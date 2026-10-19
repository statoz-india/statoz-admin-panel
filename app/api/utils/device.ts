import packageJson from "@/package.json";

/** Sent as `appVersion` at login, so the devices list shows which panel build signed in. */
export const APP_VERSION: string = packageJson.version;

/** The device fields `superadmin-login` takes. */
export interface LoginDevice {
  deviceId?: string;
  deviceName: string;
  platform: "web";
  appVersion: string;
}

const MAX_DEVICE_ID_LENGTH = 128;

// Order matters: Edge, Opera and Samsung Internet also claim to be Chrome and
// Safari, and Chrome claims to be Safari.
const BROWSERS: [RegExp, string][] = [
  [/Edg(e|A|iOS)?\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/SamsungBrowser\//, "Samsung Internet"],
  [/Firefox\/|FxiOS\//, "Firefox"],
  [/Chrome\/|CriOS\//, "Chrome"],
  [/Safari\//, "Safari"],
];

// Android also claims to be Linux.
const SYSTEMS: [RegExp, string][] = [
  [/iPhone|iPad|iPod/, "iOS"],
  [/Android/, "Android"],
  [/CrOS/, "ChromeOS"],
  [/Windows/, "Windows"],
  [/Macintosh|Mac OS X/, "macOS"],
  [/Linux/, "Linux"],
];

/** "Chrome on macOS", from a User-Agent header. */
export function describeBrowser(userAgent: string | null | undefined): string {
  const ua = userAgent ?? "";
  const browser = BROWSERS.find(([pattern]) => pattern.test(ua))?.[1];
  const system = SYSTEMS.find(([pattern]) => pattern.test(ua))?.[1];
  if (browser && system) return `${browser} on ${system}`;
  return browser ?? system ?? "Web browser";
}

/**
 * The device fields for a login from this browser. A missing or odd device id
 * is left out: the login still works, it just opens a new session.
 */
export function loginDevice(
  deviceId: unknown,
  userAgent: string | null | undefined,
): LoginDevice {
  const id = typeof deviceId === "string" ? deviceId.trim() : "";
  return {
    ...(id && id.length <= MAX_DEVICE_ID_LENGTH ? { deviceId: id } : {}),
    deviceName: describeBrowser(userAgent),
    platform: "web",
    appVersion: APP_VERSION,
  };
}
