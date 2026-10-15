/// <reference types="vite/client" />

/**
 * Contract every API route must keep, checked against every `route.ts` under
 * `app/api` — a new route is covered the moment it is added.
 *
 * The panel's pages all read `{ success, ... }` off these responses, so a
 * route must:
 *  - always answer with that JSON envelope (never throw, never HTML);
 *  - turn a dead backend into `success: false` with an error status;
 *  - never report success when the backend says the session is gone;
 *  - send the admin's session with every call it makes to the backend.
 */

import { describe, expect, it } from "vitest";
import { signIn } from "../helpers/cookies";
import { API_BASE_URL, jsonResponse, makeRequest, mockFetch, routeContext } from "../helpers/http";

type Handler = (request: Request, context: { params: Promise<Record<string, string>> }) => Promise<Response>;
type RouteModule = Partial<Record<(typeof METHODS)[number], Handler>>;

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const;

const routeModules = import.meta.glob<RouteModule>("/app/api/**/route.ts", { eager: true });

/** Plausible values for each dynamic segment, so handlers get past their id checks. */
const PARAM_VALUES: Record<string, string> = {
  id: "64b7f0c2a1b2c3d4e5f60718",
  matchId: "64b7f0c2a1b2c3d4e5f60719",
  botUserId: "64b7f0c2a1b2c3d4e5f6071a",
  knowledgeQuizId: "64b7f0c2a1b2c3d4e5f6071b",
  ppId: "PP001",
  pbId: "PB001",
  date: "2026-08-08",
  gameType: "cricket",
  category: "easy",
  chapterName: "foundation",
  tournament: "IPL",
  teamAbbreviation: "CSK",
};

/** Routes the admin calls before having a session. */
const PRE_AUTH_ROUTES = new Set(["login", "send-otp"]);
/** Routes that never call the backend. */
const NO_BACKEND_ROUTES = new Set(["socket-config"]);

const routes = Object.keys(routeModules)
  .map((file) => {
    const route = file.replace(/^\/app\/api\//, "").replace(/\/route\.ts$/, "");
    const params = Object.fromEntries(
      [...route.matchAll(/\[([^\]]+)\]/g)].map(([, name]) => [name, PARAM_VALUES[name] ?? "test-value"]),
    );
    const urlPath = `/api/${route.replace(/\[([^\]]+)\]/g, (_, name: string) => encodeURIComponent(params[name]))}`;
    const methods = METHODS.filter((m) => typeof routeModules[file][m] === "function");
    return { file, route, params, urlPath, methods };
  })
  .sort((a, b) => a.route.localeCompare(b.route));

/** A body with the fields create/update forms commonly send. */
const SAMPLE_BODY = {
  email: "admin@statoz.test",
  name: "Test",
  status: "ACTIVE",
  matchUrl: "",
  questions: [],
};

/** Search routes skip the backend when there is nothing to search for. */
const SAMPLE_QUERY = "?page=1&limit=10&searchQuery=test&search=test";

async function call(route: (typeof routes)[number], method: (typeof METHODS)[number]) {
  const handler = routeModules[route.file][method]!;
  const hasBody = method !== "GET" && method !== "OPTIONS";
  const path = method === "GET" ? `${route.urlPath}${SAMPLE_QUERY}` : route.urlPath;
  const request = makeRequest(path, { method, body: hasBody ? SAMPLE_BODY : undefined });
  return handler(request, routeContext(route.params));
}

async function envelope(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`Expected a JSON body, got (${res.status}): ${text.slice(0, 200)}`);
  }
}

it("discovers the API routes", () => {
  expect(routes.length).toBeGreaterThan(150);
});

describe.each(routes)("$route", (route) => {
  it("exports at least one HTTP handler", () => {
    expect(route.methods.length).toBeGreaterThan(0);
  });

  describe.each(route.methods)("%s", (method) => {
    it("answers with the JSON envelope when the backend is healthy", async () => {
      signIn();
      mockFetch(() => jsonResponse({ success: true, data: {}, message: "ok" }));

      const res = await call(route, method);

      expect(res).toBeInstanceOf(Response);
      if (method === "OPTIONS") {
        expect(res.status).toBeLessThan(300);
        return;
      }
      const body = await envelope(res);
      expect(typeof body.success).toBe("boolean");
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(600);
    });

    // CORS preflights and routes that never call the backend have no failure modes to check.
    if (method === "OPTIONS" || NO_BACKEND_ROUTES.has(route.route)) return;

    it("turns an unreachable backend into success:false with an error status", async () => {
      signIn();
      const fetchMock = mockFetch(() => {
        throw new TypeError("fetch failed");
      });

      const res = await call(route, method);

      const body = await envelope(res);
      // Rejected before reaching the backend (e.g. input validation): nothing to check here.
      if (fetchMock.mock.calls.length === 0) return;
      // Logout always clears the panel's cookies, even when the backend is down.
      if (route.route === "logout") return;
      expect(body.success).toBe(false);
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(typeof body.message === "string" || typeof body.error === "string").toBe(true);
    });

    if (route.route !== "logout") {
      it("never reports success when the backend rejects the session", async () => {
        signIn();
        const fetchMock = mockFetch(() => jsonResponse({ success: false, message: "Unauthorized" }, 401));

        const res = await call(route, method);

        const body = await envelope(res);
        if (fetchMock.mock.calls.length === 0) return;
        expect(body.success).not.toBe(true);
        expect(res.status).toBeGreaterThanOrEqual(400);
      });
    }

    if (!PRE_AUTH_ROUTES.has(route.route)) {
      it("sends the admin's session with every backend call", async () => {
        signIn("session-under-test");
        const fetchMock = mockFetch(() => jsonResponse({ success: true, data: {} }));

        await call(route, method);

        const backendCalls = fetchMock.mock.calls.filter(([input]) => String(input).startsWith(API_BASE_URL));
        for (const [input, init] of backendCalls) {
          const headers = new Headers((init as RequestInit | undefined)?.headers);
          expect(headers.get("cookie") ?? "", `call to ${String(input)}`).toContain("accessToken=session-under-test");
        }
      });
    }
  });
});
