// @vitest-environment jsdom

/**
 * Per-device sessions in the browser: the device id sent at login, signing
 * out without losing it, noticing a session that ended elsewhere, and the
 * signed-in devices screen.
 */

import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DevicesSection from "@/app/components/devices/DevicesSection";
import SessionGuard from "@/app/components/SessionGuard";
import type { DeviceSession } from "@/app/interface/session.interface";
import { useAuthStore, type User } from "@/app/store/authStore";
import { DEVICE_ID_KEY, clearBrowserStorage, getDeviceId, watchSession } from "@/app/utils/session";
import { fetchCall, jsonResponse, mockFetch } from "../helpers/http";

const router = { replace: vi.fn(), push: vi.fn(), back: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), forward: vi.fn() };

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

const ADMIN: User = {
  _id: "u1",
  userName: "admin",
  email: "admin@statoz.test",
  userType: "superadmin",
  createdAt: "",
  updatedAt: "",
  __v: 0,
  coins: 0,
  xp: 0,
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const flush = () => act(async () => new Promise((r) => setTimeout(r, 0)));

describe("getDeviceId", () => {
  it("makes an id once and keeps it in localStorage", () => {
    const id = getDeviceId();
    expect(id).toMatch(UUID);
    expect(getDeviceId()).toBe(id);
    expect(window.localStorage.getItem(DEVICE_ID_KEY)).toBe(id);
  });

  it("reuses an id the browser already has", () => {
    window.localStorage.setItem(DEVICE_ID_KEY, "existing-id");
    expect(getDeviceId()).toBe("existing-id");
  });

  it("still makes a UUID where crypto.randomUUID is missing (plain http)", () => {
    const real = globalThis.crypto;
    vi.stubGlobal("crypto", { getRandomValues: real.getRandomValues.bind(real) });
    expect(getDeviceId()).toMatch(UUID);
  });
});

describe("clearBrowserStorage", () => {
  it("wipes local and session storage but keeps the device id", () => {
    window.localStorage.setItem(DEVICE_ID_KEY, "device-1");
    window.localStorage.setItem("auth-storage", "{}");
    window.localStorage.setItem("admin_pinned_tournaments", "[]");
    window.sessionStorage.setItem("admin_users_scroll_top", "120");

    clearBrowserStorage();

    expect(window.localStorage.length).toBe(1);
    expect(window.localStorage.getItem(DEVICE_ID_KEY)).toBe("device-1");
    expect(window.sessionStorage.length).toBe(0);
  });

  it("doesn't invent a device id", () => {
    window.localStorage.setItem("auth-storage", "{}");
    clearBrowserStorage();
    expect(window.localStorage.length).toBe(0);
  });
});

describe("watchSession", () => {
  /** A panel whose session is `signedIn`, and whose other routes answer `status`. */
  function panel({ signedIn = true, status = 200 } = {}) {
    const state = { signedIn, status };
    const fetchMock = mockFetch((url) =>
      url === "/api/session-status"
        ? jsonResponse({ success: true, data: { signedIn: state.signedIn } })
        : jsonResponse({ success: state.status < 400 }, state.status),
    );
    const statusChecks = () => fetchMock.mock.calls.filter(([url]) => url === "/api/session-status").length;
    return { state, fetchMock, statusChecks };
  }

  it("checks the session when it starts, and reports one that's gone", async () => {
    panel({ signedIn: false });
    const onSignedOut = vi.fn();

    watchSession(onSignedOut);

    await waitFor(() => expect(onSignedOut).toHaveBeenCalledOnce());
  });

  it("checks again after a failed call and reports the session once it's gone", async () => {
    const { state, statusChecks } = panel();
    const onSignedOut = vi.fn();
    watchSession(onSignedOut);
    await flush();
    expect(onSignedOut).not.toHaveBeenCalled();

    // Signed out from another device; the route answers with its own status.
    state.signedIn = false;
    state.status = 500;
    const res = await fetch("/api/users/getAllUsers");
    await flush();

    expect(res.status).toBe(500);
    expect(statusChecks()).toBe(2);
    expect(onSignedOut).toHaveBeenCalledOnce();

    await fetch("/api/users/getAllUsers");
    await flush();
    expect(onSignedOut).toHaveBeenCalledOnce();
  });

  it("leaves a live session alone after a failure (a 403, a bug, a dead backend)", async () => {
    const { statusChecks } = panel({ status: 403 });
    const onSignedOut = vi.fn();
    watchSession(onSignedOut);
    await flush();

    await fetch("/api/sessions");
    await flush();

    expect(statusChecks()).toBe(2);
    expect(onSignedOut).not.toHaveBeenCalled();
  });

  it("only asks after failed calls to the panel's own session routes", async () => {
    const { state, statusChecks } = panel();
    watchSession(vi.fn());
    await flush();
    expect(statusChecks()).toBe(1);

    await fetch("/api/users/getAllUsers");
    state.status = 401;
    await fetch("https://elsewhere.test/api/users");
    await fetch("/api/login", { method: "POST" });
    await fetch("/api/send-otp", { method: "POST" });
    await fetch("http://[");
    await flush();
    expect(statusChecks()).toBe(1);

    await fetch(new URL("/api/a", window.location.origin));
    await flush();
    await fetch(new Request(`${window.location.origin}/api/b`));
    await flush();
    expect(statusChecks()).toBe(3);
  });

  it("runs one check at a time", async () => {
    let answer!: (r: Response) => void;
    const fetchMock = mockFetch((url) =>
      url === "/api/session-status" ? new Promise<Response>((r) => (answer = r)) : jsonResponse({}, 500),
    );
    const onSignedOut = vi.fn();
    watchSession(onSignedOut);

    await fetch("/api/x");
    await fetch("/api/y");
    answer(jsonResponse({ success: true, data: { signedIn: false } }));
    await flush();

    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/session-status")).toHaveLength(1);
    expect(onSignedOut).toHaveBeenCalledOnce();
  });

  it("concludes nothing when the check itself fails", async () => {
    mockFetch((url) => {
      if (url === "/api/session-status") throw new TypeError("offline");
      return jsonResponse({}, 500);
    });
    const onSignedOut = vi.fn();
    watchSession(onSignedOut);

    await fetch("/api/x");
    await flush();

    expect(onSignedOut).not.toHaveBeenCalled();
  });

  it("puts fetch back and goes quiet when stopped", async () => {
    let answer!: (r: Response) => void;
    const fetchMock = mockFetch(() => new Promise<Response>((r) => (answer = r)));
    const onSignedOut = vi.fn();

    const stop = watchSession(onSignedOut);
    expect(globalThis.fetch).not.toBe(fetchMock);
    stop();
    answer(jsonResponse({ success: true, data: { signedIn: false } }));
    await flush();

    expect(globalThis.fetch).toBe(fetchMock);
    expect(onSignedOut).not.toHaveBeenCalled();
  });
});

describe("SessionGuard", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: true, token: "tok", user: ADMIN, hasHydrated: true });
  });

  it("sends the admin to login once the session is gone, keeping the device id", async () => {
    window.localStorage.setItem(DEVICE_ID_KEY, "device-1");
    window.sessionStorage.setItem("x", "1");
    mockFetch([jsonResponse({ success: true, data: { signedIn: false } })]);

    render(<SessionGuard />);

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/login"));
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(window.localStorage.getItem(DEVICE_ID_KEY)).toBe("device-1");
    expect(window.sessionStorage.length).toBe(0);
  });

  it("stays out of the way while signed out", async () => {
    useAuthStore.setState({ isAuthenticated: false, token: null, user: null });
    const fetchMock = mockFetch([jsonResponse({ success: true, data: { signedIn: false } })]);

    render(<SessionGuard />);
    await flush();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(globalThis.fetch).toBe(fetchMock);
  });

  it("stops watching when unmounted", async () => {
    const fetchMock = mockFetch([jsonResponse({ success: true, data: { signedIn: true } })]);

    const { unmount } = render(<SessionGuard />);
    await flush();
    unmount();

    expect(globalThis.fetch).toBe(fetchMock);
    expect(router.push).not.toHaveBeenCalled();
  });
});

