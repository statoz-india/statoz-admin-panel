import { NextResponse } from "next/server";
import {
  getSessionCookie,
  requireAuth,
  tryRefreshAccessToken,
} from "../utils/api-helper";

const API_BASE_URL = process.env.API_BASE_URL;

/** Hard stop so a hanging backend cannot pin a Next.js worker. */
const REQUEST_TIMEOUT_MS = 30_000;

/** Response bodies past this are truncated before being sent to the browser. */
const MAX_BODY_CHARS = 2_000_000;

/**
 * Headers we never forward from the pasted command: the token headers are ours
 * to set, and the rest are computed by fetch for the new connection.
 */
const BLOCKED_REQUEST_HEADERS = new Set([
  "authorization",
  "cookie",
  "host",
  "content-length",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "accept-encoding",
  "proxy-authorization",
]);

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

const ALLOWED_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

interface TestRequestPayload {
  method?: unknown;
  url?: unknown;
  headers?: unknown;
  body?: unknown;
}

type TargetResolution = { url: string } | { error: string };

/**
 * Resolve the pasted URL.
 *
 * An absolute http(s) URL is sent as-is, whichever host it names — the panel is
 * an internal tool and the point is to be able to hit any environment's API from
 * whichever one the panel happens to be deployed on. Note that the admin's
 * access token travels with it. Anything else is treated as a path and resolved
 * against `API_BASE_URL`, so `/knowledge-quiz/` follows the environment.
 */
function resolveTarget(rawUrl: string): TargetResolution {
  const trimmed = rawUrl.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return { url: new URL(trimmed).toString() };
    } catch {
      return { error: `"${rawUrl}" is not a valid URL.` };
    }
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    // file:, data:, ftp: and friends — fetch either refuses them or reads local
    // resources off the server, neither of which is API testing.
    return { error: "Only http and https URLs can be sent." };
  }

  if (!API_BASE_URL) {
    return {
      error:
        "API_BASE_URL is not configured on the server — paste a full URL instead.",
    };
  }

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return { url: `${API_BASE_URL.replace(/\/$/, "")}${path}` };
}

function parseHeaders(raw: unknown): Record<string, string> {
  const headers: Record<string, string> = {};
  if (!Array.isArray(raw)) return headers;

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const { key, value } = entry as { key?: unknown; value?: unknown };
    if (typeof key !== "string" || typeof value !== "string") continue;
    const name = key.trim();
    if (!name || BLOCKED_REQUEST_HEADERS.has(name.toLowerCase())) continue;
    headers[name] = value;
  }

  return headers;
}

/** Header list for the UI, with the injected token reduced to a fingerprint. */
function maskedHeaderList(
  headers: Record<string, string>,
): { key: string; value: string }[] {
  return Object.entries(headers).map(([key, value]) => {
    const lower = key.toLowerCase();
    if (lower === "authorization") {
      return { key, value: "Bearer <session access token>" };
    }
    if (lower === "cookie") {
      return { key, value: "accessToken=<session access token>" };
    }
    return { key, value };
  });
}

function collectResponseHeaders(response: Response): { key: string; value: string }[] {
  const list: { key: string; value: string }[] = [];
  response.headers.forEach((value, key) => {
    list.push({ key, value });
  });
  return list.sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Send an arbitrary request to the backend with the current admin session
 * attached. `POST` because the pasted command carries a body of its own.
 */
export async function POST(request: Request) {
  try {
    await requireAuth();

    const payload = (await request.json()) as TestRequestPayload;

    const method =
      typeof payload.method === "string"
        ? payload.method.trim().toUpperCase()
        : "GET";
    if (!ALLOWED_METHODS.has(method)) {
      return NextResponse.json(
        { success: false, message: `Unsupported HTTP method "${method}".` },
        { status: 400 },
      );
    }

    if (typeof payload.url !== "string" || !payload.url.trim()) {
      return NextResponse.json(
        { success: false, message: "No URL in the request." },
        { status: 400 },
      );
    }

    const target = resolveTarget(payload.url);
    if ("error" in target) {
      return NextResponse.json(
        { success: false, message: target.error },
        { status: 400 },
      );
    }
    const targetUrl = target.url;

    const userHeaders = parseHeaders(payload.headers);
    const body =
      typeof payload.body === "string" && payload.body.length > 0
        ? payload.body
        : null;

    const sendBody = body !== null && !METHODS_WITHOUT_BODY.has(method);

    const send = async (token: string | undefined) => {
      const headers: Record<string, string> = {
        Accept: "application/json, text/plain, */*",
        ...(sendBody ? { "Content-Type": "application/json" } : {}),
        ...userHeaders,
        // Both forms: the backend reads the cookie, admin-data routes read Bearer.
        Cookie: `accessToken=${token ?? ""}`,
        Authorization: `Bearer ${token ?? ""}`,
      };

      const response = await fetch(targetUrl, {
        method,
        headers,
        ...(sendBody ? { body } : {}),
        redirect: "follow",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      return { response, headers };
    };

    const startedAt = Date.now();
    let { response, headers: sentHeaders } = await send(await getSessionCookie());

    // Same one-shot refresh-and-retry the rest of the panel's routes use.
    let refreshed = false;
    if (response.status === 498) {
      const newToken = await tryRefreshAccessToken();
      if (newToken) {
        refreshed = true;
        ({ response, headers: sentHeaders } = await send(newToken));
      }
    }
    const durationMs = Date.now() - startedAt;

    const rawText = await response.text();
    const truncated = rawText.length > MAX_BODY_CHARS;

    return NextResponse.json({
      success: true,
      data: {
        request: {
          method,
          url: targetUrl,
          headers: maskedHeaderList(sentHeaders),
          body: sendBody ? body : null,
          refreshedToken: refreshed,
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          durationMs,
          sizeBytes: rawText.length,
          truncated,
          headers: collectResponseHeaders(response),
          body: truncated ? rawText.slice(0, MAX_BODY_CHARS) : rawText,
        },
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        {
          success: false,
          message: `The request did not finish within ${REQUEST_TIMEOUT_MS / 1000}s.`,
        },
        { status: 504 },
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Malformed request payload." },
        { status: 400 },
      );
    }
    console.error("API testing request failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send the request.",
      },
      { status: 500 },
    );
  }
}
