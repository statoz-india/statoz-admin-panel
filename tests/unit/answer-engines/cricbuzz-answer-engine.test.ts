import { describe, expect, it } from "vitest";
import { answerCricketQuiz } from "@/app/api/utils/cricbuzz-answer-engine";
import type { CbScorecard } from "@/app/api/utils/cricbuzz";
import { t20Scorecard } from "../../fixtures/cricbuzz-scorecard";
import { question } from "../../helpers/quiz";

const QUIZ_TEAMS = { teamA: { name: "India", abbreviation: "IND" }, teamB: { name: "Australia", abbreviation: "AUS" } };

function ask(text: string, options: string[], scorecard: CbScorecard = t20Scorecard(), teams = QUIZ_TEAMS) {
  return answerCricketQuiz([question(text, options)], scorecard, teams)[0];
}

const YES_NO = ["Yes", "No"];

describe("cricket quiz bank, from a finished T20", () => {
  it.each([
    ["Which team will win the match?", ["India", "Australia"], "India"],
    ["The team that wins the toss will choose to BAT first.", YES_NO, "Yes"],
    ["The team that wins the toss will also win the match.", YES_NO, "No"],
    ["The team batting second will successfully chase the target.", YES_NO, "Yes"],
    ["The match will go to the final over (6 or fewer balls remaining at the finish).", YES_NO, "Yes"],
    ["The Player of the Match will come from the winning team.", YES_NO, "Yes"],
    ["The team batting first will post a total of 180 or more.", YES_NO, "Yes"],
    ["Someone will score a century (100+) in the second innings.", YES_NO, "Yes"],
    ["The highest partnership of the second innings will be 100 or more runs.", YES_NO, "Yes"],
    ["Australia will lose 5 or more wickets in their innings.", YES_NO, "Yes"],
    ["India will lose 5 or more wickets in their innings.", YES_NO, "No"],
    ["India's final run rate will be greater than 9.00.", YES_NO, "Yes"],
    ["Australia will score 50 or more runs in the powerplay (first 6 overs).", YES_NO, "Yes"],
    ["India will score 50 or more runs in the powerplay (first 6 overs).", YES_NO, "No"],
    ["Which team will win the toss?", ["India", "Australia"], "Australia"],
    ["What will the toss-winning team choose to do?", ["Bowl first", "Bat first"], "Bat first"],
    ["Which team's player will be named Player of the Match?", ["IND", "AUS"], "IND"],
    [
      "How will the winning team win the match?",
      ["By defending a total (batted first)", "By chasing a target (batted second)"],
      "By chasing a target (batted second)",
    ],
    ["What range will the first innings total fall into?", ["Under 150", "150-179", "180-199", "200+"], "180-199"],
    ["What range will the target for the chasing team fall into?", ["150-185", "186-200"], "186-200"],
    ["What range will India's innings total fall into?", ["Under 180", "180-199"], "180-199"],
    ["How many sixes will Australia hit in their innings?", ["0-5", "6-10", "11+"], "6-10"],
    ["How many wickets will India lose in their innings?", ["0-3", "4-6", "7-10"], "4-6"],
    ["How many runs will the top scorer of the second innings make?", ["Under 50", "50-99", "100+"], "100+"],
    ["How many wickets will the leading bowler take in the second innings?", ["0-1", "2", "3+"], "2"],
    ["What range will the highest partnership of the second innings fall into?", ["0-49", "50-99", "100+"], "100+"],
  ])("%s → %s", (text, options, expected) => {
    const proposal = ask(text, options);
    expect(proposal.answer, proposal.evidence).toBe(expected);
    expect(proposal.optionIndex).toBe(options.indexOf(expected));
  });

  it("explains its answers with the scorecard", () => {
    expect(ask("The match will go to the final over (6 or fewer balls remaining at the finish).", YES_NO).evidence).toBe(
      "IND batted second: 186/4 in 19.2 of 20 overs — 4 balls remaining at the finish. India won by 6 wkts.",
    );
    expect(ask("India's final run rate will be greater than 9.00.", YES_NO).evidence).toBe(
      "IND 186/4 (19.2 ov) — run rate 9.62.",
    );
    expect(ask("Which team will win the toss?", ["India", "Australia"]).evidence).toBe("AUS won the toss and chose to bat.");
  });

  it("only counts sixes by players who batted", () => {
    // Cummins' bogus 7 sixes are on a did-not-bat line.
    expect(ask("How many sixes will Australia hit in their innings?", []).answer).toBe("9");
  });

  it("answers in free text when a question has no options", () => {
    expect(ask("Which team will win the match?", []).answer).toBe("India");
    expect(ask("What will the toss-winning team choose to do?", []).answer).toBe("Bat first");
    expect(ask("What range will the first innings total fall into?", []).answer).toBe("185");
  });

  it("pairs teams when the quiz lists them the other way round", () => {
    const swapped = { teamA: QUIZ_TEAMS.teamB, teamB: QUIZ_TEAMS.teamA };
    expect(ask("Which team will win the match?", ["Australia", "India"], t20Scorecard(), swapped).answer).toBe("India");
  });
});

