import type { Tournament } from "./tournament.model";

/**
 * Trending tournaments and trending teams shown in the app
 * (`/trending/tournaments`, `/trending/teams`). Not the same as the signup
 * list at `/tournament/trending` (see `trending-tournaments.model.ts`).
 */

/** Sports allowed in these lists; any other `gameType` is rejected on save. */
export const TRENDING_SPORTS = [
  "football",
  "cricket",
  "basketball",
  "racing",
] as const;

export type TrendingSport = (typeof TRENDING_SPORTS)[number];

export function isTrendingSport(value: unknown): value is TrendingSport {
  return (
    typeof value === "string" &&
    (TRENDING_SPORTS as readonly string[]).includes(value)
  );
}

export interface TrendingTeamInfo {
  _id: string;
  name: string;
  displayName: string;
  abbreviation: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  /** Tournament short code. */
  tournament: string;
  tournamentId?: string;
  season?: string[];
}

/** A row of `GET /trending/tournaments`, sorted by `order`. */
export interface CuratedTrendingTournament {
  _id: string;
  /** null if the tournament was deleted after being added. */
  tournament: Tournament | null;
  sportsType: TrendingSport;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** A row of `GET /trending/teams`, sorted by `order`. */
export interface CuratedTrendingTeam {
  _id: string;
  /** null if the team was deleted after being added. */
  team: TrendingTeamInfo | null;
  tournament: Tournament | null;
  sportsType: TrendingSport;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** A saved row as the PUTs return it, with ids instead of documents. */
export interface CuratedTrendingRecord {
  _id: string;
  order: number;
  sportsType: TrendingSport;
  tournament?: string;
  team?: string;
  createdAt: string;
  updatedAt: string;
}
