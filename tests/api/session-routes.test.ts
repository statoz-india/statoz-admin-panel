/**
 * The signed-in devices routes: list sessions, sign one out, sign out
 * everywhere — and the session check the panel runs after a failed call.
 */

import { describe, expect, it } from "vitest";
import { POST as logoutAll } from "@/app/api/logout-all/route";
import { GET as sessionStatus } from "@/app/api/session-status/route";
import { DELETE as deleteSession } from "@/app/api/sessions/[sessionId]/route";
import { badRequest, proxySessions, serverError } from "@/app/api/sessions/proxy";
import { GET as listSessions } from "@/app/api/sessions/route";
import { cookieJar, signIn } from "../helpers/cookies";
import { API_BASE_URL, fetchCall, jsonResponse, makeRequest, mockFetch, readJson, routeContext, textResponse } from "../helpers/http";

const SESSIONS = [
  {
    _id: "665f0c2a1b2c3d4e5f60718a",
    deviceName: "Chrome on macOS",
    platform: "web",
    appVersion: "0.1.0",
    ip: "203.0.113.7",
    lastUsedAt: "2026-10-19T09:12:44.000Z",
    createdAt: "2026-10-01T18:03:10.000Z",
    isCurrent: true,
  },
];

describe("proxySessions", () => {
  it("calls the backend under /authorization and unwraps its envelope", async () => {
    signIn("acc");
    const fetchMock = mockFetch([jsonResponse({ success: true, message: "Sessions", data: SESSIONS })]);

    const res = await proxySessions("/sessions", { method: "GET" }, "fallback");

    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}/authorization/sessions`);
    expect(await readJson(res)).toEqual({ success: true, message: "Sessions", data: SESSIONS });
  });

  it.each([401, 498])("turns a %d into 'session expired'", async (status) => {
    signIn();
    mockFetch([jsonResponse({}, status)]);

    const res = await proxySessions("/sessions", { method: "GET" }, "fallback");

    expect(res.status).toBe(401);
    expect(await readJson(res)).toEqual({ success: false, message: "Session expired. Please log in again." });
  });

  it("keeps a 403 as 'no access', not a login problem", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, message: "Forbidden - SuperAdmin access required" }, 403)]);

    const res = await proxySessions("/sessions", { method: "GET" }, "fallback");

    expect(res.status).toBe(403);
    expect(await readJson(res)).toEqual({ success: false, message: "Forbidden - SuperAdmin access required" });
  });

  it("falls back to a generic message for a body that isn't JSON", async () => {
    signIn();
    mockFetch([textResponse("<html>Bad gateway</html>", 502)]);

    const res = await proxySessions("/sessions", { method: "GET" }, "Failed to load");

    expect(res.status).toBe(502);
    expect(await readJson(res)).toEqual({ success: false, message: "Failed to load (Status: 502)" });
  });

  it("accepts an empty success body", async () => {
    signIn();
    mockFetch([new Response("", { status: 200 })]);

    const res = await proxySessions("/sessions/x", { method: "DELETE" }, "fallback");

    expect(await readJson(res)).toEqual({ success: true });
  });

  it("badRequest and serverError answer in the envelope", async () => {
    expect(await readJson(badRequest("nope"))).toEqual({ success: false, message: "nope" });
    const res = serverError(new Error("boom"), "Failed");
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ success: false, message: "Failed" });
  });
});

describe("GET /api/sessions", () => {
  it("lists the admin's signed-in devices", async () => {
    signIn("acc");
    const fetchMock = mockFetch([jsonResponse({ success: true, data: SESSIONS })]);

    const res = await listSessions();

    expect(fetchCall(fetchMock).method).toBe("GET");
    expect((await readJson(res)).data).toEqual(SESSIONS);
  });

  it("answers 500 when the backend is down", async () => {
    signIn();
    mockFetch(() => {
      throw new TypeError("fetch failed");
    });
    const res = await listSessions();
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ success: false, message: "Failed to load signed-in devices" });
  });
});

describe("DELETE /api/sessions/:sessionId", () => {
  it("signs that device out", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ success: true, message: "Session revoked" })]);

    const res = await deleteSession(makeRequest("/api/sessions/abc", { method: "DELETE" }), routeContext({ sessionId: " abc/1 " }));

    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/authorization/sessions/abc%2F1`);
    expect(call.method).toBe("DELETE");
    expect(await readJson(res)).toMatchObject({ success: true, message: "Session revoked" });
  });

  it("passes on 'Session not found' for an unknown id or someone else's session", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, message: "Session not found" }, 404)]);

    const res = await deleteSession(makeRequest("/api/sessions/x", { method: "DELETE" }), routeContext({ sessionId: "x" }));

    expect(res.status).toBe(404);
    expect(await readJson(res)).toEqual({ success: false, message: "Session not found" });
  });

  it("requires an id", async () => {
    const fetchMock = mockFetch([jsonResponse({})]);
    const res = await deleteSession(makeRequest("/api/sessions/%20", { method: "DELETE" }), routeContext({ sessionId: " " }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers 500 when the backend is down", async () => {
    signIn();
    mockFetch(() => {
      throw new TypeError("fetch failed");
    });
    const res = await deleteSession(makeRequest("/api/sessions/x", { method: "DELETE" }), routeContext({ sessionId: "x" }));
    expect(res.status).toBe(500);
  });
});