describe("cricket event bank", () => {
  it.each([
    ["The team that wins the toss will also win the match in India vs Australia game?", "No"],
    ["The team batting second in India vs Australia game will successfully chase the target.", "Yes"],
    ["The match will go to the final over (6 or fewer balls remaining at the finish) in India vs Australia game?", "Yes"],
    ["The highest partnership of the any innings will be 100 or more runs in India vs Australia game?", "Yes"],
    ["Someone will score a century (100+) in the any innings in Australia vs India game?", "Yes"],
  ])("%s → %s", (text, expected) => {
    expect(ask(text, YES_NO).answer).toBe(expected);
  });

  it("won't answer an event about another match", () => {
    expect(ask("The team that wins the toss will also win the match in India vs England game?", YES_NO)).toMatchObject({
      answer: null,
      evidence: "Couldn't tell which team “england” is in this match.",
    });
  });

  it("can't rule out a 100 partnership when some innings lack partnership data", () => {
    const sc = t20Scorecard();
    sc.scoreCard[1].partnershipsData = undefined;
    sc.scoreCard[0].partnershipsData = { p: { bat1Name: "a", bat2Name: "b", totalRuns: 60, totalBalls: 30 } };
    expect(
      ask("The highest partnership of the any innings will be 100 or more runs in India vs Australia game?", YES_NO, sc).evidence,
    ).toBe("Highest partnership per innings: AUS 60, IND ?. The Cricbuzz scorecard is missing partnerships for some innings.");
  });
});

describe("cricket answers from incomplete or unusual matches", () => {
  it("waits for the second innings", () => {
    const sc = t20Scorecard();
    sc.scoreCard = sc.scoreCard.slice(0, 1);
    sc.matchHeader.result = undefined;
    expect(ask("The team batting second will successfully chase the target.", YES_NO, sc)).toMatchObject({
      answer: null,
      evidence: "The Cricbuzz scorecard has no second innings yet.",
    });
    expect(ask("India will lose 5 or more wickets in their innings.", YES_NO, sc).evidence).toBe(
      "IND hasn't batted on the Cricbuzz scorecard yet.",
    );
  });

  it("waits for the toss", () => {
    const sc = t20Scorecard();
    sc.matchHeader.tossResults = { tossWinnerId: 0, decision: "" };
    expect(ask("Which team will win the toss?", ["India", "Australia"], sc).evidence).toBe(
      "The toss result isn't on the Cricbuzz scorecard yet.",
    );
  });

  it("maps a no-result onto the matching option", () => {
    const sc = t20Scorecard();
    sc.matchHeader.result = { resultType: "noresult" };
    sc.matchHeader.status = "No result";
    expect(ask("Which team will win the match?", ["India", "Australia", "No result"], sc).answer).toBe("No result");
    expect(ask("The team that wins the toss will also win the match.", YES_NO, sc).evidence).toBe("No winner: No result.");
  });

  it("won't guess a revised DLS target or balls remaining", () => {
    const sc = t20Scorecard();
    sc.matchHeader.status = "India won by 6 wkts (DLS method)";
    expect(ask("What range will the target for the chasing team fall into?", ["150-185", "186-200"], sc).answer).toBeNull();
    expect(ask("The match will go to the final over (6 or fewer balls remaining at the finish).", YES_NO, sc).evidence).toMatch(
      /^Rain-affected match/,
    );
  });

  it("uses a reduced-overs match's length", () => {
    const sc = t20Scorecard();
    sc.matchHeader.status = "India won by 6 wkts (6-over game)";
    sc.scoreCard[1].scoreDetails = { runs: 70, wickets: 2, overs: 5.3 };
    const proposal = ask("The match will go to the final over (6 or fewer balls remaining at the finish).", YES_NO, sc);
    expect(proposal.answer).toBe("Yes");
    expect(proposal.evidence).toContain("in 5.3 of 6 overs — 3 balls remaining");
  });

  it("won't answer a 6-over powerplay question from a 10-over powerplay", () => {
    const sc = t20Scorecard();
    sc.scoreCard[0].ppData = { pp_1: { ppOversFrom: 0.1, ppOversTo: 10, ppType: "mandatory", runsScored: 80 } };
    expect(ask("Australia will score 50 or more runs in the powerplay (first 6 overs).", YES_NO, sc).evidence).toBe(
      "Cricbuzz's powerplay for AUS ran to over 10, not 6.",
    );
  });

  it("can't place a player of the match who isn't on the scorecard", () => {
    const sc = t20Scorecard();
    sc.matchHeader.playersOfTheMatch = [{ id: 999, name: "Someone Else" }];
    expect(ask("Which team's player will be named Player of the Match?", ["India", "Australia"], sc).evidence).toBe(
      "Player of the match: Someone Else — couldn't tell which team they play for.",
    );
  });

  it("finds the player of the match's team by name when the id differs", () => {
    const sc = t20Scorecard();
    sc.matchHeader.playersOfTheMatch = [{ id: 999, name: "Travis Head" }];
    expect(ask("Which team's player will be named Player of the Match?", ["India", "Australia"], sc).answer).toBe("Australia");
  });

  it("can't count balls left for an unknown format", () => {
    const sc = t20Scorecard();
    sc.matchHeader.matchFormat = "HUNDRED";
    expect(ask("The match will go to the final over (6 or fewer balls remaining at the finish).", YES_NO, sc).evidence).toBe(
      "Can't tell how many overs a HUNDRED match has.",
    );
  });
});
