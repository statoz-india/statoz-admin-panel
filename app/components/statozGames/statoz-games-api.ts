"use client";

import type {
  FinalOverDetail,
  FinalOverListItem,
  FootballChessDetail,
  FootballChessListItem,
  GrandPrixDashDetail,
  GrandPrixDashListItem,
  HoopDuelDetail,
  HoopDuelListItem,
  ListGameResultsParams,
  Paginated,
  PenaltyShootoutDetail,
  PenaltyShootoutListItem,
  PitchDuelDetail,
  PitchDuelListItem,
  TennisRallyDetail,
  TennisRallyListItem,
} from "@/app/interface/game.interface";
import type {
  CreateGamePayload,
  Game,
  GameSection,
  UpdateGamePayload,
} from "@/app/interface/game-catalog.interface";
import type { GameType } from "@/app/constants/game-type";

/** A failed games request; `body` keeps extra fields such as `missingIds`. */
export class GamesApiError extends Error {
  body: Record<string, unknown>;

  constructor(message: string, body: Record<string, unknown> = {}) {
    super(message);
    this.name = "GamesApiError";
    this.body = body;
  }
}

/** Call a games proxy route, unwrap `data`, and throw on failure. */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/statoz-games${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new GamesApiError(
      body?.message ?? `Request failed (${res.status})`,
      body ?? {},
    );
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
  getPitchDuel: (id: string) => request<PitchDuelDetail>(`/pitch-duels/${id}`),

  /* ---------- Football chess ---------- */
  listFootballChess: (params: ListGameResultsParams = {}) =>
    request<Paginated<FootballChessListItem>>(`/football-chess${qs(params)}`),
  getFootballChess: (id: string) =>
    request<FootballChessDetail>(`/football-chess/${id}`),

  /* ---------- Final over ---------- */
  listFinalOver: (params: ListGameResultsParams = {}) =>
    request<Paginated<FinalOverListItem>>(`/final-over${qs(params)}`),
  getFinalOver: (id: string) => request<FinalOverDetail>(`/final-over/${id}`),

  /* ---------- Grand prix dash ---------- */
  listGrandPrixDash: (params: ListGameResultsParams = {}) =>
    request<Paginated<GrandPrixDashListItem>>(`/grand-prix-dash${qs(params)}`),
  getGrandPrixDash: (id: string) =>
    request<GrandPrixDashDetail>(`/grand-prix-dash/${id}`),

  /* ---------- Hoop duel ---------- */
  listHoopDuel: (params: ListGameResultsParams = {}) =>
    request<Paginated<HoopDuelListItem>>(`/hoop-duel${qs(params)}`),
  getHoopDuel: (id: string) => request<HoopDuelDetail>(`/hoop-duel/${id}`),

  /* ---------- Tennis rally ---------- */
  listTennisRally: (params: ListGameResultsParams = {}) =>
    request<Paginated<TennisRallyListItem>>(`/tennis-rally${qs(params)}`),
  getTennisRally: (id: string) =>
    request<TennisRallyDetail>(`/tennis-rally/${id}`),

  /* ---------- Games catalog ---------- */
  /** Every game, grouped into one section per sport, in display order. */
  listGames: () => request<GameSection[]>("/games"),
  createGame: (payload: CreateGamePayload) =>
    request<Game>("/games", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  /** Change only the fields in `patch`; returns the full updated game. */
  updateGame: (id: string, patch: UpdateGamePayload) =>
    request<Game>(`/games/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  /** Replace the order of every game in `gameType`; returns them re-ordered. */
  setGameOrder: (gameType: GameType, gameIds: string[]) =>
    request<Game[]>("/games/order", {
      method: "PUT",
      body: JSON.stringify({ gameType, gameIds }),
    }),
};
