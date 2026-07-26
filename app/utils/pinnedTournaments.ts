"use client";

import { useSyncExternalStore } from "react";

const PINNED_TOURNAMENTS_KEY = "admin_pinned_tournaments";

/** Shown in every tournament row until the admin pins something else. */
export const DEFAULT_PINNED_TOURNAMENTS: readonly string[] = Object.freeze([
  "IPL",
  "FIFA",
]);

let cache: readonly string[] | null = null;
const listeners = new Set<() => void>();

function readPinned(): readonly string[] {
  if (typeof window === "undefined") return DEFAULT_PINNED_TOURNAMENTS;
  if (cache) return cache;

  try {
    const raw = window.localStorage.getItem(PINNED_TOURNAMENTS_KEY);
    if (raw === null) {
      cache = DEFAULT_PINNED_TOURNAMENTS;
    } else {
      const parsed: unknown = JSON.parse(raw);
      cache = Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === "string")
        : DEFAULT_PINNED_TOURNAMENTS;
    }
  } catch {
    cache = DEFAULT_PINNED_TOURNAMENTS;
  }

  return cache;
}

function writePinned(next: readonly string[]) {
  cache = next;
  try {
    window.localStorage.setItem(PINNED_TOURNAMENTS_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode / quota) — keep the in-memory value.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep other tabs in sync with pins made here.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== PINNED_TOURNAMENTS_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function togglePinnedTournament(tournament: string) {
  const current = readPinned();
  writePinned(
    current.includes(tournament)
      ? current.filter((value) => value !== tournament)
      : [...current, tournament],
  );
}

/** Pinned tournament types, persisted in localStorage and shared across sections. */
export function usePinnedTournaments(): readonly string[] {
  return useSyncExternalStore(
    subscribe,
    readPinned,
    () => DEFAULT_PINNED_TOURNAMENTS,
  );
}
