/**
 * Answers to the football questions in the quiz bank and the event bank
 * (`app/api/utils/eventreolve.js`) from a FotMob match. The sport-agnostic
 * parts (matching a question to a bank, mapping an answer onto its options)
 * live in `quiz-answer-core`; this file builds the match facts (score, goal
 * and card events, team stats) and resolves each bank question. Sofascore
 * matches reuse the banks through `answerFootballFacts`, with facts built in
 * `sofascore-answer-engine`.
 */

import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchAnswerProposal } from "@/app/interface/match-answers.interface";
import type { FmMatchDetails, FmStatRow } from "./fotmob";
import {
  answerFromBank,
  buildAnswerTeam,
  forTeam,
  NOBODY_OPTION_RE,
  none,
  normWords,
  pairQuizTeams,
  reworded,
  yesNo,
  type AnswerTeam,
  type BankQuestion,
  type Fact,
  type QuizTeamLike,
} from "./quiz-answer-core";

/* ---------- Match facts ---------- */

interface Goal {
  minute: number;
  /** Stoppage-time minutes, e.g. 2 for 45+2. */
  added: number;
  /** The team the goal counts for (the opponent's, for an own goal). */
  teamId: number;
  player: string;
  ownGoal: boolean;
  penalty: boolean;
}

interface Card {
  teamId: number;
  /** Straight red or second yellow. */
  red: boolean;
}

type Stat = "yellow" | "red" | "corners" | "possession" | "shots" | "shotsOnTarget" | "fouls";

interface MatchFacts {
  /** The site the facts were read off, for evidence text. */
  source: string;
  /** [home, away] */
  teams: AnswerTeam[];
  homeId: number;
  awayId: number;
  started: boolean;
  statusText: string;
  score: Record<number, number>;
  /** In the order they were scored. */
  goals: Goal[];
  cards: Card[];
  /** Whole-match team stats as [home, away]. */
  teamStats: Map<Stat, [number, number]>;
}

const toNum = (v: unknown) =>
  typeof v === "number" ? v : typeof v === "string" ? parseFloat(v) : NaN;

/** FotMob's team stat keys. */
const FOTMOB_TEAM_STATS: Record<string, Stat> = {
  yellow_cards: "yellow",
  red_cards: "red",
  corners: "corners",
  BallPossesion: "possession",
  total_shots: "shots",
  ShotsOnTarget: "shotsOnTarget",
  fouls: "fouls",
};

function buildMatchFacts(
  md: FmMatchDetails,
  quizTeams: { teamA: QuizTeamLike; teamB: QuizTeamLike },
): MatchFacts {
  const [home, away] = md.header.teams;
  const homeProvider = { name: home.name, shortName: home.name };
  const awayProvider = { name: away.name, shortName: away.name };
  const { t1Quiz, t2Quiz } = pairQuizTeams(quizTeams, homeProvider, awayProvider);
  const teams = [
    buildAnswerTeam(home.id, homeProvider, t1Quiz),
    buildAnswerTeam(away.id, awayProvider, t2Quiz),
  ];

  const events = (md.content.matchFacts?.events?.events ?? []).filter(
    (e) => !e.isPenaltyShootoutEvent,
  );
  const sideId = (isHome: boolean | undefined) => (isHome ? home.id : away.id);

  const goals: Goal[] = events
    .filter((e) => e.type === "Goal")
    .map((e) => ({
      minute: e.time,
      added: e.overloadTime ?? 0,
      teamId: sideId(e.isHome),
      player: e.player?.name ?? "Unknown",
      ownGoal: !!e.ownGoal,
      penalty: e.goalDescriptionKey === "penalty",
    }))
    .sort((a, b) => a.minute - b.minute || a.added - b.added);

  const cards: Card[] = events
    .filter((e) => e.type === "Card" && e.card)
    .map((e) => ({ teamId: sideId(e.isHome), red: e.card === "Red" || e.card === "YellowRed" }));

  const teamStats = new Map<Stat, [number, number]>();
  for (const group of md.content.stats?.Periods?.All?.stats ?? []) {
    for (const row of group.stats ?? ([] as FmStatRow[])) {
      const stat = FOTMOB_TEAM_STATS[row.key];
      const [a, b] = row.stats ?? [];
      if (!stat || a == null || b == null || teamStats.has(stat)) continue;
      const pair: [number, number] = [toNum(a), toNum(b)];
      if (!Number.isNaN(pair[0]) && !Number.isNaN(pair[1])) teamStats.set(stat, pair);
    }
  }

  const status = md.header.status;
  const reason = status.reason?.long ? ` (${status.reason.long})` : "";

  return {
    source: "FotMob",
    teams,
    homeId: home.id,
    awayId: away.id,
    started: !!status.started,
    statusText: `${home.name} ${home.score ?? 0} - ${away.score ?? 0} ${away.name}${reason}`,
    score: { [home.id]: home.score ?? 0, [away.id]: away.score ?? 0 },
    goals,
    cards,
    teamStats,
  };
}

