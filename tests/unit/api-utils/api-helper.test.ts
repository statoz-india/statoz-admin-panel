import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";
import {
  authenticatedFetch,
  errorResponse,
  extractArray,
  extractBackendErrorMessage,
  getRefreshTokenCookie,
  getSessionCookie,
  handleExternalApiResponse,
  noRecordFound,
  requireAuth,
  successResponse,
  tryRefreshAccessToken,
} from "@/app/api/utils/api-helper";
import { cookieJar, signIn } from "../../helpers/cookies";
import { API_BASE_URL, fetchCall, jsonResponse, mockFetch, readJson, textResponse } from "../../helpers/http";

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

    it("returns the original 498 when the refresh fails", async () => {
      signIn("old", "refresh-1");
      const fetchMock = mockFetch((url) =>
        url.endsWith("/refresh-token") ? jsonResponse({ success: false }, 401) : jsonResponse({}, 498),
      );

      const res = await authenticatedFetch("/x");

      expect(res.status).toBe(498);
      expect(fetchMock).toHaveBeenCalledTimes(2);
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

  it.each([
    ["the backend refuses", textResponse("expired", 401)],
    ["the body isn't JSON", textResponse("<html>", 200)],
    ["success is false", jsonResponse({ success: false, data: { accessToken: "x" } })],
    ["there is no access token", jsonResponse({ success: true, data: {} })],
  ])("returns null when %s", async (_, response) => {
    signIn("old", "refresh-1");
    mockFetch([response]);
    expect(await tryRefreshAccessToken()).toBeNull();
    expect(cookieJar.get("accessToken")).toBe("old");
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

  it("starts a fresh refresh after the previous one settled", async () => {
    signIn("old", "refresh-1");
    const fetchMock = mockFetch(() => jsonResponse({ success: true, data: { accessToken: "new" } }));

    await tryRefreshAccessToken();
    await tryRefreshAccessToken();

    expect(fetchMock).toHaveBeenCalledTimes(2);
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
