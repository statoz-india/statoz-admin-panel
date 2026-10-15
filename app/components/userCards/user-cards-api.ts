"use client";

import type { Paginated } from "@/app/interface/pagination.interface";
import type { AdminUserCards } from "@/app/interface/userCards.interface";

/** Call a user-cards proxy route, unwrap `data`, and throw on failure. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/user-cards${path}`, {
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

export const userCardsApi = {
  all: (page: number) =>
    request<Paginated<AdminUserCards>>(`/all?page=${page}`),
};
