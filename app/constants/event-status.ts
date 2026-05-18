const EVENT_STATUS_VALUES = [
  "UPCOMING",
  "ACTIVE",
  "FINISHED",
  "CANCELLED",
  "DELETED",
  "SETTLEMENT_DONE",
  "WINNING_OPTION_UPDATED",
] as const;

type EventStatusValue = (typeof EVENT_STATUS_VALUES)[number];

export { EVENT_STATUS_VALUES, type EventStatusValue };
