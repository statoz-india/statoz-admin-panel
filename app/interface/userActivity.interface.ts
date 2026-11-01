import type {
  ProfileBanner,
  ProfilePic,
} from "@/app/interface/user-asset.interface";

/* ---------- Motorsport quizzes ---------- */

export interface MotorsportQuizQuestion {
  questionNumber: number;
  questionText: string | null;
  questionType: string | null;
  options?: string[];
  userAnswer: { option: string; value: string };
  /** null until answers are set. */
  correctAnswer: string | null;
  correctAnswerOption: string | null;
}

export interface MotorsportQuizSubmission {
  submissionId: string;
  quizId: string;
  submissionTime: string;
  /** Missing until the quiz is settled. */
  obtainedXP?: number;
  xpCredited: boolean;
  /** null if the quiz was deleted. */
  quiz: {
    quizId: string;
    quizStatus: string;
    tournament: string;
  } | null;
  match: {
    _id: string;
    matchId: string;
    name: string;
    tournament: string;
    gameType: string;
    seasonYear: string;
    matchStatus: "Upcoming" | "Ongoing" | "Finished" | "Cancelled";
    raceStartTime?: string;
  } | null;
  questions: MotorsportQuizQuestion[];
}

/* ---------- Mini-games ---------- */

type GameResultBase = {
  _id: string;
  submittedUserId: string;
  createdAt: string;
};

type HeadToHeadScore = {
  user?: number;
  opponent?: number;
  status?: string;
  xpDelta?: number;
};

export type PitchDuelResult = GameResultBase & {
  finalScore?: HeadToHeadScore;
  hasUserWonToss?: boolean;
  opponentId?: string;
};

export type PenaltyShootoutResult = GameResultBase & {
  finalScore?: string;
  finalMessage?: string;
  finalScoreMessage?: string;
  obtainedXp?: number;
  opponentId?: string;
};

export type FootballChessResult = GameResultBase & {
  finalScore?: HeadToHeadScore;
  gameMode?: string;
  totalTurns?: number;
  durationSeconds?: number;
  abandoned?: boolean;
};

export type FinalOverResult = GameResultBase & {
  scored?: number;
  chasing?: number;
  wicketLost?: number;
  message?: string;
  xpDelta?: number;
  chaseTier?: string;
  sixes?: number;
  fours?: number;
};

export type GrandPrixDashResult = GameResultBase & {
  startingPosition?: number;
  finishingPosition?: number;
  finalStatus?: string;
  xpDelta?: number;
  raceTime?: number | string;
  totalCars?: number;
  totalLap?: number;
};

export type HoopDuelResult = GameResultBase & {
  finalYourScore?: number;
  finalOpponentScore?: number;
  status?: string;
  xpDelta?: number;
  difficulty?: string;
  dunks?: number;
  blocks?: number;
  steals?: number;
  bestRun?: number;
};

export type TennisRallyResult = GameResultBase & {
  finalYourScore?: number;
  finalOpponentScore?: number;
  status?: string;
  xpDelta?: number;
  grade?: string;
  longestRally?: number;
  playingWinners?: number;
  playingErrors?: number;
};

export type GameBlock<R> = { matchesPlayed: number; results: R[] };

export interface UserGames {
  pitchDuel: GameBlock<PitchDuelResult>;
  penaltyShootout: GameBlock<PenaltyShootoutResult>;
  footballChess: GameBlock<FootballChessResult>;
  finalOver: GameBlock<FinalOverResult>;
  grandPrixDash: GameBlock<GrandPrixDashResult>;
  hoopDuel: GameBlock<HoopDuelResult>;
  tennisRally: GameBlock<TennisRallyResult>;
}

/* ---------- Assets ---------- */

export type AssetSource =
  | "admin"
  | "pack"
  | "reward"
  | "daily-drop"
  | "starter-pack"
  | "bought";

export interface OwnedPlayerCard {
  _id: string;
  playerId: string;
  name: string;
  shortName: string;
  image: string;
  team: string;
  teamAbbreviation: string;
  position: string;
  playerType: string;
  cardType: string;
  finalRating: number;
  coinValue: number;
}

