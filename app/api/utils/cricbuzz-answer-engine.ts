/**
 * Answers to the cricket questions in the quiz bank and the event bank
 * (`app/api/utils/eventreolve.js`) from a Cricbuzz scorecard. The sport-agnostic parts (matching a question to a bank,
 * mapping an answer onto its options) live in `quiz-answer-core`; this file
 * builds the match facts and resolves each bank question. Sofascore matches
 * reuse the banks through `answerCricketFacts`, with facts built in
 * `sofascore-answer-engine`.
 */

import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchAnswerProposal } from "@/app/interface/match-answers.interface";
import type { CbBatter, CbBowler, CbScorecard } from "./cricbuzz";
import {
  answerFromBank,
  buildAnswerTeam,
  forTeam,
  none,
  normWords,
  pairQuizTeams,
  playerForOption,
  reworded,
  yesNo,
  type AnswerPlayer,
  type AnswerTeam,
  type BankQuestion,
  type Fact,
  type QuizTeamLike,
} from "./quiz-answer-core";

/* ---------- Match facts ---------- */

interface InningsFacts {
  batTeamId: number;
  bowlTeamId: number;
  runs: number;
  wickets: number;
  overs: number;
  /** Legal balls faced. */
  balls: number;
  revisedOvers: number;
  /** Powerplay runs, and the overs it ran to; null when not known. */
  ppRuns: number | null;
  ppOvers: number | null;
  topPartnership: number | null;
  batters: CbBatter[];
  bowlers: CbBowler[];
}

interface MatchFacts {
  /** The site the facts were read off, for evidence text. */
  source: string;
  teams: AnswerTeam[];
  innings: InningsFacts[];
  /** Cricbuzz's `matchFormat` names: "T20", "ODI", "TEST", … */
  format: string;
  status: string;
  toss: { winnerId: number | null; decision: "bat" | "bowl" | null };
  winnerId: number | null;
  /** `teamId` null when the player isn't on the scorecard. */
  potm: { name: string; teamId: number | null }[];
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const maxOf = (xs: number[]) => (xs.length ? Math.max(...xs) : null);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);

const batted = (b: CbBatter) => b.outDesc !== "" || num(b.balls) > 0 || num(b.runs) > 0;
/** 41.4 overs → 250 balls. */
const oversToBalls = (overs: number) => Math.floor(overs) * 6 + Math.round((overs % 1) * 10);

function buildMatchFacts(
  sc: CbScorecard,
  quizTeams: { teamA: QuizTeamLike; teamB: QuizTeamLike },
): MatchFacts {
  const header = sc.matchHeader;
  const { t1Quiz, t2Quiz } = pairQuizTeams(quizTeams, header.team1, header.team2);
  const teams = [
    buildAnswerTeam(header.team1.id, header.team1, t1Quiz),
    buildAnswerTeam(header.team2.id, header.team2, t2Quiz),
  ];

  // Everyone on the scorecard, to find the player of the match's team.
  const players = new Map<number, AnswerPlayer>();
  const addPlayer = (id: number, name: string, teamId: number) => {
    if (!players.has(id)) players.set(id, { name, key: normWords(name), teamId });
  };

  const innings: InningsFacts[] = sc.scoreCard.map((inn) => {
    const batters = Object.values(inn.batTeamDetails?.batsmenData ?? {});
    const bowlers = Object.values(inn.bowlTeamDetails?.bowlersData ?? {});
    for (const b of batters) addPlayer(b.batId, b.batName, inn.batTeamDetails.batTeamId);
    for (const b of bowlers) addPlayer(b.bowlerId, b.bowlName, inn.bowlTeamDetails.bowlTeamId);

    const pp =
      Object.values(inn.ppData ?? {}).find((p) => /mandatory/i.test(p.ppType)) ??
      Object.values(inn.ppData ?? {})[0];

    return {
      batTeamId: inn.batTeamDetails.batTeamId,
      bowlTeamId: inn.bowlTeamDetails.bowlTeamId,
      runs: num(inn.scoreDetails?.runs),
      wickets: num(inn.scoreDetails?.wickets),
      overs: num(inn.scoreDetails?.overs),
      balls: inn.scoreDetails?.ballNbr ?? oversToBalls(num(inn.scoreDetails?.overs)),
      revisedOvers: num(inn.scoreDetails?.revisedOvers),
      ppRuns: pp ? num(pp.runsScored) : null,
      ppOvers: pp ? num(pp.ppOversTo) : null,
      topPartnership: maxOf(Object.values(inn.partnershipsData ?? {}).map((p) => num(p.totalRuns))),
      batters: batters.filter(batted),
      bowlers,
    };
  });

  const result = header.result;
  const decision = header.tossResults?.decision;
  const roster = [...players.values()];

  return {
    source: "Cricbuzz",
    teams,
    innings,
    format: header.matchFormat ?? "",
    status: header.status ?? "",
    toss: {
      // Cricbuzz sends 0 / "" when there was no toss.
      winnerId: header.tossResults?.tossWinnerId || null,
      decision: !decision ? null : /bat/i.test(decision) ? "bat" : "bowl",
    },
    winnerId: result?.resultType === "win" && result.winningteamId ? result.winningteamId : null,
    potm: (header.playersOfTheMatch ?? [])
      .map((p) => {
        const name = p.fullName || p.name;
        const found = players.get(p.id) ?? (name ? playerForOption(name, roster) : undefined);
        return { name, teamId: found?.teamId ?? null };
      })
      .filter((p) => p.name),
  };
}

