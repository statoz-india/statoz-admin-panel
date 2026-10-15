// @vitest-environment jsdom
/// <reference types="vite/client" />

/**
 * Every admin section and every page must mount and stay mounted while the
 * backend is slow or down — no render crash that blanks the panel. New
 * sections and pages are picked up automatically.
 */

import { act, render, type RenderResult } from "@testing-library/react";
import type { ComponentType } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/app/store/authStore";
import { VALID_SECTIONS } from "@/app/utils/enums/section.enum";

const ID = "64b7f0c2a1b2c3d4e5f60718";
const router = { replace: vi.fn(), push: vi.fn(), back: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), forward: vi.fn() };
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => searchParams,
  usePathname: () => "/",
  useParams: () => ({ id: ID, quizId: ID, setId: ID, matchId: ID, category: "easy" }),
}));

// The live-stats socket must never dial out from a test.
vi.mock("socket.io-client", () => {
  const socket = { on: vi.fn(), off: vi.fn(), emit: vi.fn(), connect: vi.fn(), disconnect: vi.fn(), connected: false };
  return { io: () => socket, default: () => socket };
});

const pages = import.meta.glob<{ default: ComponentType }>("/app/**/page.tsx", { eager: true });
const Home = pages["/app/page.tsx"].default;
const otherPages = Object.entries(pages)
  .filter(([file]) => file !== "/app/page.tsx")
  .map(([file, mod]) => ({ route: file.replace(/^\/app/, "").replace(/\/page\.tsx$/, "") || "/", Page: mod.default }));

const BACKENDS = {
  slow: () => new Promise<Response>(() => {}),
  down: () => Promise.reject(new TypeError("fetch failed")),
} as const;

beforeEach(() => {
  searchParams = new URLSearchParams();
  useAuthStore.setState({
    isAuthenticated: true,
    token: "tok",
    hasHydrated: true,
    user: { _id: "u1", userName: "admin", email: "a@b.c", userType: "superadmin", createdAt: "", updatedAt: "", __v: 0, coins: 0, xp: 0 },
  });
});

/** Mount, let effects and failed requests settle, and check nothing blanked the page. */
async function mountAndSettle(ui: React.ReactElement, backend: keyof typeof BACKENDS): Promise<RenderResult> {
  vi.stubGlobal("fetch", vi.fn(BACKENDS[backend]));
  let result!: RenderResult;
  await act(async () => {
    result = render(ui);
  });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 20));
  });
  // React unmounts the whole tree on an uncaught render error.
  expect(result.container.childElementCount).toBeGreaterThan(0);
  return result;
}

it("discovers the sections and pages", () => {
  expect(VALID_SECTIONS.length).toBeGreaterThan(20);
  expect(otherPages.length).toBeGreaterThan(15);
});

describe.each(VALID_SECTIONS)("section %s", (section) => {
  it.each(Object.keys(BACKENDS) as (keyof typeof BACKENDS)[])("mounts with the backend %s", async (backend) => {
    searchParams = new URLSearchParams({ section });
    const { getByText } = await mountAndSettle(<Home />, backend);
    expect(getByText("Admin Panel")).toBeInTheDocument();
  });
});

describe.each(otherPages)("page $route", ({ Page }) => {
  it.each(Object.keys(BACKENDS) as (keyof typeof BACKENDS)[])("mounts with the backend %s", async (backend) => {
    await mountAndSettle(<Page />, backend);
  });
});
