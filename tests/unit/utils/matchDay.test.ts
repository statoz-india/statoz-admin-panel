import { afterEach, describe, expect, it, vi } from "vitest";
import {
  dateToMatchDay,
  formatMatchDayLabel,
  isRealMatchDay,
  MATCH_DAY_PATTERN,
  matchDayToDate,
  SCORE_TIMEZONE,
  shiftMatchDay,
  todayMatchDay,
  toMatchDay,
} from "@/app/utils/matchDay";

describe("toMatchDay", () => {
  it("buckets a late-evening UTC fixture into the next IST day", () => {
    // 20:30 UTC is 02:00 IST the next morning.
    expect(toMatchDay(new Date("2026-08-08T20:30:00Z"))).toBe("2026-08-09");
  });

  it("keeps 23:59 IST on the same day", () => {
    expect(toMatchDay(new Date("2026-08-08T18:29:59Z"))).toBe("2026-08-08");
  });

  it("rolls over exactly at IST midnight", () => {
    expect(toMatchDay(new Date("2026-08-08T18:30:00Z"))).toBe("2026-08-09");
  });

  it("produces the YYYY-MM-DD shape the backend validates", () => {
    expect(toMatchDay(new Date("2026-01-05T06:00:00Z"))).toMatch(MATCH_DAY_PATTERN);
  });

  it("uses the backend's score timezone", () => {
    expect(SCORE_TIMEZONE).toBe("Asia/Kolkata");
  });
});

describe("todayMatchDay", () => {
  afterEach(() => vi.useRealTimers());

  it("is today in IST, not UTC", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-08T20:30:00Z"));
    expect(todayMatchDay()).toBe("2026-08-09");
  });
});

describe("isRealMatchDay", () => {
  it.each([
    ["2026-08-08", true],
    ["2028-02-29", true],
    ["2026-02-29", false],
    ["2026-13-01", false],
    ["2026-04-31", false],
    ["2026-00-10", false],
    ["2026-8-8", false],
    ["26-08-08", false],
    ["2026/08/08", false],
    ["", false],
    ["2026-08-08T00:00", false],
  ])("%s → %s", (day, expected) => {
    expect(isRealMatchDay(day)).toBe(expected);
  });
});

describe("shiftMatchDay", () => {
  it.each([
    ["2026-08-08", 1, "2026-08-09"],
    ["2026-08-08", -1, "2026-08-07"],
    ["2026-12-31", 1, "2027-01-01"],
    ["2027-01-01", -1, "2026-12-31"],
    ["2026-03-01", -1, "2026-02-28"],
    ["2028-03-01", -1, "2028-02-29"],
    ["2026-08-08", 0, "2026-08-08"],
    ["2026-08-08", 30, "2026-09-07"],
  ])("%s %+d → %s", (day, delta, expected) => {
    expect(shiftMatchDay(day, delta)).toBe(expected);
  });
});

describe("matchDayToDate / dateToMatchDay", () => {
  it("builds a local-midnight date for calendar widgets", () => {
    const date = matchDayToDate("2026-08-08")!;
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(7);
    expect(date.getDate()).toBe(8);
    expect(date.getHours()).toBe(0);
  });

  it("rejects days that aren't on the calendar", () => {
    expect(matchDayToDate("2026-02-30")).toBeUndefined();
    expect(matchDayToDate("garbage")).toBeUndefined();
  });

  it("reads a date's local calendar fields", () => {
    expect(dateToMatchDay(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });

  it("round-trips", () => {
    for (const day of ["2026-01-01", "2026-08-08", "2028-02-29", "2026-12-31"]) {
      expect(dateToMatchDay(matchDayToDate(day)!)).toBe(day);
    }
  });
});

describe("formatMatchDayLabel", () => {
  it("formats a real day for display", () => {
    expect(formatMatchDayLabel("2026-08-08")).toMatch(/^Sat, 8 Aug,? 2026$/);
  });

  it("returns invalid input untouched", () => {
    expect(formatMatchDayLabel("2026-13-45")).toBe("2026-13-45");
  });
});
