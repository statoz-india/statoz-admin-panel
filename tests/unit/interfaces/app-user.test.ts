import { describe, expect, it } from "vitest";
import {
  isEventOpen,
  isFutureOpen,
  isPredictionOpen,
  isQuizOpen,
  teamName,
} from "@/app/interface/app-user.interface";

const NOW = Date.parse("2026-11-01T12:00:00Z");
const PAST = "2026-11-01T10:00:00Z";
const LATER = "2026-11-01T14:00:00Z";

describe("isQuizOpen", () => {
  it.each(["UPCOMING", "live", "ENTRYNOTSTARTED", undefined])("%s takes answers", (quizStatus) => {
    expect(isQuizOpen({ _id: "q", quizStatus }, NOW)).toBe(true);
  });

  it.each(["FINISHED", "ENTRYCLOSED", "ANSWER_UPDATED", "SETTLEMENT_DONE", "UNRESOLVED", "CANCELLED"])(
    "%s doesn't",
    (quizStatus) => {
      expect(isQuizOpen({ _id: "q", quizStatus }, NOW)).toBe(false);
    },
  );

  it("closes once entryStopTime has passed", () => {
    expect(isQuizOpen({ _id: "q", quizStatus: "LIVE", entryStopTime: PAST }, NOW)).toBe(false);
    expect(isQuizOpen({ _id: "q", quizStatus: "LIVE", entryStopTime: LATER }, NOW)).toBe(true);
  });
});

describe("isPredictionOpen", () => {
  it.each([
    ["ACTIVE", true],
    ["UPCOMING", true],
    ["LIVE", true],
    ["WINNING_TEAM_UPDATED", false],
    ["FINISHED", false],
    [undefined, false],
  ])("%s → %s", (predictionStatus, open) => {
    expect(isPredictionOpen({ _id: "p", predictionStatus })).toBe(open);
  });
});

describe("isEventOpen", () => {
  const event = (eventStatus: string, entryStartTime?: string, entryCloseTime?: string) => ({
    _id: "e",
    eventName: "Toss",
    eventStatus,
    entryStartTime,
    entryCloseTime,
  });

  it("needs an open status and the entry window", () => {
    expect(isEventOpen(event("ACTIVE", PAST, LATER), NOW)).toBe(true);
    expect(isEventOpen(event("UPCOMING"), NOW)).toBe(true);
    expect(isEventOpen(event("ACTIVE", LATER), NOW)).toBe(false);
    expect(isEventOpen(event("ACTIVE", undefined, PAST), NOW)).toBe(false);
    expect(isEventOpen(event("FINISHED", PAST, LATER), NOW)).toBe(false);
  });
});

describe("isFutureOpen", () => {
  it("is only ACTIVE futures inside the window", () => {
    expect(isFutureOpen({ _id: "f", futureStatus: "ACTIVE", entryStartTime: PAST, entryCloseTime: LATER }, NOW)).toBe(true);
    expect(isFutureOpen({ _id: "f", futureStatus: "UPCOMING" }, NOW)).toBe(false);
    expect(isFutureOpen({ _id: "f", futureStatus: "ACTIVE", entryCloseTime: PAST }, NOW)).toBe(false);
  });
});

describe("teamName", () => {
  it("prefers the display name, then the name, then the code", () => {
    expect(teamName({ displayName: "CSK", name: "Chennai" }, "A")).toBe("CSK");
    expect(teamName({ name: "Chennai" }, "A")).toBe("Chennai");
    expect(teamName({ abbreviation: "CHE" }, "A")).toBe("CHE");
    expect(teamName(null, "Team A")).toBe("Team A");
  });
});
