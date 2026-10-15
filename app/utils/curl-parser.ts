/**
 * Minimal cURL command parser for the API Testing section.
 *
 * Only the flags that show up in a copy-pasted request are understood; the rest
 * are either skipped or reported as warnings so the tester never silently sends
 * something different from what was pasted. Auth flags are deliberately dropped
 * — the proxy attaches the logged-in admin's access token itself.
 */

export interface ParsedCurlHeader {
  key: string;
  value: string;
}

export interface ParsedCurl {
  method: string;
  url: string;
  headers: ParsedCurlHeader[];
  body: string | null;
  /** Non-fatal notes: flags dropped, auth overridden, etc. */
  warnings: string[];
}

/** Flags that take no value and change nothing about the request we send. */
const IGNORED_BOOLEAN_FLAGS = new Set([
  "-L",
  "--location",
  "-k",
  "--insecure",
  "-s",
  "--silent",
  "-S",
  "--show-error",
  "-v",
  "--verbose",
  "-i",
  "--include",
  "-I",
  "--head",
  "-f",
  "--fail",
  "-N",
  "--no-buffer",
  "-#",
  "--progress-bar",
  "--compressed",
  "--globoff",
  "-g",
  "--no-keepalive",
  "--location-trusted",
]);

/** Flags that take a value we do not need — flag and value are both dropped. */
const IGNORED_VALUE_FLAGS = new Set([
  "-o",
  "--output",
  "-w",
  "--write-out",
  "-c",
  "--cookie-jar",
  "-m",
  "--max-time",
  "--connect-timeout",
  "--retry",
  "--retry-delay",
  "-x",
  "--proxy",
  "--resolve",
  "--cacert",
  "--cert",
  "--key",
  "-T",
  "--upload-file",
]);

const DATA_FLAGS = new Set([
  "-d",
  "--data",
  "--data-raw",
  "--data-ascii",
  "--data-binary",
  "--data-urlencode",
]);

/** Short flags whose value may be glued on, as in `-XPOST` or `-HAccept: x`. */
const ATTACHABLE_SHORT_FLAGS = ["-X", "-H", "-d", "-u", "-b", "-A", "-e"];

/**
 * Split a shell-ish command into tokens. Handles single quotes, double quotes,
 * backslash escapes and `\`-continued lines. A bare newline is treated as plain
 * whitespace rather than an end-of-command, because pasted commands often lose
 * their trailing backslashes.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let started = false;
  let i = 0;

  const flush = () => {
    if (started) {
      tokens.push(current);
      current = "";
      started = false;
    }
  };

  while (i < input.length) {
    const ch = input[i];

    if (ch === "\\") {
      const next = input[i + 1];
      if (next === undefined) {
        i += 1;
        continue;
      }
      if (next === "\n") {
        i += 2;
        continue;
      }
      if (next === "\r" && input[i + 2] === "\n") {
        i += 3;
        continue;
      }
      current += next;
      started = true;
      i += 2;
      continue;
    }

    // `$'...'` / `$"..."` — the `$` is shell quoting syntax, not content.
    if (ch === "$" && (input[i + 1] === "'" || input[i + 1] === '"')) {
      i += 1;
      continue;
    }

    if (ch === "'") {
      started = true;
      i += 1;
      while (i < input.length && input[i] !== "'") {
        current += input[i];
        i += 1;
      }
      if (i >= input.length) {
        throw new Error("Unterminated single quote in the cURL command.");
      }
      i += 1;
      continue;
    }

    if (ch === '"') {
      started = true;
      i += 1;
      while (i < input.length && input[i] !== '"') {
        if (input[i] === "\\" && i + 1 < input.length) {
          const next = input[i + 1];
          // Inside double quotes the shell only unescapes these.
          current += '"\\$`\n'.includes(next) ? next : `\\${next}`;
          i += 2;
          continue;
        }
        current += input[i];
        i += 1;
      }
      if (i >= input.length) {
        throw new Error("Unterminated double quote in the cURL command.");
      }
      i += 1;
      continue;
    }

    if (/\s/.test(ch)) {
      flush();
      i += 1;
      continue;
    }

    // Windows-style line continuation.
    if (ch === "^" && (input[i + 1] === "\n" || input[i + 1] === "\r")) {
      i += 1;
      continue;
    }

    current += ch;
    started = true;
    i += 1;
  }

  flush();
  return tokens;
}

/** Split `--flag=value` and `-Xvalue` into a flag plus its attached value. */
function splitFlag(token: string): { flag: string; value?: string } {
  if (token.startsWith("--")) {
    const eq = token.indexOf("=");
    if (eq > -1) {
      return { flag: token.slice(0, eq), value: token.slice(eq + 1) };
    }
    return { flag: token };
  }
  if (token.startsWith("-") && token.length > 2) {
    const short = token.slice(0, 2);
    if (ATTACHABLE_SHORT_FLAGS.includes(short)) {
      return { flag: short, value: token.slice(2) };
    }
  }
  return { flag: token };
}

