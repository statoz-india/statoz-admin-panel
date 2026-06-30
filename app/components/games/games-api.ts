"use client";

import type {
  ListGameResultsParams,
  Paginated,
  PenaltyShootoutDetail,
  PenaltyShootoutListItem,
  PitchDuelDetail,
  PitchDuelListItem,
} from "@/app/interface/game.interface";

/** Call a games proxy route, unwrap `data`, and throw on failure. */
async function request<T>(path: string): Promise<T> {
  const res = await fetch(`/api/games${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
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

export const gamesApi = {
  /* ---------- Penalty shootouts ---------- */
  listPenaltyShootouts: (params: ListGameResultsParams = {}) =>
    request<Paginated<PenaltyShootoutListItem>>(
      `/penalty-shootouts${qs(params)}`,
    ),
  getPenaltyShootout: (id: string) =>
    request<PenaltyShootoutDetail>(`/penalty-shootouts/${id}`),

  /* ---------- Pitch duels ---------- */
  listPitchDuels: (params: ListGameResultsParams = {}) =>
    request<Paginated<PitchDuelListItem>>(`/pitch-duels${qs(params)}`),
  getPitchDuel: (id: string) =>
    request<PitchDuelDetail>(`/pitch-duels/${id}`),
};
