"use client";

import type {
  ActionCard,
  CreateActionCardInput,
  CreatePlayerCardInput,
  FilterPlayerCardsParams,
  ListActionCardsParams,
  ListPlayerCardsParams,
  Paginated,
  PlayerCard,
  UpdateActionCardInput,
  UpdatePlayerCardInput,
} from "@/app/interface/player-card.interface";

/** Call a player-cards proxy route, unwrap `data`, and throw on failure. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/player-cards${path}`, {
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

/** Build a `?a=b&c=d` query string, skipping empty values. */
function qs(params: object): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const cardsApi = {
  /* ---------- Player cards ---------- */
  listPlayerCards: (params: ListPlayerCardsParams = {}) =>
    request<Paginated<PlayerCard>>(qs(params)),
  filterPlayerCards: (params: FilterPlayerCardsParams) =>
    request<PlayerCard[]>(`/filter${qs(params)}`),
  createPlayerCard: (input: CreatePlayerCardInput) =>
    request<PlayerCard>("", { method: "POST", body: JSON.stringify(input) }),
  updatePlayerCard: (id: string, input: UpdatePlayerCardInput) =>
    request<PlayerCard>(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deletePlayerCard: (id: string) =>
    request<{ _id: string }>(`/${id}`, { method: "DELETE" }),

  /* ---------- Action cards ---------- */
  listActionCards: (params: ListActionCardsParams = {}) =>
    request<Paginated<ActionCard>>(`/action-cards${qs(params)}`),
  createActionCard: (input: CreateActionCardInput) =>
    request<ActionCard>("/action-cards", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateActionCard: (id: string, input: UpdateActionCardInput) =>
    request<ActionCard>(`/action-cards/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteActionCard: (id: string) =>
    request<{ _id: string }>(`/action-cards/${id}`, { method: "DELETE" }),
};
