import { describe, expect, it } from "vitest";
import type { QuizQuestion } from "@/app/api/quiz/route";
import {
  answerFromBank,
  answerQuestions,
  buildAnswerTeam,
  findBestMatch,
  forTeam,
  hasPhrase,
  isNoOption,
  isYesOption,
  NOBODY_OPTION_RE,
  normWords,
  optionMatchesPlayer,
  pairQuizTeams,
  parseNumericOption,
  playerForOption,
  reworded,
  STRONG_PAIR_SCORE,
  teamForOption,
  teamMatchScore,
  teamPairingWarning,
  TIE_OPTION_RE,
  yesNo,
  type AnswerPlayer,
  type AnswerTeam,
  type BankQuestion,
} from "@/app/api/utils/quiz-answer-core";
import { question } from "../../helpers/quiz";

describe("text helpers", () => {
  it.each([
    ["Atlético Madrid!", "atletico madrid"],
    ["  Man. Utd  ", "man utd"],
    ["Bayern München", "bayern munchen"],
    ["Sunrisers-Hyderabad (SRH)", "sunrisers hyderabad srh"],
    ["", ""],
  ])("normWords(%j) → %j", (input, expected) => {
    expect(normWords(input)).toBe(expected);
  });

  it("hasPhrase matches whole words only", () => {
    expect(hasPhrase("royal challengers bengaluru", "challengers")).toBe(true);
    expect(hasPhrase("chennai super kings", "super king")).toBe(false);
    expect(hasPhrase("india", "")).toBe(false);
  });
});

describe("teamMatchScore", () => {
  it.each([
    ["same name", { name: "India" }, { name: "India", shortName: "IND" }, 4],
    ["same name after dropping 'FC'", { name: "Arsenal FC" }, { name: "Arsenal", shortName: "ARS" }, 4],
    ["expanded abbreviations", { name: "Man Utd" }, { name: "Manchester United", shortName: "MUN" }, 4],
    ["one of the provider's other names", { name: "Bengaluru FC" }, { name: "BFC", shortName: "BFC", otherNames: ["Bengaluru"] }, 4],
    ["the quiz's display name", { name: "RCB", displayName: "Royal Challengers Bengaluru" }, { name: "Royal Challengers Bengaluru", shortName: "RCB" }, 4],
    [
      "same abbreviation",
      { name: "Royal Challengers Bengaluru", abbreviation: "RCB" },
      { name: "Royal Challengers Bangalore", shortName: "RCB" },
      3,
    ],
    ["one name inside the other", { name: "Newcastle" }, { name: "Newcastle United", shortName: "NEW" }, 2],
    ["a shared distinctive word", { name: "Bayern Munich" }, { name: "Bayern München", shortName: "FCB" }, 1],
    ["only a generic word in common", { name: "Leeds United" }, { name: "Newcastle United", shortName: "NEW" }, 0],
    ["different teams", { name: "India" }, { name: "Australia", shortName: "AUS" }, 0],
  ])("%s → %d", (_, quizTeam, provider, score) => {
    expect(teamMatchScore(quizTeam, provider)).toBe(score);
  });
});

const IND = { name: "India", abbreviation: "IND" };
const AUS = { name: "Australia", abbreviation: "AUS" };
const pIND = { name: "India", shortName: "IND" };
const pAUS = { name: "Australia", shortName: "AUS" };

describe("pairQuizTeams", () => {
  it("lines teams up in order", () => {
    expect(pairQuizTeams({ teamA: IND, teamB: AUS }, pIND, pAUS)).toEqual({ score: 8, t1Quiz: IND, t2Quiz: AUS });
  });

  it("lines teams up when the provider lists them the other way round", () => {
    expect(pairQuizTeams({ teamA: IND, teamB: AUS }, pAUS, pIND)).toEqual({ score: 8, t1Quiz: AUS, t2Quiz: IND });
  });

  it("needs both teams to match", () => {
    expect(pairQuizTeams({ teamA: IND, teamB: AUS }, pIND, { name: "England", shortName: "ENG" })).toEqual({ score: 0 });
  });

  it("rejects a pair of weak matches", () => {
    const pair = pairQuizTeams(
      { teamA: { name: "Newcastle" }, teamB: { name: "Bayern Munich" } },
      { name: "Newcastle United", shortName: "NEW" },
      { name: "Bayern München", shortName: "FCB" },
    );
    expect(pair.score).toBe(0);
  });
});

