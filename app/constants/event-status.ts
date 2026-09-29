/** Every `eventStatus` the backend uses (`EventStatus`); all are settable from the event page. */
const EVENT_STATUS_VALUES = [
  "UPCOMING",
  "ACTIVE",
  "FINISHED",
  "CANCELLED",
  "DELETED",
  "SETTLEMENT_DONE",
  "WINNING_OPTION_UPDATED",
  "ABANDONED",
  "NO_RESULT",
  "NOT_ENOUGH_DATA",
] as const;

type EventStatusValue = (typeof EVENT_STATUS_VALUES)[number];

export { EVENT_STATUS_VALUES, type EventStatusValue };
