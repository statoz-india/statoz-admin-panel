/**
 * Rule-based answers for basketball quiz questions. The sport-agnostic parts
 * (question parsing, option matching, Yes/No) live in `quiz-answer-core`;
 * this file has the basketball resolvers — result, margin, points by team /
 * quarter / half, overtime, the highest-scoring quarter, player and team
 * stats (rebounds, assists, threes, …) and double-doubles. The facts come
 * from Sofascore (built in `sofascore-answer-engine`).
 */

import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchAnswerProposal } from "@/app/interface/match-answers.interface";
import {
  answerFromFact,
  answerQuestions,
  buildAnswerContext,
  compare,
  none,
  normWords,
  type AnswerContext,
  type AnswerPlayer,
  type AnswerTeam,
  type Fact,
} from "./quiz-answer-core";

/* ---------- Match facts ---------- */

export type BasketballStat =
  | "points" | "rebounds" | "assists" | "steals" | "blocks" | "turnovers"
  | "fouls" | "threes" | "freeThrows" | "fieldGoals" | "biggestLead" | "leadChanges";

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

/** A slice of the game a question asks about. */
interface Scope {
  label: string;
  /** Indices into `periods`. */
  periods: number[];
}

type Ctx = AnswerContext<Player> & { scope: Scope | null };

/* ---------- Helpers ---------- */

function teamName(f: Facts, id: number | null): string {
  return f.teams.find((t) => t.id === id)?.shortName ?? "—";
}

const other = (f: Facts, id: number) => (id === f.homeId ? f.awayId : f.homeId);
const scopeTeamOf = (ctx: Ctx) =>
  ctx.mentionedTeams.length === 1 ? ctx.mentionedTeams[0].id : ctx.roleTeamId;
const wantsLow = (q: string) => /\b(fewer|fewest|less|least|lowest|minimum)\b/.test(q);
const ORDINALS = ["first|1st", "second|2nd", "third|3rd", "fourth|4th|final|last"];

function scopeOf(q: string, f: Facts): Scope | null {
  const quarters = f.periods.length === 4;
  if (quarters) {
    for (let i = 0; i < 4; i++) {
      if (new RegExp(`\\b(${ORDINALS[i]}) (quarter|qtr)\\b|\\bq${i + 1}\\b|\\bquarter ${i + 1}\\b`).test(q)) {
        return { label: `Q${i + 1}`, periods: [i] };
      }
    }
  }
  if (/\b(first|1st) half\b|\bhalf ?time\b|\bht\b|\bat the (break|half)\b/.test(q)) {
    return { label: "1st half", periods: quarters ? [0, 1] : [0] };
  }
  if (/\b(second|2nd) half\b/.test(q)) {
    return { label: "2nd half (regulation)", periods: quarters ? [2, 3] : [1] };
  }
  return null;
}

/** [home, away] points in a scope, or the whole game. */
function pointsIn(f: Facts, scope: Scope | null): [number, number] {
  if (!scope) return [f.score[f.homeId], f.score[f.awayId]];
  return scope.periods.reduce<[number, number]>(
    (acc, i) => [acc[0] + (f.periods[i]?.[0] ?? 0), acc[1] + (f.periods[i]?.[1] ?? 0)],
    [0, 0],
  );
}

const pointsLine = (f: Facts, [h, a]: [number, number], label: string) =>
  `${label}: ${teamName(f, f.homeId)} ${h}–${a} ${teamName(f, f.awayId)}.`;

function quarterOfOption(option: string): number | null {
  const o = normWords(option);
  for (let i = 0; i < 4; i++) {
    if (new RegExp(`\\b(${ORDINALS[i]})\\b|\\bq${i + 1}\\b|\\bquarter ${i + 1}\\b`).test(o)) return i;
  }
  return null;
}

/* ---------- Resolvers ---------- */

function resolveWinner(ctx: Ctx, f: Facts): Fact {
  const evidence = `Result: ${f.statusText}.${f.finished ? "" : " The game isn't finished."}`;
  if (f.winnerId === null) return { kind: "team", teamId: null, evidence };
  const asksLoser =
    /\b(lose|loses|lost|loser|losing)\b/.test(ctx.q) && !/\b(win|wins|won|winner)\b/.test(ctx.q);
  return { kind: "team", teamId: asksLoser ? other(f, f.winnerId) : f.winnerId, evidence };
}

/** "Which team wins the 3rd quarter?", "Who leads at half-time?" */
function resolveScopeWinner(ctx: Ctx, f: Facts, scope: Scope): Fact {
  const [h, a] = pointsIn(f, scope);
  const evidence = pointsLine(f, [h, a], scope.label);
  const winner = h > a ? f.homeId : a > h ? f.awayId : null;
  if (ctx.shape === "yesno" && scopeTeamOf(ctx) === null && /\b(tie|tied|level|draw|drawn)\b/.test(ctx.q)) {
    return { kind: "boolean", value: winner === null, evidence };
  }
  return { kind: "team", teamId: winner, evidence };
}

