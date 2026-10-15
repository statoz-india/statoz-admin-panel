import { describe, expect, it } from "vitest";
import { answerFootballQuiz } from "@/app/api/utils/fotmob-answer-engine";
import type { FmMatchDetails } from "@/app/api/utils/fotmob";
import { leedsNewcastle } from "../../fixtures/fotmob-match";
import { question } from "../../helpers/quiz";

const QUIZ_TEAMS = {
  teamA: { name: "Leeds United", abbreviation: "LEE" },
  teamB: { name: "Newcastle United", abbreviation: "NEW" },
};
const YES_NO = ["Yes", "No"];
const TEAMS = ["Leeds United", "Newcastle United", "Draw"];

function ask(text: string, options: string[], match: FmMatchDetails = leedsNewcastle()) {
  return answerFootballQuiz([question(text, options)], match, QUIZ_TEAMS)[0];
}

describe("football quiz bank, from Leeds 4–1 Newcastle", () => {
  it.each([
    ["Which team will win the match?", TEAMS, "Leeds United"],
    ["There will be 3 or more total goals in the match.", YES_NO, "Yes"],
    ["The match will end in a draw.", YES_NO, "No"],
    ["Both teams will score at least one goal.", YES_NO, "Yes"],
    ["The team that scores first will go on to win the match.", YES_NO, "Yes"],
    ["The team leading at half time will win the match.", YES_NO, "Yes"],
    ["At least one red card will be shown in the match.", YES_NO, "Yes"],
    ["The match will produce 4 or more yellow cards in total.", YES_NO, "No"],
    ["The first goal of the match will be scored before the 30-minute mark.", YES_NO, "Yes"],
    ["There will be more than 8 corner kicks in the match.", YES_NO, "Yes"],
    ["Leeds United will win the match.", YES_NO, "Yes"],
    ["Newcastle United will win the match.", YES_NO, "No"],
    ["Newcastle United will keep a clean sheet (concede 0 goals).", YES_NO, "No"],
    ["Leeds United will score 2 or more goals in the match.", YES_NO, "Yes"],
    ["Leeds United will have more than 60% possession.", YES_NO, "No"],
    ["Leeds United will register 5 or more shots on target.", YES_NO, "Yes"],
    ["Newcastle United will receive a red card in the match.", YES_NO, "Yes"],
    ["Leeds United will receive a red card in the match.", YES_NO, "No"],
    ["Leeds United will receive a yellow card in the match.", YES_NO, "Yes"],
    ["Leeds United will commit 10 or more fouls in the match.", YES_NO, "Yes"],
    ["Newcastle United will win 5 or more corner kicks.", YES_NO, "No"],
    ["Which team will be leading at half time?", TEAMS, "Leeds United"],
    ["Which team will score the first goal of the match?", ["Leeds United", "Newcastle United", "No goal"], "Leeds United"],
    ["How many total goals will be scored in the match?", ["0-1", "2-3", "4+"], "4+"],
    ["How many yellow cards will be shown in total?", ["0-2", "3-4", "5+"], "0-2"],
    ["How many total cards (yellow + red) will be shown in the match?", ["0-2", "3-4", "5+"], "3-4"],
    ["How many total corner kicks will the match have?", ["0-8", "9-11", "12+"], "9-11"],
    ["When will the first goal of the match be scored?", ["1-15 min", "16-30 min", "31-45 min", "46-90 min", "No goal"], "1-15 min"],
    ["How many goals will Newcastle United score in the match?", ["0", "1", "2", "3+"], "1"],
    ["How many shots will Leeds United take in the match?", ["0-9", "10-14", "15+"], "15+"],
    ["How many corner kicks will Leeds United win?", ["0-3", "4-6", "7+"], "4-6"],
  ])("%s → %s", (text, options, expected) => {
    const proposal = ask(text, options);
    expect(proposal.answer, proposal.evidence).toBe(expected);
    expect(proposal.optionIndex).toBe(options.indexOf(expected));
  });

  it("explains its answers", () => {
    expect(ask("Which team will win the match?", TEAMS).evidence).toBe("Result: Leeds United 4 - 1 Newcastle United.");
    expect(ask("Which team will be leading at half time?", TEAMS).evidence).toBe("Half-time: Leeds United 2–1 Newcastle United.");
    expect(ask("Which team will score the first goal of the match?", TEAMS).evidence).toBe(
      "First goal: 12' Joel Piroe [Leeds United].",
    );
    expect(ask("Leeds United will have more than 60% possession.", YES_NO).evidence).toBe(
      "Possession %: Leeds United 55, Newcastle United 45.",
    );
  });

  it("tags penalties and own goals in the evidence", () => {
    const match = leedsNewcastle();
    match.content.matchFacts!.events!.events = match.content.matchFacts!.events!.events!.filter(
      (e) => e.type !== "Goal" || e.goalDescriptionKey === "penalty" || e.ownGoal,
    );
    expect(ask("Which team will score the first goal of the match?", TEAMS, match).evidence).toBe(
      "First goal: 45'+2 Wilfried Gnonto (pen) [Leeds United].",
    );
  });
});

