/** Every `quizStatus` the backend uses (`QuizStatusTypes`). */
export const QUIZ_STATUSES = [
  "UPCOMING",
  "LIVE",
  "FINISHED",
  "ENTRYNOTSTARTED",
  "ENTRYCLOSED",
  "SETTLEMENT_DONE",
  "NOT_VISIBLE",
  "ADMIN_VISIBLE",
  "ANSWER_UPDATED",
  "ABANDONED",
  "NO_RESULT",
  "NOT_ENOUGH_DATA",
  "CANCELLED",
] as const;

export type QuizStatusType = (typeof QUIZ_STATUSES)[number];

/**
 * Statuses an admin can set from the quiz list's status menu. The rest are
 * set by other flows (entry window, visibility, answer submission).
 */
export const QUIZ_STATUS_VALUES = [
  "UPCOMING",
  "LIVE",
  "FINISHED",
  "SETTLEMENT_DONE",
  "ABANDONED",
  "NO_RESULT",
  "NOT_ENOUGH_DATA",
  "CANCELLED",
] as const satisfies readonly QuizStatusType[];

export type QuizStatus =(typeof QUIZ_STATUS_VALUES)[number];

/** Final statuses: once a quiz reaches one, its status can't be changed. */
export const QUIZ_FINAL_STATUSES = [
  "SETTLEMENT_DONE",
  "ABANDONED",
  "NO_RESULT",
] as const satisfies readonly QuizStatusType[];

export function isQuizStatusFinal(status: string | null | undefined): boolean {
  const s = status?.trim().toUpperCase();
  return (QUIZ_FINAL_STATUSES as readonly string[]).includes(s ?? "");
}

export const QUIZ_STATUS_ANSWER_UPDATED = "ANSWER_UPDATED";
