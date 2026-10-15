import { describe, expect, it } from "vitest";
import { describeParsedCurl, parseCurl } from "@/app/utils/curl-parser";

describe("parseCurl", () => {
  describe("method and URL", () => {
    it("defaults to GET with no body", () => {
      expect(parseCurl("curl https://api.test/users")).toEqual({
        method: "GET",
        url: "https://api.test/users",
        headers: [],
        body: null,
        warnings: [],
      });
    });

    it("defaults to POST when there is a body", () => {
      const parsed = parseCurl("curl https://api.test/users -d 'name=x'");
      expect(parsed.method).toBe("POST");
      expect(parsed.body).toBe("name=x");
    });

    it.each([
      ["curl -X put https://api.test/x", "PUT"],
      ["curl -XDELETE https://api.test/x", "DELETE"],
      ["curl --request patch https://api.test/x", "PATCH"],
      ["curl --request=post https://api.test/x", "POST"],
    ])("reads the method from %s", (cmd, method) => {
      expect(parseCurl(cmd).method).toBe(method);
    });

    it("reads --url", () => {
      expect(parseCurl("curl --url https://api.test/a").url).toBe("https://api.test/a");
    });

    it("accepts a command with the leading `curl` chopped off", () => {
      const parsed = parseCurl("-X DELETE https://api.test/items/1");
      expect(parsed.method).toBe("DELETE");
      expect(parsed.url).toBe("https://api.test/items/1");
    });

    it("accepts a bare URL or endpoint path", () => {
      expect(parseCurl("https://api.test/a").url).toBe("https://api.test/a");
      expect(parseCurl("/knowledge-quiz/").url).toBe("/knowledge-quiz/");
    });

    it("is case-insensitive about the `curl` word", () => {
      expect(parseCurl("CURL https://api.test/a").url).toBe("https://api.test/a");
    });
  });

  describe("headers", () => {
    it("collects -H and --header, trimming around the colon", () => {
      const parsed = parseCurl(
        `curl https://api.test -H 'Content-Type:  application/json' --header "X-Trace: abc:def"`,
      );
      expect(parsed.headers).toEqual([
        { key: "Content-Type", value: "application/json" },
        { key: "X-Trace", value: "abc:def" },
      ]);
    });

    it("accepts a header value glued to -H", () => {
      expect(parseCurl("curl https://api.test '-HAccept: text/plain'").headers).toEqual([
        { key: "Accept", value: "text/plain" },
      ]);
    });

    it("maps -A and -e to User-Agent and Referer", () => {
      expect(parseCurl("curl https://api.test -A 'bot/1.0' -e https://ref.test").headers).toEqual([
        { key: "User-Agent", value: "bot/1.0" },
        { key: "Referer", value: "https://ref.test" },
      ]);
    });

    it("warns about and skips a header with no colon", () => {
      const parsed = parseCurl("curl https://api.test -H 'X-Empty;'");
      expect(parsed.headers).toEqual([]);
      expect(parsed.warnings).toEqual(['Ignored malformed header "X-Empty;".']);
    });
  });

  describe("bodies", () => {
    it("joins several -d values with &", () => {
      expect(parseCurl("curl https://api.test -d a=1 --data b=2 --data-raw c=3").body).toBe("a=1&b=2&c=3");
    });

    it("keeps a JSON body exactly as pasted", () => {
      const parsed = parseCurl(`curl -X POST https://api.test -d '{"name": "Kohli", "runs": 82}'`);
      expect(parsed.body).toBe('{"name": "Kohli", "runs": 82}');
    });

    it("--json sets the body and a JSON content type", () => {
      const parsed = parseCurl(`curl https://api.test --json '{"a":1}'`);
      expect(parsed.method).toBe("POST");
      expect(parsed.body).toBe('{"a":1}');
      expect(parsed.headers).toEqual([{ key: "Content-Type", value: "application/json" }]);
    });

    it.each([
      ["q=hello world", "q=hello%20world"],
      ["=hello world", "hello%20world"],
      ["hello world", "hello%20world"],
      ["@payload.txt", "@payload.txt"],
    ])("--data-urlencode %s → %s", (raw, encoded) => {
      expect(parseCurl(`curl https://api.test --data-urlencode '${raw}'`).body).toBe(encoded);
    });

    it("-G moves the data onto the query string", () => {
      const parsed = parseCurl("curl -G https://api.test/search -d q=virat -d page=2");
      expect(parsed).toMatchObject({ method: "GET", url: "https://api.test/search?q=virat&page=2", body: null });
    });

    it("-G appends to an existing query string", () => {
      expect(parseCurl("curl --get 'https://api.test/s?x=1' -d y=2").url).toBe("https://api.test/s?x=1&y=2");
    });

    it("warns about a GET with a body", () => {
      const parsed = parseCurl("curl -X GET https://api.test -d a=1");
      expect(parsed.method).toBe("GET");
      expect(parsed.warnings).toContain("GET with a body — most backends ignore it.");
    });
  });

  describe("quoting", () => {
    it("follows backslash line continuations", () => {
      const parsed = parseCurl("curl \\\n  -X POST \\\n  https://api.test/x \\\r\n  -H 'A: b'");
      expect(parsed).toMatchObject({ method: "POST", url: "https://api.test/x", headers: [{ key: "A", value: "b" }] });
    });

    it("follows Windows ^ continuations", () => {
      expect(parseCurl("curl ^\n https://api.test/x").url).toBe("https://api.test/x");
    });

    it("treats a bare newline as whitespace", () => {
      expect(parseCurl("curl\nhttps://api.test/x\n-X PUT").method).toBe("PUT");
    });

    it("unescapes only the shell's double-quote escapes", () => {
      expect(parseCurl(String.raw`curl https://api.test -d "{\"a\":\"\$x\",\"b\":\"\n\"}"`).body).toBe(
        String.raw`{"a":"$x","b":"\n"}`,
      );
    });

    it("takes single-quoted text literally", () => {
      expect(parseCurl(String.raw`curl https://api.test -d '{"a":"\n"}'`).body).toBe(String.raw`{"a":"\n"}`);
    });

    it("drops the $ of $'…' quoting", () => {
      expect(parseCurl("curl $'https://api.test/x'").url).toBe("https://api.test/x");
    });

    it("keeps an escaped space inside one token", () => {
      expect(parseCurl(String.raw`curl https://api.test -H X-Name:\ Virat\ Kohli`).headers).toEqual([
        { key: "X-Name", value: "Virat Kohli" },
      ]);
    });
  });

  describe("flags it doesn't send", () => {
    it("silently skips flags that don't change the request", () => {
      const parsed = parseCurl(
        "curl -s -S -L -k --compressed -o out.json -m 10 --retry 3 -w '%{http_code}' https://api.test/x",
      );
      expect(parsed).toMatchObject({ url: "https://api.test/x", warnings: [], headers: [] });
    });

    it.each([
      ["-u admin:secret", "Dropped -u/--user: the panel signs the request with your admin session."],
      ["-b 'accessToken=abc'", "Dropped -b/--cookie: the panel sends your own session cookie."],
      ["-F file=@x.png", "Dropped -F/--form: multipart form uploads are not supported here."],
    ])("drops auth / form flag %s with a warning", (flag, warning) => {
      const parsed = parseCurl(`curl https://api.test ${flag}`);
      expect(parsed.warnings).toEqual([warning]);
      expect(parsed.headers).toEqual([]);
      expect(parsed.body).toBeNull();
    });

    it("warns about flags it doesn't understand", () => {
      expect(parseCurl("curl --http2 https://api.test").warnings).toEqual(['Ignored unsupported flag "--http2".']);
    });

    it("warns about extra positional arguments", () => {
      expect(parseCurl("curl https://a.test https://b.test").warnings).toEqual(['Ignored extra argument "https://b.test".']);
    });
  });

  describe("errors", () => {
    it.each([
      ["", "Paste a cURL command first."],
      ["   \n ", "Paste a cURL command first."],
      ["wget https://api.test", 'Not a cURL command — it starts with "wget".'],
      ["curl -X GET", "No URL found in the cURL command."],
      ["curl https://api.test -H", "-H is missing its value."],
      ["curl https://api.test -d 'unterminated", "Unterminated single quote in the cURL command."],
      ['curl https://api.test -d "unterminated', "Unterminated double quote in the cURL command."],
    ])("%j → %s", (cmd, message) => {
      expect(() => parseCurl(cmd)).toThrow(message);
    });
  });
});

describe("describeParsedCurl", () => {
  it("summarises method and URL", () => {
    expect(describeParsedCurl(parseCurl("curl -X POST https://api.test/x"))).toBe("POST https://api.test/x");
  });
});
