import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  authenticatedFetch,
  errorResponse,
  extractArray,
  extractBackendErrorMessage,
  forgetRenewals,
  getRefreshTokenCookie,
  getSessionCookie,
  handleExternalApiResponse,
  noRecordFound,
  requireAuth,
  successResponse,
  tryRefreshAccessToken,
  withSessionCleared,
} from "@/app/api/utils/api-helper";
import { cookieJar, signIn } from "../../helpers/cookies";
import { API_BASE_URL, fetchCall, jsonResponse, mockFetch, readJson, textResponse } from "../../helpers/http";

beforeEach(() => forgetRenewals());

/** A backend whose access tokens are expired except `fresh`, renewing to `fresh` / `refresh-2`. */
function expiringBackend(fresh = "new") {
  return mockFetch((url, init) => {
    if (url.endsWith("/authorization/refresh-token")) {
      return jsonResponse({ success: true, data: { accessToken: fresh, refreshToken: "refresh-2" } });
    }
    const cookie = (init.headers as Record<string, string>).Cookie;
    return cookie === `accessToken=${fresh}` ? jsonResponse({ data: "fresh" }) : jsonResponse({}, 498);
  });
}

describe("session cookies", () => {
  it("reads the access and refresh tokens", async () => {
    signIn("acc", "ref");
    expect(await getSessionCookie()).toBe("acc");
    expect(await getRefreshTokenCookie()).toBe("ref");
  });

  it("is undefined when logged out", async () => {
    expect(await getSessionCookie()).toBeUndefined();
  });
});

describe("requireAuth", () => {
  it("returns the session token", async () => {
    signIn("acc");
    await expect(requireAuth()).resolves.toBe("acc");
  });

  it("throws a 401 response when logged out", async () => {
    const thrown = await requireAuth().catch((e) => e);
    expect(thrown).toBeInstanceOf(NextResponse);
    expect(thrown.status).toBe(401);
    expect(await readJson(thrown)).toEqual({ success: false, message: "Unauthorized" });
  });

  it("renews the session when only the refresh cookie is left", async () => {
    cookieJar.set("refreshToken", "refresh-1");
    mockFetch([jsonResponse({ success: true, data: { accessToken: "new" } })]);

    await expect(requireAuth()).resolves.toBe("new");
    expect(cookieJar.get("accessToken")).toBe("new");
  });

  it("throws a 401 when the session can't be renewed", async () => {
    cookieJar.set("refreshToken", "refresh-1");
    mockFetch([textResponse("expired", 401)]);

    const thrown = await requireAuth().catch((e) => e);
    expect(thrown.status).toBe(401);
  });
});

