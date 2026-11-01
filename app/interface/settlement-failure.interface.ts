/**
 * A quiz, prediction or event the settlement service rejected or never
 * answered (`GET /admin-data/getSettlementFailures`). One row per item; the
 * backend keeps retrying on its own while the item stays unsettled.
 */

export const SETTLEMENT_FAILURE_KINDS = ["quiz", "prediction", "event"] as const;
export type SettlementFailureKind = (typeof SETTLEMENT_FAILURE_KINDS)[number];

export const SETTLEMENT_FAILURE_STATUSES = ["open", "resolved", "all"] as const;
export type SettlementFailureStatus = (typeof SETTLEMENT_FAILURE_STATUSES)[number];

export const SETTLEMENT_FAILURE_KIND_LABELS: Record<SettlementFailureKind, string> = {
  quiz: "Quiz",
  prediction: "Prediction",
  event: "Event",
};

export const SETTLEMENT_FAILURE_STATUS_LABELS: Record<SettlementFailureStatus, string> = {
  open: "Open",
  resolved: "Resolved",
  all: "All",
};

/** Query keys the route forwards to the backend. */
export const SETTLEMENT_FAILURE_QUERY_KEYS = ["status", "kind", "page", "limit"] as const;

export function isSettlementFailureKind(value: unknown): value is SettlementFailureKind {
  return SETTLEMENT_FAILURE_KINDS.includes(value as SettlementFailureKind);
}

export function isSettlementFailureStatus(value: unknown): value is SettlementFailureStatus {
  return SETTLEMENT_FAILURE_STATUSES.includes(value as SettlementFailureStatus);
}

export interface SettlementFailure {
  _id: string;
  kind: SettlementFailureKind;
  /** The item as it is now; `null` once it's been deleted. */
  item: {
    _id: string;
    quizStatus?: string;
    predictionStatus?: string;
    eventStatus?: string;
    matchId?: string;
    tournament?: string;
  } | null;
  /** Readable id: `quizId`, `predictionId` or `eventId`. */
  itemId: string;
  /** The ESPN game the item was being settled against. */
  espnEventId: string;
  attempts: number;
  /** The settlement service's status, or `null` for a timeout or network error. */
  lastStatusCode: number | null;
  lastError: string;
  firstFailedAt: string;
  lastFailedAt: string;
  /** When a later request was accepted (not when payouts finished); `null` while open. */
  resolvedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** The item's status now, or "DELETED" when the item is gone. */
export function settlementFailureItemStatus(failure: SettlementFailure): string {
  const { item } = failure;
  if (!item) return "DELETED";
  return item.quizStatus ?? item.predictionStatus ?? item.eventStatus ?? "UNKNOWN";
}

/**
 * Settling by hand doesn't close the row: it stays open while the item
 * itself already shows SETTLEMENT_DONE.
 */
export function isSettledManually(failure: SettlementFailure): boolean {
  return (
    failure.resolvedAt === null &&
    settlementFailureItemStatus(failure).toUpperCase() === "SETTLEMENT_DONE"
  );
}

/** The item's admin page, or null when the item was deleted. */
export function settlementFailureItemHref(failure: SettlementFailure): string | null {
  const id = failure.item?._id;
  if (!id) return null;
  const encoded = encodeURIComponent(id);
  switch (failure.kind) {
    case "quiz":
      return `/quiz/${encoded}`;
    case "prediction":
      return `/prediction/${encoded}`;
    case "event":
      return `/events?id=${encoded}`;
  }
}
