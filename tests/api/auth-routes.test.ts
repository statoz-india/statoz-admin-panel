import { afterEach, describe, expect, it, vi } from "vitest";
import { OPTIONS as loginOptions, POST as login } from "@/app/api/login/route";
import { POST as logout } from "@/app/api/logout/route";
import { POST as sendOtp } from "@/app/api/send-otp/route";
import { GET as socketConfig } from "@/app/api/socket-config/route";
import { APP_VERSION } from "@/app/api/utils/device";
import { cookieJar, signIn } from "../helpers/cookies";
import { API_BASE_URL, fetchCall, jsonResponse, makeRequest, mockFetch, readJson } from "../helpers/http";

const USER = { _id: "u1", userName: "admin", email: "admin@statoz.test", userType: "superadmin" };
const CHROME_ON_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

/** `Set-Cookie` headers by cookie name. */
function setCookies(res: Response): Record<string, string> {
  return Object.fromEntries(res.headers.getSetCookie().map((c) => [c.split("=")[0], c]));
}

describe("POST /api/login", () => {
  const credentials = { email: "admin@statoz.test", otp: "123456" };

  it("forwards the credentials and this browser's device to the superadmin login", async () => {
    const fetchMock = mockFetch([jsonResponse({ success: true, data: { user: USER, accessToken: "acc", refreshToken: "ref" } })]);

    await login(
      makeRequest("/api/login", {
        method: "POST",
        body: { ...credentials, deviceId: "device-1" },
        headers: { "User-Agent": CHROME_ON_MAC },
      }),
    );

    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/authorization/superadmin-login`);
    expect(call.method).toBe("POST");
    expect(call.body).toEqual({
      ...credentials,
      deviceId: "device-1",
      deviceName: "Chrome on macOS",
      platform: "web",
      appVersion: APP_VERSION,
    });
  });

  it("sends the email exactly as send-otp does: trimmed and lower-cased", async () => {
    const fetchMock = mockFetch([jsonResponse({ success: false, message: "Invalid OTP" }, 400)]);

    await login(makeRequest("/api/login", { method: "POST", body: { email: "  Admin@Statoz.Test ", otp: "123456" } }));

    expect(fetchCall(fetchMock).body.email).toBe("admin@statoz.test");
  });

  it("logs in without a device id when the browser sent none (a new session)", async () => {
    const fetchMock = mockFetch([jsonResponse({ success: false }, 400)]);

    await login(makeRequest("/api/login", { method: "POST", body: { ...credentials, deviceId: 42 } }));

    const { body } = fetchCall(fetchMock);
    expect(body).not.toHaveProperty("deviceId");
    expect(body).toMatchObject({ deviceName: "Web browser", platform: "web" });
  });

  it("stores the tokens in httpOnly cookies and returns the backend's body", async () => {
    const backend = { success: true, statusCode: 200, message: "ok", data: { user: USER, accessToken: "acc", refreshToken: "ref" } };
    mockFetch([jsonResponse(backend)]);

    const res = await login(makeRequest("/api/login", { method: "POST", body: credentials }));

    expect(res.status).toBe(200);
    expect(await readJson(res)).toEqual(backend);
    const cookies = setCookies(res);
    expect(cookies.accessToken).toMatch(/^accessToken=acc;/);
    expect(cookies.accessToken).toMatch(/HttpOnly/i);
    expect(cookies.accessToken).toMatch(/Max-Age=86400/);
    expect(cookies.accessToken).toMatch(/SameSite=lax/i);
    expect(cookies.refreshToken).toMatch(/^refreshToken=ref;/);
    expect(cookies.refreshToken).toMatch(/Max-Age=604800/);
  });

  it("only marks cookies Secure in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    mockFetch([jsonResponse({ success: true, data: { user: USER, accessToken: "acc" } })]);
    const res = await login(makeRequest("/api/login", { method: "POST", body: credentials }));
    expect(setCookies(res).accessToken).toMatch(/Secure/);
  });

  it("sets no refresh cookie when the backend sends no refresh token", async () => {
    mockFetch([jsonResponse({ success: true, data: { user: USER, accessToken: "acc" } })]);
    const cookies = setCookies(await login(makeRequest("/api/login", { method: "POST", body: credentials })));
    expect(Object.keys(cookies)).toEqual(["accessToken"]);
  });

  it("passes a failed login through without cookies", async () => {
    mockFetch([jsonResponse({ success: false, message: "Invalid OTP" }, 401)]);

    const res = await login(makeRequest("/api/login", { method: "POST", body: credentials }));

    expect(res.status).toBe(401);
    expect(await readJson(res)).toEqual({ success: false, message: "Invalid OTP" });
    expect(res.headers.getSetCookie()).toEqual([]);
  });

  it("answers 500 when the backend is down", async () => {
    mockFetch(() => {
      throw new TypeError("fetch failed");
    });
    const res = await login(makeRequest("/api/login", { method: "POST", body: credentials }));
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ success: false, message: "Failed to connect to backend server" });
  });

  it("answers CORS preflights", async () => {
    const res = await loginOptions();
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
  });

  it("keeps the panel's session cookies when the backend sets its own, and passes other cookies on", async () => {
    mockFetch([
      new Response(JSON.stringify({ success: true, data: { user: USER, accessToken: "acc", refreshToken: "ref" } }), {
        headers: [
          ["Content-Type", "application/json"],
          ["Set-Cookie", "accessToken=backend-acc; Path=/; HttpOnly; Secure"],
          ["Set-Cookie", "refreshToken=backend-ref; Path=/; HttpOnly; Secure"],
          ["Set-Cookie", "XSRF-TOKEN=xsrf-1; Path=/"],
        ],
      }),
    ]);

    const res = await login(makeRequest("/api/login", { method: "POST", body: credentials }));

    expect(res.headers.getSetCookie()).toHaveLength(3);
    const cookies = setCookies(res);
    expect(cookies.accessToken).toMatch(/^accessToken=acc;/);
    expect(cookies.refreshToken).toMatch(/^refreshToken=ref;/);
    expect(cookies["XSRF-TOKEN"]).toBe("XSRF-TOKEN=xsrf-1; Path=/");
  });
});

describe("POST /api/logout", () => {
  it("logs out on the backend with the access token and clears the cookies", async () => {
    signIn("acc", "ref");
    const fetchMock = mockFetch([jsonResponse({ success: true })]);

    const res = await logout();

    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/authorization/logout`);
    expect(call.method).toBe("POST");
    expect(call.headers.Cookie).toBe("accessToken=acc");
    expect(await readJson(res)).toEqual({ success: true, message: "Logged out successfully" });
    const cookies = setCookies(res);
    expect(cookies.accessToken).toMatch(/^accessToken=;/);
    expect(cookies.refreshToken).toMatch(/^refreshToken=;/);
  });

  it("renews an expired access token first, so the backend can tell which session to end", async () => {
    signIn("old", "refresh-1");
    const fetchMock = mockFetch((url, init) => {
      if (url.endsWith("/refresh-token")) return jsonResponse({ success: true, data: { accessToken: "new", refreshToken: "refresh-2" } });
      return (init.headers as Record<string, string>).Cookie === "accessToken=new" ? jsonResponse({ success: true }) : jsonResponse({}, 498);
    });

    const res = await logout();

    expect(fetchMock.mock.calls.map(([url]) => String(url).replace(API_BASE_URL, ""))).toEqual([
      "/authorization/logout",
      "/authorization/refresh-token",
      "/authorization/logout",
    ]);
    expect(fetchCall(fetchMock, 2).headers.Cookie).toBe("accessToken=new");
    expect(await readJson(res)).toMatchObject({ success: true });
    // The renewed tokens don't survive the logout.
    expect(cookieJar.get("accessToken")).toBe("");
    expect(cookieJar.get("refreshToken")).toBe("");
  });

  it("still clears the cookies when the backend is down", async () => {
    signIn("acc", "ref");
    mockFetch(() => {
      throw new TypeError("fetch failed");
    });

    const res = await logout();

    expect(res.status).toBe(500);
    const cookies = setCookies(res);
    expect(cookies.accessToken).toMatch(/^accessToken=;/);
    expect(cookies.refreshToken).toMatch(/^refreshToken=;/);
  });
});

