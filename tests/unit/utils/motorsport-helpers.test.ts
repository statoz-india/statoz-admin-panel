import { describe, expect, it } from "vitest";
import {
  eventStatusClass,
  formatIst,
  HIDDEN_EVENT_STATUSES,
  isoToIstInput,
  istInputToIso,
  quizStatusClass,
  STATUS_STYLES,
} from "@/app/components/motorsportMatches/motorsportHelpers";

describe("IST datetime-local conversion", () => {
  it("shows a UTC instant as IST input", () => {
    expect(isoToIstInput("2026-08-08T14:00:00.000Z")).toBe("2026-08-08T19:30");
  });

  it("crosses midnight into the next IST day", () => {
    expect(isoToIstInput("2026-08-08T20:00:00.000Z")).toBe("2026-08-09T01:30");
  });

  it("returns empty for missing or invalid input", () => {
    expect(isoToIstInput(null)).toBe("");
    expect(isoToIstInput(undefined)).toBe("");
    expect(isoToIstInput("nope")).toBe("");
  });

  it("reads an input value as IST", () => {
    expect(istInputToIso("2026-08-08T19:30")).toBe("2026-08-08T14:00:00.000Z");
  });

  it("round-trips", () => {
    for (const value of ["2026-01-01T00:00", "2026-08-08T19:30", "2026-12-31T23:59"]) {
      expect(isoToIstInput(istInputToIso(value))).toBe(value);
    }
  });
});

describe("formatIst", () => {
  it("formats in IST", () => {
    const text = formatIst("2026-08-08T14:00:00.000Z");
    expect(text).toMatch(/08 Aug 2026/);
    expect(text).toMatch(/07:30\s?pm/i);
  });

  it("shows a dash for missing or invalid input", () => {
    expect(formatIst(null)).toBe("—");
    expect(formatIst("bad")).toBe("—");
  });
});

describe("badges", () => {
  it("styles every race status", () => {
    expect(Object.keys(STATUS_STYLES).sort()).toEqual(["Cancelled", "Finished", "Ongoing", "Upcoming"]);
  });

  it.each([
    ["live", "bg-emerald-900 text-emerald-200"],
    ["ANSWER_UPDATED", "bg-blue-900 text-blue-200"],
    ["cancelled", "bg-red-900 text-red-200"],
    ["whatever", "bg-zinc-700 text-zinc-200"],
  ])("quizStatusClass(%s)", (status, cls) => {
    expect(quizStatusClass(status)).toBe(cls);
  });

  it.each([
    ["active", "bg-teal-900 text-teal-200"],
    ["DELETED", "bg-red-900 text-red-200"],
    ["WINNING_OPTION_UPDATED", "bg-blue-900 text-blue-200"],
    ["whatever", "bg-zinc-700 text-zinc-200"],
  ])("eventStatusClass(%s)", (status, cls) => {
    expect(eventStatusClass(status)).toBe(cls);
  });

  it("hides cancelled and deleted events by default", () => {
    expect([...HIDDEN_EVENT_STATUSES].sort()).toEqual(["CANCELLED", "DELETED"]);
  });
});
