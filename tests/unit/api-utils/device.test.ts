import { describe, expect, it } from "vitest";
import { APP_VERSION, describeBrowser, loginDevice } from "@/app/api/utils/device";
import packageJson from "@/package.json";

const UA = {
  chromeMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  safariMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
  edgeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
  firefoxLinux: "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
  operaWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 OPR/115.0.0.0",
  samsungAndroid:
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36",
  chromeAndroid:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  chromeIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.0.0 Mobile/15E148 Safari/604.1",
  firefoxIpad:
    "Mozilla/5.0 (iPad; CPU OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/131.0 Mobile/15E148 Safari/605.1.15",
  chromebook:
    "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
};

describe("describeBrowser", () => {
  it.each([
    [UA.chromeMac, "Chrome on macOS"],
    [UA.safariMac, "Safari on macOS"],
    [UA.edgeWindows, "Edge on Windows"],
    [UA.firefoxLinux, "Firefox on Linux"],
    [UA.operaWindows, "Opera on Windows"],
    [UA.samsungAndroid, "Samsung Internet on Android"],
    [UA.chromeAndroid, "Chrome on Android"],
    [UA.chromeIphone, "Chrome on iOS"],
    [UA.firefoxIpad, "Firefox on iOS"],
    [UA.chromebook, "Chrome on ChromeOS"],
  ])("%s → %s", (userAgent, expected) => {
    expect(describeBrowser(userAgent)).toBe(expected);
  });

  it.each([
    ["curl/8.7.1", "Web browser"],
    ["", "Web browser"],
    [null, "Web browser"],
    [undefined, "Web browser"],
    ["SomeBot (Windows NT 10.0)", "Windows"],
    ["Firefox/131.0", "Firefox"],
  ])("falls back for %j → %s", (userAgent, expected) => {
    expect(describeBrowser(userAgent)).toBe(expected);
  });
});

describe("loginDevice", () => {
  it("describes this browser for superadmin-login", () => {
    expect(loginDevice("3f0c-device", UA.chromeMac)).toEqual({
      deviceId: "3f0c-device",
      deviceName: "Chrome on macOS",
      platform: "web",
      appVersion: packageJson.version,
    });
    expect(APP_VERSION).toBe(packageJson.version);
  });

  it("trims the device id", () => {
    expect(loginDevice("  id-1 ", null).deviceId).toBe("id-1");
  });

  it.each([
    ["missing", undefined],
    ["blank", "   "],
    ["not a string", 42],
    ["too long", "x".repeat(129)],
  ])("leaves out a %s device id", (_, deviceId) => {
    expect(loginDevice(deviceId, null)).not.toHaveProperty("deviceId");
  });
});