describe("teamPairingWarning", () => {
  it("stays quiet for a strong match", () => {
    expect(teamPairingWarning({ teamA: IND, teamB: AUS }, pIND, pAUS, "Cricbuzz")).toBeNull();
    expect(STRONG_PAIR_SCORE).toBe(6);
  });

  it("flags a match made on partial names", () => {
    expect(
      teamPairingWarning(
        { teamA: { name: "Newcastle" }, teamB: { name: "Tottenham" } },
        { name: "Newcastle United", shortName: "NEW" },
        { name: "Tottenham Hotspur", shortName: "TOT" },
        "FotMob",
      ),
    ).toBe(
      "Teams matched on partial names: FotMob has Newcastle United vs Tottenham Hotspur for Newcastle vs Tottenham. Check it's the same match.",
    );
  });

  it("flags a different match", () => {
    expect(teamPairingWarning({ teamA: IND, teamB: AUS }, pIND, { name: "England", shortName: "ENG" }, "ESPN")).toBe(
      "The ESPN match is India vs England, which doesn't look like India vs Australia.",
    );
  });
});

describe("findBestMatch", () => {
  type Listed = { id: string; a: typeof pIND; b: typeof pIND; start: string };
  const listed = (id: string, a: typeof pIND, b: typeof pIND, start: string): Listed => ({ id, a, b, start });
  const describeListed = (m: Listed) => ({ teams: [m.a, m.b] as [typeof pIND, typeof pIND], startMs: Date.parse(m.start) });
  const quiz = { teamA: IND, teamB: AUS, matchStartTime: "2026-08-08T14:00:00Z" };

  it("picks the fixture closest to the quiz's start", () => {
    const items = [
      listed("later", pIND, pAUS, "2026-08-08T17:00:00Z"),
      listed("closest", pAUS, pIND, "2026-08-08T15:00:00Z"),
      listed("other teams", pIND, { name: "England", shortName: "ENG" }, "2026-08-08T14:00:00Z"),
    ];
    expect(findBestMatch(items, quiz, describeListed)?.id).toBe("closest");
  });

  it("ignores fixtures more than 36h away", () => {
    expect(findBestMatch([listed("far", pIND, pAUS, "2026-08-10T03:00:00Z")], quiz, describeListed)).toBeNull();
  });

  it("can be told the list is already for the right date", () => {
    expect(findBestMatch([listed("far", pIND, pAUS, "2026-08-10T03:00:00Z")], quiz, describeListed, Infinity)?.id).toBe("far");
  });

  it("prefers a better name match over a closer start", () => {
    const items = [
      listed("partial", { name: "India A", shortName: "INA" }, pAUS, "2026-08-08T14:00:00Z"),
      listed("exact", pIND, pAUS, "2026-08-08T20:00:00Z"),
    ];
    expect(findBestMatch(items, quiz, describeListed)?.id).toBe("exact");
  });

  it("takes the first best match when the quiz has no start time", () => {
    const items = [listed("first", pIND, pAUS, "2026-01-01T00:00:00Z"), listed("second", pIND, pAUS, "2026-08-08T14:00:00Z")];
    expect(findBestMatch(items, { teamA: IND, teamB: AUS }, describeListed)?.id).toBe("first");
  });

  it("returns null for an empty list", () => {
    expect(findBestMatch([], quiz, describeListed)).toBeNull();
  });
});

