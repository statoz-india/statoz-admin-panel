/** Game types that support `POST /match/matchStats`. */
export const MATCH_STATS_GAME_TYPES = [
  "football",
  "cricket",
  "basketball",
] as const;

export type MatchStatsGameType = (typeof MATCH_STATS_GAME_TYPES)[number];

export function isMatchStatsGameType(
  value: unknown,
): value is MatchStatsGameType {
  return (
    typeof value === "string" &&
    (MATCH_STATS_GAME_TYPES as readonly string[]).includes(
      value.trim().toLowerCase(),
    )
  );
}

export interface FetchMatchStatsPayload {
  matchUniqueId: string;
  matchId: string;
  espnId: string;
}

/** Document returned by `POST /match/matchStats`. */
export interface MatchStatsDocument {
  _id: string;
  matchUniqueId: string;
  matchId: string;
  espnId: string;
  gameType: MatchStatsGameType | string;
  matchSummary: Record<string, unknown>;
  fetchedAt: string;
  createdAt?: string;
  updatedAt?: string;
}
