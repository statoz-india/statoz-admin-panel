"use client";

import type {
  AppNavigationOverview,
  DeleteVersionBody,
  NavigationConfig,
  UpdateDefaultBody,
  UpsertVersionBody,
  VersionNavigationConfig,
} from "@/app/interface/app-navigation.interface";

/** Call an app-navigation proxy route, unwrap `data`, and throw on failure. */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/app-navigation${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}

export const appNavigationApi = {
  getOverview: () => request<AppNavigationOverview>("/all"),

  updateDefault: (payload: UpdateDefaultBody) =>
    request<NavigationConfig>("/default", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  upsertVersion: (payload: UpsertVersionBody) =>
    request<VersionNavigationConfig>("/version", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteVersion: (payload: DeleteVersionBody) =>
    request<unknown>("/version", {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),
};
