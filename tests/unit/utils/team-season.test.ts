import { afterEach, describe, expect, it } from "vitest";
import {
  formatSeasons,
  isValidSeason,
  normalizeSeasons,
  sameSeasons,
  SEASON_PATTERN,
} from "@/app/utils/team-season";
import {
  DEFAULT_TEAM_SEASON_OPTIONS,
  getTeamSeasonOptions,
  TEAM_SEASONS_BY_TOURNAMENT,
} from "@/app/utils/team-season-options";

describe("isValidSeason", () => {
  it.each([
    ["2026", true],
    ["2026/27", true],
    ["1999/00", true],
    ["2026/2027", false],
    ["2026-27", false],
    ["26", false],
    [" 2026", false],
    ["2026/7", false],
    ["", false],
  ])("%j → %s", (season, valid) => {
    expect(isValidSeason(season)).toBe(valid);
    expect(SEASON_PATTERN.test(season)).toBe(valid);
  });
});

describe("normalizeSeasons", () => {
  it("trims and de-duplicates, keeping first-seen order", () => {
    expect(normalizeSeasons([" 2026", "2026/27 ", "2026", "2025"])).toEqual(["2026", "2026/27", "2025"]);
  });

  it("handles an empty list", () => {
    expect(normalizeSeasons([])).toEqual([]);
  });
});

describe("sameSeasons", () => {
  it("compares in order", () => {
    expect(sameSeasons(["2026", "2026/27"], ["2026", "2026/27"])).toBe(true);
    expect(sameSeasons(["2026", "2026/27"], ["2026/27", "2026"])).toBe(false);
    expect(sameSeasons(["2026"], ["2026", "2026/27"])).toBe(false);
    expect(sameSeasons([], [])).toBe(true);
  });
});

describe("formatSeasons", () => {
  it("shows a dash when not set", () => {
    expect(formatSeasons(undefined)).toBe("—");
    expect(formatSeasons(null)).toBe("—");
    expect(formatSeasons([])).toBe("—");
  });

  it("joins seasons", () => {
    expect(formatSeasons(["2026", "2026/27"])).toBe("2026, 2026/27");
  });
});

describe("getTeamSeasonOptions", () => {
  afterEach(() => {
    delete TEAM_SEASONS_BY_TOURNAMENT.TEST_EPL;
  });

  it("offers the defaults for an unconfigured tournament", () => {
    expect(getTeamSeasonOptions("UNKNOWN")).toEqual([...DEFAULT_TEAM_SEASON_OPTIONS]);
    expect(getTeamSeasonOptions("")).toEqual([...DEFAULT_TEAM_SEASON_OPTIONS]);
  });

  it("only offers valid seasons by default", () => {
    expect(DEFAULT_TEAM_SEASON_OPTIONS.every(isValidSeason)).toBe(true);
  });

  it("keeps a team's existing seasons selectable", () => {
    expect(getTeamSeasonOptions("IPL", ["2025", DEFAULT_TEAM_SEASON_OPTIONS[0]])).toEqual([
      ...DEFAULT_TEAM_SEASON_OPTIONS,
      "2025",
    ]);
  });

  it("never mutates the defaults", () => {
    getTeamSeasonOptions("IPL", ["1999"]);
    expect(DEFAULT_TEAM_SEASON_OPTIONS).not.toContain("1999");
  });

  it("matches a configured tournament ignoring case and spaces", () => {
    TEAM_SEASONS_BY_TOURNAMENT.TEST_EPL = ["2025/26", "2026/27"];
    expect(getTeamSeasonOptions("  test_epl ")).toEqual(["2025/26", "2026/27"]);
  });

  it("only configures valid seasons", () => {
    for (const seasons of Object.values(TEAM_SEASONS_BY_TOURNAMENT)) {
      expect(seasons.every(isValidSeason)).toBe(true);
    }
  });
});
