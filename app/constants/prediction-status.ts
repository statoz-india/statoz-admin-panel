const PREDICTION_STATUS_VALUES = [
  "ACTIVE",
  "LIVE",
  "FINISHED",
  "CANCELLED",
  "SETTLEMENT_DONE",
] as const;

type PredictionStatus = (typeof PREDICTION_STATUS_VALUES)[number];

export { PREDICTION_STATUS_VALUES, type PredictionStatus };
