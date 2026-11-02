/** Public sport XP leaderboard: `GET /leaderboard/public/sport/:gameType`. */

export const SPORT_LEADERBOARD_GAME_TYPES = ["cricket", "football", "basketball", "racing"] as const;

export type SportLeaderboardGameType = (typeof SPORT_LEADERBOARD_GAME_TYPES)[number];

export function isSportLeaderboardGameType(value: string): value is SportLeaderboardGameType {
  return (SPORT_LEADERBOARD_GAME_TYPES as readonly string[]).includes(value);
}

export interface SportLeaderboardRow {
  _id: string;
  userName: string;
  /** Empty or missing when the user has none. */
  avatarUrl?: string;
  bannerUrl?: string;
  /** What the board ranks by: XP across every tournament of this sport. */
  sportXP: number;
  totalXP: number;
  coins: number;
  /** Ties share a rank (1, 1, 3…), so show this, not the row's position. */
  rank: number;
}

export interface SportLeaderboard {
  gameType: string;
  /** Rows returned, at most 25. */
  totalUsers: number;
  /** Everyone with XP in this sport, including those outside the top 25. */
  totalPlayers: number;
  leaderboard: SportLeaderboardRow[];
}