/* ---------- Helpers ---------- */

const teamShort = (f: MatchFacts, id: number | null) =>
  f.teams.find((t) => t.id === id)?.shortName ?? "—";

const inningsLine = (f: MatchFacts, i: InningsFacts) =>
  `${teamShort(f, i.batTeamId)} ${i.runs}/${i.wickets} (${i.overs} ov)`;

const ORDINAL = ["first", "second"];

/** The match's first or second innings. */
function withInnings(f: MatchFacts, index: number, resolve: (inn: InningsFacts) => Fact): Fact {
  const inn = f.innings[index];
  return inn ? resolve(inn) : none(`The ${f.source} scorecard has no ${ORDINAL[index]} innings yet.`);
}

/** A team's innings — its first, so a super over isn't counted. */
function withTeamInnings(f: MatchFacts, team: AnswerTeam, resolve: (inn: InningsFacts) => Fact): Fact {
  const inn = f.innings.find((i) => i.batTeamId === team.id);
  return inn ? resolve(inn) : none(`${team.shortName} hasn't batted on the ${f.source} scorecard yet.`);
}

function withWinner(f: MatchFacts, resolve: (winnerId: number) => Fact): Fact {
  return f.winnerId === null ? none(`No winner: ${f.status || "result not available"}.`) : resolve(f.winnerId);
}

function withToss(f: MatchFacts, resolve: (winnerId: number, evidence: string) => Fact): Fact {
  const { winnerId, decision } = f.toss;
  if (winnerId === null) return none(`The toss result isn't on the ${f.source} scorecard yet.`);
  return resolve(winnerId, `${teamShort(f, winnerId)} won the toss${decision ? ` and chose to ${decision}` : ""}.`);
}

function withPotmTeam(f: MatchFacts, resolve: (teamId: number, evidence: string) => Fact): Fact {
  if (!f.potm.length) return none(`${f.source} hasn't named a player of the match.`);
  const teamIds = [...new Set(f.potm.map((p) => p.teamId))];
  const names = f.potm.map((p) => p.name).join(", ");
  if (teamIds.length !== 1 || teamIds[0] === null) {
    return none(`Player of the match: ${names} — couldn't tell which team they play for.`);
  }
  return resolve(teamIds[0], `Player of the match: ${names} (${teamShort(f, teamIds[0])}).`);
}

function decisionForOption(option: string): "bat" | "bowl" | undefined {
  const o = normWords(option);
  const bat = /\bbat/.test(o);
  const bowl = /\b(bowl|field)/.test(o);
  return bat === bowl ? undefined : bat ? "bat" : "bowl";
}

const SCHEDULED_OVERS: Record<string, number> = { T20: 20, ODI: 50, T10: 10 };

/** Balls the side batting second had left when the match ended. */
function resolveBallsRemaining(f: MatchFacts, chase: InningsFacts): Fact {
  // Revised overs are rarely recorded; a pre-match reduction shows in the status ("6 over game").
  const reduced = f.status.match(/\b(\d+)[- ]overs?\s+(game|match|a side|per side|contest)\b/i);
  const rainAffected = /\b(dls|d\/l|vjd|rain|wet outfield|bad light)\b/i.test(f.status);
  const overs =
    chase.revisedOvers ||
    (reduced ? Number(reduced[1]) : rainAffected ? null : SCHEDULED_OVERS[f.format.toUpperCase()] ?? null);
  if (!overs) {
    return none(
      rainAffected
        ? `Rain-affected match (${f.status}) — the scorecard doesn't give the chase's revised overs, so balls remaining can't be worked out.`
        : `Can't tell how many overs a ${f.format || "this"} match has.`,
    );
  }
  const remaining = Math.max(0, overs * 6 - chase.balls);
  return {
    kind: "number",
    value: remaining,
    evidence: `${teamShort(f, chase.batTeamId)} batted second: ${chase.runs}/${chase.wickets} in ${chase.overs} of ${overs} overs — ${remaining} ball${remaining === 1 ? "" : "s"} remaining at the finish. ${f.status}.`,
  };
}

