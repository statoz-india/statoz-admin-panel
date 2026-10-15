import { describe, expect, it } from "vitest";
import type { EspnCompetitor, EspnStatusType } from "@/app/api/utils/espn";
import type { FmListMatch, FmMatchDetails } from "@/app/api/utils/fotmob";
import { MatchAnswersError } from "@/app/api/utils/match-answers-route";
import {
  answerEspnQuestions,
  cricbuzzAnswersWarning,
  fotmobAnswersWarning,
  lookupCricbuzzMatch,
  lookupEspnMatch,
  lookupFotmobMatch,
} from "@/app/api/utils/match-source-lookup";
import type { MatchAnswerSourceUrl } from "@/app/interface/match-answers.interface";
import { t20Scorecard } from "../../fixtures/cricbuzz-scorecard";
import { leedsNewcastle } from "../../fixtures/fotmob-match";
import { recentMatchesPage, scorecardPage } from "../../helpers/cricbuzz-pages";
import { jsonResponse, mockFetch, textResponse } from "../../helpers/http";
import { question, questions } from "../../helpers/quiz";

describe("answer warnings", () => {
  it("cricbuzz: only a finished match is final", () => {
    const header = t20Scorecard().matchHeader;
    expect(cricbuzzAnswersWarning(header)).toBeNull();
    expect(cricbuzzAnswersWarning({ ...header, complete: false, state: "Innings Break", status: "India need 186 runs" })).toBe(
      'Cricbuzz shows this match as "Innings Break" (India need 186 runs) — answers can still change.',
    );
  });

  it.each([
    [{ cancelled: true, started: false, finished: false }, "FotMob lists this match as cancelled."],
    [{ cancelled: false, started: false, finished: false }, "The match hasn't started on FotMob yet, so nothing can be answered."],
    [{ cancelled: false, started: true, finished: false, scoreStr: "1 - 0" }, "The match is still in progress on FotMob (1 - 0) — answers can still change."],
    [{ cancelled: false, started: true, finished: false }, "The match is still in progress on FotMob (live) — answers can still change."],
    [{ cancelled: false, started: true, finished: true }, null],
  ])("fotmob %j → %s", (status, warning) => {
    expect(fotmobAnswersWarning({ utcTime: "", ...status })).toBe(warning);
  });
});