describe("football event bank", () => {
  it.each([
    ["There will be 3 or more total goals in the Leeds United vs Newcastle United game?", "Yes"],
    ["The Leeds United vs Newcastle United game will end in a draw.", "No"],
    ["Both teams in Leeds United vs Newcastle United game will score at least one goal?", "Yes"],
    ["At least one red card will be shown in Leeds United vs Newcastle United game?", "Yes"],
    ["At least one yellow card will be shown in Leeds United vs Newcastle United game?", "Yes"],
    ["Leeds United will commit 10 or more fouls in Leeds United vs Newcastle United game?", "Yes"],
    ["Newcastle United will commit 8 or more fouls in Leeds United vs Newcastle United game?", "Yes"],
    ["Newcastle United will win 5 or more corner kicks in Leeds United vs Newcastle United game?", "No"],
    ["Leeds United will win 3 or more corner kicks in Leeds United vs Newcastle United game?", "Yes"],
  ])("%s → %s", (text, expected) => {
    expect(ask(text, YES_NO).answer).toBe(expected);
  });
});

describe("football answers from unusual matches", () => {
  it("answers nothing before kick-off", () => {
    const match = leedsNewcastle();
    match.header.status = { utcTime: "", started: false, finished: false, cancelled: false };
    match.header.teams[0].score = 0;
    match.header.teams[1].score = 0;
    expect(ask("Which team will win the match?", TEAMS, match)).toMatchObject({
      answer: null,
      evidence: "The match hasn't started on FotMob (Leeds United 0 - 0 Newcastle United).",
    });
  });

  it("maps a goalless draw onto the right options", () => {
    const match = leedsNewcastle();
    match.header.teams[0].score = 0;
    match.header.teams[1].score = 0;
    match.content.matchFacts!.events!.events = [];
    expect(ask("Which team will win the match?", TEAMS, match).answer).toBe("Draw");
    expect(ask("Which team will score the first goal of the match?", ["Leeds United", "Newcastle United", "No goalscorer"], match).answer).toBe(
      "No goalscorer",
    );
    expect(ask("When will the first goal of the match be scored?", ["1-45 min", "46-90 min", "No goal"], match).answer).toBe("No goal");
    expect(ask("The team that scores first will go on to win the match.", YES_NO, match).answer).toBe("No");
  });

  it("counts cards from the events when FotMob has no stats", () => {
    const match = leedsNewcastle();
    match.content.stats = null;
    expect(ask("At least one red card will be shown in the match.", YES_NO, match).answer).toBe("Yes");
    expect(ask("How many yellow cards will be shown in total?", [], match).answer).toBe("2");
    expect(ask("Leeds United will have more than 60% possession.", YES_NO, match)).toMatchObject({
      answer: null,
      evidence: "FotMob has no possession % for this match.",
    });
  });

  it("puts stoppage-time first goals in the last window", () => {
    const match = leedsNewcastle();
    match.content.matchFacts!.events!.events = [goal(90, false, "Late", 4)];
    expect(ask("When will the first goal of the match be scored?", ["1-45 min", "46-90 min"], match).answer).toBe("46-90 min");
  });
});

function goal(time: number, isHome: boolean, name: string, overloadTime = 0) {
  return { type: "Goal", time, isHome, overloadTime, player: { id: 1, name } };
}
