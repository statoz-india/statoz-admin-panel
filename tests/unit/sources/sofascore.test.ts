import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  indexedQuestions,
  lookupSofascoreMatch,
  parseSofascoreEventId,
  SofascoreLookupError,
  sofascoreMatchPageUrl,
  sofascoreSportFor,
  withSofascoreFallback,
  type SsEvent,
} from "@/app/api/utils/sofascore";
import type { MatchAnswersResult } from "@/app/interface/match-answers.interface";
import { ARSENAL, arsenalChelseaData, arsenalChelseaEvent, CHELSEA } from "../../fixtures/sofascore";
import { jsonResponse, mockFetch } from "../../helpers/http";
import { question } from "../../helpers/quiz";

const API = "https://www.sofascore.com/api/v1";

/** Sofascore's API: paths map to bodies, or to a status code. Anything else is a 404. */
function sofascoreApi(routes: Record<string, unknown>) {
  return mockFetch((url) => {
    const hit = routes[url.replace(API, "")];
    if (hit === undefined) return jsonResponse({ error: { code: 404 } }, 404);
    if (typeof hit === "number") return jsonResponse({}, hit);
    return jsonResponse(hit);
  });
}

describe("Sofascore helpers", () => {
  it.each([
    ["football", "football"],
    [" Cricket ", "cricket"],
    ["BASKETBALL", "basketball"],
    ["racing", null],
    ["", null],
    [null, null],
    [undefined, null],
  ])("sofascoreSportFor(%j) → %s", (gameType, sport) => {
    expect(sofascoreSportFor(gameType)).toBe(sport);
  });

  it.each([
    ["https://www.sofascore.com/football/match/arsenal-chelsea/RsR#id:12345678", 12345678],
    ["https://www.sofascore.com/football/match/arsenal-chelsea/RsR#tab:statistics,id:42", 42],
    ["https://www.sofascore.com/api/v1/event/789", 789],
    ["https://api.sofascore.com/api/v1/event/789/statistics", 789],
    ["https://www.sofascore.com/football/match/arsenal-chelsea/RsR", null],
    ["https://www.fotmob.com/match/1#id:1", null],
    ["nope", null],
  ])("parseSofascoreEventId(%j) → %s", (url, id) => {
    expect(parseSofascoreEventId(url)).toBe(id);
  });

  it("links the match page, or the API when there's no slug", () => {
    expect(sofascoreMatchPageUrl("football", arsenalChelseaEvent())).toBe(
      "https://www.sofascore.com/football/match/arsenal-chelsea/RsR#id:1",
    );
    expect(sofascoreMatchPageUrl("football", arsenalChelseaEvent({ slug: undefined }))).toBe(`${API}/event/1`);
  });

  it("turns a prediction's questions into quiz questions keyed by index", () => {
    expect(
      indexedQuestions([
        { questionText: "Who will win?", options: ["A", "B"] },
        { questionText: "  ", options: [] },
        { questionText: "Total goals?", options: ["0-2", "3+"] },
      ]),
    ).toEqual([
      { _id: "0", questionNumber: 1, questionText: "Who will win?", questionType: "MCQ", options: ["A", "B"], xp: 0, correctAnswer: "" },
      { _id: "2", questionNumber: 3, questionText: "Total goals?", questionType: "MCQ", options: ["0-2", "3+"], xp: 0, correctAnswer: "" },
    ]);
  });
});

describe("withSofascoreFallback", () => {
  const result = (source: MatchAnswersResult["source"], warnings: string[] = []) =>
    ({ source, warnings, proposals: [] }) as unknown as MatchAnswersResult;
  const blocked = (status: number) => new SofascoreLookupError("Sofascore denied access", [{ label: "Team", url: "u" }], status);

  it("returns Sofascore's result when it works", async () => {
    const fallback = vi.fn();
    await expect(withSofascoreFallback(async () => result("sofascore"), fallback, "")).resolves.toMatchObject({ source: "sofascore" });
    expect(fallback).not.toHaveBeenCalled();
  });

  it.each([
    [403, "cricbuzz", "Cricbuzz"],
    [429, "fotmob", "FotMob"],
  ] as const)("falls back when Sofascore answers %d", async (status, source, name) => {
    const out = await withSofascoreFallback(
      async () => {
        throw blocked(status);
      },
      async () => result(source, ["Teams matched on partial names"]),
      "",
    );
    expect(out.source).toBe(source);
    expect(out.warnings).toEqual([`Sofascore was unavailable (${status}). Fetched from ${name} instead.`, "Teams matched on partial names"]);
  });

  it.each([
    ["a pasted Sofascore URL", blocked(403), "https://www.sofascore.com/x#id:1"],
    ["another status", blocked(500), ""],
    ["a non-lookup error", new Error("boom"), ""],
  ])("doesn't fall back for %s", async (_, error, url) => {
    const fallback = vi.fn();
    await expect(
      withSofascoreFallback(
        async () => {
          throw error;
        },
        fallback,
        url,
      ),
    ).rejects.toBe(error);
    expect(fallback).not.toHaveBeenCalled();
  });

  it("rethrows when there is no fallback", async () => {
    const error = blocked(403);
    await expect(
      withSofascoreFallback(async () => {
        throw error;
      }, undefined, ""),
    ).rejects.toBe(error);
  });

  it("reports both failures, keeping Sofascore's pages and status", async () => {
    const error = await withSofascoreFallback(
      async () => {
        throw blocked(403);
      },
      async () => {
        throw new Error("Cricbuzz returned 503");
      },
      "",
    ).catch((e) => e);
    expect(error).toBeInstanceOf(SofascoreLookupError);
    expect(error).toMatchObject({
      message: "Sofascore denied access The alternative source also failed: Cricbuzz returned 503",
      status: 403,
      sourceUrls: [{ label: "Team", url: "u" }],
    });
  });
});