describe("lookupCricbuzzMatch", () => {
  const TARGET = { teamA: { name: "India" }, teamB: { name: "Australia" }, matchStartTime: "2026-08-08T14:00:00Z" };

  function cricbuzzSite(scorecard = t20Scorecard()) {
    return mockFetch((url) =>
      url.includes("/recent-matches") ? textResponse(recentMatchesPage()) : textResponse(scorecardPage(scorecard)),
    );
  }

  it("finds the match on the recent-matches page", async () => {
    cricbuzzSite();
    const sourceUrls: MatchAnswerSourceUrl[] = [];

    const { lookup, scorecard } = await lookupCricbuzzMatch(TARGET, "", sourceUrls);

    expect(scorecard.matchHeader.matchId).toBe(9001);
    expect(lookup).toEqual({
      source: "cricbuzz",
      match: {
        externalMatchId: 9001,
        title: "India vs Australia",
        subtitle: "1st T20I · Australia tour of India, 2026",
        state: "Complete",
        status: "India won by 6 wkts",
        startTime: "2026-08-08T14:00:00.000Z",
        isComplete: true,
      },
      sourceUrls: [
        { label: "Recent matches", url: "https://www.cricbuzz.com/cricket-match/live-scores/recent-matches" },
        { label: "Scorecard", url: "https://www.cricbuzz.com/live-cricket-scorecard/9001/ind-vs-aus" },
      ],
      matchedBy: "auto",
      suggestedStatus: "result",
      warnings: [],
    });
  });

  it("goes straight to a pasted match URL", async () => {
    const fetchMock = cricbuzzSite();
    const { lookup } = await lookupCricbuzzMatch(TARGET, "https://www.cricbuzz.com/live-cricket-scores/9001/x", []);
    expect(lookup.matchedBy).toBe("url");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("warns when the pasted match is a different one", async () => {
    cricbuzzSite();
    const { lookup } = await lookupCricbuzzMatch(
      { teamA: { name: "England" }, teamB: { name: "South Africa" } },
      "https://www.cricbuzz.com/live-cricket-scores/9001/x",
      [],
    );
    expect(lookup.warnings).toEqual(["The Cricbuzz match is India vs Australia, which doesn't look like England vs South Africa."]);
  });

  it("rejects a URL from another site", async () => {
    const error = await lookupCricbuzzMatch(TARGET, "https://www.espn.in/cricket/x", []).catch((e) => e);
    expect(error).toBeInstanceOf(MatchAnswersError);
    expect(error.status).toBe(400);
  });

  it("explains when the match isn't on the recent list, keeping the pages read", async () => {
    cricbuzzSite();
    const sourceUrls: MatchAnswerSourceUrl[] = [];
    const error = await lookupCricbuzzMatch({ ...TARGET, teamB: { name: "Pakistan" } }, "", sourceUrls).catch((e) => e);
    expect(error).toBeInstanceOf(MatchAnswersError);
    expect(error).toMatchObject({
      status: 404,
      message:
        "Couldn't find India vs Pakistan (within 36h of the match start) on Cricbuzz's recent matches. Paste the Cricbuzz match URL to use it directly.",
    });
    expect(sourceUrls.map((u) => u.label)).toEqual(["Recent matches"]);
  });

  it.each([
    [{ state: "Preview", complete: false }, "upcoming"],
    [{ state: "Toss", complete: false }, "upcoming"],
    [{ state: "In Progress", complete: false }, "live"],
    [{ state: "Innings Break", complete: false }, "live"],
    [{ state: "Abandon", complete: false }, "abandoned"],
    [{ state: "Cancelled", complete: false }, "canceled"],
    [{ state: "Postponed", complete: false }, "postponed"],
    [{ state: "Complete", complete: true, status: "Match tied (No result)" }, "no_result"],
  ])("suggests a status for %j", async (header, status) => {
    const scorecard = t20Scorecard();
    Object.assign(scorecard.matchHeader, header);
    cricbuzzSite(scorecard);
    const { lookup } = await lookupCricbuzzMatch(TARGET, "https://www.cricbuzz.com/live-cricket-scores/9001/x", []);
    expect(lookup.suggestedStatus).toBe(status);
  });
});

describe("lookupFotmobMatch", () => {
  const TARGET = {
    teamA: { name: "Leeds United" },
    teamB: { name: "Newcastle United" },
    matchStartTime: "2026-08-08T14:00:00Z",
  };
  const LEEDS_NEWCASTLE: FmListMatch = {
    id: 5795450,
    leagueName: "Premier League",
    home: { id: 10, name: "Leeds United" },
    away: { id: 20, name: "Newcastle United" },
    status: { utcTime: "2026-08-07T19:00:00.000Z" },
  };
  const LEEDS_EVERTON: FmListMatch = { ...LEEDS_NEWCASTLE, id: 1, away: { id: 30, name: "Everton" } };

  function fotmobSite(days: Record<string, FmListMatch[]>, details: FmMatchDetails = leedsNewcastle()) {
    return mockFetch((url) => {
      if (url.includes("/matchDetails")) return jsonResponse(details);
      const date = new URL(url).searchParams.get("date")!;
      return jsonResponse({ leagues: [{ name: "Premier League", matches: days[date] ?? [] }] });
    });
  }

  it("searches the match day, then the day before", async () => {
    fotmobSite({ "20260808": [LEEDS_EVERTON], "20260807": [LEEDS_NEWCASTLE] });
    const sourceUrls: MatchAnswerSourceUrl[] = [];

    const { lookup, details } = await lookupFotmobMatch(TARGET, "", sourceUrls);

    expect(details.general.matchId).toBe("5795450");
    expect(sourceUrls).toEqual([
      { label: "Matches on 8 Aug 2026", url: "https://www.fotmob.com/?date=20260808" },
      { label: "Matches on 7 Aug 2026", url: "https://www.fotmob.com/?date=20260807" },
      { label: "Match", url: "https://www.fotmob.com/match/5795450" },
    ]);
    expect(lookup).toMatchObject({
      source: "fotmob",
      match: {
        externalMatchId: 5795450,
        title: "Leeds United vs Newcastle United",
        subtitle: "Premier League · Round 4",
        state: "Full-Time",
        status: "Leeds United 4 - 1 Newcastle United",
        startTime: "2026-08-08T14:00:00.000Z",
        isComplete: true,
      },
      matchedBy: "auto",
      suggestedStatus: "result",
      warnings: [],
    });
  });

  it("names nearby matches when the pair isn't listed", async () => {
    fotmobSite({ "20260807": [LEEDS_EVERTON], "20260808": [LEEDS_EVERTON], "20260809": [LEEDS_EVERTON] });
    await expect(lookupFotmobMatch(TARGET, "", [])).rejects.toThrow(
      "Leeds United vs Newcastle United isn't in FotMob's match list for 8 Aug 2026 (or the day before or after). Matches there with one of these teams: Leeds United vs Everton (Premier League). If one of them is this match, paste its FotMob URL.",
    );
  });

  it("says when FotMob doesn't seem to cover the competition", async () => {
    fotmobSite({});
    const error = await lookupFotmobMatch(TARGET, "", []).catch((e) => e);
    expect(error.status).toBe(404);
    expect(error.message).toContain("neither team plays in any match listed there");
  });

  it("needs a start time to search by", async () => {
    await expect(lookupFotmobMatch({ ...TARGET, matchStartTime: undefined }, "", [])).rejects.toThrow(
      "There's no match start time to look the match up by. Paste the FotMob match URL instead.",
    );
  });

  it("rejects a URL from another site", async () => {
    await expect(lookupFotmobMatch(TARGET, "https://www.sofascore.com/x", [])).rejects.toBeInstanceOf(MatchAnswersError);
  });

  it("goes straight to a pasted match URL", async () => {
    const fetchMock = fotmobSite({});
    const { lookup } = await lookupFotmobMatch(TARGET, "https://www.fotmob.com/match/5795450", []);
    expect(lookup.matchedBy).toBe("url");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    [{ reason: { long: "Postponed" }, started: false, finished: false }, "postponed", "Postponed"],
    [{ reason: { short: "Abandoned" }, started: true, finished: false }, "abandoned", "Live"],
    [{ cancelled: true, started: false, finished: false }, "canceled", "Not started"],
    [{ started: true, finished: false }, "live", "Live"],
    [{ started: false, finished: false }, "upcoming", "Not started"],
  ])("suggests a status for %j", async (status, suggested, state) => {
    const details = leedsNewcastle();
    details.header.status = { utcTime: "2026-08-08T14:00:00.000Z", cancelled: false, ...status } as FmMatchDetails["header"]["status"];
    fotmobSite({}, details);
    const { lookup } = await lookupFotmobMatch(TARGET, "https://www.fotmob.com/match/5795450", []);
    expect(lookup.suggestedStatus).toBe(suggested);
    expect(lookup.match.state).toBe(state);
  });

  it("formats a numeric round", async () => {
    const details = leedsNewcastle();
    details.general.leagueRoundName = "12";
    fotmobSite({}, details);
    const { lookup } = await lookupFotmobMatch(TARGET, "https://www.fotmob.com/match/5795450", []);
    expect(lookup.match.subtitle).toBe("Premier League · Round 12");
  });
});

const competitor = (side: "home" | "away", name: string, score: string, winner?: boolean | string): EspnCompetitor => ({
  id: side,
  homeAway: side,
  score,
  winner: winner as boolean,
  team: { id: name, displayName: name, abbreviation: name.slice(0, 3).toUpperCase() },
});

const FULL_TIME: EspnStatusType = {
  id: "28",
  name: "STATUS_FULL_TIME",
  state: "post",
  completed: true,
  description: "Full Time",
  detail: "FT",
  shortDetail: "FT",
};

function espnSummary(status: Partial<EspnStatusType> = {}, competitors = [competitor("home", "Arsenal", "2", true), competitor("away", "Chelsea", "1", false)]) {
  return {
    header: {
      id: "401873742",
      season: { name: "2026-27 English Premier League" },
      competitions: [{ id: "401873742", date: "2026-08-08T14:00Z", competitors, status: { type: { ...FULL_TIME, ...status } } }],
    },
  };
}

describe("lookupEspnMatch", () => {
  const TARGET = { gameType: "football", espnLeagueName: "soccer/eng.1", espnEventId: "401873742" };

  it("reads the match's own summary", async () => {
    const fetchMock = mockFetch([jsonResponse(espnSummary())]);
    const sourceUrls: MatchAnswerSourceUrl[] = [];

    const { lookup, home, away } = await lookupEspnMatch(TARGET, "", sourceUrls);

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=401873742",
    );
    expect([home.team.displayName, away.team.displayName]).toEqual(["Arsenal", "Chelsea"]);
    expect(lookup).toEqual({
      source: "espn",
      match: {
        externalMatchId: 401873742,
        title: "Arsenal vs Chelsea",
        subtitle: "2026-27 English Premier League",
        state: "Full Time",
        status: "Arsenal 2 - 1 Chelsea",
        startTime: "2026-08-08T14:00Z",
        isComplete: true,
      },
      sourceUrls,
      matchedBy: "auto",
      suggestedStatus: "result",
      warnings: [],
    });
  });

  it("takes the event id from a pasted URL", async () => {
    const fetchMock = mockFetch([jsonResponse(espnSummary())]);
    const { lookup } = await lookupEspnMatch(TARGET, "https://www.espn.in/football/match/_/gameId/555/arsenal-chelsea", []);
    expect(String(fetchMock.mock.calls[0][0])).toContain("event=555");
    expect(lookup.matchedBy).toBe("url");
  });

  it("needs an event id", async () => {
    await expect(lookupEspnMatch({ ...TARGET, espnEventId: null }, "", [])).rejects.toThrow(
      "This match has no ESPN event id saved yet. Paste an ESPN match URL to use instead.",
    );
    await expect(lookupEspnMatch({ ...TARGET, espnEventId: " " }, "https://www.espn.in/football/team/_/id/359", [])).rejects.toThrow(
      "That doesn't look like an ESPN match URL",
    );
  });

  it("tries the sport's leagues in turn for a bare league code", async () => {
    const fetchMock = mockFetch((url) => (url.includes("/basketball/wnba/") ? jsonResponse(espnSummary()) : jsonResponse({}, 404)));
    const sourceUrls: MatchAnswerSourceUrl[] = [];

    await lookupEspnMatch({ gameType: "Basketball", espnLeagueName: "NBA", espnEventId: "1" }, "", sourceUrls);

    expect(fetchMock.mock.calls.map(([url]) => String(url).split("/sports/")[1].split("/summary")[0])).toEqual([
      "basketball/nba",
      "basketball/wnba",
    ]);
    expect(sourceUrls).toHaveLength(2);
  });

  it("explains when no candidate league has the event", async () => {
    mockFetch(() => jsonResponse({}, 404));
    const error = await lookupEspnMatch({ gameType: "football", espnLeagueName: "soccer/esp.1", espnEventId: "1" }, "", []).catch((e) => e);
    expect(error).toBeInstanceOf(MatchAnswersError);
    expect(error).toMatchObject({ status: 404, message: "Couldn't find event 1 on ESPN under any of: soccer/esp.1, soccer/eng.1." });
  });

  it("has no league to guess for cricket", async () => {
    await expect(lookupEspnMatch({ gameType: "cricket", espnEventId: "1" }, "", [])).rejects.toThrow(
      'This match has no usable ESPN league saved (espnLeagueName: none), and there\'s no fallback league for "cricket" on ESPN.',
    );
  });

  it("explains a summary missing a team", async () => {
    mockFetch([jsonResponse(espnSummary({}, [competitor("home", "Arsenal", "2", true)]))]);
    await expect(lookupEspnMatch(TARGET, "", [])).rejects.toThrow("ESPN's data for event 401873742 is missing a team.");
  });

  it.each([
    [{ state: "in", completed: false, name: "STATUS_SECOND_HALF", description: "Second Half" }, "live", false],
    [{ state: "pre", completed: false, name: "STATUS_SCHEDULED", description: "Scheduled" }, "upcoming", false],
    [{ name: "STATUS_POSTPONED", description: "Postponed" }, "postponed", true],
    [{ name: "STATUS_ABANDONED", description: "Abandoned" }, "abandoned", true],
    [{ name: "STATUS_CANCELED", description: "Canceled" }, "canceled", true],
    [{ name: "STATUS_FINAL", description: "Result", detail: "No result" }, "no_result", true],
    // Cricket leaves `completed` out: "post" alone means finished.
    [{ name: "STATUS_FINAL", description: "Result", completed: undefined }, "result", true],
  ])("maps status %j → %s", async (status, suggested, complete) => {
    mockFetch([jsonResponse(espnSummary(status))]);
    const { lookup } = await lookupEspnMatch(TARGET, "", []);
    expect(lookup.suggestedStatus).toBe(suggested);
    expect(lookup.match.isComplete).toBe(complete);
  });
});

describe("answerEspnQuestions", () => {
  const target = { teamA: { name: "Arsenal" }, teamB: { name: "Chelsea" } };
  const winnerQs = questions(["Who will win?", ["Arsenal", "Chelsea", "Draw"]], ["Who will win?", ["Chelsea", "Arsenal"]]);

  it("answers 'which team will win' from ESPN's winner flags", () => {
    const [a, b] = answerEspnQuestions(competitor("home", "Arsenal", "2", true), competitor("away", "Chelsea", "1", false), true, target, winnerQs);
    expect(a).toEqual({ questionKey: "q1", questionNumber: 1, answer: "Arsenal", optionIndex: 0, evidence: "ESPN shows Arsenal won." });
    expect(b).toMatchObject({ answer: "Arsenal", optionIndex: 1 });
  });

  it("reads cricket's string winner flag", () => {
    const [a] = answerEspnQuestions(competitor("home", "Arsenal", "150", false), competitor("away", "Chelsea", "151", "true"), true, target, winnerQs);
    expect(a).toMatchObject({ answer: "Chelsea", optionIndex: 1, evidence: "ESPN shows Chelsea won." });
  });

  it("picks Draw when nobody won", () => {
    const [a, b] = answerEspnQuestions(competitor("home", "Arsenal", "1"), competitor("away", "Chelsea", "1"), true, target, winnerQs);
    expect(a).toMatchObject({ answer: "Draw", optionIndex: 2, evidence: "ESPN shows no winner (Arsenal 1 - 1 Chelsea)." });
    expect(b).toMatchObject({ answer: null, optionIndex: null });
  });

  it("leaves other questions with the score as evidence", () => {
    const [p] = answerEspnQuestions(
      competitor("home", "Arsenal", "2", true),
      competitor("away", "Chelsea", "1", false),
      true,
      target,
      [question("Both teams to score?", ["Yes", "No"])],
    );
    expect(p).toMatchObject({ answer: null, evidence: "ESPN doesn't check this kind of question yet — final score: Arsenal 2 - 1 Chelsea." });
  });

  it("won't answer for teams that don't match", () => {
    const [p] = answerEspnQuestions(
      competitor("home", "Arsenal", "2", true),
      competitor("away", "Chelsea", "1", false),
      true,
      { teamA: { name: "India" }, teamB: { name: "Australia" } },
      [question("Who will win?", ["India", "Australia"])],
    );
    expect(p.answer).toBeNull();
  });

  it("answers nothing before the match has finished", () => {
    const proposals = answerEspnQuestions(competitor("home", "Arsenal", "0"), competitor("away", "Chelsea", "0"), false, target, winnerQs);
    expect(proposals.map((p) => p.evidence)).toEqual(Array(2).fill("The match hasn't finished on ESPN yet."));
  });
});