/* ---------- Helpers ---------- */

const teamName = (f: MatchFacts, id: number | null) => f.teams.find((t) => t.id === id)?.shortName ?? "—";
const other = (f: MatchFacts, id: number) => (id === f.homeId ? f.awayId : f.homeId);

function winnerOf(f: MatchFacts): number | null {
  const [h, a] = [f.score[f.homeId], f.score[f.awayId]];
  return h > a ? f.homeId : a > h ? f.awayId : null;
}

function goalLine(f: MatchFacts, g: Goal): string {
  const tag = g.ownGoal ? " (OG)" : g.penalty ? " (pen)" : "";
  return `${g.minute}'${g.added ? `+${g.added}` : ""} ${g.player}${tag} [${teamName(f, g.teamId)}]`;
}

const result = (f: MatchFacts) => `Result: ${f.statusText}.`;

/** Goals up to half-time (45+ stoppage time counts as the 45th minute). */
function halfTime(f: MatchFacts): { leaderId: number | null; evidence: string } {
  const ht = (id: number) => f.goals.filter((g) => g.teamId === id && g.minute <= 45).length;
  const [h, a] = [ht(f.homeId), ht(f.awayId)];
  return {
    leaderId: h > a ? f.homeId : a > h ? f.awayId : null,
    evidence: `Half-time: ${teamName(f, f.homeId)} ${h}–${a} ${teamName(f, f.awayId)}.`,
  };
}

function firstGoal(f: MatchFacts): { goal: Goal | null; evidence: string } {
  const goal = f.goals[0] ?? null;
  return { goal, evidence: goal ? `First goal: ${goalLine(f, goal)}.` : `No goals (${f.statusText}).` };
}

const noGoal = (evidence: string): Fact => ({
  kind: "choice",
  value: "No goal scored",
  evidence,
  matchesOption: (o) => NOBODY_OPTION_RE.test(normWords(o)),
});

const STAT_LABEL: Record<Stat, string> = {
  yellow: "Yellow cards",
  red: "Red cards",
  corners: "Corners",
  possession: "Possession %",
  shots: "Total shots",
  shotsOnTarget: "Shots on target",
  fouls: "Fouls",
};

function teamStat(f: MatchFacts, stat: Stat, teamId: number): number | null {
  const pair = f.teamStats.get(stat);
  if (pair) return teamId === f.homeId ? pair[0] : pair[1];
  if (stat === "yellow" || stat === "red") {
    return f.cards.filter((c) => c.teamId === teamId && c.red === (stat === "red")).length;
  }
  return null;
}

/** A stat as [home, away] with its evidence line, or why it's missing. */
function withStat(
  f: MatchFacts,
  stat: Stat,
  resolve: (home: number, away: number, evidence: string) => Fact,
): Fact {
  const [h, a] = [teamStat(f, stat, f.homeId), teamStat(f, stat, f.awayId)];
  if (h === null || a === null) return none(`${f.source} has no ${STAT_LABEL[stat].toLowerCase()} for this match.`);
  return resolve(h, a, `${STAT_LABEL[stat]}: ${teamName(f, f.homeId)} ${h}, ${teamName(f, f.awayId)} ${a}.`);
}

/** Yes/No on the match total of a stat. */
const matchStat = (f: MatchFacts, stat: Stat, test: (total: number) => boolean) =>
  withStat(f, stat, (h, a, evidence) => yesNo(test(h + a), `${evidence} Total ${h + a}.`));

/** Yes/No on one team's value of a stat. */
const teamStatIs = (f: MatchFacts, stat: Stat, team: AnswerTeam, test: (value: number) => boolean) =>
  withStat(f, stat, (h, a, evidence) => yesNo(test(team.id === f.homeId ? h : a), evidence));

const matchStatCount = (f: MatchFacts, stat: Stat) =>
  withStat(f, stat, (h, a, evidence): Fact => ({ kind: "number", value: h + a, evidence: `${evidence} Total ${h + a}.` }));

const teamStatCount = (f: MatchFacts, stat: Stat, team: AnswerTeam) =>
  withStat(f, stat, (h, a, evidence): Fact => ({ kind: "number", value: team.id === f.homeId ? h : a, evidence }));

const totalGoals = (f: MatchFacts) => f.score[f.homeId] + f.score[f.awayId];

/* ---------- The question bank ---------- */

