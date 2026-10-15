const FUTURE_STATUS_VALUES = [
  "UPCOMING",
  "ACTIVE",
  "FINISHED",
  "CANCELLED",
  "DELETED",
  "SETTLEMENT_DONE",
  "WINNING_OPTION_UPDATED",
] as const;

type FutureStatusValue = (typeof FUTURE_STATUS_VALUES)[number];

export { FUTURE_STATUS_VALUES, type FutureStatusValue };
