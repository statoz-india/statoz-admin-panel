import { describe, expect, it } from "vitest";
import { loginErrorMessage, normalizeEmail } from "@/app/utils/login";

describe("normalizeEmail", () => {
  it.each([
    ["  Admin@Statoz.IN ", "admin@statoz.in"],
    ["admin@statoz.in", "admin@statoz.in"],
    ["", ""],
    [undefined, ""],
    [42, ""],
  ])("%j → %j", (input, expected) => {
    expect(normalizeEmail(input)).toBe(expected);
  });
});

describe("loginErrorMessage", () => {
  it.each([
    [400, "Email and otp are required field", "Enter your email and the code."],
    [400, "OTP expired or not found", "This code has expired or was already used. Request a new one."],
    [400, "Invalid OTP", "That code isn't right. Check it and try again."],
    [401, "User should be superadmin to access admin panel", "This account isn't an admin."],
    [404, "User does not exist", "No account uses this email."],
    [429, "Too many authentication attempts, please try again later.", "Too many attempts. Wait 15 minutes, then try again."],
    [429, undefined, "Too many attempts. Wait 15 minutes, then try again."],
  ])("explains a %d %j", (status, message, expected) => {
    expect(loginErrorMessage(status, message, "Login failed")).toBe(expected);
  });

  it("passes on any other backend message", () => {
    expect(loginErrorMessage(403, "Not a superadmin", "Login failed")).toBe("Not a superadmin");
  });

  it.each([undefined, "", 7, { message: "x" }])("falls back without a usable message (%j)", (message) => {
    expect(loginErrorMessage(500, message, "Login failed")).toBe("Login failed");
  });

  it("doesn't match inherited object keys", () => {
    expect(loginErrorMessage(400, "constructor", "Login failed")).toBe("constructor");
  });
});