function resolveOvertime(f: Facts): Fact {
  const ot = f.overtime;
  return {
    kind: "boolean",
    value: ot !== null,
    evidence: ot ? `Went to overtime (OT: ${teamName(f, f.homeId)} ${ot[0]}–${ot[1]} ${teamName(f, f.awayId)}).` : `No overtime: ${f.statusText}.`,
  };
}

function resolveBusiestQuarter(ctx: Ctx, f: Facts): Fact {
  if (f.periods.length !== 4) return none(`${f.source} splits this game into halves, not quarters.`);
  const totals = f.periods.map(([h, a]) => h + a);
  const wantLow = wantsLow(ctx.q);
  const pick = wantLow ? Math.min(...totals) : Math.max(...totals);
  const hits = totals.flatMap((t, i) => (t === pick ? [i] : []));
  const evidence = `Points by quarter: ${totals.map((t, i) => `Q${i + 1} ${t}`).join(", ")}.`;
  if (hits.length > 1) return none(`${evidence} ${hits.map((i) => `Q${i + 1}`).join(" and ")} tie.`);
  return {
    kind: "choice",
    value: `Q${hits[0] + 1}`,
    evidence,
    matchesOption: (o) => quarterOfOption(o) === hits[0],
  };
}

function resolveMargin(ctx: Ctx, f: Facts): Fact {
  const [h, a] = pointsIn(f, ctx.scope);
  const margin = Math.abs(h - a);
  const evidence = `${pointsLine(f, [h, a], ctx.scope?.label ?? "Final")} Margin ${margin}.`;
  const teamId = scopeTeamOf(ctx);
  if (ctx.shape === "yesno" && teamId !== null) {
    const winner = h > a ? f.homeId : a > h ? f.awayId : null;
    return {
      kind: "boolean",
      value: winner === teamId && compare(margin, ctx.threshold ?? { op: ">=", value: 1 }),
      evidence,
    };
  }
  return { kind: "number", value: margin, evidence };
}

function resolvePoints(ctx: Ctx, f: Facts): Fact {
  const { q, scope } = ctx;
  const [h, a] = pointsIn(f, scope);
  const evidence = pointsLine(f, [h, a], scope?.label ?? `Final${f.overtime ? " (incl. OT)" : ""}`);

  if (ctx.shape === "players" || ctx.mentionedPlayers.length) {
    if (scope) return none(`${f.source} only has full-game player stats, not ${scope.label}.`);
    return resolvePlayerStat(ctx, f, "points");
  }
  if (ctx.shape === "teams") {
    if (h === a) return { kind: "team", teamId: null, evidence };
    return { kind: "team", teamId: h > a !== wantsLow(q) ? f.homeId : f.awayId, evidence };
  }
  const teamId = scopeTeamOf(ctx);
  if (teamId !== null) {
    const against = /\bconcede[sd]?\b|\ballow(s|ed)?\b|\bagainst\b/.test(q);
    const own = teamId === f.homeId ? h : a;
    return { kind: "number", value: against ? h + a - own : own, evidence };
  }
  return { kind: "number", value: h + a, evidence: `${evidence} Total ${h + a}.` };
}

const STAT_LABEL: Record<BasketballStat, string> = {
  points: "Points",
  rebounds: "Rebounds",
  assists: "Assists",
  steals: "Steals",
  blocks: "Blocks",
  turnovers: "Turnovers",
  fouls: "Fouls",
  threes: "3-pointers made",
  freeThrows: "Free throws made",
  fieldGoals: "Field goals made",
  biggestLead: "Biggest lead",
  leadChanges: "Lead changes",
};

function detectStat(q: string): BasketballStat | null {
  if (/\b(3|three) ?(pointers?|pt|pts|point (shots?|field goals?|baskets?|goals?))\b|\bthrees\b|\btriples\b/.test(q)) {
    return "threes";
  }
  if (/\bfree throws?\b/.test(q)) return "freeThrows";
  if (/\bfield goals?\b/.test(q)) return "fieldGoals";
  if (/\brebounds?\b|\bboards\b/.test(q)) return "rebounds";
  if (/\bassists?\b|\bdimes\b/.test(q)) return "assists";
  if (/\bsteals?\b/.test(q)) return "steals";
  if (/\bblocks?\b|\bblocked shots?\b/.test(q)) return "blocks";
  if (/\bturnovers?\b/.test(q)) return "turnovers";
  if (/\bfouls?\b/.test(q)) return "fouls";
  if (/\b(biggest|largest) lead\b/.test(q)) return "biggestLead";
  if (/\blead changes?\b/.test(q)) return "leadChanges";
  return null;
}

