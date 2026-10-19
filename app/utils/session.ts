/** localStorage key for this browser's device id. */
export const DEVICE_ID_KEY = "statoz.deviceId";

function newDeviceId(): string {
  // randomUUID only exists in secure contexts; the panel is sometimes opened
  // over plain http on a LAN address.
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * This browser's id, made once and sent on every login. With it, logging in
 * again reuses this browser's session; without it every login opens a new one,
 * and past 5 the backend signs out the least recently used device.
 */
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = newDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/** Wipe what the panel keeps in the browser after signing out, except the device id. */
export function clearBrowserStorage(): void {
  const deviceId = localStorage.getItem(DEVICE_ID_KEY);
  localStorage.clear();
  sessionStorage.clear();
  if (deviceId) localStorage.setItem(DEVICE_ID_KEY, deviceId);
}

/** Panel routes that work without a session: their failures say nothing about it. */
const SESSIONLESS_ROUTES = new Set([
  "/api/login",
  "/api/send-otp",
  "/api/logout",
  "/api/session-status",
]);

function isSessionRoute(input: RequestInfo | URL): boolean {
  try {
    const raw =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const url = new URL(raw, window.location.href);
    return (
      url.origin === window.location.origin &&
      url.pathname.startsWith("/api/") &&
      !SESSIONLESS_ROUTES.has(url.pathname)
    );
  } catch {
    return false;
  }
}

/**
 * Call `onSignedOut` once this browser's session turns out to be gone. Checks
 * now, and again whenever one of the panel's own API calls fails: sections
 * call `fetch` directly and each route reports a dead session with its own
 * status, so this asks `/api/session-status` instead of reading statuses.
 * Returns a function that stops watching.
 */
export function watchSession(onSignedOut: () => void): () => void {
  const nativeFetch = globalThis.fetch;
  const callNative: typeof fetch = (input, init) => nativeFetch(input, init);
  let checking: Promise<void> | null = null;
  let stopped = false;

  const check = () =>
    (checking ??= (async () => {
      try {
        const res = await callNative("/api/session-status", {
          credentials: "include",
          cache: "no-store",
        });
        const body = await res.json();
        if (!stopped && res.ok && body?.data?.signedIn === false) {
          stopped = true;
          onSignedOut();
        }
      } catch {
        // Offline, or the panel is redeploying: that says nothing about the session.
      } finally {
        checking = null;
      }
    })());

  const watchedFetch: typeof fetch = async (input, init) => {
    const response = await callNative(input, init);
    if (!response.ok && !stopped && isSessionRoute(input)) void check();
    return response;
  };

  globalThis.fetch = watchedFetch;
  void check();

  return () => {
    stopped = true;
    if (globalThis.fetch === watchedFetch) globalThis.fetch = nativeFetch;
  };
}
