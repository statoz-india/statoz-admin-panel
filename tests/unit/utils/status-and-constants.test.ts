/**
 * Status values, their badges and the section list. The completeness checks
 * fail when a status or section is added in one place but not the other.
 */

import { describe, expect, it } from "vitest";
import { eventStatusBadgeClass } from "@/app/components/events/event-appearance";
import { EVENT_STATUS_VALUES } from "@/app/constants/event-status";
import { FUTURE_STATUS_VALUES } from "@/app/constants/future-status";
import { GAME_TYPE_OPTIONS, isGameType } from "@/app/constants/game-type";
import { MATCH_STATUS_LABELS, MATCH_STATUS_VALUES } from "@/app/constants/match-status";
import {
  PREDICTION_STATUS_VALUES,
  PREDICTION_STATUSES,
} from "@/app/constants/prediction-status";
import {
  isQuizStatusFinal,
  QUIZ_FINAL_STATUSES,
  QUIZ_STATUS_VALUES,
  QUIZ_STATUSES,
} from "@/app/constants/quiz-status";
import { APP_OS, isAppOs, NAV_LIST_META, NAV_LISTS } from "@/app/interface/app-navigation.interface";
import { CONTACT_ISSUE_LABELS, CONTACT_ISSUES, isContactIssue } from "@/app/interface/contact-us.interface";
import { isMatchStatsGameType } from "@/app/interface/match-stats.interface";
import { isTrendingType, TRENDING_TYPE_LABELS, TRENDING_TYPE_OPTIONS } from "@/app/models/trending.model";
import { errorRowIndex } from "@/app/components/trending/TrendingMatchesTab";
import { EventStatus } from "@/app/utils/enums/event.enum";
import { FutureStatus } from "@/app/utils/enums/future.enum";
import { isValidSection, Section, SIDEBAR_MENU_ITEMS, VALID_SECTIONS } from "@/app/utils/enums/section.enum";
import { statusBadgeClass } from "@/app/utils/statusBadge";

const DEFAULT_BADGE = "bg-zinc-800 text-zinc-200";

describe("statusBadgeClass", () => {
  it.each([
    ["LIVE", "bg-emerald-900 text-emerald-200"],
    ["live", "bg-emerald-900 text-emerald-200"],
    ["ACTIVE", "bg-teal-900 text-teal-200"],
    ["FINISHED", "bg-zinc-700 text-zinc-200"],
    ["result", "bg-zinc-700 text-zinc-200"],
    ["CANCELED", "bg-red-900 text-red-200"],
    ["CANCELLED", "bg-red-900 text-red-200"],
    ["no_result", "bg-stone-700 text-stone-200"],
    ["ENTRYSTARTED", "bg-blue-900 text-blue-200"],
  ])("%s → %s", (status, cls) => {
    expect(statusBadgeClass(status)).toBe(cls);
  });

  it("falls back for unknown statuses", () => {
    expect(statusBadgeClass("SOMETHING_NEW")).toBe(DEFAULT_BADGE);
    expect(statusBadgeClass("")).toBe(DEFAULT_BADGE);
  });

  it.each([
    ["quiz", QUIZ_STATUSES],
    ["prediction", PREDICTION_STATUSES],
    ["event", EVENT_STATUS_VALUES],
    ["future", FUTURE_STATUS_VALUES],
    ["match", MATCH_STATUS_VALUES],
  ])("has a dedicated badge for every %s status", (_, statuses) => {
    const missing = statuses.filter((s) => statusBadgeClass(s) === DEFAULT_BADGE);
    expect(missing).toEqual([]);
  });
});

describe("eventStatusBadgeClass", () => {
  it("has a dedicated badge for every event status, in any case", () => {
    for (const status of EVENT_STATUS_VALUES) {
      expect(eventStatusBadgeClass(status)).not.toBe(DEFAULT_BADGE);
      expect(eventStatusBadgeClass(status.toLowerCase())).toBe(eventStatusBadgeClass(status));
    }
  });

  it("falls back for unknown statuses", () => {
    expect(eventStatusBadgeClass("??")).toBe(DEFAULT_BADGE);
  });
});

