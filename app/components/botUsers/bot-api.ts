"use client";

import type {
  BotUser,
  BotCardsResponse,
  BotDeck,
  CreateBotPayload,
  CreateDeckPayload,
  CurrentDeckResponse,
  StarterPackResponse,
} from "@/app/interface/bot-user.interface";

/** Call a bot-users proxy route, unwrap `data`, and throw on failure. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/bot-users${path}`, {
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

export const botApi = {
  list: () => request<BotUser[]>(""),
  create: (payload: CreateBotPayload) =>
    request<BotUser>("/create-bots", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  cards: (botUserId: string) =>
    request<BotCardsResponse>(`/${botUserId}/cards`),
  createDeck: (botUserId: string, payload: CreateDeckPayload) =>
    request<BotDeck>(`/${botUserId}/decks`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  setCurrentDeck: (botUserId: string, deckId: string) =>
    request<CurrentDeckResponse>(`/${botUserId}/current-deck`, {
      method: "PATCH",
      body: JSON.stringify({ deckId }),
    }),
  assignStarterPack: (botUserId: string) =>
    request<StarterPackResponse>(`/${botUserId}/starter-pack`),
};
