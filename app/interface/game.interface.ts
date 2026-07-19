/**
 * Types for the admin game-result API (penalty shootouts, pitch duels and
 * football chess).
 */

/** Paginated list envelope (the `data` payload of the list endpoints). */
export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/** Shared list filters for both result types. */
export interface ListGameResultsParams {
  page?: number;
  limit?: number;
  submittedUserId?: string;
  opponentId?: string;
}

export type CardDetails = Record<string, unknown> | null;

/* ---------- Penalty shootout ---------- */

export interface PenaltyShootoutListItem {
  _id: string;
  submittedUserId: string;
  username: string;
  opponentUsername: string;
  finalScore: string; // e.g. "3 - 2"
  finalMessage: string;
  finalScoreMessage: string;
  obtainedXp: number;
  isWin: boolean;
  userGoals: number;
  opponentGoals: number;
  totalRounds: number;
  playedAt: string;
}

export interface PenaltyKickDetail {
  userId: string;
  username: string;
  isOpponent: boolean;
  shoot: "left" | "center" | "right";
  dive: "left" | "center" | "right";
  isGoal: boolean;
  taker_id: string;
  taker_card_details: CardDetails;
  keeper_id: string;
  keeper_card_details: CardDetails;
}

export interface PenaltyShootoutDetail extends PenaltyShootoutListItem {
  kickLog: PenaltyKickDetail[];
  createdAt: string;
  updatedAt: string;
}

/* ---------- Pitch duel ---------- */

export interface PitchDuelListItem {
  _id: string;
  submittedUserId: string;
  username: string;
  opponentId?: string;
  opponentUsername: string;
  toss: "heads" | "tails";
  tossUserSelection: "attack" | "defend";
  hasUserWonToss: boolean;
  userScore: number;
  opponentScore: number;
  status: string;
  xpDelta: number;
  mvp: string; // player card id
  isWin: boolean;
  totalRounds: number;
  playedAt: string;
}

export interface PitchDuelDetail extends PitchDuelListItem {
  finalScore: {
    user: number;
    opponent: number;
    status: string;
    xpDelta: number;
    mvp: string;
    mvp_card_details: CardDetails;
  };
  duelLog: unknown[];
  createdAt: string;
  updatedAt: string;
}

/* ---------- Football chess ---------- */

export interface FootballChessListItem {
  _id: string;
  submittedUserId: string;
  username: string;
  opponentId?: string;
  opponentUsername: string;
  gameMode: string;
  toss: "heads" | "tails";
  tossUserSelection: string;
  hasUserWonToss: boolean;
  formation: { user: string; opponent: string };
  userScore: number;
  opponentScore: number;
  status: string;
  xpDelta: number;
  mvp: string; // player card id
  isWin: boolean;
  totalTurns: number;
  durationSeconds: number;
  abandoned: boolean;
  playedAt: string;
}

export interface FootballChessDetail extends FootballChessListItem {
  lineup: {
    user: unknown[];
    opponent: unknown[];
  };
  finalScore: {
    user: number;
    opponent: number;
    status: string;
    xpDelta: number;
    mvp: string;
    mvp_card_details: CardDetails;
  };
  matchLog: unknown[];
  goals: unknown[];
  createdAt: string;
  updatedAt: string;
}
