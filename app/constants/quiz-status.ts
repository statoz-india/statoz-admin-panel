export const QUIZ_STATUS_VALUES = [
  "UPCOMING",
  "LIVE",
  "FINISHED",
  "SETTLEMENT_DONE",
] as const;

export type QuizStatus = (typeof QUIZ_STATUS_VALUES)[number];
