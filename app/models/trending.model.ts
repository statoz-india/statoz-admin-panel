import type { Prediction } from "@/app/interface/prediction.interface";
import type { Quiz } from "@/app/api/quiz/route";
import type { MatchData } from "@/app/api/match/route";
import type { Future } from "./futures.model";
import type { Event } from "./events.model";
import type { MotorsportMatch } from "./motorsport-match.model";
import type { MotorsportQuizListItem } from "./motorsport-quiz.model";

/** Backend source collection each trending item can point at. */
export const TRENDING_TYPE_OPTIONS = [
  "prediction",
  "future",
  "event",
  "quiz",
  "match",
  "motorsportMatch",
  "motorsportQuiz",
] as const;

export type TrendingType = (typeof TRENDING_TYPE_OPTIONS)[number];

export function isTrendingType(value: unknown): value is TrendingType {
  return (
    typeof value === "string" &&
    (TRENDING_TYPE_OPTIONS as readonly string[]).includes(value)
  );
}

export const TRENDING_TYPE_LABELS: Record<TrendingType, string> = {
  prediction: "Prediction",
  future: "Future",
  event: "Event",
  quiz: "Quiz",
  match: "Match",
  motorsportMatch: "Race",
  motorsportQuiz: "Race quiz",
};

/** Plural form for list/empty-state copy (`match` doesn't just take an `s`). */
export const TRENDING_TYPE_PLURAL_LABELS: Record<TrendingType, string> = {
  prediction: "predictions",
  future: "futures",
  event: "events",
  quiz: "quizzes",
  match: "matches",
  motorsportMatch: "races",
  motorsportQuiz: "race quizzes",
};

/** Shape of the populated `data` field, keyed by `type`. */
type TrendingDataByType = {
  prediction: Prediction;
  future: Future;
  event: Event;
  quiz: Quiz;
  match: MatchData;
  motorsportMatch: TrendingMotorsportMatch;
  motorsportQuiz: TrendingMotorsportQuiz;
};

/** The race as a trending motorsport quiz embeds it. */
export interface TrendingQuizRace {
  _id: string;
  /** Readable id, e.g. `F1-R19`. */
  matchId?: string;
  name?: string;
  /** Tournament code, e.g. `F1` (the quiz's own `tournament` is an id). */
  tournament?: string;
  matchStatus?: string;
  raceStartTime?: string | null;
  raceEventStartDate?: string | null;
  raceEventStopDate?: string | null;
}

/**
 * A motorsport quiz as the trending list returns it. Unlike every other
 * type it has no show/hide rule: players see it even with `isVisible: false`.
 * `matchId` is the race's `_id` and `tournament` an id; the readable values
 * are on `match`.
 */
export type TrendingMotorsportQuiz = Omit<
  MotorsportQuizListItem,
  "match" | "createdAt" | "updatedAt"
> & {
  match?: TrendingQuizRace;
  raceStartTime?: string | null;
  gameType?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * A race as the trending list returns it: the `MotorSportMatch` document with
 * `createdBy` left as a bare user id (not populated, unlike the race list).
 */
export type TrendingMotorsportMatch = Omit<
  MotorsportMatch,
  "createdBy" | "createdAt" | "updatedAt"
> & {
  createdBy?: string | MotorsportMatch["createdBy"];
  createdAt?: string;
  updatedAt?: string;
};

/**
 * One entry as returned by `GET /api/trending`. The backend doesn't just
 * `.populate()` the stored document — it re-runs the *same aggregation
 * pipeline* that type's own homepage endpoint uses (`matchAggregation()`,
 * `predictionAggregation()`, etc.), so `data` here is identically shaped to
 * a `GET .../homePage*` list item, not a raw Mongoose document.
 */
export type TrendingItem = {
  [K in TrendingType]: {
    _id: string;
    type: K;
    order: number;
    data: TrendingDataByType[K];
  };
}[TrendingType];

/** One entry as sent to `PUT /api/trending` — `data` is just the id. */
export interface TrendingPutEntry {
  type: TrendingType;
  data: string;
}

/**
 * One entry as returned by `PUT /api/trending`'s confirmation response —
 * this is the raw stored record (unaggregated), since PUT only confirms
 * what was saved. `data` is the referenced document's id, not the document.
 */
export interface TrendingPutResponseItem {
  _id: string;
  type: TrendingType;
  dataModel: string;
  data: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrendingListResponse {
  items: TrendingItem[];
}

/**
 * Loose shape covering every record a trending entry's `data` can be —
 * whichever fields the current content type actually has — enough to render
 * a title/subtitle without caring whether `data` came fully populated (from
 * `GET /trending`) or from a leaner home-page list (the "add item" picker).
 */
export interface TrendingDisplayRecord {
  _id: string;
  tournament?: string;
  tournamentData?: { tournament?: string; tournamentName?: string };
  teamA?: { name?: string; displayName?: string } | string;
  teamB?: { name?: string; displayName?: string } | string;
  predictionStatus?: string;
  quizStatus?: string;
  eventName?: string;
  futureStatus?: string;
  eventStatus?: string;
  matchStatus?: string;
  /** Races: the title, since they have no teams. */
  name?: string;
  /** Races: the readable id (`F1-R19`). Motorsport quizzes: the race's `_id`. */
  matchId?: string | null;
  seasonYear?: string;
  raceStartTime?: string | null;
  /** `false` when hidden from players; the admin GET still returns these. */
  isVisible?: boolean;
  /** Motorsport quizzes: readable id (e.g. `F1-R19-Q1`), question count and race. */
  quizId?: string;
  questionCount?: number;
  match?: TrendingQuizRace | string | null;
}