const FOOTBALL_BANK: BankQuestion<MatchFacts>[] = [
  {
    id: "match_result_mcq",
    template: "Which team will win the match?",
    resolve: (f) => ({ kind: "team", teamId: winnerOf(f), evidence: result(f) }),
  },

  /* ----- Boolean: match ----- */
  {
    id: "match_three_or_more_goals",
    template: "There will be 3 or more total goals in the match.",
    resolve: (f) => yesNo(totalGoals(f) >= 3, result(f)),
  },
  {
    id: "match_ends_in_draw",
    template: "The match will end in a draw.",
    resolve: (f) => yesNo(winnerOf(f) === null, result(f)),
  },
  {
    id: "both_teams_to_score",
    template: "Both teams will score at least one goal.",
    resolve: (f) => yesNo(f.score[f.homeId] > 0 && f.score[f.awayId] > 0, result(f)),
  },
  {
    id: "first_scorer_wins",
    template: "The team that scores first will go on to win the match.",
    resolve: (f) => {
      const { goal, evidence } = firstGoal(f);
      return yesNo(!!goal && goal.teamId === winnerOf(f), `${evidence} ${result(f)}`);
    },
  },
  {
    id: "halftime_leader_wins",
    template: "The team leading at half time will win the match.",
    resolve: (f) => {
      const { leaderId, evidence } = halfTime(f);
      return yesNo(leaderId !== null && leaderId === winnerOf(f), `${evidence} ${result(f)}`);
    },
  },
  {
    id: "match_has_red_card",
    template: "At least one red card will be shown in the match.",
    resolve: (f) => matchStat(f, "red", (n) => n >= 1),
  },
  {
    id: "match_over_4_yellow_cards",
    template: "The match will produce 4 or more yellow cards in total.",
    resolve: (f) => matchStat(f, "yellow", (n) => n >= 4),
  },
  {
    id: "first_goal_before_30",
    template: "The first goal of the match will be scored before the 30-minute mark.",
    resolve: (f) => {
      const { goal, evidence } = firstGoal(f);
      return yesNo(!!goal && goal.minute <= 30, evidence);
    },
  },
  {
    id: "match_over_8_corners",
    template: "There will be more than 8 corner kicks in the match.",
    resolve: (f) => matchStat(f, "corners", (n) => n > 8),
  },

  /* ----- Boolean: one team ----- */
  {
    id: "team_wins_match",
    template: "{teamA} will win the match.",
    resolve: forTeam((f, team) => yesNo(winnerOf(f) === team.id, result(f))),
  },
  {
    id: "team_clean_sheet",
    template: "{teamA} will keep a clean sheet (concede 0 goals).",
    resolve: forTeam((f, team) => yesNo(f.score[other(f, team.id)] === 0, result(f))),
  },
  {
    id: "team_scores_two_plus",
    template: "{teamB} will score 2 or more goals in the match.",
    resolve: forTeam((f, team) => yesNo(f.score[team.id] >= 2, result(f))),
  },
  {
    id: "team_possession_over_60",
    template: "{teamA} will have more than 60% possession.",
    resolve: forTeam((f, team) => teamStatIs(f, "possession", team, (n) => n > 60)),
  },
  {
    id: "team_five_plus_shots_on_target",
    template: "{teamB} will register 5 or more shots on target.",
    resolve: forTeam((f, team) => teamStatIs(f, "shotsOnTarget", team, (n) => n >= 5)),
  },
  {
    // The bank asks it about {teamA} and about {teamB}.
    id: "team_gets_red_card",
    template: "{teamA} will receive a red card in the match.",
    resolve: forTeam((f, team) => teamStatIs(f, "red", team, (n) => n >= 1)),
  },
  {
    // The bank asks it about {teamA} and about {teamB}.
    id: "team_gets_yellow_card",
    template: "{teamA} will receive a yellow card in the match.",
    resolve: forTeam((f, team) => teamStatIs(f, "yellow", team, (n) => n >= 1)),
  },
  {
    id: "team_ten_plus_fouls",
    template: "{teamA} will commit 10 or more fouls in the match.",
    resolve: forTeam((f, team) => teamStatIs(f, "fouls", team, (n) => n >= 10)),
  },
  {
    id: "team_five_plus_corners",
    template: "{teamA} will win 5 or more corner kicks.",
    resolve: forTeam((f, team) => teamStatIs(f, "corners", team, (n) => n >= 5)),
  },

  /* ----- MCQ ----- */
  {
    id: "halftime_leader_mcq",
    template: "Which team will be leading at half time?",
    resolve: (f) => {
      const { leaderId, evidence } = halfTime(f);
      return { kind: "team", teamId: leaderId, evidence };
    },
  },
  {
    id: "first_goal_team_mcq",
    template: "Which team will score the first goal of the match?",
    resolve: (f) => {
      const { goal, evidence } = firstGoal(f);
      return goal ? { kind: "team", teamId: goal.teamId, evidence } : noGoal(evidence);
    },
  },
  {
    id: "total_goals_range_mcq",
    template: "How many total goals will be scored in the match?",
    resolve: (f) => ({ kind: "number", value: totalGoals(f), evidence: result(f) }),
  },
  {
    id: "total_yellow_cards_range_mcq",
    template: "How many yellow cards will be shown in total?",
    resolve: (f) => matchStatCount(f, "yellow"),
  },
  {
    id: "total_cards_range_mcq",
    template: "How many total cards (yellow + red) will be shown in the match?",
    resolve: (f) =>
      withStat(f, "yellow", (hy, ay, yellow) =>
        withStat(f, "red", (hr, ar, red): Fact => ({
          kind: "number",
          value: hy + ay + hr + ar,
          evidence: `${yellow} ${red} Total ${hy + ay + hr + ar}.`,
        })),
      ),
  },
  {
    id: "total_corners_range_mcq",
    template: "How many total corner kicks will the match have?",
    resolve: (f) => matchStatCount(f, "corners"),
  },
  {
    id: "first_goal_window_mcq",
    template: "When will the first goal of the match be scored?",
    resolve: (f) => {
      const { goal, evidence } = firstGoal(f);
      if (!goal) return noGoal(evidence);
      // Stoppage time counts in its half ("45+2" → 31–45); extra time in the last window.
      return { kind: "number", value: Math.min(goal.minute, 90), evidence };
    },
  },
  {
    id: "team_goals_range_mcq",
    template: "How many goals will {teamA} score in the match?",
    resolve: forTeam((f, team) => ({ kind: "number", value: f.score[team.id], evidence: result(f) })),
  },
  {
    id: "team_shots_range_mcq",
    template: "How many shots will {teamA} take in the match?",
    resolve: forTeam((f, team) => teamStatCount(f, "shots", team)),
  },
  {
    id: "team_corners_range_mcq",
    template: "How many corner kicks will {teamA} win?",
    resolve: forTeam((f, team) => teamStatCount(f, "corners", team)),
  },
];

