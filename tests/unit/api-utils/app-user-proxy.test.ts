import { describe, expect, it } from "vitest";
import { POST as appUserLogin } from "@/app/api/app-user/login/route";
import { POST as appUserRefresh } from "@/app/api/app-user/refresh/route";
import { POST as appUserSendOtp } from "@/app/api/app-user/send-otp/route";
import { GET as actGet, POST as actPost } from "@/app/api/app-user/act/[...path]/route";
import { isAllowedAppUserAction } from "@/app/api/utils/app-user-proxy";
import { APP_USER_TOKEN_HEADER } from "@/app/interface/app-user.interface";
import { cookieJar, signIn } from "../../helpers/cookies";
import {
  API_BASE_URL,
  fetchCall,
  jsonResponse,
  makeRequest,
  mockFetch,
  readJson,
  routeContext,
} from "../../helpers/http";

const ID = "6721f0c2a1b2c3d4e5f60718";

const act = (method: "GET" | "POST", path: string, { token = "user-token", body }: { token?: string | null; body?: unknown } = {}) => {
  const request = makeRequest(`/api/app-user/act/${path}`, {
    method,
    body,
    headers: token ? { [APP_USER_TOKEN_HEADER]: token } : {},
  });
  const context = routeContext({ path: path.split("/") } as unknown as Record<string, string>);
  return method === "GET" ? actGet(request, context) : actPost(request, context);
};

describe("isAllowedAppUserAction", () => {
  it.each([
    ["GET", "user/current-user"],
    ["GET", "quiz/homePageQuizzes"],
    ["GET", `quiz/${ID}`],
    ["POST", `quiz/submitQuiz/${ID}`],
    ["PUT", `quiz/updateSubmission/${ID}`],
    ["POST", `prediction/submitPrediction/${ID}`],
    ["GET", `prediction/userSubmittedBets/${ID}`],
    ["POST", `events/submitEventBet/${ID}`],
    ["GET", `events/${ID}/userEventBet`],
    ["POST", `futures/submitBet/${ID}`],
    ["GET", `futures/${ID}/userBet`],
  ])("allows %s %s", (method, path) => {
    expect(isAllowedAppUserAction(method, path)).toBe(true);
  });

  it.each([
    ["POST", "user/current-user"],
    ["GET", "user/getAllUsers"],
    ["POST", `quiz/quizSettlement/${ID}`],
    ["POST", "prediction/submitPrediction/not-an-id"],
    ["GET", `quiz/${ID}/../../admin-data/x`],
    ["DELETE", `quiz/${ID}`],
  ])("refuses %s %s", (method, path) => {
    expect(isAllowedAppUserAction(method, path)).toBe(false);
  });
});

