import { describe, expect, it } from "vitest";
import {
  answerBasketballFacts,
  type BasketballMatchFacts,
  type BasketballPlayer,
  type BasketballStat,
} from "@/app/api/utils/basketball-answer-engine";
import { buildAnswerTeam, normWords } from "@/app/api/utils/quiz-answer-core";
import { question } from "../../helpers/quiz";

const LAL = 1;
const BOS = 2;

const player = (id: number, name: string, teamId: number, stats: BasketballPlayer["stats"]): BasketballPlayer => ({
  id,
  name,
  key: normWords(name),
  teamId,
  stats,
});

/**
 * Lakers 110–100 Celtics, regulation. Lakers led after every quarter
 * (30–25, 58–55, 83–75, 110–100). LeBron and Tatum tie as top scorer on 35.
 */
function lakersCeltics(overrides: Partial<BasketballMatchFacts> = {}): BasketballMatchFacts {
  return {
    source: "Sofascore",
    teams: [
      buildAnswerTeam(LAL, { name: "Los Angeles Lakers", shortName: "Lakers" }),
      buildAnswerTeam(BOS, { name: "Boston Celtics", shortName: "Celtics" }),
    ],
    homeId: LAL,
    awayId: BOS,
    players: [
      player(11, "LeBron James", LAL, { points: 35, rebounds: 10, assists: 12, steals: 2, threes: 3 }),
      player(12, "Anthony Davis", LAL, { points: 28, rebounds: 14, assists: 3, steals: 1, threes: 0 }),
      player(21, "Jayson Tatum", BOS, { points: 35, rebounds: 8, assists: 5, steals: 1, threes: 5 }),
      player(22, "Jaylen Brown", BOS, { points: 22, rebounds: 6, assists: 4, steals: 3, threes: 4 }),
    ],
    started: true,
    finished: true,
    statusText: "Lakers 110 - 100 Celtics",
    score: { [LAL]: 110, [BOS]: 100 },
    periods: [
      [30, 25],
      [28, 30],
      [25, 20],
      [27, 25],
    ],
    overtime: null,
    winnerId: LAL,
    teamStats: new Map<BasketballStat, [number, number]>([
      ["rebounds", [48, 40]],
      ["assists", [26, 22]],
      ["steals", [7, 9]],
      ["threes", [12, 16]],
    ]),
    ...overrides,
  };
}

const YES_NO = ["Yes", "No"];

function ask(text: string, options: string[], facts = lakersCeltics()) {
  return answerBasketballFacts([question(text, options)], facts)[0];
}

describe("basketball quiz bank, from Lakers 110–100 Celtics", () => {
  it.each([
    ["Which team will win the game?", ["Lakers", "Celtics"], "Lakers"],
    ["The combined final score will be 240 points or more.", YES_NO, "No"],
    ["The game will go to overtime.", YES_NO, "No"],
    ["The final margin of victory will be 20 points or more.", YES_NO, "No"],
    ["The team leading at half time will go on to win the game.", YES_NO, "Yes"],
    ["At least one player will score 40 or more points in the game.", YES_NO, "No"],
    ["Boston Celtics will score 110 or more points.", YES_NO, "No"],
    ["Los Angeles Lakers will score 110 or more points.", YES_NO, "Yes"],
    ["Los Angeles Lakers will score 120 or more points.", YES_NO, "No"],
    ["Lakers will record 25 or more assists.", YES_NO, "Yes"],
    ["Celtics will pull down 45 or more rebounds.", YES_NO, "No"],
    ["Celtics will make 15 or more three-pointers.", YES_NO, "Yes"],
    ["Celtics will record 8 or more steals.", YES_NO, "Yes"],
    ["Lakers will have at least one player score 30 or more points.", YES_NO, "Yes"],
    ["Lakers will be leading at the end of every regulation quarter.", YES_NO, "Yes"],
    ["Celtics will be leading at the end of every regulation quarter.", YES_NO, "No"],
    ["Which team will be leading at half time?", ["Lakers", "Celtics"], "Lakers"],
    ["What range will the combined final score fall into?", ["Under 200", "200-219", "220+"], "200-219"],
    ["What range will the final margin of victory fall into?", ["1-5", "6-10", "11+"], "6-10"],
    ["How many points will the game's top scorer finish with?", ["Under 30", "30-39", "40+"], "30-39"],
    ["Which team will the game's top scorer come from?", ["Lakers", "Celtics", "Both have same"], "Both have same"],
    ["How many points will Celtics score?", ["Under 100", "100-109", "110+"], "100-109"],
    ["How many three-pointers will Lakers make?", ["0-9", "10-14", "15+"], "10-14"],
    ["How many assists will Celtics dish out?", ["Under 20", "20-24", "25+"], "20-24"],
    ["How many rebounds will Lakers pull down?", ["Under 40", "40-49", "50+"], "40-49"],
  ])("%s → %s", (text, options, expected) => {
    const proposal = ask(text, options);
    expect(proposal.answer, proposal.evidence).toBe(expected);
    expect(proposal.optionIndex).toBe(options.indexOf(expected));
  });

  it("explains its answers", () => {
    expect(ask("The game will go to overtime.", YES_NO).evidence).toBe("No overtime: Lakers 110 - 100 Celtics.");
    expect(ask("At least one player will score 40 or more points in the game.", YES_NO).evidence).toBe("No one scored 40+ points.");
    expect(ask("Lakers will have at least one player score 30 or more points.", YES_NO).evidence).toBe(
      "30+ points for Lakers: LeBron James 35.",
    );
    expect(ask("Which team will the game's top scorer come from?", ["Lakers", "Celtics", "Both have same"]).evidence).toBe(
      "Top scorers: LeBron James 35 (Lakers), Jayson Tatum 35 (Celtics).",
    );
    expect(ask("Lakers will be leading at the end of every regulation quarter.", YES_NO).evidence).toBe(
      "Score at the end of each quarter (Lakers–Celtics): Q1 30–25, Q2 58–55, Q3 83–75, Q4 110–100.",
    );
  });

  it("names a single top scorer's team", () => {
    const facts = lakersCeltics();
    facts.players[2].stats.points = 30;
    expect(ask("Which team will the game's top scorer come from?", ["Lakers", "Celtics"], facts).answer).toBe("Lakers");
  });
});