describe("lookupSofascoreMatch", () => {
  const REQUEST = {
    gameType: "football",
    teamA: { name: "Arsenal" },
    teamB: { name: "Chelsea" },
    matchStartTime: "2026-08-08T14:00:00Z",
  };
  const MATCH_URL = "https://www.sofascore.com/football/match/arsenal-chelsea/RsR#id:1";
  const data = arsenalChelseaData();

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-15T00:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("finds the match from a team's recent events and answers the questions", async () => {
    const fetchMock = sofascoreApi({
      "/search/teams?q=Arsenal&page=0": {
        results: [
          { type: "team", entity: { ...ARSENAL } },
          // Weaker name match: dropped while a better one exists.
          { type: "team", entity: { id: 99, name: "Arsenal Women", sport: { slug: "football" } } },
          { type: "team", entity: { id: 98, name: "Arsenal", sport: { slug: "basketball" } } },
        ],
      },
      "/team/10/events/last/0": { events: [arsenalChelseaEvent({ id: 7, startTimestamp: Date.parse("2026-01-01T00:00:00Z") / 1000 }), arsenalChelseaEvent()] },
      "/event/1": { event: arsenalChelseaEvent() },
      "/event/1/statistics": { statistics: data.statistics },
      "/event/1/incidents": { incidents: data.incidents },
      "/event/1/best-players/summary": { playerOfTheMatch: { player: { id: 1, name: "Bukayo Saka" }, value: "8.5" } },
    });

    const result = await lookupSofascoreMatch(
      { ...REQUEST, questions: [question("Which team will win the match?", ["Arsenal", "Chelsea", "Draw"])] },
      "",
    );

    expect(result).toMatchObject({
      source: "sofascore",
      match: {
        externalMatchId: 1,
        title: "Arsenal vs Chelsea",
        subtitle: "Premier League · Round 4",
        state: "Ended",
        status: "Arsenal 2 - 1 Chelsea",
        startTime: "2026-08-08T14:00:00.000Z",
        isComplete: true,
      },
      sourceUrls: [
        { label: "Team: Arsenal", url: "https://www.sofascore.com/team/football/arsenal/10" },
        { label: "Match", url: MATCH_URL },
      ],
      matchedBy: "auto",
      suggestedStatus: "result",
      warnings: [],
      proposals: [{ questionKey: "q1", answer: "Arsenal", optionIndex: 0 }],
    });
    // Lineups answered 404, which the lookup treats as "not available" rather than failing.
    expect(fetchMock.mock.calls.map(([url]) => String(url).replace(API, ""))).toContain("/event/1/lineups");
  });

  it("reads a pasted match URL without searching, and skips details when there are no questions", async () => {
    const fetchMock = sofascoreApi({ "/event/1": { event: arsenalChelseaEvent() } });

    const result = await lookupSofascoreMatch(REQUEST, MATCH_URL);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ matchedBy: "url", proposals: [] });
  });

  it("warns that a live match's answers can change", async () => {
    const live = arsenalChelseaEvent({ status: { code: 7, description: "2nd half", type: "inprogress" } });
    sofascoreApi({ "/event/1": { event: live }, "/event/1/incidents": { incidents: [] } });

    const result = await lookupSofascoreMatch({ ...REQUEST, questions: [question("x", [])] }, MATCH_URL);

    expect(result.suggestedStatus).toBe("live");
    expect(result.warnings).toEqual(['Sofascore shows this match as "2nd half" — answers can still change.']);
  });

  it.each([
    [{ status: { code: 0, description: "Not started", type: "notstarted" } }, "upcoming"],
    [{ status: { code: 60, description: "Postponed", type: "postponed" } }, "postponed"],
    [{ status: { code: 70, description: "Canceled", type: "canceled" } }, "canceled"],
    [{ status: { code: 100, description: "Ended", type: "finished" }, note: "Abandoned due to rain" }, "abandoned"],
    [{ status: { code: 100, description: "No result", type: "finished" } }, "no_result"],
  ])("suggests a status for %j", async (overrides, suggested) => {
    sofascoreApi({ "/event/1": { event: arsenalChelseaEvent(overrides as Partial<SsEvent>) } });
    expect((await lookupSofascoreMatch(REQUEST, MATCH_URL)).suggestedStatus).toBe(suggested);
  });

  it("flags a pasted match between other teams", async () => {
    sofascoreApi({ "/event/1": { event: arsenalChelseaEvent() } });
    const result = await lookupSofascoreMatch({ ...REQUEST, teamA: { name: "Liverpool" }, teamB: { name: "Everton" } }, MATCH_URL);
    expect(result.warnings).toEqual(["The Sofascore match is Arsenal vs Chelsea, which doesn't look like Liverpool vs Everton."]);
  });

  it("shows penalties in the score line", async () => {
    const event = arsenalChelseaEvent({ homeScore: { display: 1, penalties: 4 }, awayScore: { display: 1, penalties: 3 } });
    sofascoreApi({ "/event/1": { event } });
    expect((await lookupSofascoreMatch(REQUEST, MATCH_URL)).match.status).toBe("Arsenal 1 - 1 Chelsea (pens 4-3)");
  });

  describe("failures", () => {
    const failure = (request: typeof REQUEST, url: string) =>
      lookupSofascoreMatch(request, url).then(
        () => {
          throw new Error("Expected the lookup to fail");
        },
        (e: SofascoreLookupError) => e,
      );

    it("only handles cricket, football and basketball", async () => {
      const error = await failure({ ...REQUEST, gameType: "racing" }, "");
      expect(error).toBeInstanceOf(SofascoreLookupError);
      expect(error.message).toBe("Sofascore lookup is available for cricket, football and basketball (this is racing).");
    });

    it("rejects a URL without the event id", async () => {
      expect((await failure(REQUEST, "https://www.sofascore.com/football/match/arsenal-chelsea/RsR")).message).toMatch(
        /^That isn't a Sofascore match URL/,
      );
    });

    it("passes a 403 on with its status for the fallback", async () => {
      sofascoreApi({ "/event/1": 403 });
      const error = await failure(REQUEST, MATCH_URL);
      expect(error.status).toBe(403);
      expect(error.message).toMatch(/^Sofascore denied access \(403\)/);
    });

    it("explains an unreachable Sofascore", async () => {
      mockFetch(() => {
        throw new TypeError("Failed to fetch");
      });
      expect((await failure(REQUEST, MATCH_URL)).message).toMatch(/^Couldn't reach Sofascore from this browser/);
    });

    it("explains an unreadable event", async () => {
      sofascoreApi({ "/event/1": { event: { id: 1 } } });
      expect((await failure(REQUEST, MATCH_URL)).message).toBe(
        "Couldn't read the match from Sofascore — its data format may have changed.",
      );
    });

    it("refuses a match from another sport", async () => {
      const event = arsenalChelseaEvent({ tournament: { name: "NBA", category: { sport: { slug: "basketball" } } } });
      sofascoreApi({ "/event/1": { event } });
      const error = await failure(REQUEST, MATCH_URL);
      expect(error.message).toBe("That Sofascore match is basketball, but this is football.");
      expect(error.sourceUrls).toEqual([{ label: "Match", url: MATCH_URL }]);
    });

    it("explains when neither team is on Sofascore", async () => {
      sofascoreApi({ "/search/teams?q=Arsenal&page=0": { results: [] }, "/search/teams?q=Chelsea&page=0": { results: [] } });
      expect((await failure(REQUEST, "")).message).toBe(
        'Sofascore has no football team matching "Arsenal" or "Chelsea". Paste the Sofascore match URL to use a match directly.',
      );
    });

    it("explains when the teams' fixtures don't include the match", async () => {
      sofascoreApi({
        "/search/teams?q=Arsenal&page=0": { results: [{ entity: ARSENAL }] },
        "/search/teams?q=Chelsea&page=0": { results: [{ entity: CHELSEA }] },
        "/team/10/events/last/0": { events: [] },
        "/team/20/events/last/0": { events: [] },
      });
      const error = await failure(REQUEST, "");
      expect(error.message).toBe(
        "Couldn't find Arsenal vs Chelsea (within 36h of the match start) in Arsenal / Chelsea's recent and upcoming matches on Sofascore. Paste the Sofascore match URL to use it directly.",
      );
      expect(error.sourceUrls.map((u) => u.label)).toEqual(["Team: Arsenal", "Team: Chelsea"]);
    });
  });
});
