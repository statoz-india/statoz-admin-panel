import { describe, expect, it } from "vitest";
import { espnSummaryUrl, fetchEspnSummary } from "@/app/api/utils/espn";
import {
  fetchFotmobMatchDetails,
  fetchFotmobMatchesForDate,
  findFotmobMatchForQuiz,
  fotmobDateKey,
  fotmobDatePageUrl,
  fotmobMatchPageUrl,
  fotmobNearMisses,
  parseFotmobMatchId,
  type FmListMatch,
} from "@/app/api/utils/fotmob";
import { leedsNewcastle } from "../../fixtures/fotmob-match";
import { fetchCall, jsonResponse, mockFetch } from "../../helpers/http";

const listed = (id: number, home: string, away: string, leagueName = "Premier League"): FmListMatch => ({
  id,
  leagueName,
  home: { id: id * 10, name: home },
  away: { id: id * 10 + 1, name: away },
  status: { utcTime: "2026-08-08T14:00:00.000Z" },
});

describe("FotMob", () => {
  it("keys dates in IST", () => {
    expect(fotmobDateKey(Date.parse("2026-08-08T20:30:00Z"))).toBe("20260809");
    expect(fotmobDateKey(Date.parse("2026-08-08T10:00:00Z"))).toBe("20260808");
  });

  it("builds page URLs", () => {
    expect(fotmobDatePageUrl("20260808")).toBe("https://www.fotmob.com/?date=20260808");
    expect(fotmobMatchPageUrl(5795450)).toBe("https://www.fotmob.com/match/5795450");
  });

  it.each([
    ["https://www.fotmob.com/match/5795450", 5795450],
    ["https://www.fotmob.com/match/5795450/matchfacts/leeds-vs-newcastle", 5795450],
    ["https://www.fotmob.com/matches/leeds-united-vs-newcastle-united/2tq3x#5795450", 5795450],
    ["https://www.fotmob.com/api/data/matchDetails?matchId=123", 123],
    ["https://fotmob.com/match/7", 7],
    ["https://www.fotmob.com/matchDetails?matchId=abc", null],
    ["https://www.fotmob.com/teams/9879/overview/leeds", null],
    ["https://www.fotmob.co/match/1", null],
    ["not a url", null],
  ])("parseFotmobMatchId(%j) → %s", (url, id) => {
    expect(parseFotmobMatchId(url)).toBe(id);
  });

  it("lists a day's matches with their league", async () => {
    const fetchMock = mockFetch([
      jsonResponse({
        leagues: [
          { name: "Premier League", matches: [{ id: 1, home: { id: 1, name: "A" }, away: { id: 2, name: "B" }, status: { utcTime: "x" } }] },
          { name: "Empty league" },
        ],
      }),
    ]);

    const matches = await fetchFotmobMatchesForDate("20260808");

    expect(fetchCall(fetchMock).url).toBe("https://www.fotmob.com/api/data/matches?date=20260808&timezone=Asia%2FKolkata");
    expect(matches).toEqual([{ id: 1, home: { id: 1, name: "A" }, away: { id: 2, name: "B" }, status: { utcTime: "x" }, leagueName: "Premier League" }]);
  });

  it("copes with a day without leagues", async () => {
    mockFetch([jsonResponse({})]);
    expect(await fetchFotmobMatchesForDate("20260808")).toEqual([]);
  });

  it("fetches match details", async () => {
    const fetchMock = mockFetch([jsonResponse(leedsNewcastle())]);
    expect((await fetchFotmobMatchDetails(5795450)).general.matchId).toBe("5795450");
    expect(fetchCall(fetchMock).url).toBe("https://www.fotmob.com/api/data/matchDetails?matchId=5795450");
  });

  it("explains unreadable match details", async () => {
    mockFetch([jsonResponse({ header: { teams: [] }, content: {} })]);
    await expect(fetchFotmobMatchDetails(1)).rejects.toThrow(
      "Couldn't read match details from FotMob — the data format may have changed.",
    );
  });

  it("throws on an error status", async () => {
    mockFetch([jsonResponse({}, 404)]);
    await expect(fetchFotmobMatchDetails(1)).rejects.toThrow(
      "FotMob returned 404 for https://www.fotmob.com/api/data/matchDetails?matchId=1",
    );
  });

  it("finds the quiz's match in a day's list regardless of time", () => {
    const quiz = { teamA: { name: "Newcastle United" }, teamB: { name: "Leeds United" }, matchStartTime: "2026-01-01T00:00:00Z" };
    const found = findFotmobMatchForQuiz([listed(1, "Arsenal", "Chelsea"), listed(2, "Leeds United", "Newcastle United")], quiz);
    expect(found?.id).toBe(2);
  });

  it("suggests listed matches with one of the quiz's teams", () => {
    const quiz = { teamA: { name: "Leeds United" }, teamB: { name: "Newcastle United" } };
    const near = fotmobNearMisses(
      [
        listed(1, "Leeds United", "Everton"),
        listed(1, "Leeds United", "Everton"),
        listed(2, "Newcastle Jets", "Sydney FC", "A-League"),
        listed(3, "Arsenal", "Chelsea"),
      ],
      quiz,
    );
    expect(near.map((m) => m.id)).toEqual([1]);
  });
});

describe("ESPN", () => {
  it("builds summary URLs", () => {
    expect(espnSummaryUrl("soccer/eng.1", "401 873")).toBe(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=401%20873",
    );
  });

  it("fetches a summary", async () => {
    const summary = { header: { id: "1", competitions: [{ id: "1", date: "", competitors: [], status: {} }] } };
    const fetchMock = mockFetch([jsonResponse(summary)]);
    expect(await fetchEspnSummary("soccer/eng.1", "1")).toEqual(summary);
    expect(fetchCall(fetchMock).headers.Accept).toContain("application/json");
  });

  it("throws on an error status", async () => {
    mockFetch([jsonResponse({}, 404)]);
    await expect(fetchEspnSummary("soccer/eng.1", "1")).rejects.toThrow(
      "ESPN returned 404 for https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=1",
    );
  });

  it("throws when there is no match data", async () => {
    mockFetch([jsonResponse({ header: { competitions: [] } })]);
    await expect(fetchEspnSummary("cricket/1", "77")).rejects.toThrow("ESPN has no match data for event 77");
  });
});
