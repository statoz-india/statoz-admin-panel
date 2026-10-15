import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cookieJar } from "./helpers/cookies";

// Route handlers read the session from `next/headers`; give them a jar tests control.
vi.mock("next/headers", async () => {
  const { cookies } = await import("./helpers/cookies");
  return { cookies, headers: async () => new Headers() };
});

beforeEach(() => {
  cookieJar.clear();
  // Handlers log every backend failure; the tests assert on responses instead.
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  // No test may reach the network: an un-mocked fetch fails loudly.
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      throw new Error(`Unexpected network call in test: ${String(input)}`);
    }),
  );
});

class MemoryStorage implements Storage {
  private items = new Map<string, string>();
  get length() {
    return this.items.size;
  }
  clear() {
    this.items.clear();
  }
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  key(index: number) {
    return [...this.items.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.items.delete(key);
  }
  setItem(key: string, value: string) {
    this.items.set(key, String(value));
  }
}

if (typeof window !== "undefined") {
  // Node 25+ ships its own `localStorage` global, which is undefined without
  // `--localstorage-file` and hides jsdom's. Put an in-memory one back.
  for (const name of ["localStorage", "sessionStorage"] as const) {
    if (window[name]) continue;
    const storage = new MemoryStorage();
    Object.defineProperty(window, name, { value: storage, configurable: true });
    Object.defineProperty(globalThis, name, { value: storage, configurable: true });
  }

  // jsdom has no layout, so it leaves the scrolling APIs out.
  window.scrollTo = () => {};
  Element.prototype.scrollTo ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};

  const { cleanup } = await import("@testing-library/react");
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });
}
