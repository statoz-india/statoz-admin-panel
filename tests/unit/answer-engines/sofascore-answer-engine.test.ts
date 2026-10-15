import { describe, expect, it } from "vitest";
import {
  answerSofascoreQuiz,
  cricketFormat,
  sofascoreProviderTeam,
} from "@/app/api/utils/sofascore-answer-engine";
import type { QuizTeamLike } from "@/app/api/utils/quiz-answer-core";
import type { SofascoreMatchData, SsEvent, SsInnings } from "@/app/api/utils/sofascore";
import { arsenalChelseaData, arsenalChelseaEvent, cskMiData, lakersCelticsData } from "../../fixtures/sofascore";
import { question } from "../../helpers/quiz";

const YES_NO = ["Yes", "No"];

describe("sofascoreProviderTeam", () => {
  it("uses a short shortName as the abbreviation", () => {
    expect(sofascoreProviderTeam({ id: 1, name: "West Indies", shortName: "WI", nameCode: "WIN" })).toEqual({
      name: "West Indies",
      shortName: "WI",
      otherNames: ["WIN"],
    });
  });

  it("falls back to nameCode when the shortName is a word", () => {
    expect(sofascoreProviderTeam({ id: 1, name: "Brighton & Hove Albion", shortName: "Brighton", nameCode: "BHA" })).toEqual({
      name: "Brighton & Hove Albion",
      shortName: "BHA",
      otherNames: ["Brighton"],
    });
  });

  it("falls back to the name when there's nothing shorter", () => {
    expect(sofascoreProviderTeam({ id: 1, name: "Kerala" })).toEqual({ name: "Kerala", shortName: "Kerala", otherNames: [] });
  });
});

describe("cricketFormat", () => {
  const event = (name: string) => ({ tournament: { name } }) as unknown as SsEvent;
  const innings = (overs: number[], teams: number[]) =>
    overs.map((o, i) => ({ number: i + 1, overs: o, battingTeam: { id: teams[i] } }) as unknown as SsInnings);

  it.each([
    ["India tour of England, Test Series", "TEST"],
    ["Abu Dhabi T10", "T10"],
    ["The Hundred", "HUNDRED"],
    ["ICC T20 World Cup", "T20"],
    ["Twenty20 Cup", "T20"],
    ["ODI Series", "ODI"],
    ["Royal London One-Day Cup", "ODI"],
    ["Indian Premier League", "T20"],
    ["Big Bash League", "T20"],
    ["SA20", "T20"],
    ["Friendly", ""],
  ])("%s → %j", (name, format) => {
    expect(cricketFormat(event(name), null)).toBe(format);
  });

  it("spots a Test from two innings for one side", () => {
    expect(cricketFormat(event("Friendly"), innings([90, 85, 40, 0.5], [1, 2, 1, 2]))).toBe("TEST");
  });

  it("spots an ODI from the overs", () => {
    expect(cricketFormat(event("Friendly"), innings([50, 45.3], [1, 2]))).toBe("ODI");
  });

  it("ignores a super over when counting innings", () => {
    expect(cricketFormat(event("Friendly"), innings([20, 20, 1, 1], [1, 2, 1, 2]))).toBe("");
  });
});

function ask(data: SofascoreMatchData, text: string, options: string[], teams: { teamA: QuizTeamLike; teamB: QuizTeamLike }) {
  return answerSofascoreQuiz([question(text, options)], data, teams)[0];
}

describe("football from Sofascore", () => {
  const TEAMS = { teamA: { name: "Arsenal" }, teamB: { name: "Chelsea" } };
  const footy = (text: string, options: string[], data = arsenalChelseaData()) => ask(data, text, options, TEAMS);

  it.each([
    ["Which team will win the match?", ["Arsenal", "Chelsea", "Draw"], "Arsenal"],
    ["Which team will be leading at half time?", ["Arsenal", "Chelsea", "Draw"], "Arsenal"],
    ["Which team will score the first goal of the match?", ["Arsenal", "Chelsea"], "Arsenal"],
    ["Both teams will score at least one goal.", YES_NO, "Yes"],
    ["There will be more than 8 corner kicks in the match.", YES_NO, "Yes"],
    ["Arsenal will have more than 60% possession.", YES_NO, "No"],
    ["At least one red card will be shown in the match.", YES_NO, "Yes"],
    ["Chelsea will receive a red card in the match.", YES_NO, "Yes"],
    ["How many yellow cards will be shown in total?", ["0-2", "3-4"], "3-4"],
  ])("%s → %s", (text, options, expected) => {
    const proposal = footy(text, options);
    expect(proposal.answer, proposal.evidence).toBe(expected);
  });

  it("names the result with Sofascore's status", () => {
    expect(footy("Which team will win the match?", []).evidence).toBe("Result: Arsenal 2 - 1 Chelsea (Full-Time).");
  });

  it("credits an own goal to the other side", () => {
    expect(footy("Which team will be leading at half time?", []).evidence).toBe("Half-time: ARS 2–1 CHE.");
  });

  it("answers nothing before kick-off", () => {
    const event = arsenalChelseaEvent({
      status: { code: 0, description: "Not started", type: "notstarted" },
      homeScore: {},
      awayScore: {},
    });
    expect(footy("Which team will win the match?", ["Arsenal", "Chelsea"], { ...arsenalChelseaData(event), incidents: [] })).toMatchObject({
      answer: null,
      evidence: "The match hasn't started on Sofascore (Arsenal 0 - 0 Chelsea (Not started)).",
    });
  });
});

