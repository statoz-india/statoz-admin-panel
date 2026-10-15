"use client";

import type {
  AppNavigationOverview,
  DeleteVersionBody,
  NavigationConfig,
  UpdateDefaultBody,
  UpsertVersionBody,
  VersionNavigationConfig,
} from "@/app/interface/app-navigation.interface";
import {
  SUGGESTED_MATCHES_TABS,
  SUGGESTED_SHOP_TABS,
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

/**
 * Rows written before `shopTabs` / `matchesTabs` existed may come back without
 * them. The backend falls back to stock defaults for those, so mirror that here
 * rather than rendering an empty list the admin could accidentally save.
 */
function withNavDefaults<T extends NavigationConfig>(config: T): T {
  let next: T = config;
  if (!Array.isArray(config.shopTabs) || config.shopTabs.length === 0) {
    next = { ...next, shopTabs: [...SUGGESTED_SHOP_TABS] };
  }
  if (!Array.isArray(config.matchesTabs) || config.matchesTabs.length === 0) {
    next = { ...next, matchesTabs: [...SUGGESTED_MATCHES_TABS] };
  }
  return next;
}

export const appNavigationApi = {
  getOverview: async (): Promise<AppNavigationOverview> => {
    const data = await request<AppNavigationOverview>("/all");
    return {
      default: withNavDefaults(data.default),
      versions: (data.versions ?? []).map(withNavDefaults),
    };
  },

  updateDefault: async (payload: UpdateDefaultBody) =>
    withNavDefaults(
      await request<NavigationConfig>("/default", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    ),

  upsertVersion: async (payload: UpsertVersionBody) =>
    withNavDefaults(
      await request<VersionNavigationConfig>("/version", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    ),

  deleteVersion: (payload: DeleteVersionBody) =>
    request<unknown>("/version", {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),
};