/**
 * Apply curl's `--data-urlencode` rules: `name=content` encodes only the
 * content, `=content` and a bare `content` encode the whole thing. The `@file`
 * forms have no meaning in a browser, so they are passed through untouched.
 */
function urlEncodeData(raw: string): string {
  if (raw.includes("@")) return raw;
  const eq = raw.indexOf("=");
  if (eq === -1) return encodeURIComponent(raw);
  if (eq === 0) return encodeURIComponent(raw.slice(1));
  return `${raw.slice(0, eq)}=${encodeURIComponent(raw.slice(eq + 1))}`;
}

function appendQuery(url: string, query: string): string {
  if (!query) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${query}`;
}

/**
 * Parse a cURL command. Throws with a readable message when the command has no
 * URL or is not a cURL command at all.
 */
export function parseCurl(input: string): ParsedCurl {
  const tokens = tokenize(input.trim());
  if (tokens.length === 0) {
    throw new Error("Paste a cURL command first.");
  }

  let index = 0;
  if (tokens[0].toLowerCase() === "curl") {
    index = 1;
  } else if (
    // Tolerate a pasted command with the leading `curl` word chopped off, and a
    // bare URL or endpoint path typed on its own.
    tokens[0].startsWith("-") ||
    /^https?:\/\//i.test(tokens[0]) ||
    tokens[0].startsWith("/")
  ) {
    // Nothing to skip — parsing starts at the first token.
  } else {
    throw new Error(`Not a cURL command — it starts with "${tokens[0]}".`);
  }

  let method: string | null = null;
  let url: string | null = null;
  const headers: ParsedCurlHeader[] = [];
  const dataParts: string[] = [];
  const warnings: string[] = [];
  let isGetWithData = false;

  const nextValue = (flag: string, attached?: string): string => {
    if (attached !== undefined) return attached;
    index += 1;
    const value = tokens[index];
    if (value === undefined) {
      throw new Error(`${flag} is missing its value.`);
    }
    return value;
  };

  for (; index < tokens.length; index += 1) {
    const token = tokens[index];
    const { flag, value: attached } = splitFlag(token);

    if (!token.startsWith("-")) {
      if (url === null) {
        url = token;
      } else {
        warnings.push(`Ignored extra argument "${token}".`);
      }
      continue;
    }

    if (IGNORED_BOOLEAN_FLAGS.has(flag)) continue;

    if (IGNORED_VALUE_FLAGS.has(flag)) {
      nextValue(flag, attached);
      continue;
    }

    switch (flag) {
      case "-X":
      case "--request":
        method = nextValue(flag, attached).toUpperCase();
        break;

      case "--url":
        url = nextValue(flag, attached);
        break;

      case "-H":
      case "--header": {
        const raw = nextValue(flag, attached);
        const colon = raw.indexOf(":");
        if (colon === -1) {
          // `-H "X-Foo;"` is curl's "send an empty header" form.
          warnings.push(`Ignored malformed header "${raw}".`);
          break;
        }
        headers.push({
          key: raw.slice(0, colon).trim(),
          value: raw.slice(colon + 1).trim(),
        });
        break;
      }

      case "--json": {
        dataParts.push(nextValue(flag, attached));
        headers.push({ key: "Content-Type", value: "application/json" });
        break;
      }

      case "-G":
      case "--get":
        isGetWithData = true;
        break;

      case "-A":
      case "--user-agent":
        headers.push({ key: "User-Agent", value: nextValue(flag, attached) });
        break;

      case "-e":
      case "--referer":
        headers.push({ key: "Referer", value: nextValue(flag, attached) });
        break;

      case "-u":
      case "--user":
        nextValue(flag, attached);
        warnings.push(
          "Dropped -u/--user: the panel signs the request with your admin session.",
        );
        break;

      case "-b":
      case "--cookie":
        nextValue(flag, attached);
        warnings.push(
          "Dropped -b/--cookie: the panel sends your own session cookie.",
        );
        break;

      case "-F":
      case "--form":
        nextValue(flag, attached);
        warnings.push(
          "Dropped -F/--form: multipart form uploads are not supported here.",
        );
        break;

      default: {
        if (DATA_FLAGS.has(flag)) {
          const raw = nextValue(flag, attached);
          dataParts.push(
            flag === "--data-urlencode" ? urlEncodeData(raw) : raw,
          );
          break;
        }
        warnings.push(`Ignored unsupported flag "${flag}".`);
        break;
      }
    }
  }

  if (!url) {
    throw new Error("No URL found in the cURL command.");
  }

  let body: string | null = dataParts.length > 0 ? dataParts.join("&") : null;

  if (isGetWithData && body !== null) {
    url = appendQuery(url, body);
    body = null;
    if (!method) method = "GET";
  }

  if (!method) {
    method = body !== null ? "POST" : "GET";
  }

  if (body !== null && method === "GET") {
    warnings.push("GET with a body — most backends ignore it.");
  }

  return { method, url, headers, body, warnings };
}

/** One-line summary of a parsed request, for the preview strip. */
export function describeParsedCurl(parsed: ParsedCurl): string {
  return `${parsed.method} ${parsed.url}`;
}
