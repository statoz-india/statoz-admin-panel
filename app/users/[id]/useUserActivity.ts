"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Loads one `/api/users/:id/<endpoint>` activity section with its own
 * loading and error state, so each tab loads independently.
 */
export function useUserActivity<T>(
  userId: string,
  endpoint: string,
  fallbackError: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/users/${userId}/${endpoint}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();

      if (!res.ok || !response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            (typeof response?.error === "string" && response.error) ||
            fallbackError,
        );
        return;
      }

      setData(response.data as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : fallbackError);
    } finally {
      setLoading(false);
    }
  }, [userId, endpoint, fallbackError]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, load };
}

/** `endpoint?query`, leaving out empty values: the endpoint `useUserActivity` takes. */
export function withQuery(
  endpoint: string,
  params: Record<string, string | number | null | undefined>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  return qs ? `${endpoint}?${qs}` : endpoint;
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