/** Yes/No on a number fact, keeping its evidence. */
const numberIs = (fact: Fact, test: (n: number) => boolean): Fact =>
  fact.kind === "number" ? yesNo(test(fact.value), fact.evidence) : fact;

const numberFact = (value: number, evidence: string): Fact => ({ kind: "number", value, evidence });

const topBatter = (inn: InningsFacts) =>
  inn.batters.reduce<CbBatter | null>((best, b) => (!best || num(b.runs) > num(best.runs) ? b : best), null);
const topBowler = (inn: InningsFacts) =>
  inn.bowlers.reduce<CbBowler | null>((best, b) => (!best || num(b.wickets) > num(best.wickets) ? b : best), null);

function partnershipFact(f: MatchFacts, inn: InningsFacts): Fact {
  if (inn.topPartnership === null) return none(`The ${f.source} scorecard has no partnerships for ${inningsLine(f, inn)}.`);
  return numberFact(inn.topPartnership, `Highest partnership, ${teamShort(f, inn.batTeamId)} innings: ${inn.topPartnership} runs.`);
}

/* ---------- The question bank ---------- */

const CRICKET_BANK: BankQuestion<MatchFacts>[] = [
  {
    id: "match_winner_mcq",
    template: "Which team will win the match?",
    resolve: (f) => ({ kind: "team", teamId: f.winnerId, evidence: `Result: ${f.status || "not available"}.` }),
  },

  /* ----- Boolean ----- */
  {
    id: "toss_decision_is_bat",
    template: "The team that wins the toss will choose to BAT first.",
    resolve: (f) =>
      withToss(f, (_, evidence) =>
        f.toss.decision ? yesNo(f.toss.decision === "bat", evidence) : none(`${evidence} The toss decision isn't on the scorecard.`),
      ),
  },
  {
    id: "toss_winner_wins_match",
    template: "The team that wins the toss will also win the match.",
    resolve: (f) =>
      withToss(f, (tossWinnerId, evidence) =>
        withWinner(f, (winnerId) => yesNo(tossWinnerId === winnerId, `${evidence} Result: ${f.status}.`)),
      ),
  },
  {
    id: "chase_successful",
    template: "The team batting second will successfully chase the target.",
    resolve: (f) =>
      withInnings(f, 1, (chase) =>
        withWinner(f, (winnerId) =>
          yesNo(winnerId === chase.batTeamId, `${teamShort(f, chase.batTeamId)} batted second. Result: ${f.status}.`),
        ),
      ),
  },
  {
    id: "close_finish",
    template: "The match will go to the final over (6 or fewer balls remaining at the finish).",
    resolve: (f) => withInnings(f, 1, (chase) => numberIs(resolveBallsRemaining(f, chase), (n) => n <= 6)),
  },
  {
    id: "potm_from_winner",
    template: "The Player of the Match will come from the winning team.",
    resolve: (f) =>
      withWinner(f, (winnerId) =>
        withPotmTeam(f, (teamId, evidence) => yesNo(teamId === winnerId, `${evidence} Result: ${f.status}.`)),
      ),
  },
  {
    id: "first_innings_over_180",
    template: "The team batting first will post a total of 180 or more.",
    resolve: (f) => withInnings(f, 0, (inn) => yesNo(inn.runs >= 180, `First innings: ${inningsLine(f, inn)}.`)),
  },
  {
    id: "century_in_second_innings",
    template: "Someone will score a century (100+) in the second innings.",
    resolve: (f) =>
      withInnings(f, 1, (inn) => {
        const top = topBatter(inn);
        return yesNo(
          !!top && num(top.runs) >= 100,
          `Top score in the second innings (${inningsLine(f, inn)}): ${top ? `${top.batName} ${num(top.runs)}` : "no one batted"}.`,
        );
      }),
  },
  {
    id: "highest_partnership_over_100",
    template: "The highest partnership of the second innings will be 100 or more runs.",
    resolve: (f) => withInnings(f, 1, (inn) => numberIs(partnershipFact(f, inn), (n) => n >= 100)),
  },
  {
    id: "team_loses_5_plus",
    template: "{teamA} will lose 5 or more wickets in their innings.",
    resolve: forTeam((f, team) =>
      withTeamInnings(f, team, (inn) => yesNo(inn.wickets >= 5, `${inningsLine(f, inn)}.`)),
    ),
  },
  {
    id: "team_runrate_over_9",
    template: "{teamA}'s final run rate will be greater than 9.00.",
    resolve: forTeam((f, team) =>
      withTeamInnings(f, team, (inn) => {
        if (!inn.balls) return none(`${team.shortName} hasn't faced a ball yet.`);
        const rate = (inn.runs * 6) / inn.balls;
        return yesNo(rate > 9, `${inningsLine(f, inn)} — run rate ${rate.toFixed(2)}.`);
      }),
    ),
  },
  {
    id: "team_powerplay_over_50",
    template: "{teamA} will score 50 or more runs in the powerplay (first 6 overs).",
    resolve: forTeam((f, team) =>
      withTeamInnings(f, team, (inn) => {
        if (inn.ppRuns === null) return none(`The ${f.source} scorecard has no powerplay score for ${team.shortName}.`);
        if (inn.ppOvers !== 6) {
          return none(`${f.source}'s powerplay for ${team.shortName} ran to over ${inn.ppOvers ?? "?"}, not 6.`);
        }
        return yesNo(inn.ppRuns >= 50, `${team.shortName} powerplay (first 6 overs): ${inn.ppRuns} runs.`);
      }),
    ),
  },

  /* ----- MCQ ----- */
  {
    id: "toss_winner_mcq",
    template: "Which team will win the toss?",
    resolve: (f) => withToss(f, (winnerId, evidence) => ({ kind: "team", teamId: winnerId, evidence })),
  },
  {
    id: "toss_decision_mcq",
    template: "What will the toss-winning team choose to do?",
    resolve: (f) =>
      withToss(f, (_, evidence) => {
        const { decision } = f.toss;
        if (!decision) return none(`${evidence} The toss decision isn't on the scorecard.`);
        return {
          kind: "choice",
          value: decision === "bat" ? "Bat first" : "Bowl first",
          evidence,
          matchesOption: (o) => decisionForOption(o) === decision,
        };
      }),
  },
  {
    id: "potm_team_mcq",
    template: "Which team's player will be named Player of the Match?",
    resolve: (f) => withPotmTeam(f, (teamId, evidence) => ({ kind: "team", teamId, evidence })),
  },
  {
    id: "win_type_mcq",
    template: "How will the winning team win the match?",
    resolve: (f) =>
      withInnings(f, 0, (first) =>
        withWinner(f, (winnerId) => {
          const defended = winnerId === first.batTeamId;
          return {
            kind: "choice",
            value: defended ? "By defending a total (batted first)" : "By chasing a target (batted second)",
            evidence: `${teamShort(f, first.batTeamId)} batted first. Result: ${f.status}.`,
            matchesOption: (o) => {
              const words = normWords(o);
              return defended ? /\b(defend|batted first)/.test(words) : /\b(chas|batted second)/.test(words);
            },
          };
        }),
      ),
  },
  {
    id: "first_innings_range",
    template: "What range will the first innings total fall into?",
    resolve: (f) => withInnings(f, 0, (inn) => numberFact(inn.runs, `First innings: ${inningsLine(f, inn)}.`)),
  },
  {
    id: "target_range",
    template: "What range will the target for the chasing team fall into?",
    resolve: (f) =>
      withInnings(f, 0, (inn) =>
        /\b(dls|d\/l|vjd)\b/i.test(f.status)
          ? none(`The target was revised (${f.status}), and the scorecard doesn't give the revised one.`)
          : numberFact(inn.runs + 1, `First innings: ${inningsLine(f, inn)} — target ${inn.runs + 1}.`),
      ),
  },
  {
    id: "team_runs_range",
    template: "What range will {teamA}'s innings total fall into?",
    resolve: forTeam((f, team) => withTeamInnings(f, team, (inn) => numberFact(inn.runs, `${inningsLine(f, inn)}.`))),
  },
  {
    id: "team_sixes_range",
    template: "How many sixes will {teamA} hit in their innings?",
    resolve: forTeam((f, team) =>
      withTeamInnings(f, team, (inn) => {
        const sixes = sum(inn.batters.map((b) => num(b.sixes)));
        return numberFact(sixes, `${team.shortName} hit ${sixes} six${sixes === 1 ? "" : "es"} (${inningsLine(f, inn)}).`);
      }),
    ),
  },
  {
    id: "team_wickets_range",
    template: "How many wickets will {teamA} lose in their innings?",
    resolve: forTeam((f, team) => withTeamInnings(f, team, (inn) => numberFact(inn.wickets, `${inningsLine(f, inn)}.`))),
  },
  {
    id: "top_scorer_runs_range",
    template: "How many runs will the top scorer of the second innings make?",
    resolve: (f) =>
      withInnings(f, 1, (inn) => {
        const top = topBatter(inn);
        if (!top) return none(`No one has batted in the second innings (${inningsLine(f, inn)}).`);
        return numberFact(num(top.runs), `Top scorer in the second innings: ${top.batName} ${num(top.runs)} (${num(top.balls)}b).`);
      }),
  },
  {
    id: "top_wicket_count_range",
    template: "How many wickets will the leading bowler take in the second innings?",
    resolve: (f) =>
      withInnings(f, 1, (inn) => {
        const top = topBowler(inn);
        if (!top) return none(`No bowling figures for the second innings (${inningsLine(f, inn)}).`);
        return numberFact(
          num(top.wickets),
          `Leading bowler in the second innings: ${top.bowlName} ${num(top.wickets)}/${num(top.runs)} in ${num(top.overs)} ov.`,
        );
      }),
  },
  {
    id: "highest_partnership_range",
    template: "What range will the highest partnership of the second innings fall into?",
    resolve: (f) => withInnings(f, 1, (inn) => partnershipFact(f, inn)),
  },
];

