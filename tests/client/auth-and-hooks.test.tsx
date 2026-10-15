// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { redirectToLogin } from "@/app/api/utils/clearAuthStore";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";
import { useGameType } from "@/app/hooks/useGameType";
import { useAuthStore, type User } from "@/app/store/authStore";
import { stopWheelFromChangingFocusedNumberInput } from "@/app/utils/numberInput";
import {
  DEFAULT_PINNED_TOURNAMENTS,
  togglePinnedTournament,
  usePinnedTournaments,
} from "@/app/utils/pinnedTournaments";
import { jsonResponse, mockFetch } from "../helpers/http";

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

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, token: null, user: null, hasHydrated: false });
  });

  it("logs in and out", () => {
    useAuthStore.getState().login("tok", ADMIN);
    expect(useAuthStore.getState()).toMatchObject({ isAuthenticated: true, token: "tok", user: ADMIN });

    useAuthStore.getState().logout();
    expect(useAuthStore.getState()).toMatchObject({ isAuthenticated: false, token: null, user: null });
  });

  it("persists the session but not the hydration flag", () => {
    useAuthStore.getState().login("tok", ADMIN);
    useAuthStore.getState().setHasHydrated(true);

    const stored = JSON.parse(window.localStorage.getItem("auth-storage")!);
    expect(stored.state).toEqual({ isAuthenticated: true, token: "tok", user: ADMIN });
  });

  it("restores a stored session", async () => {
    window.localStorage.setItem(
      "auth-storage",
      JSON.stringify({ state: { isAuthenticated: true, token: "saved", user: ADMIN }, version: 0 }),
    );
    await useAuthStore.persist.rehydrate();
    expect(useAuthStore.getState()).toMatchObject({ isAuthenticated: true, token: "saved", hasHydrated: true });
  });

  it("redirectToLogin logs out and goes to /login", () => {
    useAuthStore.getState().login("tok", ADMIN);
    const router = { push: vi.fn() };

    redirectToLogin(router);

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(router.push).toHaveBeenCalledWith("/login");
  });
});

describe("useAuthHydrated", () => {
  it("reports hydration once the store has rehydrated", async () => {
    useAuthStore.setState({ hasHydrated: false });
    const { result } = renderHook(() => useAuthHydrated());
    await waitFor(() => expect(result.current).toBe(true));
  });
});

describe("useGameType", () => {
  it("uses the record's own game type without a request", () => {
    const fetchMock = mockFetch([jsonResponse({})]);
    const { result } = renderHook(() => useGameType({ gameType: "football", tournament: "EPL" }));
    expect(result.current).toBe("football");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("looks the game type up from the tournament, ignoring case", async () => {
    mockFetch([
      jsonResponse({
        success: true,
        data: [
          { tournament: "EPL", gameType: "football" },
          { tournament: "IPL", gameType: "cricket" },
        ],
      }),
    ]);
    const { result } = renderHook(() => useGameType({ tournament: "ipl" }));
    await waitFor(() => expect(result.current).toBe("cricket"));
  });

  it("is null for an unknown tournament, a failed lookup, or no record", async () => {
    mockFetch([jsonResponse({ success: true, data: [] })]);
    const unknown = renderHook(() => useGameType({ tournament: "XYZ" }));
    await waitFor(() => expect(unknown.result.current).toBeNull());

    mockFetch(() => {
      throw new TypeError("offline");
    });
    const failed = renderHook(() => useGameType({ tournament: "IPL" }));
    await waitFor(() => expect(failed.result.current).toBeNull());

    expect(renderHook(() => useGameType(null)).result.current).toBeNull();
  });
});

describe("pinned tournaments", () => {
  /** Mount the hook with the module's cache re-read from (empty) storage. */
  function renderPinned() {
    const hook = renderHook(() => usePinnedTournaments());
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
    });
    return hook;
  }

  it("starts with the defaults and toggles pins in storage", () => {
    const { result } = renderPinned();
    expect(result.current).toEqual(DEFAULT_PINNED_TOURNAMENTS);

    act(() => togglePinnedTournament("EPL"));
    expect(result.current).toEqual([...DEFAULT_PINNED_TOURNAMENTS, "EPL"]);
    expect(JSON.parse(window.localStorage.getItem("admin_pinned_tournaments")!)).toEqual(result.current);

    act(() => togglePinnedTournament("EPL"));
    expect(result.current).toEqual(DEFAULT_PINNED_TOURNAMENTS);
  });

  it("follows pins made in another tab", () => {
    const { result } = renderPinned();
    act(() => {
      window.localStorage.setItem("admin_pinned_tournaments", JSON.stringify(["ISL", 7, "PKL"]));
      window.dispatchEvent(new StorageEvent("storage", { key: "admin_pinned_tournaments" }));
    });
    expect(result.current).toEqual(["ISL", "PKL"]);
  });

  it("ignores storage events for other keys", () => {
    const { result } = renderPinned();
    act(() => {
      window.localStorage.setItem("admin_pinned_tournaments", JSON.stringify(["ISL"]));
      window.dispatchEvent(new StorageEvent("storage", { key: "auth-storage" }));
    });
    expect(result.current).toEqual(DEFAULT_PINNED_TOURNAMENTS);
  });

  it("falls back to the defaults for corrupt storage", () => {
    window.localStorage.setItem("admin_pinned_tournaments", "{not json");
    const { result } = renderPinned();
    expect(result.current).toEqual(DEFAULT_PINNED_TOURNAMENTS);
  });
});

describe("stopWheelFromChangingFocusedNumberInput", () => {
  function wheelOn(input: HTMLInputElement) {
    const event = { currentTarget: input, preventDefault: vi.fn() };
    stopWheelFromChangingFocusedNumberInput(event as never);
    return event;
  }

  it("blurs a focused number input so the wheel can't change it", () => {
    const input = document.body.appendChild(Object.assign(document.createElement("input"), { type: "number" }));
    input.focus();

    const event = wheelOn(input);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.activeElement).not.toBe(input);
    input.remove();
  });

  it("leaves an unfocused input alone", () => {
    const input = document.body.appendChild(document.createElement("input"));
    expect(wheelOn(input).preventDefault).not.toHaveBeenCalled();
    input.remove();
  });
});
