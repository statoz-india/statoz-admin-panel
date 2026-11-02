// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { APP_USER_TOKEN_HEADER } from "@/app/interface/app-user.interface";
import { ApiRequestError } from "@/app/utils/apiRequest";
import {
  APP_USERS_STORAGE_KEY,
  appUserRequest,
  findAppUser,
  readAppUsers,
  removeAppUser,
  saveAppUserLogin,
  sendAppUserCode,
  signInAppUser,
} from "@/app/utils/appUsers";
import { fetchCall, jsonResponse, mockFetch } from "../helpers/http";

const login = (id = "u1", accessToken = "access-1") => ({
  user: { _id: id, email: `${id}@x.com`, userName: id, coins: 100 },
  accessToken,
  refreshToken: "refresh-1",
});

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe("app user store", () => {
  it("adds users, replaces a re-added one's tokens, and removes them", () => {
    saveAppUserLogin(login("u1"));
    saveAppUserLogin(login("u2"));
    const first = findAppUser("u1")!;
    saveAppUserLogin(login("u1", "access-2"));

    expect(readAppUsers().map((u) => u._id)).toEqual(["u1", "u2"]);
    expect(findAppUser("u1")).toMatchObject({ accessToken: "access-2", addedAt: first.addedAt });

    removeAppUser("u1");
    expect(readAppUsers().map((u) => u._id)).toEqual(["u2"]);
  });

  it("ignores broken storage", () => {
    localStorage.setItem(APP_USERS_STORAGE_KEY, "{");
    expect(readAppUsers()).toEqual([]);
    localStorage.setItem(APP_USERS_STORAGE_KEY, JSON.stringify([{ nope: true }]));
    expect(readAppUsers()).toEqual([]);
  });
});

describe("signing a user in", () => {
  it("stores the user after the code is accepted", async () => {
    const fetchMock = mockFetch([jsonResponse({ success: true, data: login("u9") })]);
    await signInAppUser("u9@x.com", "123456", "device-1");
    expect(fetchCall(fetchMock).body).toEqual({ email: "u9@x.com", otp: "123456", deviceId: "device-1" });
    expect(findAppUser("u9")).toMatchObject({ email: "u9@x.com", coins: 100 });
  });

  it("reports a wrong code without storing anyone", async () => {
    mockFetch([jsonResponse({ success: false, message: "Invalid OTP" }, 400)]);
    await expect(signInAppUser("u9@x.com", "1", "d")).rejects.toThrow("Invalid OTP");
    expect(readAppUsers()).toEqual([]);
  });

  it("reports a code that couldn't be sent", async () => {
    mockFetch([jsonResponse({ success: false, message: "User does not exist" }, 404)]);
    await expect(sendAppUserCode("x@x.com")).rejects.toMatchObject({ status: 404 });
  });
});

describe("appUserRequest", () => {
  it("sends the user's token and unwraps the data", async () => {
    saveAppUserLogin(login());
    const fetchMock = mockFetch([jsonResponse({ success: true, data: { coins: 5 } })]);
    expect(await appUserRequest("u1", "GET", "user/current-user")).toEqual({ coins: 5 });
    const call = fetchCall(fetchMock);
    expect(call.url).toBe("/api/app-user/act/user/current-user");
    expect(call.headers[APP_USER_TOKEN_HEADER]).toBe("access-1");
  });

  it("renews an expired token once and retries", async () => {
    saveAppUserLogin(login());
    const fetchMock = mockFetch([
      jsonResponse({ success: false, message: "Token expired" }, 498),
      jsonResponse({ success: true, data: { accessToken: "access-2" } }),
      jsonResponse({ success: true, data: [] }),
    ]);

    await appUserRequest("u1", "GET", "quiz/homePageQuizzes");

    expect(fetchCall(fetchMock, 1)).toMatchObject({ url: "/api/app-user/refresh", body: { refreshToken: "refresh-1" } });
    expect(fetchCall(fetchMock, 2).headers[APP_USER_TOKEN_HEADER]).toBe("access-2");
    expect(findAppUser("u1")).toMatchObject({ accessToken: "access-2", refreshToken: "refresh-1" });
  });

  it("marks the user signed out when the backend ends their session", async () => {
    saveAppUserLogin(login());
    mockFetch([jsonResponse({ success: false, message: "Invalid access token", appUserSignedOut: true }, 401)]);
    await expect(appUserRequest("u1", "GET", "user/current-user")).rejects.toBeInstanceOf(ApiRequestError);
    expect(findAppUser("u1")?.signedOut).toBe(true);
    await expect(appUserRequest("u1", "GET", "user/current-user")).rejects.toMatchObject({ status: 401 });
  });

  it("marks the user signed out when the renewal is refused", async () => {
    saveAppUserLogin(login());
    mockFetch([
      jsonResponse({ success: false }, 498),
      jsonResponse({ success: false, message: "Invalid refresh token", appUserSignedOut: true }, 401),
    ]);
    await expect(appUserRequest("u1", "GET", "user/current-user")).rejects.toMatchObject({ status: 401 });
    expect(findAppUser("u1")?.signedOut).toBe(true);
  });

  it("leaves the user signed in when the admin's own session is the problem", async () => {
    saveAppUserLogin(login());
    mockFetch([jsonResponse({ success: false, message: "Unauthorized" }, 401)]);
    await expect(appUserRequest("u1", "GET", "user/current-user")).rejects.toThrow("Unauthorized");
    expect(findAppUser("u1")?.signedOut).toBeUndefined();
  });

  it("refuses a user who isn't stored", async () => {
    await expect(appUserRequest("ghost", "GET", "user/current-user")).rejects.toMatchObject({ status: 404 });
  });
});
