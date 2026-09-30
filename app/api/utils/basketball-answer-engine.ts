/**
 * Answers to the basketball questions in the quiz bank and the event bank
 * (`app/api/utils/eventreolve.js`). The sport-agnostic parts (matching a
 * question to a bank, mapping an answer onto its options) live in
 * `quiz-answer-core`; this file resolves each bank question. The facts come
 * from Sofascore (built in `sofascore-answer-engine`).
 */

import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchAnswerProposal } from "@/app/interface/match-answers.interface";
import {
  answerFromBank,
  forTeam,
  none,
  reworded,
  yesNo,
  type AnswerPlayer,
  type AnswerTeam,
  type BankQuestion,
  type Fact,
} from "./quiz-answer-core";

/* ---------- Match facts ---------- */

export type BasketballStat = "points" | "rebounds" | "assists" | "steals" | "threes";

export interface BasketballPlayer extends AnswerPlayer {
  id: number;
  /** Game totals; a stat the site didn't send is 0. */
  stats: Partial<Record<BasketballStat, number>>;
}

export interface BasketballMatchFacts {
  /** The site the facts were read off, for evidence text. */
  source: string;
  /** [home, away] */
  teams: AnswerTeam[];
  homeId: number;
  awayId: number;
  players: BasketballPlayer[];
  started: boolean;
  finished: boolean;
  statusText: string;
  /** Final points, overtime included. */
  score: Record<number, number>;
  /** Points per regulation period — 4 quarters, or 2 halves — as [home, away]. */
  periods: [number, number][];
  /** Overtime points as [home, away]; null when the game didn't go to overtime. */
  overtime: [number, number] | null;
  winnerId: number | null;
  /** Whole-game team stats as [home, away]. */
  teamStats: Map<BasketballStat, [number, number]>;
}

type Facts = BasketballMatchFacts;
type Player = BasketballPlayer;

/* ---------- Helpers ---------- */

const teamName = (f: Facts, id: number | null) => f.teams.find((t) => t.id === id)?.shortName ?? "—";
const result = (f: Facts) => `Result: ${f.statusText}.${f.finished ? "" : " The game isn't finished."}`;
const total = (f: Facts) => f.score[f.homeId] + f.score[f.awayId];
const margin = (f: Facts) => Math.abs(f.score[f.homeId] - f.score[f.awayId]);

/** Who led at half-time: the first two quarters, or the first half. */
function withHalfTime(f: Facts, resolve: (leaderId: number | null, evidence: string) => Fact): Fact {
  const first = f.periods.slice(0, f.periods.length === 4 ? 2 : 1);
  if (!first.length) return none(`${f.source} has no period scores for this game yet.`);
  const [h, a] = first.reduce((acc, [ph, pa]) => [acc[0] + ph, acc[1] + pa], [0, 0]);
  return resolve(
    h > a ? f.homeId : a > h ? f.awayId : null,
    `Half-time: ${teamName(f, f.homeId)} ${h}–${a} ${teamName(f, f.awayId)}.`,
  );
}

const STAT_LABEL: Record<BasketballStat, string> = {
  points: "Points",
  rebounds: "Rebounds",
  assists: "Assists",
  steals: "Steals",
  threes: "3-pointers made",
};

function teamStat(f: Facts, stat: BasketballStat, teamId: number): number | null {
  const pair = f.teamStats.get(stat);
  if (pair) return teamId === f.homeId ? pair[0] : pair[1];
  // Fall back to adding up the box score.
  const own = f.players.filter((p) => p.teamId === teamId);
  if (!own.length || !own.some((p) => p.stats[stat] !== undefined)) return null;
  return own.reduce((n, p) => n + (p.stats[stat] ?? 0), 0);
}

/** One team's value of a stat, with evidence, or why it's missing. */
function withTeamStat(
  f: Facts,
  stat: BasketballStat,
  team: AnswerTeam,
  resolve: (value: number, evidence: string) => Fact,
): Fact {
  const [h, a] = [teamStat(f, stat, f.homeId), teamStat(f, stat, f.awayId)];
  if (h === null || a === null) return none(`${f.source} has no ${STAT_LABEL[stat].toLowerCase()} for this game.`);
  return resolve(
    team.id === f.homeId ? h : a,
    `${STAT_LABEL[stat]}: ${teamName(f, f.homeId)} ${h}, ${teamName(f, f.awayId)} ${a}.`,
  );
}

const statCount = (f: Facts, stat: BasketballStat, team: AnswerTeam) =>
  withTeamStat(f, stat, team, (value, evidence): Fact => ({ kind: "number", value, evidence }));