describe("DevicesSection", () => {
  const THIS_BROWSER: DeviceSession = {
    _id: "s1",
    deviceName: "Chrome on macOS",
    platform: "web",
    appVersion: "0.1.0",
    ip: "203.0.113.7",
    lastUsedAt: "2026-10-19T09:12:44.000Z",
    createdAt: "2026-10-01T18:03:10.000Z",
    isCurrent: true,
  };
  const PHONE: DeviceSession = {
    _id: "s2",
    deviceName: "Pixel 8",
    platform: "android",
    appVersion: "1.8.0",
    lastUsedAt: "not a date",
    isCurrent: false,
  };
  const LAPTOP: DeviceSession = { _id: "s3", platform: "web", isCurrent: false };

  /** The panel's session routes, answering from `sessions`. */
  function backend(sessions: DeviceSession[], answers: Record<string, () => Response> = {}) {
    return mockFetch((url, init) => {
      const method = (init.method ?? "GET").toUpperCase();
      const key = `${method} ${url}`;
      if (answers[key]) return answers[key]();
      if (key === "GET /api/sessions") return jsonResponse({ success: true, data: sessions });
      return jsonResponse({ success: true });
    });
  }

  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: true, token: "tok", user: ADMIN, hasHydrated: true });
  });

  it("lists the devices, marking this browser and not offering to sign it out", async () => {
    backend([THIS_BROWSER, PHONE, LAPTOP]);
    render(<DevicesSection />);

    const current = (await screen.findByText("Chrome on macOS")).closest("tr")!;
    expect(within(current).getByText("This browser")).toBeInTheDocument();
    expect(within(current).queryByRole("button")).toBeNull();
    expect(within(current).getByText("web · 0.1.0")).toBeInTheDocument();
    expect(within(current).getByText("203.0.113.7")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Sign out Pixel 8" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out Unknown device" })).toBeInTheDocument();
  });

  it("signs one device out after confirming, and says it may notice late", async () => {
    const user = userEvent.setup();
    const fetchMock = backend([THIS_BROWSER, PHONE]);
    render(<DevicesSection />);

    await user.click(await screen.findByRole("button", { name: "Sign out Pixel 8" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/up to 15 minutes/)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Sign out" }));

    await waitFor(() => expect(screen.queryByText("Pixel 8")).toBeNull());
    const call = fetchCall(fetchMock, 1);
    expect(call.url).toBe("/api/sessions/s2");
    expect(call.method).toBe("DELETE");
    expect(screen.getByText(/Signed out Pixel 8\. It can keep working for up to 15 minutes/)).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("can back out of signing a device out", async () => {
    const user = userEvent.setup();
    const fetchMock = backend([THIS_BROWSER, PHONE]);
    render(<DevicesSection />);

    await user.click(await screen.findByRole("button", { name: "Sign out Pixel 8" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("drops a device that was already signed out", async () => {
    const user = userEvent.setup();
    backend([THIS_BROWSER, PHONE], {
      "DELETE /api/sessions/s2": () => jsonResponse({ success: false, message: "Session not found" }, 404),
    });
    render(<DevicesSection />);

    await user.click(await screen.findByRole("button", { name: "Sign out Pixel 8" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Sign out" }));

    expect(await screen.findByText("That device was already signed out.")).toBeInTheDocument();
    expect(screen.queryByText("Pixel 8")).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps the dialog open with the reason when signing out fails", async () => {
    const user = userEvent.setup();
    backend([THIS_BROWSER, PHONE], {
      "DELETE /api/sessions/s2": () => jsonResponse({ success: false, message: "Backend unavailable" }, 503),
    });
    render(<DevicesSection />);

    await user.click(await screen.findByRole("button", { name: "Sign out Pixel 8" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Sign out" }));

    expect(await screen.findByText("Backend unavailable")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("signs out every other device and keeps this one", async () => {
    const user = userEvent.setup();
    const fetchMock = backend([THIS_BROWSER, PHONE, LAPTOP]);
    render(<DevicesSection />);

    await user.click(await screen.findByRole("button", { name: "Sign out all other devices" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Sign out others" }));

    await waitFor(() => expect(screen.queryByText("Pixel 8")).toBeNull());
    expect(fetchCall(fetchMock, 1)).toMatchObject({ url: "/api/logout-all", method: "POST", body: { keepCurrent: true } });
    expect(screen.getByText("Chrome on macOS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out all other devices" })).toBeDisabled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("signs out everywhere and goes to login, keeping the device id", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(DEVICE_ID_KEY, "device-1");
    const fetchMock = backend([THIS_BROWSER, PHONE]);
    render(<DevicesSection />);

    await user.click(await screen.findByRole("button", { name: "Sign out everywhere" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Sign out everywhere" }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/login"));
    expect(fetchCall(fetchMock, 1)).toMatchObject({ url: "/api/logout-all", method: "POST", body: {} });
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(window.localStorage.getItem(DEVICE_ID_KEY)).toBe("device-1");
  });

  it("shows a 403 as no access", async () => {
    backend([], {
      "GET /api/sessions": () => jsonResponse({ success: false, message: "Forbidden - SuperAdmin access required" }, 403),
    });
    render(<DevicesSection />);

    expect(await screen.findByText("This account doesn't have admin access.")).toBeInTheDocument();
  });

  it("shows why the list couldn't load, and an empty list", async () => {
    mockFetch(() => {
      throw new TypeError("Failed to fetch");
    });
    const { unmount } = render(<DevicesSection />);
    expect(await screen.findByText("Failed to fetch")).toBeInTheDocument();
    unmount();

    backend([]);
    render(<DevicesSection />);
    expect(await screen.findByText("No signed-in devices to show.")).toBeInTheDocument();
  });

  it("reloads on Refresh", async () => {
    const user = userEvent.setup();
    const fetchMock = backend([THIS_BROWSER]);
    render(<DevicesSection />);

    await screen.findByText("Chrome on macOS");
    await user.click(screen.getByRole("button", { name: "Refresh" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