describe("/api/app-user/act", () => {
  it("needs the admin to be signed in to the panel", async () => {
    cookieJar.clear();
    const fetchMock = mockFetch([jsonResponse({ data: [] })]);
    const res = await act("GET", "quiz/homePageQuizzes");
    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses actions outside the allowlist", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: [] })]);
    const res = await act("GET", "user/getAllUsers");
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("asks for a new login when there's no user token", async () => {
    signIn();
    const res = await act("GET", "quiz/homePageQuizzes", { token: null });
    expect(res.status).toBe(401);
    expect(await readJson(res)).toMatchObject({ success: false, appUserSignedOut: true });
  });

  it("acts with the user's token, never the admin's cookie", async () => {
    signIn("admin-session");
    const fetchMock = mockFetch([jsonResponse({ data: { coins: 10 }, message: "ok" })]);
    const res = await act("POST", `prediction/submitPrediction/${ID}`, { body: { teamChosen: "A", coinsBet: 5 } });

    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/prediction/submitPrediction/${ID}`);
    expect(call.method).toBe("POST");
    expect(call.headers.Authorization).toBe("Bearer user-token");
    expect(JSON.stringify(call.headers)).not.toContain("admin-session");
    expect(call.body).toEqual({ teamChosen: "A", coinsBet: 5 });
    expect(await readJson(res)).toEqual({ success: true, data: { coins: 10 }, message: "ok" });
  });

  it("turns an empty home-page list (404) into []", async () => {
    signIn();
    mockFetch([jsonResponse({ data: [], message: "No events found" }, 404)]);
    const res = await act("GET", "events/homePageEvents");
    expect(res.status).toBe(200);
    expect(await readJson(res)).toMatchObject({ success: true, data: [] });
  });

  it("passes a refused bet on with the backend's detail", async () => {
    signIn();
    mockFetch([jsonResponse({ data: { error: "Entry period is closed" }, message: "Bet cannot be placed" }, 400)]);
    const res = await act("POST", `events/submitEventBet/${ID}`, { body: { chosenOption: "Y", coinsBet: 1 } });
    expect(res.status).toBe(400);
    expect(await readJson(res)).toMatchObject({ success: false, message: "Entry period is closed" });
  });

  it("passes an expired token (498) on so the browser can renew it", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "Token expired" }, 498)]);
    const res = await act("GET", "user/current-user");
    expect(res.status).toBe(498);
    expect(await readJson(res)).not.toHaveProperty("appUserSignedOut");
  });

  it("flags a refused user session (401)", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "Invalid access token" }, 401)]);
    const res = await act("GET", "user/current-user");
    expect(res.status).toBe(401);
    expect(await readJson(res)).toMatchObject({ appUserSignedOut: true, message: "Invalid access token" });
  });

  it("turns a network failure into a 500", async () => {
    signIn();
    mockFetch(() => {
      throw new Error("ECONNREFUSED");
    });
    const res = await act("GET", "user/current-user");
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ success: false, message: "ECONNREFUSED" });
  });

  it("copes with a non-JSON body", async () => {
    signIn();
    mockFetch([new Response("<html>", { status: 502 })]);
    const res = await act("GET", "user/current-user");
    expect(res.status).toBe(502);
    expect((await readJson(res)).message).toBe("The request failed");
  });
});

describe("/api/app-user sign-in routes", () => {
  it("sends a login code, normalising the email", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: null, message: "OTP sent" })]);
    const res = await appUserSendOtp(makeRequest("/api/app-user/send-otp", { method: "POST", body: { email: " Player@Example.com " } }));
    expect(fetchCall(fetchMock)).toMatchObject({
      url: `${API_BASE_URL}/authorization/send-otp`,
      body: { email: "player@example.com", purpose: "login" },
    });
    expect(await readJson(res)).toMatchObject({ success: true, message: "OTP sent" });
  });

  it("requires an email", async () => {
    const res = await appUserSendOtp(makeRequest("/api/app-user/send-otp", { method: "POST", body: {} }));
    expect(res.status).toBe(400);
  });

  it("logs the user in with /login and returns their tokens", async () => {
    signIn("admin-session");
    const login = { user: { _id: ID, email: "p@x.com" }, accessToken: "a", refreshToken: "r" };
    const fetchMock = mockFetch([jsonResponse({ data: login })]);
    const res = await appUserLogin(
      makeRequest("/api/app-user/login", {
        method: "POST",
        body: { email: "P@x.com", otp: " 123456 ", deviceId: "device-1" },
        headers: { "user-agent": "Mozilla/5.0 (Macintosh) Chrome/120 Safari/537" },
      }),
    );
    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/authorization/login`);
    expect(call.body).toMatchObject({
      email: "p@x.com",
      otp: "123456",
      deviceId: "device-1",
      platform: "web",
      deviceName: "Statoz admin panel (Chrome on macOS)",
    });
    expect(call.headers).not.toHaveProperty("Cookie");
    expect(await readJson(res)).toMatchObject({ success: true, data: login });
  });

  it("passes a wrong code's message on", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "Invalid OTP" }, 400)]);
    const res = await appUserLogin(makeRequest("/api/app-user/login", { method: "POST", body: { email: "p@x.com", otp: "1" } }));
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ success: false, message: "Invalid OTP" });
  });

  it("requires the email and the code", async () => {
    const res = await appUserLogin(makeRequest("/api/app-user/login", { method: "POST", body: { email: "p@x.com" } }));
    expect(res.status).toBe(400);
  });

  it("renews a user's session", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: { accessToken: "new", refreshToken: "r" } })]);
    const res = await appUserRefresh(makeRequest("/api/app-user/refresh", { method: "POST", body: { refreshToken: "r" } }));
    expect(fetchCall(fetchMock).body).toEqual({ refreshToken: "r" });
    expect(await readJson(res)).toMatchObject({ success: true, data: { accessToken: "new" } });
  });

  it("flags a refused refresh as signed out", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "Invalid refresh token" }, 401)]);
    const res = await appUserRefresh(makeRequest("/api/app-user/refresh", { method: "POST", body: { refreshToken: "r" } }));
    expect(res.status).toBe(401);
    expect(await readJson(res)).toMatchObject({ appUserSignedOut: true });
  });

  it("flags a missing refresh token as signed out", async () => {
    const res = await appUserRefresh(makeRequest("/api/app-user/refresh", { method: "POST", body: {} }));
    expect(res.status).toBe(401);
    expect(await readJson(res)).toMatchObject({ appUserSignedOut: true });
  });

  it("turns a network failure into a 500", async () => {
    signIn();
    mockFetch(() => {
      throw new Error("ECONNREFUSED");
    });
    const res = await appUserRefresh(makeRequest("/api/app-user/refresh", { method: "POST", body: { refreshToken: "r" } }));
    expect(res.status).toBe(500);
  });
});
