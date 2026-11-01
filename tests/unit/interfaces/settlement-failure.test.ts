import { describe, expect, it } from "vitest";
import {
  isSettledManually,
  isSettlementFailureKind,
  isSettlementFailureStatus,
  SETTLEMENT_FAILURE_KIND_LABELS,
  SETTLEMENT_FAILURE_KINDS,
  SETTLEMENT_FAILURE_STATUS_LABELS,
  SETTLEMENT_FAILURE_STATUSES,
  settlementFailureItemHref,
  settlementFailureItemStatus,
  type SettlementFailure,
} from "@/app/interface/settlement-failure.interface";

const failure = (overrides: Partial<SettlementFailure> = {}): SettlementFailure => ({
  _id: "f1",
  kind: "quiz",
  item: { _id: "6721f0c2a1b2c3d4e5f60718", quizStatus: "FINISHED", tournament: "IPL" },
  itemId: "M1042-Q3",
  espnEventId: "704512",
  attempts: 3,
  lastStatusCode: null,
  lastError: "The operation was aborted due to timeout",
  firstFailedAt: "2026-10-31T15:02:10.000Z",
  lastFailedAt: "2026-10-31T15:09:41.000Z",
  resolvedAt: null,
  ...overrides,
});

describe("settlement failure filters", () => {
  it("knows the kinds and statuses, with a label for each", () => {
    for (const kind of SETTLEMENT_FAILURE_KINDS) {
      expect(isSettlementFailureKind(kind)).toBe(true);
      expect(SETTLEMENT_FAILURE_KIND_LABELS[kind]).toBeTruthy();
    }
    for (const status of SETTLEMENT_FAILURE_STATUSES) {
      expect(isSettlementFailureStatus(status)).toBe(true);
      expect(SETTLEMENT_FAILURE_STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it.each(["race", "Quiz", "", null])("rejects %j", (value) => {
    expect(isSettlementFailureKind(value)).toBe(false);
    expect(isSettlementFailureStatus(value)).toBe(false);
  });
});

describe("settlementFailureItemStatus", () => {
  it.each([
    [{ _id: "q", quizStatus: "FINISHED" }, "FINISHED"],
    [{ _id: "p", predictionStatus: "ACTIVE" }, "ACTIVE"],
    [{ _id: "e", eventStatus: "SETTLEMENT_DONE" }, "SETTLEMENT_DONE"],
    [{ _id: "x" }, "UNKNOWN"],
    [null, "DELETED"],
  ])("%j → %s", (item, status) => {
    expect(settlementFailureItemStatus(failure({ item }))).toBe(status);
  });
});

describe("isSettledManually", () => {
  it("is an open row whose item is already settled", () => {
    expect(isSettledManually(failure({ item: { _id: "q", quizStatus: "SETTLEMENT_DONE" } }))).toBe(true);
  });

  it("is not a resolved row, an unsettled item or a deleted one", () => {
    expect(
      isSettledManually(
        failure({ item: { _id: "q", quizStatus: "SETTLEMENT_DONE" }, resolvedAt: "2026-10-31T16:00:00.000Z" }),
      ),
    ).toBe(false);
    expect(isSettledManually(failure())).toBe(false);
    expect(isSettledManually(failure({ item: null }))).toBe(false);
  });
});

describe("settlementFailureItemHref", () => {
  it.each([
    ["quiz", "/quiz/abc"],
    ["prediction", "/prediction/abc"],
    ["event", "/events?id=abc"],
  ] as const)("links a %s to its admin page", (kind, href) => {
    expect(settlementFailureItemHref(failure({ kind, item: { _id: "abc" } }))).toBe(href);
  });

  it("has no link for a deleted item", () => {
    expect(settlementFailureItemHref(failure({ item: null }))).toBeNull();
  });
});
