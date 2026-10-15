// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/app/store/authStore";
import { fetchCall, jsonResponse, mockFetch } from "../helpers/http";

const router = { replace: vi.fn(), push: vi.fn(), back: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), forward: vi.fn() };
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => searchParams,
  usePathname: () => "/",
}));

// The shop's tabs load their own data; only the switching is under test here.
vi.mock("@/app/components/playerCards/PlayerCardsSection", () => ({
  PlayerCardsTab: () => <div>Player cards tab</div>,
  ActionCardsTab: () => <div>Action cards tab</div>,
}));
vi.mock("@/app/components/userAssets/AssetCatalogTab", () => ({
  default: ({ title }: { title: string }) => <div>{title} tab</div>,
}));

const { default: LoginPage } = await import("@/app/login/page");
const { default: ShopSection } = await import("@/app/components/shop/ShopSection");

beforeEach(() => {
  searchParams = new URLSearchParams();
  useAuthStore.setState({ isAuthenticated: false, token: null, user: null, hasHydrated: true });
});

describe("login page", () => {
  const USER = { _id: "u1", userName: "admin", email: "admin@statoz.test", userType: "superadmin" };

  it("signs in with an emailed OTP", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch((url) =>
      url === "/api/send-otp"
        ? jsonResponse({ success: true, message: "OTP sent" })
        : jsonResponse({ success: true, data: { user: USER, accessToken: "acc", refreshToken: "ref" } }),
    );
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email address"), "admin@statoz.test");
    await user.click(screen.getByRole("button", { name: "Send OTP" }));

    const otp = await screen.findByLabelText("OTP (6 digits)");
    const login = screen.getByRole("button", { name: "Login" });
    expect(login).toBeDisabled();
    // Non-digits are dropped.
    await user.type(otp, "12a34b56");
    expect(otp).toHaveValue("123456");
    await user.click(login);

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/?section=dashboard"));
    expect(fetchCall(fetchMock, 0).body).toEqual({ email: "admin@statoz.test" });
    expect(fetchCall(fetchMock, 1).body).toEqual({ email: "admin@statoz.test", otp: "123456" });
    expect(useAuthStore.getState()).toMatchObject({ isAuthenticated: true, token: "acc", user: USER });
  });

  it("shows why the OTP couldn't be sent", async () => {
    const user = userEvent.setup();
    mockFetch([jsonResponse({ success: false, message: "Not a superadmin" }, 403)]);
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email address"), "someone@statoz.test");
    await user.click(screen.getByRole("button", { name: "Send OTP" }));

    expect(await screen.findByText("Not a superadmin")).toBeInTheDocument();
    expect(screen.queryByLabelText("OTP (6 digits)")).toBeNull();
  });

  it("shows a rejected OTP and stays logged out", async () => {
    const user = userEvent.setup();
    mockFetch((url) =>
      url === "/api/send-otp" ? jsonResponse({ success: true }) : jsonResponse({ success: false, message: "Invalid OTP" }, 401),
    );
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email address"), "admin@statoz.test");
    await user.click(screen.getByRole("button", { name: "Send OTP" }));
    await user.type(await screen.findByLabelText("OTP (6 digits)"), "000000");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid OTP")).toBeInTheDocument();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("sends a signed-in admin straight to the dashboard", async () => {
    useAuthStore.setState({ isAuthenticated: true, hasHydrated: true });
    render(<LoginPage />);
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/?section=dashboard"));
    expect(screen.queryByRole("button", { name: "Send OTP" })).toBeNull();
  });
});

describe("ShopSection", () => {
  it("opens on player cards by default", () => {
    render(<ShopSection />);
    expect(screen.getByText("Player cards tab")).toBeInTheDocument();
  });

  it.each([
    ["action", "Action cards tab"],
    ["profilePics", "Profile pics tab"],
    ["banners", "Profile banners tab"],
    ["bogus", "Player cards tab"],
  ])("opens the tab named in the URL (%s)", (shopTab, shown) => {
    searchParams = new URLSearchParams({ shopTab });
    render(<ShopSection />);
    expect(screen.getByText(shown)).toBeInTheDocument();
  });

  it("puts the chosen tab in the URL, dropping other sections' params", async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams({ section: "shop", id: "x", leaderboardTab: "coins" });
    render(<ShopSection />);

    await user.click(screen.getByRole("button", { name: "Banners" }));

    expect(router.replace).toHaveBeenCalledWith("/?section=shop&shopTab=banners", { scroll: false });
  });
});