const statAtLeast = (f: Facts, stat: BasketballStat, team: AnswerTeam, min: number) =>
  withTeamStat(f, stat, team, (value, evidence) => yesNo(value >= min, evidence));

const points = (p: Player) => p.stats.points ?? 0;

/** The box score's top scorer(s), or why there isn't one. */
function withTopScorers(f: Facts, resolve: (top: Player[], evidence: string) => Fact): Fact {
  if (!f.players.length) return none(`${f.source} has no box score for this game yet.`);
  const most = Math.max(...f.players.map(points));
  const top = f.players.filter((p) => points(p) === most);
  return resolve(
    top,
    `Top scorer${top.length > 1 ? "s" : ""}: ${top.map((p) => `${p.name} ${points(p)} (${teamName(f, p.teamId)})`).join(", ")}.`,
  );
}

/** Players scoring at least `min` points, optionally on one team. */
function withScorersOver(
  f: Facts,
  min: number,
  team: AnswerTeam | null,
  resolve: (hits: Player[], evidence: string) => Fact,
): Fact {
  if (!f.players.length) return none(`${f.source} has no box score for this game yet.`);
  const hits = f.players.filter((p) => (!team || p.teamId === team.id) && points(p) >= min);
  const scope = team ? ` for ${team.shortName}` : "";
  return resolve(
    hits,
    hits.length
      ? `${min}+ points${scope}: ${hits.map((p) => `${p.name} ${points(p)}`).join(", ")}.`
      : `No one scored ${min}+ points${scope}.`,
  );
}

/* ---------- The question bank ---------- */