/* ---------- The event bank ---------- */

/** Quiz questions asked about "{teamA} vs {teamB}", and two about any innings. */
const CRICKET_EVENT_BANK: BankQuestion<MatchFacts>[] = [
  reworded(
    CRICKET_BANK,
    "toss_winner_wins_match",
    "The team that wins the toss will also win the match in {teamA} vs {teamB} game?",
  ),
  reworded(
    CRICKET_BANK,
    "chase_successful",
    "The team batting second in {teamA} vs {teamB} game will successfully chase the target.",
  ),
  reworded(
    CRICKET_BANK,
    "close_finish",
    "The match will go to the final over (6 or fewer balls remaining at the finish) in {teamA} vs {teamB} game?",
  ),
  {
    id: "highest_partnership_over_100",
    template: "The highest partnership of the any innings will be 100 or more runs in {teamA} vs {teamB} game?",
    resolve: (f) => {
      if (!f.innings.length) return none(`No innings on the ${f.source} scorecard yet.`);
      const best = Math.max(...f.innings.map((i) => i.topPartnership ?? 0));
      const evidence = `Highest partnership per innings: ${f.innings
        .map((i) => `${teamShort(f, i.batTeamId)} ${i.topPartnership ?? "?"}`)
        .join(", ")}.`;
      // Innings without partnership data can only be ruled out once another reached 100.
      if (best < 100 && f.innings.some((i) => i.topPartnership === null)) {
        return none(`${evidence} The ${f.source} scorecard is missing partnerships for some innings.`);
      }
      return yesNo(best >= 100, evidence);
    },
  },
  {
    // The event bank's id, though it asks about any innings.
    id: "century_in_second_innings",
    template: "Someone will score a century (100+) in the any innings in {teamA} vs {teamB} game?",
    resolve: (f) => {
      if (!f.innings.length) return none(`No innings on the ${f.source} scorecard yet.`);
      const tops = f.innings.map((inn) => ({ inn, top: topBatter(inn) }));
      return yesNo(
        tops.some(({ top }) => !!top && num(top.runs) >= 100),
        `Top score per innings: ${tops
          .map(({ inn, top }) => `${teamShort(f, inn.batTeamId)} — ${top ? `${top.batName} ${num(top.runs)}` : "no one batted"}`)
          .join(", ")}.`,
      );
    },
  },
];

/* ---------- Entry points ---------- */

export function answerCricketQuiz(
  questions: QuizQuestion[],
  scorecard: CbScorecard,
  quizTeams: { teamA: QuizTeamLike; teamB: QuizTeamLike },
): MatchAnswerProposal[] {
  return answerCricketFacts(questions, buildMatchFacts(scorecard, quizTeams));
}

/** Answers from facts another site's data was turned into. */
export function answerCricketFacts(questions: QuizQuestion[], facts: MatchFacts): MatchAnswerProposal[] {
  return answerFromBank(questions, [...CRICKET_BANK, ...CRICKET_EVENT_BANK], facts);
}

export type { InningsFacts as CricketInningsFacts, MatchFacts as CricketMatchFacts };
