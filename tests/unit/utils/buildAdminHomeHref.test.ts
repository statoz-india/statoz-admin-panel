import { describe, expect, it } from "vitest";
import {
  buildAdminHomeHref,
  buildDetailBackHref,
  FROM_MATCH_DETAIL,
  FROM_MOTORSPORT_DETAIL,
  stripAdminHomeQueryNoise,
} from "@/app/utils/buildAdminHomeHref";

/** The query of an admin-home href as a plain object, for order-free comparison. */
function query(href: string): Record<string, string> {
  expect(href.startsWith("/?")).toBe(true);
  return Object.fromEntries(new URLSearchParams(href.slice(2)));
}

const DETAIL_NOISE = "from=match&id=abc&tab=json&matchId=m1";

describe("buildAdminHomeHref", () => {
  it("goes to / when there is no section", () => {
    expect(buildAdminHomeHref(null, new URLSearchParams("a=1"))).toBe("/");
    expect(buildAdminHomeHref(undefined, null)).toBe("/");
    expect(buildAdminHomeHref("", null)).toBe("/");
  });

  it("sets the section and keeps unrelated params", () => {
    expect(query(buildAdminHomeHref("users", new URLSearchParams("q=virat")))).toEqual({ q: "virat", section: "users" });
  });

  it("overwrites an existing section", () => {
    expect(query(buildAdminHomeHref("events", new URLSearchParams("section=quizzes"))).section).toBe("events");
  });

  it("accepts null search params", () => {
    expect(buildAdminHomeHref("dashboard", null)).toBe("/?section=dashboard");
  });

  it("drops detail-page params", () => {
    expect(query(buildAdminHomeHref("events", new URLSearchParams(DETAIL_NOISE)))).toEqual({ section: "events" });
  });

  it.each([
    ["matches", { matchTournament: "IPL", tournament: "T" }],
    ["teams", { matchTournament: "IPL", tournament: "T" }],
    ["users", {}],
  ])("keeps only %s's tournament filters", (section, kept) => {
    const sp = new URLSearchParams("predTournament=IPL&quizTournament=IPL&matchTournament=IPL&tournament=T");
    expect(query(buildAdminHomeHref(section, sp))).toEqual({ ...kept, section });
  });

  it.each([
    ["leaderboard", "leaderboardTab=coins"],
    ["shop", "shopTab=banners"],
    ["payments", "paymentsTab=assets"],
    ["unresolved", "unresolvedTab=quizzes&unresolvedGame=cricket&unresolvedStatus=open"],
    [
      "statoz_games",
      "gamesTab=knowledgeQuiz&kqTab=sets",
    ],
    ["contactus", "contactIssue=bug"],
    ["matches", "matchDate=2026-08-08"],
    ["statoz_games", "gamesTab=catalog"],
  ])("keeps %s's own tab params and drops them elsewhere", (section, params) => {
    const own = Object.fromEntries(new URLSearchParams(params));
    expect(query(buildAdminHomeHref(section, new URLSearchParams(params)))).toEqual({ ...own, section });
    expect(query(buildAdminHomeHref("dashboard", new URLSearchParams(params)))).toEqual({ section: "dashboard" });
  });

  it("doesn't modify the caller's params", () => {
    const sp = new URLSearchParams(DETAIL_NOISE);
    buildAdminHomeHref("events", sp);
    expect(sp.toString()).toBe(DETAIL_NOISE);
  });
});

describe("stripAdminHomeQueryNoise", () => {
  it("edits the params in place", () => {
    const sp = new URLSearchParams("id=1&shopTab=player&q=x");
    stripAdminHomeQueryNoise("shop", sp);
    expect(sp.toString()).toBe("shopTab=player&q=x");
  });
});

describe("buildDetailBackHref", () => {
  it("returns to the parent match with its tournament filter", () => {
    const sp = new URLSearchParams("matchId=m1&matchTournament=IPL&quizTournament=X");
    expect(buildDetailBackHref(FROM_MATCH_DETAIL, sp)).toBe("/match/m1?from=matches&matchTournament=IPL");
  });

  it("returns to the parent match without a tournament filter", () => {
    expect(buildDetailBackHref("match", new URLSearchParams("matchId=m1"))).toBe("/match/m1?from=matches");
  });

  it("encodes the parent match id", () => {
    expect(buildDetailBackHref("match", new URLSearchParams("matchId=a/b c"))).toBe("/match/a%2Fb%20c?from=matches");
  });

  it("falls back to the matches list when the parent match is unknown", () => {
    expect(query(buildDetailBackHref("match", new URLSearchParams("from=match")))).toEqual({ section: "matches" });
  });

  it("returns to the parent motorsport race", () => {
    expect(buildDetailBackHref(FROM_MOTORSPORT_DETAIL, new URLSearchParams("matchId=r9"))).toBe(
      "/motorsport/r9?from=matches&matchesTab=motorsport",
    );
  });

  it("falls back to the motorsport list when the race is unknown", () => {
    expect(query(buildDetailBackHref("motorsport", null))).toEqual({
      section: "matches",
      matchesTab: "motorsport",
    });
  });

  it("rewrites legacy knowledgequiz home links into Statoz Games", () => {
    expect(query(buildAdminHomeHref("knowledgequiz", null))).toEqual({
      section: "statoz_games",
      gamesTab: "knowledgeQuiz",
    });
  });

  it("rewrites legacy motorsportmatches home links into the matches tab", () => {
    expect(query(buildAdminHomeHref("motorsportmatches", null))).toEqual({
      section: "matches",
      matchesTab: "motorsport",
    });
  });

  it("rewrites legacy predictions home links into matches", () => {
    expect(
      query(
        buildAdminHomeHref(
          "predictions",
          new URLSearchParams("predTournament=IPL"),
        ),
      ),
    ).toEqual({ section: "matches", matchTournament: "IPL" });
  });

  it("rewrites legacy quizzes home links into matches", () => {
    expect(
      query(
        buildAdminHomeHref(
          "quizzes",
          new URLSearchParams("quizTournament=IPL"),
        ),
      ),
    ).toEqual({ section: "matches", matchTournament: "IPL" });
  });

  it("returns to an ordinary section's home", () => {
    expect(query(buildDetailBackHref("quizzes", new URLSearchParams("quizTournament=IPL&id=q1")))).toEqual({
      matchTournament: "IPL",
      section: "matches",
    });
  });

  it("goes home when there is no section", () => {
    expect(buildDetailBackHref(null, null)).toBe("/");
  });
});
