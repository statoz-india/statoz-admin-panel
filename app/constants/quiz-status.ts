export const QUIZ_STATUS_VALUES = [
  "UPCOMING",
  "LIVE",
  "FINISHED",
  "ENTRYNOTSTARTED",
  "ENTRYCLOSED",
  "SETTLEMENT_DONE",
  "NOT_VISIBLE",
  "ADMIN_VISIBLE",
] as const;

export type QuizStatus = (typeof QUIZ_STATUS_VALUES)[number];
