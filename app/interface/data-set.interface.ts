import type { MatchData } from "../api/match/route";
import type {
  MatchEvent,
  MatchPrediction,
  MatchQuiz,
} from "./match-picks.interface";

/** Tabs of the Data Set section, in display order. */
export const DATA_SET_TABS = [
  "matches",
  "quizzes",
  "predictions",
  "events",
] as const;

export type DataSetTab = (typeof DATA_SET_TABS)[number];

export function isDataSetTab(value: string | null | undefined): value is DataSetTab {
  return DATA_SET_TABS.includes(value as DataSetTab);
}

/** Backend route prefix per tab: `/{prefix}/statuses` and `/{prefix}/byStatus`. */
export const DATA_SET_BACKEND_PREFIX: Record<DataSetTab, string> = {
  matches: "match",
  quizzes: "quiz",
  predictions: "prediction",
  events: "events",
};

/** One page of `GET /{prefix}/byStatus[/:status]`; empty is a 200 with `items: []`. */
export interface StatusPage<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/** Same row shapes as the other admin lists; statuses widen to any value. */
export type DataSetMatch = MatchData;
export type DataSetQuiz = MatchQuiz;
export type DataSetPrediction = MatchPrediction;
export type DataSetEvent = MatchEvent;

export type DataSetItem =
  | DataSetMatch
  | DataSetQuiz
  | DataSetPrediction
  | DataSetEvent;