describe("basketball event bank", () => {
  it.each([
    ["The combined final score will be 240 points or more in Lakers vs Celtics match?", "No"],
    ["The final margin of victory will be 20 points or more in Lakers vs Celtics match?", "No"],
    ["Lakers vs Celtics game will go to overtime?", "No"],
    ["The team leading at half time in Lakers vs Celtics game will go on to win the game?", "Yes"],
  ])("%s → %s", (text, expected) => {
    expect(ask(text, YES_NO).answer).toBe(expected);
  });

  it("answers the half-time MCQ", () => {
    expect(ask("Which team will be leading at half time in Lakers vs Celtics game?", ["Lakers", "Celtics"]).answer).toBe("Lakers");
  });
});

describe("basketball answers from unusual games", () => {
  it("answers nothing before tip-off", () => {
    expect(ask("Which team will win the game?", ["Lakers", "Celtics"], lakersCeltics({ started: false, statusText: "Not started" }))).toMatchObject({
      answer: null,
      evidence: "The game hasn't started on Sofascore (Not started).",
    });
  });

  it("notes an unfinished game in the evidence", () => {
    expect(ask("Which team will win the game?", [], lakersCeltics({ finished: false })).evidence).toBe(
      "Result: Lakers 110 - 100 Celtics. The game isn't finished.",
    );
  });

  it("reports overtime", () => {
    const proposal = ask("The game will go to overtime.", YES_NO, lakersCeltics({ overtime: [12, 8] }));
    expect(proposal.answer).toBe("Yes");
    expect(proposal.evidence).toBe("Went to overtime (OT: Lakers 12–8 Celtics).");
  });

  it("adds up the box score when there are no team stats", () => {
    const facts = lakersCeltics({ teamStats: new Map() });
    expect(ask("How many rebounds will Lakers pull down?", [], facts).answer).toBe("24");
  });

  it("says when a stat is missing everywhere", () => {
    const facts = lakersCeltics({ teamStats: new Map() });
    for (const p of facts.players) delete p.stats.steals;
    expect(ask("Celtics will record 8 or more steals.", YES_NO, facts)).toMatchObject({
      answer: null,
      evidence: "Sofascore has no steals for this game.",
    });
  });

  it("uses the first half for games played in halves", () => {
    const facts = lakersCeltics({
      periods: [
        [35, 40],
        [45, 30],
      ],
    });
    expect(ask("Which team will be leading at half time?", ["Lakers", "Celtics"], facts).answer).toBe("Celtics");
    expect(ask("Lakers will be leading at the end of every regulation quarter.", YES_NO, facts).evidence).toBe(
      "Sofascore doesn't have all four quarters for this game.",
    );
  });

  it("waits for period scores and the box score", () => {
    const facts = lakersCeltics({ periods: [], players: [] });
    expect(ask("Which team will be leading at half time?", ["Lakers", "Celtics"], facts).evidence).toBe(
      "Sofascore has no period scores for this game yet.",
    );
    expect(ask("How many points will the game's top scorer finish with?", [], facts).evidence).toBe(
      "Sofascore has no box score for this game yet.",
    );
  });
});
