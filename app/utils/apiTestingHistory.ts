"use client";

import { useSyncExternalStore } from "react";
import type { ParsedCurlHeader } from "./curl-parser";

const API_TESTING_HISTORY_KEY = "admin_api_testing_history";

/** Oldest entries fall off past this. */
export const API_TESTING_HISTORY_LIMIT = 50;

/**
 * Headers never written to storage. The proxy ignores them anyway (it attaches
 * the admin's own token), and they would otherwise leave tokens in localStorage.
 */
const UNSAVED_HEADERS = new Set([
  "authorization",
  "cookie",
  "proxy-authorization",
]);

/**
 * A request sent from API Testing — what's needed to send it again. Responses
 * are not stored: re-sending fetches a fresh one.
 */
export interface ApiTestingHistoryEntry {
  method: string;
  url: string;
  headers: ParsedCurlHeader[];
  body: string | null;
  /** Epoch ms of the last time it was sent. */
  lastSentAt: number;
}

const EMPTY: readonly ApiTestingHistoryEntry[] = Object.freeze([]);

let cache: readonly ApiTestingHistoryEntry[] | null = null;
const listeners = new Set<() => void>();

/** Two sends are the same saved request when method, URL and body match. */
export function historyKey(
  entry: Pick<ApiTestingHistoryEntry, "method" | "url" | "body">,
): string {
  return `${entry.method.toUpperCase()} ${entry.url.trim()}\n${entry.body ?? ""}`;
}

function isEntry(value: unknown): value is ApiTestingHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.method === "string" &&
    typeof entry.url === "string" &&
    Array.isArray(entry.headers) &&
    (entry.body === null || typeof entry.body === "string") &&
    typeof entry.lastSentAt === "number"
  );
}

function readHistory(): readonly ApiTestingHistoryEntry[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;

  try {
    const raw = window.localStorage.getItem(API_TESTING_HISTORY_KEY);
    const parsed: unknown = raw === null ? [] : JSON.parse(raw);
    cache = Array.isArray(parsed) ? parsed.filter(isEntry) : EMPTY;
  } catch {
    cache = EMPTY;
  }

  return cache;
}

function writeHistory(next: readonly ApiTestingHistoryEntry[]) {
  cache = next;
  try {
    window.localStorage.setItem(API_TESTING_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode / quota) — keep the in-memory value.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep other tabs in sync with requests sent there.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== API_TESTING_HISTORY_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Most recent first, deduplicated by {@link historyKey}, capped at
 * {@link API_TESTING_HISTORY_LIMIT}. Pure so it can be tested on its own.
 */
export function withRequest(
  history: readonly ApiTestingHistoryEntry[],
  request: Omit<ApiTestingHistoryEntry, "lastSentAt">,
  now: number,
): ApiTestingHistoryEntry[] {
  const entry: ApiTestingHistoryEntry = {
    method: request.method.toUpperCase(),
    url: request.url.trim(),
    headers: request.headers.filter(
      (header) => !UNSAVED_HEADERS.has(header.key.trim().toLowerCase()),
    ),
    body: request.body,
    lastSentAt: now,
  };
  const key = historyKey(entry);
  return [
    entry,
    ...history.filter((existing) => historyKey(existing) !== key),
  ].slice(0, API_TESTING_HISTORY_LIMIT);
}

export function saveApiTestingRequest(
  request: Omit<ApiTestingHistoryEntry, "lastSentAt">,
) {
  writeHistory(withRequest(readHistory(), request, Date.now()));
}

export function removeApiTestingRequest(key: string) {
  writeHistory(readHistory().filter((entry) => historyKey(entry) !== key));
}

export function clearApiTestingHistory() {
  writeHistory(EMPTY);
}

/** Requests sent from API Testing, persisted in this browser's localStorage. */
export function useApiTestingHistory(): readonly ApiTestingHistoryEntry[] {
  return useSyncExternalStore(subscribe, readHistory, () => EMPTY);
}

/** Single-quote for a POSIX shell, so the curl parser reads it back verbatim. */
function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** Rebuild a cURL command for the editor, so a saved request can be tweaked. */
export function toCurlCommand(
  entry: Pick<ApiTestingHistoryEntry, "method" | "url" | "headers" | "body">,
): string {
  const parts = [`curl -X ${entry.method} ${shellQuote(entry.url)}`];
  for (const header of entry.headers) {
    parts.push(`-H ${shellQuote(`${header.key}: ${header.value}`)}`);
  }
  if (entry.body !== null) parts.push(`-d ${shellQuote(entry.body)}`);
  return parts.join(" \\\n  ");
}
