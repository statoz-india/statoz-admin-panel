import { NextRequest } from "next/server";
import { vi } from "vitest";

export const API_BASE_URL = "https://backend.test/api/v1";

export function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export function textResponse(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "Content-Type": "text/plain" } });
}

type Handler = (url: string, init: RequestInit) => Response | Promise<Response>;

/**
 * Replace global `fetch`. Pass one handler for every call, or a list of
 * responses handed out in order (the last one repeats).
 */
export function mockFetch(handler: Handler | Response[]) {
  const responses = Array.isArray(handler) ? handler : null;
  let call = 0;
  const fn = vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (responses) {
      const res = responses[Math.min(call++, responses.length - 1)];
      // A Response body can only be read once; hand out a copy each time.
      return res.clone();
    }
    return (handler as Handler)(url, init);
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

/** The URL and init of the nth fetch call. */
export function fetchCall(fn: ReturnType<typeof mockFetch>, n = 0) {
  const [input, init = {}] = fn.mock.calls[n] as [RequestInfo | URL, RequestInit | undefined];
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  return {
    url,
    init,
    method: (init.method ?? "GET").toUpperCase(),
    headers: (init.headers ?? {}) as Record<string, string>,
    body: typeof init.body === "string" ? JSON.parse(init.body) : init.body,
  };
}

export async function readJson<T = Record<string, unknown>>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

/** A `NextRequest` like the one Next.js hands a route handler. */
export function makeRequest(
  path: string,
  { method = "GET", body, headers = {} }: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
): NextRequest {
  const url = path.startsWith("http") ? path : `http://localhost:3000${path}`;
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** The second argument Next.js passes a dynamic route handler. */
export function routeContext<P extends Record<string, string>>(params: P) {
  return { params: Promise.resolve(params) };
}