describe("POST /api/logout-all", () => {
  it("signs out every other device and keeps this browser signed in", async () => {
    signIn("acc", "ref");
    const fetchMock = mockFetch([jsonResponse({ success: true, message: "Signed out" })]);

    const res = await logoutAll(makeRequest("/api/logout-all", { method: "POST", body: { keepCurrent: true } }));

    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/authorization/logout-all`);
    expect(call.body).toEqual({ keepCurrent: true });
    expect(await readJson(res)).toMatchObject({ success: true });
    expect(res.headers.getSetCookie()).toEqual([]);
    expect(cookieJar.get("accessToken")).toBe("acc");
  });

  it("signs out everywhere, this browser included", async () => {
    signIn("acc", "ref");
    const fetchMock = mockFetch([jsonResponse({ success: true })]);

    const res = await logoutAll(makeRequest("/api/logout-all", { method: "POST", body: {} }));

    expect(fetchCall(fetchMock).body).toEqual({});
    expect(await readJson(res)).toMatchObject({ success: true });
    expect(cookieJar.get("accessToken")).toBe("");
    expect(cookieJar.get("refreshToken")).toBe("");
    expect(res.headers.getSetCookie()).toEqual([
      expect.stringMatching(/^accessToken=;/),
      expect.stringMatching(/^refreshToken=;/),
    ]);
  });

  it("treats anything but keepCurrent: true as everywhere, and a missing body too", async () => {
    signIn("acc", "ref");
    const fetchMock = mockFetch(() => jsonResponse({ success: true }));

    await logoutAll(makeRequest("/api/logout-all", { method: "POST", body: { keepCurrent: "yes" } }));
    await logoutAll(makeRequest("/api/logout-all", { method: "POST" }));

    expect(fetchCall(fetchMock, 0).body).toEqual({});
    expect(fetchCall(fetchMock, 1).body).toEqual({});
  });

  it("keeps this browser signed in when the backend refuses", async () => {
    signIn("acc", "ref");
    mockFetch([jsonResponse({ success: false, message: "Forbidden - SuperAdmin access required" }, 403)]);

    const res = await logoutAll(makeRequest("/api/logout-all", { method: "POST", body: {} }));

    expect(res.status).toBe(403);
    expect(cookieJar.get("accessToken")).toBe("acc");
  });

  it("answers 500 when the backend is down", async () => {
    signIn();
    mockFetch(() => {
      throw new TypeError("fetch failed");
    });
    const res = await logoutAll(makeRequest("/api/logout-all", { method: "POST", body: {} }));
    expect(res.status).toBe(500);
  });
});

describe("GET /api/session-status", () => {
  it.each([
    ["both cookies", { accessToken: "acc", refreshToken: "ref" }, true],
    ["only the refresh cookie (renewed on the next call)", { refreshToken: "ref" }, true],
    ["only the access cookie", { accessToken: "acc" }, true],
    ["cleared cookies", { accessToken: "", refreshToken: "" }, false],
    ["no cookies", {}, false],
  ])("with %s: signedIn is %s", async (_, cookies, signedIn) => {
    for (const [name, value] of Object.entries(cookies)) cookieJar.set(name, value);

    expect(await readJson(await sessionStatus())).toEqual({ success: true, data: { signedIn } });
  });
});