describe("status constants", () => {
  it("lists every backend event status", () => {
    expect([...EVENT_STATUS_VALUES].sort()).toEqual(Object.values(EventStatus).sort());
  });

  it("lists every backend future status", () => {
    expect([...FUTURE_STATUS_VALUES].sort()).toEqual(Object.values(FutureStatus).sort());
  });

  it("only lets admins set real statuses", () => {
    expect(QUIZ_STATUS_VALUES.every((s) => (QUIZ_STATUSES as readonly string[]).includes(s))).toBe(true);
    expect(PREDICTION_STATUS_VALUES.every((s) => (PREDICTION_STATUSES as readonly string[]).includes(s))).toBe(true);
  });

  it("labels every match status", () => {
    expect(Object.keys(MATCH_STATUS_LABELS).sort()).toEqual([...MATCH_STATUS_VALUES].sort());
  });

  it("has no duplicate values", () => {
    for (const list of [QUIZ_STATUSES, PREDICTION_STATUSES, EVENT_STATUS_VALUES, MATCH_STATUS_VALUES, GAME_TYPE_OPTIONS]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });
});

describe("isQuizStatusFinal", () => {
  it.each(QUIZ_FINAL_STATUSES)("%s is final", (status) => {
    expect(isQuizStatusFinal(status)).toBe(true);
  });

  it("ignores case and whitespace", () => {
    expect(isQuizStatusFinal(" settlement_done ")).toBe(true);
  });

  it.each(["LIVE", "UPCOMING", "ANSWER_UPDATED", "", null, undefined])("%j is not final", (status) => {
    expect(isQuizStatusFinal(status)).toBe(false);
  });
});

describe("isGameType", () => {
  it.each(GAME_TYPE_OPTIONS)("accepts %s", (type) => {
    expect(isGameType(type)).toBe(true);
  });

  it.each(["Cricket", "golf", "", null, 1, undefined])("rejects %j", (value) => {
    expect(isGameType(value)).toBe(false);
  });
});

describe("sections", () => {
  it("recognises every section", () => {
    for (const section of VALID_SECTIONS) expect(isValidSection(section)).toBe(true);
    expect(isValidSection("nope")).toBe(false);
    expect(isValidSection("Dashboard")).toBe(false);
  });

  it("gives every sidebar item a label and a real section", () => {
    for (const item of SIDEBAR_MENU_ITEMS) {
      expect(isValidSection(item.id)).toBe(true);
      expect(item.label.trim()).not.toBe("");
    }
  });

  it("lists each sidebar section once, starting with the dashboard", () => {
    const ids = SIDEBAR_MENU_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe(Section.DASHBOARD);
  });
});

describe("small type guards", () => {
  it("isContactIssue is case-sensitive", () => {
    for (const issue of CONTACT_ISSUES) expect(isContactIssue(issue)).toBe(true);
    expect(isContactIssue("bug")).toBe(false);
    expect(Object.keys(CONTACT_ISSUE_LABELS).sort()).toEqual([...CONTACT_ISSUES].sort());
  });

  it("isMatchStatsGameType ignores case and spaces", () => {
    expect(isMatchStatsGameType(" Football ")).toBe(true);
    expect(isMatchStatsGameType("racing")).toBe(false);
    expect(isMatchStatsGameType(null)).toBe(false);
  });

  it("isTrendingType knows every trending source and has a label for each", () => {
    for (const type of TRENDING_TYPE_OPTIONS) {
      expect(isTrendingType(type)).toBe(true);
      expect(TRENDING_TYPE_LABELS[type]).toBeTruthy();
    }
    expect(isTrendingType("user")).toBe(false);
  });

  it("trending accepts races as motorsportMatch", () => {
    expect(isTrendingType("motorsportMatch")).toBe(true);
    expect(TRENDING_TYPE_LABELS.motorsportMatch).toBe("Race");
  });

  it("trending accepts race quizzes as motorsportQuiz, separate from quiz", () => {
    expect(isTrendingType("motorsportQuiz")).toBe(true);
    expect(TRENDING_TYPE_LABELS.motorsportQuiz).toBe("Race quiz");
    expect(TRENDING_TYPE_OPTIONS).toContain("quiz");
  });

  it("errorRowIndex finds the row a trending save failed on", () => {
    expect(
      errorRowIndex(
        "trendingMatches[3].data does not reference an existing motorsportMatch",
      ),
    ).toBe(3);
    expect(errorRowIndex("trendingMatches must be a non-empty array")).toBeNull();
  });
});

describe("app navigation interface", () => {
  it("recognises the app platforms", () => {
    for (const os of APP_OS) expect(isAppOs(os)).toBe(true);
    expect(isAppOs("windows")).toBe(false);
    expect(isAppOs("iOS")).toBe(false);
  });

  it("describes every navigation list", () => {
    for (const list of NAV_LISTS) {
      expect(NAV_LIST_META[list].label).toBeTruthy();
      expect(NAV_LIST_META[list].suggestions.length).toBeGreaterThan(0);
    }
  });
});
