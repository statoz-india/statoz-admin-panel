import { describe, expect, it } from "vitest";
import {
  CRICBUZZ_RECENT_MATCHES_URL,
  cricbuzzScorecardUrl,
  fetchCricbuzzScorecard,
  fetchRecentCricbuzzMatches,
  findCricbuzzMatchForQuiz,
  parseCricbuzzMatchId,
} from "@/app/api/utils/cricbuzz";
import { t20Scorecard } from "../../fixtures/cricbuzz-scorecard";
import { ENGLAND_SA_INFO, INDIA_AUSTRALIA_INFO, recentMatchesPage, scorecardPage } from "../../helpers/cricbuzz-pages";
import { fetchCall, mockFetch, textResponse } from "../../helpers/http";

describe("Cricbuzz URLs", () => {
  it("builds scorecard URLs", () => {
    expect(cricbuzzScorecardUrl(9001)).toBe("https://www.cricbuzz.com/live-cricket-scorecard/9001");
    expect(cricbuzzScorecardUrl(9001, "ind-vs-aus")).toBe("https://www.cricbuzz.com/live-cricket-scorecard/9001/ind-vs-aus");
  });

  it.each([
    ["https://www.cricbuzz.com/live-cricket-scores/12345/ind-vs-aus-1st-t20i", 12345],
    ["https://www.cricbuzz.com/live-cricket-scorecard/999", 999],
    ["https://m.cricbuzz.com/cricket-match-squads/77/x", 77],
    ["  https://cricbuzz.com/live-cricket-scores/5/  ", 5],
    ["https://www.cricbuzz.com/", null],
    ["https://notcricbuzz.com/live-cricket-scores/1/x", null],
    ["https://cricbuzz.com.evil.test/live-cricket-scores/1/x", null],
    ["cricbuzz 12345", null],
    ["", null],
  ])("parseCricbuzzMatchId(%j) → %s", (url, id) => {
    expect(parseCricbuzzMatchId(url)).toBe(id);
  });
});

describe("fetchRecentCricbuzzMatches", () => {
  it("reads every listed match from the page's flight data", async () => {
    const fetchMock = mockFetch([textResponse(recentMatchesPage())]);

    const matches = await fetchRecentCricbuzzMatches();

    expect(fetchCall(fetchMock).url).toBe(CRICBUZZ_RECENT_MATCHES_URL);
    expect(fetchCall(fetchMock).headers["User-Agent"]).toMatch(/Mozilla/);
    expect(matches).toEqual([
      { ...INDIA_AUSTRALIA_INFO, slug: "ind-vs-aus" },
      { ...ENGLAND_SA_INFO, slug: "eng-vs-rsa" },
    ]);
  });

  it("returns nothing for a page without match data", async () => {
    mockFetch([textResponse("<html><body>Maintenance</body></html>")]);
    expect(await fetchRecentCricbuzzMatches()).toEqual([]);
  });

  it("throws on an error status", async () => {
    mockFetch([textResponse("blocked", 403)]);
    await expect(fetchRecentCricbuzzMatches()).rejects.toThrow(`Cricbuzz returned 403 for ${CRICBUZZ_RECENT_MATCHES_URL}`);
  });
});

describe("fetchCricbuzzScorecard", () => {
  it("picks this match's scorecard off the page", async () => {
    const scorecard = t20Scorecard();
    const fetchMock = mockFetch([textResponse(scorecardPage(scorecard))]);

    await expect(fetchCricbuzzScorecard(9001, "ind-vs-aus")).resolves.toEqual(scorecard);
    expect(fetchCall(fetchMock).url).toBe("https://www.cricbuzz.com/live-cricket-scorecard/9001/ind-vs-aus");
  });

  it("treats a missing innings list as empty", async () => {
    const scorecard = t20Scorecard();
    const page = scorecardPage({ ...scorecard, scoreCard: null as unknown as [] });
    mockFetch([textResponse(page)]);
    expect((await fetchCricbuzzScorecard(9001)).scoreCard).toEqual([]);
  });

  it("explains when the page layout has changed", async () => {
    mockFetch([textResponse(scorecardPage(t20Scorecard()))]);
    await expect(fetchCricbuzzScorecard(4242)).rejects.toThrow(
      "Couldn't read scorecard data from the Cricbuzz page — its layout may have changed.",
    );
  });
});

describe("findCricbuzzMatchForQuiz", () => {
  const matches = [ENGLAND_SA_INFO, INDIA_AUSTRALIA_INFO];

  it("finds the quiz's match, either way round", () => {
    const quiz = { teamA: { name: "Australia" }, teamB: { name: "India" }, matchStartTime: "2026-08-08T14:00:00Z" };
    expect(findCricbuzzMatchForQuiz(matches, quiz)?.matchId).toBe(9001);
  });

  it("ignores a match far from the quiz's start", () => {
    const quiz = { teamA: { name: "India" }, teamB: { name: "Australia" }, matchStartTime: "2026-08-12T14:00:00Z" };
    expect(findCricbuzzMatchForQuiz(matches, quiz)).toBeNull();
  });
});