describe("teams and options", () => {
  const newcastle = buildAnswerTeam(1, { name: "Newcastle United", shortName: "NEW" }, { name: "Newcastle", abbreviation: "NEW" });
  const leeds = buildAnswerTeam(2, { name: "Leeds United", shortName: "LEE" });

  it("buildAnswerTeam collects normalised aliases and labels with the quiz's name", () => {
    expect(newcastle).toEqual({ id: 1, shortName: "NEW", label: "Newcastle", aliases: ["newcastle united", "newcastle", "new"] });
    expect(leeds.label).toBe("Leeds United");
  });

  it("buildAnswerTeam falls back to the name when there is no short name", () => {
    expect(buildAnswerTeam(3, { name: "Kerala Blasters", shortName: "" }).shortName).toBe("Kerala Blasters");
  });

  it.each([
    ["Newcastle", 1],
    ["NEW", 1],
    ["Newcastle United FC", 1],
    ["Leeds", 2],
    ["leeds utd", 2],
    ["United", undefined],
    ["Draw", undefined],
    ["", undefined],
  ])("teamForOption(%j) → %s", (option, id) => {
    expect(teamForOption(option, [newcastle, leeds])?.id).toBe(id);
  });

  // Known gap: both teams' aliases contain the shared city word, so the
  // phrase match hits both and the full name is treated as ambiguous.
  it.todo("teamForOption maps full names in same-city derbies (Manchester United vs Manchester City)");

  it.each([
    ["Virat Kohli", true],
    ["virat kohli", true],
    ["Kohli", true],
    ["V Kohli", true],
    ["V", false],
    ["Rohit Kohli", false],
    ["", false],
  ])("optionMatchesPlayer(%j, Virat Kohli) → %s", (option, matches) => {
    expect(optionMatchesPlayer(option, { name: "Virat Kohli", key: "virat kohli", teamId: 1 })).toBe(matches);
  });

  const roster: AnswerPlayer[] = ["Rohit Sharma", "Ishant Sharma", "Virat Kohli"].map((name) => ({
    name,
    key: normWords(name),
    teamId: 1,
  }));

  it("playerForOption finds the one player an option names", () => {
    expect(playerForOption("Kohli", roster)?.name).toBe("Virat Kohli");
    expect(playerForOption("Rohit Sharma", roster)?.name).toBe("Rohit Sharma");
  });

  it("playerForOption gives up when an option could be several players", () => {
    expect(playerForOption("Sharma", roster)).toBeUndefined();
    expect(playerForOption("Bumrah", roster)).toBeUndefined();
  });
});

describe("parseNumericOption", () => {
  const cases: [string, number[], number[]][] = [
    ["0-5", [0, 3, 5], [6, -1]],
    ["150 - 179", [150, 179], [149, 180]],
    ["150–179", [150, 179], [180]],
    ["10 to 20", [10, 20], [9, 21]],
    ["between 20 and 10", [10, 15, 20], [21]],
    ["16-30 min", [16, 30], [31]],
    ["11+", [11, 50], [10]],
    ["3 or more", [3, 4], [2]],
    ["5 and above", [5], [4]],
    ["2 plus", [2], [1]],
    ["1,000+", [1000], [999]],
    ["at least 3", [3], [2]],
    ["Minimum of 4", [4], [3]],
    [">= 3", [3], [2]],
    ["more than 8", [9], [8]],
    ["Over 2.5", [3], [2]],
    ["above 5", [6], [5]],
    ["> 5", [6], [5]],
    ["up to 5", [5], [6]],
    ["at most 5", [5], [6]],
    ["<= 5", [5], [6]],
    ["less than 5", [4], [5]],
    ["Under 150", [149], [150]],
    ["below 5", [4], [5]],
    ["< 5", [4], [5]],
    ["5 or less", [5], [6]],
    ["6 or fewer", [6], [7]],
    ["5 and under", [5], [6]],
    ["3", [3], [2, 4]],
    ["exactly 3", [3], [4]],
    ["3 goals", [3], [2]],
    ["by 5 or more", [5], [4]],
    ["None", [0], [1]],
    ["zero", [0], [1]],
    ["Nil", [0], [1]],
    ["no one", [0], [1]],
  ];

  it.each(cases)("%j", (option, yes, no) => {
    const test = parseNumericOption(option);
    expect(test).not.toBeNull();
    for (const n of yes) expect(test!(n), `${option} should include ${n}`).toBe(true);
    for (const n of no) expect(test!(n), `${option} should exclude ${n}`).toBe(false);
  });

  it.each(["India", "Draw", "Yes", "", "Bat first"])("%j isn't numeric", (option) => {
    expect(parseNumericOption(option)).toBeNull();
  });
});