describe("authenticatedFetch", () => {
  it("prefixes API_BASE_URL and sends the session cookie without caching", async () => {
    signIn("acc");
    const fetchMock = mockFetch([jsonResponse({ ok: true })]);

    await authenticatedFetch("/users/getAllUsers");

    const { url, headers, init } = fetchCall(fetchMock);
    expect(url).toBe(`${API_BASE_URL}/users/getAllUsers`);
    expect(headers).toMatchObject({
      "Content-Type": "application/json",
      Cookie: "accessToken=acc",
      Pragma: "no-cache",
      Expires: "0",
    });
    expect(headers["Cache-Control"]).toContain("no-store");
    expect(init.credentials).toBe("include");
  });

  it("forwards the XSRF token as header and cookie", async () => {
    signIn("acc");
    cookieJar.set("XSRF-TOKEN", "xsrf-1");
    const fetchMock = mockFetch([jsonResponse({})]);

    await authenticatedFetch("/x");

    const { headers } = fetchCall(fetchMock);
    expect(headers["X-XSRF-TOKEN"]).toBe("xsrf-1");
    expect(headers.Cookie).toBe("accessToken=acc ; XSRF-TOKEN=xsrf-1");
  });

  it("sends an empty token when logged out (the backend rejects it)", async () => {
    const fetchMock = mockFetch([jsonResponse({}, 401)]);
    const res = await authenticatedFetch("/x");
    expect(res.status).toBe(401);
    expect(fetchCall(fetchMock).headers.Cookie).toBe("accessToken=");
  });

  it("ends the session on a 401: a bad token, or the account is gone", async () => {
    signIn("acc", "ref");
    mockFetch([jsonResponse({ message: "Invalid access token" }, 401)]);

    expect((await authenticatedFetch("/x")).status).toBe(401);
    expect(cookieJar.get("accessToken")).toBe("");
    expect(cookieJar.get("refreshToken")).toBe("");
  });

  it("keeps the session on a 403 (logged in, but not a superadmin)", async () => {
    signIn("acc", "ref");
    mockFetch([jsonResponse({ message: "Forbidden - SuperAdmin access required" }, 403)]);

    await authenticatedFetch("/x");
    expect(cookieJar.get("accessToken")).toBe("acc");
  });

  it("renews before the first call when only the refresh cookie is left", async () => {
    cookieJar.set("refreshToken", "refresh-1");
    const fetchMock = expiringBackend();

    const res = await authenticatedFetch("/x");

    expect(await readJson(res)).toEqual({ data: "fresh" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchCall(fetchMock, 1).headers.Cookie).toBe("accessToken=new");
  });

  it("answers 503 without calling the backend when that renewal is unavailable", async () => {
    cookieJar.set("refreshToken", "refresh-1");
    const fetchMock = mockFetch([textResponse("down", 502)]);

    const res = await authenticatedFetch("/x");

    expect(res.status).toBe(503);
    expect(await readJson(res)).toMatchObject({ success: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(cookieJar.get("refreshToken")).toBe("refresh-1");
  });

  it("uses absolute URLs as-is", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({})]);
    await authenticatedFetch("https://other.test/a");
    expect(fetchCall(fetchMock).url).toBe("https://other.test/a");
  });

  it("passes method/body through and lets callers add headers", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({})]);

    await authenticatedFetch("/x", { method: "PUT", body: '{"a":1}', headers: { "X-Extra": "1" } });

    const call = fetchCall(fetchMock);
    expect(call.method).toBe("PUT");
    expect(call.body).toEqual({ a: 1 });
    expect(call.headers["X-Extra"]).toBe("1");
    expect(call.headers.Cookie).toBe("accessToken=test-access-token");
  });

  it("returns other statuses untouched", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "nope" }, 403)]);
    expect((await authenticatedFetch("/x")).status).toBe(403);
  });

  describe("when the access token has expired (498)", () => {
    it("refreshes, stores the new token and retries once with it", async () => {
      signIn("old", "refresh-1");
      const fetchMock = mockFetch((url, init) => {
        if (url.endsWith("/authorization/refresh-token")) {
          expect(JSON.parse(String(init.body))).toEqual({ refreshToken: "refresh-1" });
          return jsonResponse({ success: true, data: { accessToken: "new" } });
        }
        const cookie = (init.headers as Record<string, string>).Cookie;
        return cookie === "accessToken=new" ? jsonResponse({ data: "fresh" }) : jsonResponse({}, 498);
      });

      const res = await authenticatedFetch("/users/getAllUsers");

      expect(await readJson(res)).toEqual({ data: "fresh" });
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(cookieJar.get("accessToken")).toBe("new");
    });

    it("stores both tokens when the backend rotates the refresh token", async () => {
      signIn("old", "refresh-1");
      expiringBackend();

      await authenticatedFetch("/x");

      expect(cookieJar.get("accessToken")).toBe("new");
      expect(cookieJar.get("refreshToken")).toBe("refresh-2");
    });

    it("returns the original 498 and ends the session when the refresh is refused", async () => {
      signIn("old", "refresh-1");
      const fetchMock = mockFetch((url) =>
        url.endsWith("/refresh-token") ? jsonResponse({ success: false }, 401) : jsonResponse({}, 498),
      );

      const res = await authenticatedFetch("/x");

      expect(res.status).toBe(498);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(cookieJar.get("accessToken")).toBe("");
      expect(cookieJar.get("refreshToken")).toBe("");
    });

    it("answers 503 and keeps the session when the refresh fails for now", async () => {
      signIn("old", "refresh-1");
      mockFetch((url) => {
        if (url.endsWith("/refresh-token")) throw new TypeError("fetch failed");
        return jsonResponse({}, 498);
      });

      const res = await authenticatedFetch("/x");

      expect(res.status).toBe(503);
      expect(cookieJar.get("accessToken")).toBe("old");
      expect(cookieJar.get("refreshToken")).toBe("refresh-1");
    });

    it("returns the retry's response even if it fails again", async () => {
      signIn("old", "refresh-1");
      let calls = 0;
      mockFetch((url) => {
        if (url.endsWith("/refresh-token")) return jsonResponse({ success: true, data: { accessToken: "new" } });
        calls++;
        return jsonResponse({}, calls === 1 ? 498 : 500);
      });

      expect((await authenticatedFetch("/x")).status).toBe(500);
    });
  });
});