export interface OwnedActionCard {
  _id: string;
  baseId: string;
  title: string;
  category: string;
  basePower: number;
  risky: boolean;
  icon: string;
}

export interface UserAssets {
  userId: string;
  profilePicsPurchased: Array<{
    /** null if the pic was deleted. */
    profilePicId: ProfilePic | null;
    purchasedAt: string;
    coinsUsed: number;
  }>;
  profileBannersPurchased: Array<{
    profileBannerId: ProfileBanner | null;
    purchasedAt: string;
    coinsUsed: number;
  }>;
  playerCards: Array<{
    playerCardId: OwnedPlayerCard | null;
    acquiredAt: string;
    source: AssetSource;
  }>;
  actionCards: Array<{
    actionCardId: OwnedActionCard | null;
    acquiredAt: string;
    source: AssetSource;
  }>;
}

/* ---------- Purchases ---------- */

export interface UserPayment {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  productId: string;
  status: string;
  transactionDate: string;
  platform?: string;
  orderId?: string;
  coinsCredited: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayments {
  hasPurchased: boolean;
  totalPayments: number;
  /** Mixed currencies are summed as-is; prefer per-currency totals. */
  totalAmount: number;
  payments: UserPayment[];
}

/* ---------- Coin and XP history (`/tracker/admin/:userId/…`) ---------- */

/** The backend caps `limit` at this. */
export const TRACKER_MAX_PAGE_SIZE = 50;

export const LEDGER_TYPES = ["CREDITED", "DEBITED"] as const;
export type LedgerType = (typeof LEDGER_TYPES)[number];

export const COIN_LEDGER_SOURCES = [
  "PICK",
  "EVENT",
  "FUTURE",
  "PROFILE_PIC_PURCHASE",
  "BANNER_PURCHASE",
  "CARD_PURCHASE",
  "COIN_PURCHASE",
  "IAP_REFUND",
  "ADMIN_GIFT",
  "SIGNUP_BONUS",
  "QUIZ_ENTRY",
  "QUIZ_REWARD",
  "REFUND",
  "ADMIN_ADJUSTMENT",
  "OPENING_BALANCE",
] as const;

export const XP_SOURCES = [
  "TOURNAMENT",
  "GAME",
  "ADMIN_ADJUSTMENT",
  "OPENING_BALANCE",
] as const;

export interface CoinLedgerEntry {
  _id: string;
  ledgerType: LedgerType;
  ledgerSource: string;
  /** Always positive: `ledgerType` gives the sign. */
  coins: number;
  /** Balance right after this entry. */
  totalCoins: number;
  date: string;
  title?: string;
  description?: string;
  icon?: string;
}

export interface XpLedgerEntry {
  _id: string;
  xpType: LedgerType;
  xpSource: string;
  /** The tournament or game this XP counts towards. */
  scopeKey?: string;
  xp: number;
  /** Total XP in `scopeKey` right after this entry. */
  scopeXP?: number;
  totalXP?: number;
  date: string;
  title?: string;
  description?: string;
  icon?: string;
}

/**
 * Chart points, oldest first. Coins: one per change, `x` an ISO time and `y`
 * the balance after it. XP: one per IST day with a change, `x` `YYYY-MM-DD`
 * and `y` that day's net XP (negative on a day of only mini-game losses).
 */
export interface TrackerMap {
  points: Array<{ x: string; y: number }>;
  /** More than 1,000 changes in range: only the latest 1,000 came back. */
  truncated?: boolean;
}

/** Query keys each tracker route forwards to the backend. */
export const COIN_HISTORY_QUERY_KEYS = ["page", "limit", "ledgerType", "ledgerSource"] as const;
export const XP_HISTORY_QUERY_KEYS = ["page", "limit", "xpType", "xpSource"] as const;
export const TRACKER_MAP_QUERY_KEYS = ["from", "to"] as const;