describe("option words", () => {
  it.each(["Yes", " yes ", "TRUE", "y"])("%j is yes", (o) => expect(isYesOption(o)).toBe(true));
  it.each(["No", "false", "N "])("%j is no", (o) => expect(isNoOption(o)).toBe(true));
  it.each(["Yes!", "Yeah", "Nope", ""])("%j is neither", (o) => {
    expect(isYesOption(o)).toBe(false);
    expect(isNoOption(o)).toBe(false);
  });

  it.each(["Draw", "It's a tie", "No result", "Tied", "Neither", "Goalless"])("%j means a tie", (o) => {
    expect(TIE_OPTION_RE.test(normWords(o))).toBe(true);
  });

  it.each(["None", "No goalscorer", "Nobody", "No goals"])("%j means nobody", (o) => {
    expect(NOBODY_OPTION_RE.test(normWords(o))).toBe(true);
  });
});

describe("answerFromBank", () => {
  type Facts = { teams: AnswerTeam[]; winnerId: number | null; goals: number };
  const teams = [buildAnswerTeam(1, pIND), buildAnswerTeam(2, pAUS)];
  const facts = (overrides: Partial<Facts> = {}): Facts => ({ teams, winnerId: 2, goals: 3, ...overrides });

  const BANK: BankQuestion<Facts>[] = [
    {
      id: "winner",
      template: "Which team will win the match?",
      resolve: (f) => ({ kind: "team", teamId: f.winnerId, evidence: "Result: Australia won." }),
    },
    { id: "team_wins", template: "{teamA} will win the match.", resolve: forTeam((f, t) => yesNo(f.winnerId === t.id, "Result.")) },
    { id: "goals", template: "How many goals will be scored?", resolve: (f) => ({ kind: "number", value: f.goals, evidence: `${f.goals} goals.` }) },
    { id: "close", template: "{teamA} vs {teamB} will be close?", resolve: (_f, team) => yesNo(team?.id === 1, "First team named.") },
    {
      id: "boom",
      template: "This resolver throws.",
      resolve: () => {
        throw new Error("kaput");
      },
    },
  ];

  const answer = (q: QuizQuestion, f = facts(), notReady: string | null = null) => answerFromBank([q], BANK, f, notReady)[0];

  it("answers a team question with the winner's option", () => {
    expect(answer(question("Which team will win the match?", ["India", "Australia", "Draw"]))).toMatchObject({
      answer: "Australia",
      optionIndex: 1,
      evidence: "Result: Australia won.",
    });
  });

  it("maps no winner onto the draw option", () => {
    expect(answer(question("Which team will win the match?", ["India", "Draw", "Australia"]), facts({ winnerId: null }))).toMatchObject({
      answer: "Draw",
      optionIndex: 1,
    });
  });

  it("answers a template about one team, ignoring case and punctuation", () => {
    expect(answer(question("INDIA will win the match", ["Yes", "No"]))).toMatchObject({ answer: "No", optionIndex: 1 });
    expect(answer(question("Australia will win the match!", ["Yes", "No"]))).toMatchObject({ answer: "Yes", optionIndex: 0 });
  });

  it("ignores bracketed text in the question", () => {
    expect(answer(question("Which team will win the match? (pick one)", ["India", "Australia"])).answer).toBe("Australia");
  });

  it("explains a team that isn't in this match", () => {
    expect(answer(question("England will win the match.", ["Yes", "No"]))).toEqual({
      questionKey: "q1",
      questionNumber: 1,
      answer: null,
      optionIndex: null,
      evidence: "Couldn't tell which team “england” is in this match.",
    });
  });

  it("passes the first-named team to templates naming both", () => {
    expect(answer(question("India vs Australia will be close?", ["Yes", "No"])).answer).toBe("Yes");
    expect(answer(question("Australia vs India will be close?", ["Yes", "No"])).answer).toBe("No");
  });

  it("won't let both placeholders name the same team", () => {
    expect(answer(question("India vs India will be close?", ["Yes", "No"])).evidence).toBe(
      "Not one of the question bank's questions, so it isn't answered automatically.",
    );
  });

  it("maps a number onto a range option", () => {
    expect(answer(question("How many goals will be scored?", ["0-1", "2-3", "4+"]))).toMatchObject({ answer: "2-3", optionIndex: 1 });
  });

  it("won't guess between overlapping options", () => {
    expect(answer(question("How many goals will be scored?", ["2+", "3+"]))).toMatchObject({
      answer: null,
      evidence: "3 goals. Fits more than one option (2+, 3+).",
    });
  });

  it("says when no option fits", () => {
    expect(answer(question("How many goals will be scored?", ["0", "1"])).evidence).toBe("3 goals. No option matches 3.");
  });

  it("answers in free text when the question has no options", () => {
    expect(answer(question("How many goals will be scored?", []))).toMatchObject({ answer: "3", optionIndex: null });
    expect(answer(question("Which team will win the match?", []))).toMatchObject({ answer: "Australia", optionIndex: null });
    expect(answer(question("India will win the match.", []))).toMatchObject({ answer: "No" });
  });

  it("can't name a team in free text after a draw", () => {
    expect(answer(question("Which team will win the match?", []), facts({ winnerId: null }))).toMatchObject({
      answer: null,
      evidence: "Result: Australia won. No single team to name.",
    });
  });

  it("leaves questions outside the bank for the admin", () => {
    expect(answer(question("Who will be the best fielder?", ["A", "B"])).evidence).toBe(
      "Not one of the question bank's questions, so it isn't answered automatically.",
    );
  });

  it("isolates a resolver that throws", () => {
    const [bad, good] = answerFromBank(
      [question("This resolver throws.", []), question("How many goals will be scored?", [], { _id: "q2", questionNumber: 2 })],
      BANK,
      facts(),
    );
    expect(bad.evidence).toBe("Couldn't evaluate this question (kaput).");
    expect(good.answer).toBe("3");
  });

  it("answers nothing from the bank before the match is ready", () => {
    const [inBank, outside] = answerFromBank(
      [question("How many goals will be scored?", ["3"]), question("Unrelated?", [], { _id: "q2" })],
      BANK,
      facts(),
      "The match hasn't started.",
    );
    expect(inBank).toMatchObject({ answer: null, evidence: "The match hasn't started." });
    expect(outside.evidence).toContain("Not one of the question bank's questions");
  });

  it("ignores blank options", () => {
    expect(answer(question("Which team will win the match?", ["India", "Australia", "  "])).answer).toBe("Australia");
  });
});

describe("answerQuestions keys", () => {
  it("keys by _id, then question number, numbering from the index when there is none", () => {
    const keys = answerQuestions(
      [
        { ...question("a", []), _id: "abc" },
        { ...question("b", []), _id: "", questionNumber: 7 },
        { ...question("c", []), _id: "", questionNumber: 0 },
      ],
      () => ({ answer: null, optionIndex: null, evidence: "" }),
    ).map((p) => [p.questionKey, p.questionNumber]);
    expect(keys).toEqual([
      ["abc", 1],
      ["7", 7],
      ["0", 3],
    ]);
  });
});

describe("reworded", () => {
  const bank: BankQuestion<{ teams: AnswerTeam[] }>[] = [{ id: "a", template: "A?", resolve: () => yesNo(true, "") }];

  it("reuses a bank question's resolver under new wording", () => {
    const q = reworded(bank, "a", "A in {teamA} vs {teamB}?", "a_event");
    expect(q).toMatchObject({ id: "a_event", template: "A in {teamA} vs {teamB}?" });
    expect(q.resolve).toBe(bank[0].resolve);
  });

  it("throws for an unknown id", () => {
    expect(() => reworded(bank, "missing", "x")).toThrow('No bank question "missing" to reword.');
  });
});