/* ---------- The event bank ---------- */

/** Quiz questions asked about "{teamA} vs {teamB}", plus a few thresholds of its own. */
const FOOTBALL_EVENT_BANK: BankQuestion<MatchFacts>[] = [
  reworded(
    FOOTBALL_BANK,
    "match_three_or_more_goals",
    "There will be 3 or more total goals in the {teamA} vs {teamB} game?",
  ),
  reworded(FOOTBALL_BANK, "match_ends_in_draw", "The {teamA} vs {teamB} game will end in a draw."),
  reworded(
    FOOTBALL_BANK,
    "both_teams_to_score",
    "Both teams in {teamA} vs {teamB} game will score at least one goal?",
  ),
  reworded(FOOTBALL_BANK, "match_has_red_card", "At least one red card will be shown in {teamA} vs {teamB} game?"),
  {
    id: "match_has_yellow_card",
    template: "At least one yellow card will be shown in {teamA} vs {teamB} game?",
    resolve: (f) => matchStat(f, "yellow", (n) => n >= 1),
  },
  reworded(
    FOOTBALL_BANK,
    "team_ten_plus_fouls",
    "{teamA} will commit 10 or more fouls in {teamA} vs {teamB} game?",
    "teamA_ten_plus_fouls",
  ),
  {
    id: "teamB_eight_plus_fouls",
    template: "{teamB} will commit 8 or more fouls in {teamA} vs {teamB} game?",
    resolve: forTeam((f, team) => teamStatIs(f, "fouls", team, (n) => n >= 8)),
  },
  reworded(
    FOOTBALL_BANK,
    "team_five_plus_corners",
    "{teamB} will win 5 or more corner kicks in {teamA} vs {teamB} game?",
    "teamB_five_plus_corners",
  ),
  {
    id: "teamA_three_plus_corners",
    template: "{teamA} will win 3 or more corner kicks in {teamA} vs {teamB} game?",
    resolve: forTeam((f, team) => teamStatIs(f, "corners", team, (n) => n >= 3)),
  },
];

/* ---------- Entry points ---------- */

export function answerFootballQuiz(
  questions: QuizQuestion[],
  match: FmMatchDetails,
  quizTeams: { teamA: QuizTeamLike; teamB: QuizTeamLike },
): MatchAnswerProposal[] {
  return answerFootballFacts(questions, buildMatchFacts(match, quizTeams));
}

/** Answers from facts another site's data was turned into. */
export function answerFootballFacts(questions: QuizQuestion[], facts: MatchFacts): MatchAnswerProposal[] {
  return answerFromBank(
    questions,
    [...FOOTBALL_BANK, ...FOOTBALL_EVENT_BANK],
    facts,
    facts.started ? null : `The match hasn't started on ${facts.source} (${facts.statusText}).`,
  );
}

export type {
  Card as FootballCard,
  Goal as FootballGoal,
  MatchFacts as FootballMatchFacts,
  Stat as FootballStat,
};