describe("tryRefreshAccessToken", () => {
  it("gives up and clears the session when there is no refresh token", async () => {
    cookieJar.set("accessToken", "old");
    const fetchMock = mockFetch([jsonResponse({})]);

    expect(await tryRefreshAccessToken()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cookieJar.get("accessToken")).toBe("");
  });

  it("sends the refresh token and stores both new tokens", async () => {
    signIn("old", "refresh-1");
    const fetchMock = mockFetch([jsonResponse({ success: true, data: { accessToken: "new", refreshToken: "refresh-2" } })]);

    expect(await tryRefreshAccessToken()).toBe("new");

    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/authorization/refresh-token`);
    expect(call.body).toEqual({ refreshToken: "refresh-1" });
    expect(cookieJar.get("accessToken")).toBe("new");
    expect(cookieJar.get("refreshToken")).toBe("refresh-2");
  });

  it("keeps the refresh token when the backend doesn't rotate it", async () => {
    signIn("old", "refresh-1");
    mockFetch([jsonResponse({ success: true, data: { accessToken: "new" } })]);

    await tryRefreshAccessToken();

    expect(cookieJar.get("refreshToken")).toBe("refresh-1");
  });

  it.each([
    ["401 (signed out, expired, or a reused token)", 401],
    ["another refusal", 403],
  ])("ends the session on a %s", async (_, status) => {
    signIn("old", "refresh-1");
    mockFetch([textResponse("nope", status)]);

    expect(await tryRefreshAccessToken()).toBeNull();
    expect(cookieJar.get("accessToken")).toBe("");
    expect(cookieJar.get("refreshToken")).toBe("");
  });

  it.each([
    ["the backend is down", textResponse("Bad gateway", 502)],
    ["it hit the refresh rate limit", textResponse("Too many", 429)],
    ["the body isn't JSON", textResponse("<html>", 200)],
    ["success is false", jsonResponse({ success: false, data: { accessToken: "x" } })],
    ["there is no access token", jsonResponse({ success: true, data: {} })],
  ])("keeps the session when %s", async (_, response) => {
    signIn("old", "refresh-1");
    mockFetch([response]);
    expect(await tryRefreshAccessToken()).toBeNull();
    expect(cookieJar.get("accessToken")).toBe("old");
    expect(cookieJar.get("refreshToken")).toBe("refresh-1");
  });

  it("keeps the session when the backend is unreachable", async () => {
    signIn("old", "refresh-1");
    mockFetch(() => {
      throw new TypeError("fetch failed");
    });
    expect(await tryRefreshAccessToken()).toBeNull();
    expect(cookieJar.get("refreshToken")).toBe("refresh-1");
  });

  it("shares one refresh between concurrent callers", async () => {
    signIn("old", "refresh-1");
    let resolve!: (r: Response) => void;
    const fetchMock = mockFetch(() => new Promise<Response>((r) => (resolve = r)));

    const first = tryRefreshAccessToken();
    const second = tryRefreshAccessToken();
    await new Promise((r) => setTimeout(r, 0));
    resolve(jsonResponse({ success: true, data: { accessToken: "new" } }));

    expect(await Promise.all([first, second])).toEqual(["new", "new"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("never shares a refresh between two browsers", async () => {
    const resolvers: ((r: Response) => void)[] = [];
    const fetchMock = mockFetch(() => new Promise<Response>((r) => resolvers.push(r)));

    signIn("old-a", "refresh-a");
    const first = tryRefreshAccessToken();
    await new Promise((r) => setTimeout(r, 0));
    signIn("old-b", "refresh-b");
    const second = tryRefreshAccessToken();
    await new Promise((r) => setTimeout(r, 0));

    resolvers[0](jsonResponse({ success: true, data: { accessToken: "new-a" } }));
    resolvers[1](jsonResponse({ success: true, data: { accessToken: "new-b" } }));

    expect(await Promise.all([first, second])).toEqual(["new-a", "new-b"]);
    expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
      { refreshToken: "refresh-a" },
      { refreshToken: "refresh-b" },
    ]);
  });

  it("hands a just-finished refresh to requests still carrying the old refresh token", async () => {
    // A request the browser sent before it got the new cookies.
    signIn("old", "refresh-1");
    const fetchMock = mockFetch(() => jsonResponse({ success: true, data: { accessToken: "new", refreshToken: "refresh-2" } }));

    await tryRefreshAccessToken();
    signIn("old", "refresh-1");

    expect(await tryRefreshAccessToken()).toBe("new");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(cookieJar.get("refreshToken")).toBe("refresh-2");
  });

  it("refreshes again once the browser presents the rotated refresh token", async () => {
    signIn("old", "refresh-1");
    const fetchMock = mockFetch(() => jsonResponse({ success: true, data: { accessToken: "new", refreshToken: "refresh-2" } }));

    await tryRefreshAccessToken();
    await tryRefreshAccessToken();

    expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
      { refreshToken: "refresh-1" },
      { refreshToken: "refresh-2" },
    ]);
  });

  it("refreshes again with an unrotated refresh token once 30 seconds have passed", async () => {
    signIn("old", "refresh-1");
    const fetchMock = mockFetch(() => jsonResponse({ success: true, data: { accessToken: "new" } }));
    const now = Date.now();
    const clock = vi.spyOn(Date, "now").mockReturnValue(now);

    await tryRefreshAccessToken();
    clock.mockReturnValue(now + 29_000);
    await tryRefreshAccessToken();
    clock.mockReturnValue(now + 31_000);
    await tryRefreshAccessToken();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("doesn't remember a failed refresh", async () => {
    signIn("old", "refresh-1");
    const fetchMock = mockFetch([textResponse("down", 503), jsonResponse({ success: true, data: { accessToken: "new" } })]);

    expect(await tryRefreshAccessToken()).toBeNull();
    expect(await tryRefreshAccessToken()).toBe("new");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("withSessionCleared", () => {
  it("clears the session cookies in the request's jar and on the response", async () => {
    signIn("acc", "ref");

    const res = await withSessionCleared(NextResponse.json({ success: true }));

    expect(cookieJar.get("accessToken")).toBe("");
    expect(cookieJar.get("refreshToken")).toBe("");
    const setCookies = res.headers.getSetCookie();
    expect(setCookies).toEqual([
      expect.stringMatching(/^accessToken=;.*Max-Age=0/),
      expect.stringMatching(/^refreshToken=;.*Max-Age=0/),
    ]);
  });
});

describe("extractArray", () => {
  it.each([
    [[1, 2], [1, 2]],
    [{ items: [1] }, [1]],
    [{ data: [2] }, [2]],
    [{ data: { items: [3] } }, [3]],
    [{ data: { rows: [4] } }, []],
    [{ data: null }, []],
    [null, []],
    ["text", []],
    [undefined, []],
  ])("%j → %j", (body, expected) => {
    expect(extractArray(body)).toEqual(expected);
  });
});

describe("extractBackendErrorMessage", () => {
  it.each([
    [{ message: "Teams cannot be created", data: { errors: ["name is required", 7, "code taken"] } }, "name is required; code taken"],
    [{ message: "generic", data: { error: "Race does not belong to the tournament" } }, "Race does not belong to the tournament"],
    [{ error: "top-level error", message: "generic" }, "top-level error"],
    [{ message: "only message" }, "only message"],
    [{ message: "", msg: "legacy msg" }, "legacy msg"],
    [{ data: { errors: [] } }, "fallback"],
    [{}, "fallback"],
  ])("%j → %s", (body, expected) => {
    expect(extractBackendErrorMessage(body, "fallback")).toBe(expected);
  });
});

describe("handleExternalApiResponse", () => {
  it("parses a JSON body", async () => {
    await expect(handleExternalApiResponse(jsonResponse({ a: 1 }))).resolves.toEqual({ a: 1 });
  });

  it("throws on an empty body", async () => {
    await expect(handleExternalApiResponse(new Response("", { status: 200 }))).rejects.toThrow(
      "Empty response from external API",
    );
  });

  it.each([
    [jsonResponse({ error: "bad id", message: "generic" }, 400), "bad id"],
    [jsonResponse({ message: "Not found" }, 404), "Not found"],
    [jsonResponse({ code: 9 }, 500), "External API request failed"],
    [textResponse("Gateway timeout", 504), "Gateway timeout"],
    [textResponse("", 502), "External API error"],
  ])("throws the best message for a failed response (%#)", async (response, message) => {
    await expect(handleExternalApiResponse(response)).rejects.toThrow(message);
  });
});

describe("response builders", () => {
  it("successResponse wraps data and passes init through", async () => {
    const res = successResponse({ id: 1 }, { status: 201, message: "Created" }, { page: 2 });
    expect(res.status).toBe(201);
    expect(await readJson(res)).toEqual({ success: true, data: { id: 1 }, message: "Created", metadata: { page: 2 } });
  });

  it("successResponse leaves out an empty message", async () => {
    const body = await readJson(successResponse([], {}));
    expect(body).toEqual({ success: true, data: [] });
  });

  it("errorResponse is a 401 with a default message", async () => {
    const res = await errorResponse();
    expect(res.status).toBe(401);
    expect(await readJson(res)).toEqual({ success: false, message: "Unauthorized" });
    expect(await readJson(await errorResponse("Session expired"))).toMatchObject({ message: "Session expired" });
  });

  it("noRecordFound is a 404", async () => {
    const res = await noRecordFound();
    expect(res.status).toBe(404);
    expect(await readJson(res)).toEqual({ success: false, message: "No record found" });
  });
});