describe("basketball from Sofascore", () => {
  const TEAMS = { teamA: { name: "Lakers" }, teamB: { name: "Celtics" } };
  const hoops = (text: string, options: string[], data = lakersCelticsData()) => ask(data, text, options, TEAMS);

  it.each([
    ["Which team will win the game?", ["Lakers", "Celtics"], "Lakers"],
    ["Which team will be leading at half time?", ["Lakers", "Celtics"], "Lakers"],
    ["Lakers will make 15 or more three-pointers.", YES_NO, "No"],
    ["Lakers will be leading at the end of every regulation quarter.", YES_NO, "Yes"],
    ["Which team will the game's top scorer come from?", ["Lakers", "Celtics"], "Lakers"],
    ["The game will go to overtime.", YES_NO, "No"],
  ])("%s → %s", (text, options, expected) => {
    const proposal = hoops(text, options);
    expect(proposal.answer, proposal.evidence).toBe(expected);
  });

  it("reads team stats by name, from numbers or strings", () => {
    expect(hoops("How many rebounds will Celtics pull down?", []).answer).toBe("40");
    expect(hoops("How many assists will Lakers dish out?", []).answer).toBe("26");
  });

  it("adds up the box score, including split rebounds, without team stats", () => {
    const data = { ...lakersCelticsData(), statistics: null };
    expect(hoops("How many rebounds will Lakers pull down?", [], data).answer).toBe("24");
    expect(hoops("How many rebounds will Celtics pull down?", [], data).answer).toBe("8");
  });

  it("counts a player listed twice once", () => {
    expect(hoops("How many points will the game's top scorer finish with?", []).evidence).toBe(
      "Top scorer: LeBron James 35 (LAL).",
    );
  });

  it("spots overtime", () => {
    const data = lakersCelticsData();
    data.event.homeScore!.overtime = 10;
    data.event.awayScore!.overtime = 8;
    expect(hoops("The game will go to overtime.", YES_NO, data).answer).toBe("Yes");
  });
});

describe("cricket from Sofascore", () => {
  const TEAMS = { teamA: { name: "Chennai Super Kings", abbreviation: "CSK" }, teamB: { name: "Mumbai Indians", abbreviation: "MI" } };
  const cricket = (text: string, options: string[], data = cskMiData()) => ask(data, text, options, TEAMS);

  it.each([
    ["Which team will win the match?", ["CSK", "MI"], "CSK"],
    ["Which team will win the toss?", ["CSK", "MI"], "MI"],
    ["What will the toss-winning team choose to do?", ["Bat first", "Bowl first"], "Bowl first"],
    ["The team batting first will post a total of 180 or more.", YES_NO, "Yes"],
    ["The team batting second will successfully chase the target.", YES_NO, "No"],
    ["The highest partnership of the second innings will be 100 or more runs.", YES_NO, "No"],
    ["Chennai Super Kings will score 50 or more runs in the powerplay (first 6 overs).", YES_NO, "Yes"],
    ["Mumbai Indians will score 50 or more runs in the powerplay (first 6 overs).", YES_NO, "No"],
  ])("%s → %s", (text, options, expected) => {
    const proposal = cricket(text, options);
    expect(proposal.answer, proposal.evidence).toBe(expected);
  });

  it("orders innings by number and skips players who didn't bat", () => {
    expect(cricket("How many sixes will Chennai Super Kings hit in their innings?", []).answer).toBe("5");
  });

  it("uses Sofascore's result note", () => {
    expect(cricket("Which team will win the match?", []).evidence).toBe("Result: Chennai Super Kings won by 20 runs.");
  });

  it("has no player of the match to go on", () => {
    expect(cricket("The Player of the Match will come from the winning team.", YES_NO).evidence).toBe(
      "Sofascore hasn't named a player of the match.",
    );
  });

  it("has no winner until the match is finished", () => {
    const data = cskMiData();
    data.event.status = { code: 6, description: "2nd innings", type: "inprogress" };
    expect(cricket("Which team will win the match?", ["CSK", "MI"], data).answer).toBeNull();
  });
});