/** Stats only the team totals have. */
const TEAM_ONLY = new Set<BasketballStat>(["biggestLead", "leadChanges"]);

function teamStat(f: Facts, stat: BasketballStat, teamId: number): number | null {
  const pair = f.teamStats.get(stat);
  if (pair) return teamId === f.homeId ? pair[0] : pair[1];
  if (TEAM_ONLY.has(stat)) return null;
  // Fall back to adding up the box score.
  const own = f.players.filter((p) => p.teamId === teamId);
  if (!own.length || !own.some((p) => p.stats[stat] !== undefined)) return null;
  return own.reduce((n, p) => n + (p.stats[stat] ?? 0), 0);
}

function playerLine(p: Player, stat: BasketballStat) {
  return `${p.name} ${p.stats[stat] ?? 0}`;
}

function resolvePlayerStat(ctx: Ctx, f: Facts, stat: BasketballStat): Fact {
  const label = STAT_LABEL[stat];
  if (TEAM_ONLY.has(stat)) return none(`${label} is a team stat, not a player one.`);
  if (!f.players.length) return none(`${f.source} has no box score for this game yet.`);

  if (ctx.shape !== "players") {
    if (ctx.mentionedPlayers.length > 1) return none("Mentions several players.");
    const p = ctx.mentionedPlayers[0];
    const value = p.stats[stat] ?? 0;
    return {
      kind: "number",
      value,
      isCount: stat !== "points",
      evidence: `${label} — ${playerLine(p, stat)}.`,
    };
  }

  const teamId = scopeTeamOf(ctx);
  const pool =
    ctx.mentionedPlayers.length > 1 ? ctx.mentionedPlayers : f.players.filter((p) => teamId === null || p.teamId === teamId);
  const scored = pool.map((p) => ({ p, v: p.stats[stat] ?? 0 }));
  let leaders: typeof scored;
  if (ctx.threshold) leaders = scored.filter((x) => compare(x.v, ctx.threshold!));
  else {
    const top = Math.max(0, ...scored.map((x) => x.v));
    leaders = top > 0 ? scored.filter((x) => x.v === top) : [];
  }
  const scope = teamId !== null ? ` for ${teamName(f, teamId)}` : "";
  return {
    kind: "players",
    names: leaders.map((x) => x.p.name),
    evidence: leaders.length
      ? `${label}${scope}: ${leaders.map((x) => playerLine(x.p, stat)).join(", ")}.`
      : `${label}${scope}: no player qualifies.`,
  };
}

function resolveStat(ctx: Ctx, f: Facts, stat: BasketballStat): Fact {
  const { q } = ctx;
  const label = STAT_LABEL[stat];
  if (ctx.scope) return none(`${f.source} only has full-game ${label.toLowerCase()}, not ${ctx.scope.label}.`);
  if (ctx.shape === "players" || ctx.mentionedPlayers.length) return resolvePlayerStat(ctx, f, stat);

  const [h, a] = [teamStat(f, stat, f.homeId), teamStat(f, stat, f.awayId)];
  if (h === null || a === null) return none(`${f.source} has no ${label.toLowerCase()} for this game.`);
  const evidence = `${label}: ${teamName(f, f.homeId)} ${h}, ${teamName(f, f.awayId)} ${a}.`;

  if (ctx.shape === "teams") {
    if (h === a) return { kind: "team", teamId: null, evidence };
    return { kind: "team", teamId: h > a !== wantsLow(q) ? f.homeId : f.awayId, evidence };
  }
  const teamId = scopeTeamOf(ctx);
  if (teamId !== null) return { kind: "number", value: teamId === f.homeId ? h : a, isCount: true, evidence };
  if (stat === "biggestLead") return none(`${evidence} Name a team for its biggest lead.`);
  return { kind: "number", value: stat === "leadChanges" ? h : h + a, isCount: true, evidence };
}