const BASKETBALL_BANK: BankQuestion<Facts>[] = [
  {
    id: "match_winner_mcq",
    template: "Which team will win the game?",
    resolve: (f) => ({ kind: "team", teamId: f.winnerId, evidence: result(f) }),
  },

  /* ----- Boolean: match ----- */
  {
    id: "match_total_over_240",
    template: "The combined final score will be 240 points or more.",
    resolve: (f) => yesNo(total(f) >= 240, `${result(f)} Combined ${total(f)}.`),
  },
  {
    id: "game_goes_to_overtime",
    template: "The game will go to overtime.",
    resolve: (f) =>
      yesNo(
        f.overtime !== null,
        f.overtime
          ? `Went to overtime (OT: ${teamName(f, f.homeId)} ${f.overtime[0]}–${f.overtime[1]} ${teamName(f, f.awayId)}).`
          : `No overtime: ${f.statusText}.`,
      ),
  },
  {
    id: "blowout_margin_over_20",
    template: "The final margin of victory will be 20 points or more.",
    resolve: (f) => yesNo(margin(f) >= 20, `${result(f)} Margin ${margin(f)}.`),
  },
  {
    id: "halftime_leader_wins",
    template: "The team leading at half time will go on to win the game.",
    resolve: (f) =>
      withHalfTime(f, (leaderId, evidence) =>
        yesNo(leaderId !== null && leaderId === f.winnerId, `${evidence} ${result(f)}`),
      ),
  },
  {
    id: "any_player_scores_40",
    template: "At least one player will score 40 or more points in the game.",
    resolve: (f) => withScorersOver(f, 40, null, (hits, evidence) => yesNo(hits.length > 0, evidence)),
  },

  /* ----- Boolean: one team ----- */
  {
    id: "team_scores_110_plus",
    template: "{teamB} will score 110 or more points.",
    resolve: forTeam((f, team) => yesNo(f.score[team.id] >= 110, result(f))),
  },
  {
    id: "team_scores_120_plus",
    template: "{teamA} will score 120 or more points.",
    resolve: forTeam((f, team) => yesNo(f.score[team.id] >= 120, result(f))),
  },
  {
    id: "team_25_plus_assists",
    template: "{teamA} will record 25 or more assists.",
    resolve: forTeam((f, team) => statAtLeast(f, "assists", team, 25)),
  },
  {
    id: "team_45_plus_rebounds",
    template: "{teamA} will pull down 45 or more rebounds.",
    resolve: forTeam((f, team) => statAtLeast(f, "rebounds", team, 45)),
  },
  {
    id: "team_15_plus_threes",
    template: "{teamA} will make 15 or more three-pointers.",
    resolve: forTeam((f, team) => statAtLeast(f, "threes", team, 15)),
  },
  {
    id: "team_8_plus_steals",
    template: "{teamB} will record 8 or more steals.",
    resolve: forTeam((f, team) => statAtLeast(f, "steals", team, 8)),
  },
  {
    id: "team_has_30_point_scorer",
    template: "{teamA} will have at least one player score 30 or more points.",
    resolve: forTeam((f, team) => withScorersOver(f, 30, team, (hits, evidence) => yesNo(hits.length > 0, evidence))),
  },
  {
    id: "team_leads_every_quarter",
    template: "{teamA} will be leading at the end of every regulation quarter.",
    resolve: forTeam((f, team) => {
      if (f.periods.length !== 4) return none(`${f.source} doesn't have all four quarters for this game.`);
      const home = team.id === f.homeId;
      const ends: [number, number][] = [];
      for (const [ph, pa] of f.periods) {
        const [h, a] = ends.at(-1) ?? [0, 0];
        ends.push([h + ph, a + pa]);
      }
      return yesNo(
        ends.every(([eh, ea]) => (home ? eh > ea : ea > eh)),
        `Score at the end of each quarter (${teamName(f, f.homeId)}–${teamName(f, f.awayId)}): ${ends.map(([eh, ea], i) => `Q${i + 1} ${eh}–${ea}`).join(", ")}.`,
      );
    }),
  },

  /* ----- MCQ ----- */
  {
    id: "halftime_leader_mcq",
    template: "Which team will be leading at half time?",
    resolve: (f) => withHalfTime(f, (leaderId, evidence) => ({ kind: "team", teamId: leaderId, evidence })),
  },
  {
    id: "total_points_range_mcq",
    template: "What range will the combined final score fall into?",
    resolve: (f) => ({ kind: "number", value: total(f), evidence: `${result(f)} Combined ${total(f)}.` }),
  },
  {
    id: "margin_range_mcq",
    template: "What range will the final margin of victory fall into?",
    resolve: (f) => ({ kind: "number", value: margin(f), evidence: `${result(f)} Margin ${margin(f)}.` }),
  },
  {
    id: "top_scorer_points_range_mcq",
    template: "How many points will the game's top scorer finish with?",
    resolve: (f) => withTopScorers(f, (top, evidence) => ({ kind: "number", value: points(top[0]), evidence })),
  },
  {
    id: "top_scorer_team_mcq",
    template: "Which team will the game's top scorer come from?",
    resolve: (f) =>
      withTopScorers(f, (top, evidence) => {
        const teamIds = new Set(top.map((p) => p.teamId));
        // Tied top scorers on both teams → "Both have same".
        return { kind: "team", teamId: teamIds.size === 1 ? top[0].teamId : null, evidence };
      }),
  },
  {
    id: "team_points_range_mcq",
    template: "How many points will {teamA} score?",
    resolve: forTeam((f, team): Fact => ({ kind: "number", value: f.score[team.id], evidence: result(f) })),
  },
  {
    id: "team_threes_range_mcq",
    template: "How many three-pointers will {teamA} make?",
    resolve: forTeam((f, team) => statCount(f, "threes", team)),
  },
  {
    id: "team_assists_range_mcq",
    template: "How many assists will {teamA} dish out?",
    resolve: forTeam((f, team) => statCount(f, "assists", team)),
  },
  {
    id: "team_rebounds_range_mcq",
    template: "How many rebounds will {teamA} pull down?",
    resolve: forTeam((f, team) => statCount(f, "rebounds", team)),
  },
];

/* ---------- The event bank ---------- */

/** Quiz questions asked about "{teamA} vs {teamB}". */
const BASKETBALL_EVENT_BANK: BankQuestion<Facts>[] = [
  reworded(
    BASKETBALL_BANK,
    "match_total_over_240",
    "The combined final score will be 240 points or more in {teamA} vs {teamB} match?",
  ),
  reworded(
    BASKETBALL_BANK,
    "blowout_margin_over_20",
    "The final margin of victory will be 20 points or more in {teamA} vs {teamB} match?",
  ),
  reworded(BASKETBALL_BANK, "game_goes_to_overtime", "{teamA} vs {teamB} game will go to overtime?"),
  reworded(
    BASKETBALL_BANK,
    "halftime_leader_wins",
    "The team leading at half time in {teamA} vs {teamB} game will go on to win the game?",
  ),
  reworded(
    BASKETBALL_BANK,
    "halftime_leader_mcq",
    "Which team will be leading at half time in {teamA} vs {teamB} game?",
  ),
];

/* ---------- Entry point ---------- */

export function answerBasketballFacts(questions: QuizQuestion[], facts: Facts): MatchAnswerProposal[] {
  return answerFromBank(
    questions,
    [...BASKETBALL_BANK, ...BASKETBALL_EVENT_BANK],
    facts,
    facts.started ? null : `The game hasn't started on ${facts.source} (${facts.statusText}).`,
  );
}
