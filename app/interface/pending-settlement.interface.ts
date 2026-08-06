import type {
  MatchEvent,
  MatchPrediction,
  MatchQuiz,
} from "./match-picks.interface";

/**
 * Shapes returned by the superadmin pending-settlement endpoints:
 * `/quiz/pendingSettlementQuizzes`, `/prediction/pendingSettlementPredictions`,
 * `/events/pendingSettlementEvents`.
 *
 * Each returns everything whose entry window has already opened and that is not
 * settled yet, sorted by entry start time ascending — the most overdue first.
 * The projections match the sibling match-scoped list endpoints, so these build
 * on the interfaces in `match-picks.interface.ts`.
 */

/**
 * `questionsArray` is omitted by the list endpoint, so `totalQuestions` is the
 * only question-count signal — fetch `/api/quiz/:id` to build the answers form.
 */
export type PendingQuiz = Omit<MatchQuiz, "matchEvent"> & {
  matchEvent?: unknown;
  totalQuestions?: number;
  /** Users who submitted — the blast radius of settling. */
  totalSubmission?: number;
};

/**
 * `entryStartTime` exists on the schema but nothing in the backend writes it,
 * so it is effectively always null. The endpoint sorts on
 * `entryStartTime ?? matchStartTime`; the UI should display `matchStartTime`.
 */
export type PendingPrediction = Omit<
  MatchPrediction,
  "entryStartTime" | "matchEvent"
> & {
  entryStartTime: string | null;
  matchEvent?: unknown;
};

/** Match fields are populated for match-tied events and null for standalone ones. */
export type PendingEvent = MatchEvent;