/** Double-doubles / triple-doubles: 10+ in two / three of points, rebounds, assists, steals, blocks. */
function resolveDoubles(ctx: Ctx, f: Facts): Fact {
  const need = /\btriple ?doubles?\b/.test(ctx.q) ? 3 : 2;
  const label = need === 3 ? "Triple-double" : "Double-double";
  if (!f.players.length) return none(`${f.source} has no box score for this game yet.`);
  const cats: BasketballStat[] = ["points", "rebounds", "assists", "steals", "blocks"];
  const hit = (p: Player) => cats.filter((c) => (p.stats[c] ?? 0) >= 10).length >= need;
  const line = (p: Player) =>
    `${p.name} (${cats.filter((c) => (p.stats[c] ?? 0) >= 10).map((c) => `${p.stats[c]} ${c}`).join(", ")})`;

  const teamId = scopeTeamOf(ctx);
  const pool = f.players.filter((p) => teamId === null || p.teamId === teamId);
  const hits = pool.filter(hit);
  const evidence = hits.length ? `${label}s: ${hits.map(line).join("; ")}.` : `No ${label.toLowerCase()} in the box score.`;

  if (ctx.shape === "players") return { kind: "players", names: hits.map((p) => p.name), evidence };
  if (ctx.mentionedPlayers.length === 1) {
    return { kind: "boolean", value: hit(ctx.mentionedPlayers[0]), evidence };
  }
  return { kind: "number", value: hits.length, isCount: true, evidence };
}

function resolveQuestion(ctx: Ctx, f: Facts): Fact {
  const { q } = ctx;
  if (!f.started) return none(`The game hasn't started on ${f.source} (${f.statusText}).`);

  if (/\bover ?time\b|\bextra (time|period)\b|\bot\b/.test(q)) {
    if (!/\bpoints?\b|\bpts\b|\bscore/.test(q)) return resolveOvertime(f);
    const [h, a] = f.overtime ?? [0, 0];
    const teamId = scopeTeamOf(ctx);
    return {
      kind: "number",
      value: teamId === null ? h + a : teamId === f.homeId ? h : a,
      isCount: true,
      evidence: f.overtime ? pointsLine(f, [h, a], "Overtime") : `No overtime: ${f.statusText}.`,
    };
  }
  if (/\b(double|triple) ?doubles?\b/.test(q)) return resolveDoubles(ctx, f);
  if (/\b(which|what) quarter\b|\b(highest|lowest|most|least) scoring quarter\b|\bquarter with (the )?(most|fewest|least|highest|lowest)\b/.test(q)) {
    return resolveBusiestQuarter(ctx, f);
  }
  if (/\bmargin\b|\b(win|wins|won|winning) by\b|\bpoint (difference|differential)\b/.test(q)) {
    return resolveMargin(ctx, f);
  }

  const stat = detectStat(q);
  if (stat) return resolveStat(ctx, f, stat);

  if (/\b(top|leading|highest|high) (point )?scorer\b|\bmost points\b/.test(q) && ctx.shape !== "teams") {
    const leaders = resolvePoints({ ...ctx, shape: ctx.mentionedPlayers.length ? ctx.shape : "players" }, f);
    // "How many points will the top scorer get?" — the leader's tally.
    if (ctx.shape === "number" && leaders.kind === "players" && leaders.names.length) {
      const top = f.players.find((p) => p.name === leaders.names[0]);
      return { kind: "number", value: top?.stats.points ?? 0, evidence: leaders.evidence };
    }
    return leaders;
  }
  if (/\bpoints?\b|\bpts\b|\bscores?\b|\bscored\b|\bscorers?\b|\bscoring\b|\btotal\b/.test(q)) {
    return resolvePoints(ctx, f);
  }
  if (ctx.scope && /\b(win|wins|won|lead|leads|leading|ahead|outscore|outscores|result)\b/.test(q)) {
    return resolveScopeWinner(ctx, f, ctx.scope);
  }
  if (/\b(win|wins|won|winner|winning|victory|victorious|beat|beats|lose|loses|lost|loser|losing|result|outcome)\b/.test(q)) {
    return resolveWinner(ctx, f);
  }
  return none(`No ${f.source} rule matches this question's wording.`);
}

/* ---------- Entry point ---------- */

export function answerBasketballFacts(questions: QuizQuestion[], facts: Facts): MatchAnswerProposal[] {
  return answerQuestions(questions, (question) => {
    const preQ = normWords(question.questionText ?? "");
    const asksQuarter = /\b(which|what) quarter\b|\bscoring quarter\b|\bquarter with\b/.test(preQ);
    const base = buildAnswerContext(question, {
      teams: facts.teams,
      roster: facts.players,
      winnerId: facts.winnerId,
      choiceOption: asksQuarter ? (o) => quarterOfOption(o) !== null : undefined,
      roleTeamId: (q) =>
        /\bhome (team|side)\b|\bhosts\b/.test(q)
          ? facts.homeId
          : /\baway (team|side)\b|\bvisitors\b|\bvisiting (team|side)\b|\broad team\b/.test(q)
            ? facts.awayId
            : null,
    });
    const ctx: Ctx = { ...base, scope: scopeOf(base.q, facts) };
    return answerFromFact(resolveQuestion(ctx, facts), ctx);
  });
}
