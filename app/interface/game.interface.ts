/**
 * Types for the admin game-result API (penalty shootouts, pitch duels,
 * football chess, final over, grand prix dash, hoop duel and tennis rally).
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

/** Shared list filters. Each endpoint ignores the ones it doesn't support. */
export interface ListGameResultsParams {
  page?: number;
  limit?: number;
  submittedUserId?: string;
  /** Two-player games only. */
  opponentId?: string;
  /** Hoop duel only; any other value is ignored by the API. */
  difficulty?: string;
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

/* ---------- Final over ---------- */

export interface FinalOverListItem {
  _id: string;
  submittedUserId: string;
  /** `""` when the player was deleted — results outlive their players. */
  username: string;
  /** Target the player had to reach in the over. */
  chasing: number;
  scored: number;
  wicketLost: number;
  sixes: number;
  fours: number;
  /** Derived: `theChase.length`. Can exceed 6, since extras add balls. */
  ballsPlayed: number;
  /** Derived: `scored >= chasing`, so meeting the target exactly is a win. */
  isWin: boolean;
  /** Client-authored result copy, shown back to the player. */
  message: string;
  description: string;
  /** Signed XP change applied to the player's `finalOver` bucket. */
  xpDelta: number;
  playedAt: string;
}

export interface FinalOverDetail extends FinalOverListItem {
  /** Ball-by-ball outcomes, in order; omitted from list rows. */
  theChase: string[];
  createdAt: string;
  updatedAt: string;
}

/* ---------- Grand prix dash ---------- */

export interface GrandPrixDashListItem {
  _id: string;
  submittedUserId: string;
  /** `""` when the player was deleted. */
  username: string;
  totalLap: number;
  /** Grid size; positions run from 1 up to this. */
  totalCars: number;
  startingPosition: number;
  finishingPosition: number;
  /** `startingPosition - finishingPosition`; negative when places were lost. */
  positionsGained: number;
  /** True only for a 1st-place finish. */
  isWin: boolean;
  /** Free text from the app — display as-is, never sort or compute on it. */
  raceTime: string;
  /** Free text from the app. */
  finalStatus: string;
  xpDelta: number;
  playedAt: string;
}

export interface GrandPrixDashDetail extends GrandPrixDashListItem {
  /** How the race start went; free text from the app. */
  launch: string;
  /** The player's standout move; free text from the app. */
  mvpMove: string;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Hoop duel ---------- */

export const HOOP_DUEL_DIFFICULTIES = ["rookie", "pro", "all-star"] as const;

export type HoopDuelDifficulty = (typeof HOOP_DUEL_DIFFICULTIES)[number];

export interface HoopDuelListItem {
  _id: string;
  submittedUserId: string;
  /** `""` when the player was deleted. */
  username: string;
  difficulty: string;
  finalYourScore: number;
  finalOpponentScore: number;
  /** True only when the player outscores the opponent; a tie is false. */
  isWin: boolean;
  status: string;
  xpDelta: number;
  playedAt: string;
}

export interface HoopDuelDetail extends HoopDuelListItem {
  /** Never above `finalYourScore`. */
  halfTimeYourScore: number;
  /** Never above `finalOpponentScore`. */
  halfTimeOpponentScore: number;
  /** Decimal, stored as a double. */
  fy: number;
  perfect: number;
  threePointMove: number;
  dunks: number;
  blocks: number;
  steals: number;
  /** Rebounds. */
  boards: number;
  /** Longest scoring run. */
  bestRun: number;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Tennis rally ---------- */

export interface TennisRallyListItem {
  _id: string;
  submittedUserId: string;
  /** `""` when the player was deleted. */
  username: string;
  /** Free text from the app, not a fixed list. */
  status: string;
  finalYourScore: number;
  finalOpponentScore: number;
  /** True only when the player outscores the opponent; a tie is false. */
  isWin: boolean;
  /** Free text from the app, not a fixed list. */
  grade: string;
  xpDelta: number;
  playedAt: string;
}

export interface TennisRallyDetail extends TennisRallyListItem {
  firstServe: number;
  playingWinners: number;
  playingErrors: number;
  /** Shots in the longest rally. */
  longestRally: number;
  perfectContacts: number;
  createdAt: string;
  updatedAt: string;
}