describe("POST /api/send-otp", () => {
  it("requires an email", async () => {
    const res = await sendOtp(makeRequest("/api/send-otp", { method: "POST", body: {} }));
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ success: false, message: "Email is required" });
  });

  it("asks the backend for a login OTP and passes its answer on", async () => {
    const fetchMock = mockFetch([jsonResponse({ success: true, message: "OTP sent" })]);

    const res = await sendOtp(makeRequest("/api/send-otp", { method: "POST", body: { email: "admin@statoz.test", extra: 1 } }));

    expect(fetchCall(fetchMock).body).toEqual({ email: "admin@statoz.test", purpose: "login" });
    expect(await readJson(res)).toEqual({ success: true, message: "OTP sent" });
  });

  it("trims and lower-cases the email, as login does", async () => {
    const fetchMock = mockFetch([jsonResponse({ success: true })]);

    await sendOtp(makeRequest("/api/send-otp", { method: "POST", body: { email: " Admin@Statoz.Test  " } }));

    expect(fetchCall(fetchMock).body.email).toBe("admin@statoz.test");
  });

  it("requires an email that isn't just spaces", async () => {
    const res = await sendOtp(makeRequest("/api/send-otp", { method: "POST", body: { email: "   " } }));
    expect(res.status).toBe(400);
  });

  it("passes on the backend's status", async () => {
    mockFetch([jsonResponse({ success: false, message: "Not a superadmin" }, 403)]);
    expect((await sendOtp(makeRequest("/api/send-otp", { method: "POST", body: { email: "x@y.z" } }))).status).toBe(403);
  });
});

describe("GET /api/socket-config", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("prefers an explicit SOCKET_URL, without trailing slashes", async () => {
    vi.stubEnv("SOCKET_URL", " https://socket.statoz.test// ");
    expect(await readJson(await socketConfig())).toEqual({ success: true, data: { url: "https://socket.statoz.test" } });
  });

  it("falls back to the API's origin", async () => {
    vi.stubEnv("SOCKET_URL", "");
    vi.stubEnv("API_BASE_URL", "https://api.statoz.test/api/v1");
    expect((await readJson(await socketConfig())).data).toEqual({ url: "https://api.statoz.test" });
  });

  it("explains a missing API_BASE_URL", async () => {
    vi.stubEnv("SOCKET_URL", "");
    vi.stubEnv("API_BASE_URL", "");
    const res = await socketConfig();
    expect(res.status).toBe(500);
    expect((await readJson(res)).message).toBe("API_BASE_URL is not configured");
  });

  it("explains an invalid API_BASE_URL", async () => {
    vi.stubEnv("SOCKET_URL", "");
    vi.stubEnv("API_BASE_URL", "not a url");
    expect((await readJson(await socketConfig())).message).toBe("API_BASE_URL is not a valid URL");
  });
});
