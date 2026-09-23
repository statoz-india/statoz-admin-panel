import type { Prediction } from "@/app/interface/prediction.interface";
import type { Quiz } from "@/app/api/quiz/route";
import type { MatchData } from "@/app/api/match/route";
import type { Future } from "./futures.model";
import type { Event } from "./events.model";

/** Backend source collection each trending item can point at. */
export const TRENDING_TYPE_OPTIONS = [
  "prediction",
  "future",
  "event",
  "quiz",
  "match",
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
};

/** Plural form for list/empty-state copy (`match` doesn't just take an `s`). */
export const TRENDING_TYPE_PLURAL_LABELS: Record<TrendingType, string> = {
  prediction: "predictions",
  future: "futures",
  event: "events",
  quiz: "quizzes",
  match: "matches",
};

/** Shape of the populated `data` field, keyed by `type`. */
type TrendingDataByType = {
  prediction: Prediction;
  future: Future;
  event: Event;
  quiz: Quiz;
  match: MatchData;
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
  teamA?: { name?: string; displayName?: string } | string;
  teamB?: { name?: string; displayName?: string } | string;
  predictionStatus?: string;
  quizStatus?: string;
  eventName?: string;
  futureStatus?: string;
  eventStatus?: string;
  matchStatus?: string;
}
