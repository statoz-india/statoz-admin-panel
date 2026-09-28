/** Every `predictionStatus` the backend uses (`PredictionStatus`). */
const PREDICTION_STATUSES = [
  "UPCOMING",
  "ACTIVE",
  "FINISHED",
  "CANCELLED",
  "LIVE",
  "SETTLEMENT_DONE",
  "NOT_VISIBLE",
  "ADMIN_VISIBLE",
  "WINNING_TEAM_UPDATED",
  "ABANDONED",
  "NO_RESULT",
] as const;

type PredictionStatusType = (typeof PREDICTION_STATUSES)[number];

/**
 * Statuses an admin can set from the predictions list's status menu. The
 * rest are set by other flows (visibility, declaring the winning team).
 */
const PREDICTION_STATUS_VALUES = [
  "ACTIVE",
  "LIVE",
  "FINISHED",
  "CANCELLED",
  "SETTLEMENT_DONE",
  "ABANDONED",
  "NO_RESULT",
] as const satisfies readonly PredictionStatusType[];

type PredictionStatus = (typeof PREDICTION_STATUS_VALUES)[number];

const PREDICTION_STATUS_WINNING_TEAM_UPDATED = "WINNING_TEAM_UPDATED";

const PREDICTION_STATUS_CANCELLED = "CANCELLED";

export {
  PREDICTION_STATUSES,
  PREDICTION_STATUS_VALUES,
  PREDICTION_STATUS_WINNING_TEAM_UPDATED,
  PREDICTION_STATUS_CANCELLED,
  type PredictionStatus,
  type PredictionStatusType,
};
