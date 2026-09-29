/**
 * Rule-based answers for football quiz questions from a FotMob match.
 * The sport-agnostic parts (question parsing, option matching, Yes/No) live
 * in `quiz-answer-core`; this file builds the match facts (score, goal and
 * card events, team and player stats) and the football resolvers — result,
 * goals by team/player/half/minute window, first/last scorer, both teams to
 * score, clean sheets, penalties, scorelines, stats like corners and cards.
 * Sofascore matches reuse the resolvers through `answerFootballFacts`, with
 * facts built in `sofascore-answer-engine`.
 */

import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchAnswerProposal } from "@/app/interface/match-answers.interface";
import type { FmMatchDetails, FmPlayerStats, FmStatRow } from "./fotmob";
import {
  answerFromFact,
  answerQuestions,
  buildAnswerContext,
  buildAnswerTeam,
  compare,
  NOBODY_OPTION_RE,
  none,
  normWords,
  pairQuizTeams,
  TIE_OPTION_RE,
  type AnswerContext,
  type AnswerPlayer,
  type AnswerTeam,
  type Fact,
  type QuizTeamLike,
  type Threshold,
} from "./quiz-answer-core";

/* ---------- Match facts ---------- */

type Period = "FirstHalf" | "SecondHalf";

interface Player extends AnswerPlayer {
  id: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  saves: number;
  fouls: number;
}

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
  minute: number;
  teamId: number;
  playerId: number | null;
  /** Straight red or second yellow. */
  red: boolean;
}

interface MatchFacts {
  /** The site the facts were read off, for evidence text. */
  source: string;
  /** [home, away] */
  teams: AnswerTeam[];
  homeId: number;
  awayId: number;
  /** Team ids in the quiz's teamA/teamB order, for reading "2-1" options. */
  quizOrder: [number, number];
  players: Player[];
  started: boolean;
  finished: boolean;
  statusText: string;
  score: Record<number, number>;
  goals: Goal[];
  cards: Card[];
  missedPenalties: { minute: number; teamId: number; player: string }[];
  winnerId: number | null;
  wentToExtraTime: boolean;
  shootoutLoserId: number | null;
  aggregateLoserId: number | null;
  potm: string[];
  potmRating: string | null;
  /** [home, away] per stat, per period. */
  teamStats: Record<"All" | Period, Map<Stat, [number, number]>>;
}

type Ctx = AnswerContext<Player> & { period: Period | null };

const toNum = (v: unknown) =>
  typeof v === "number" ? v : typeof v === "string" ? parseFloat(v) : NaN;

function playerStat(p: FmPlayerStats | undefined, key: string): number {
  for (const group of p?.stats ?? []) {
    for (const s of Object.values(group.stats ?? {})) {
      if (s.key === key && typeof s.stat?.value === "number") return s.stat.value;
    }
  }
  return 0;
}

/** FotMob's team stat keys. */
const FOTMOB_TEAM_STATS: Record<string, Stat> = {
  yellow_cards: "yellow",
  red_cards: "red",
  corners: "corners",
  BallPossesion: "possession",
  total_shots: "shots",
  ShotsOnTarget: "shotsOnTarget",
  Offsides: "offsides",
  fouls: "fouls",
  keeper_saves: "saves",
  expected_goals: "xg",
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
  const quizOrder: [number, number] =
    t1Quiz && t1Quiz === quizTeams.teamB ? [away.id, home.id] : [home.id, away.id];

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
    .map((e) => ({
      minute: e.time,
      teamId: sideId(e.isHome),
      playerId: e.player?.id ?? null,
      red: e.card === "Red" || e.card === "YellowRed",
    }));

  // Roster: both lineups, falling back to whoever has player stats.
  const stats = md.content.playerStats ?? {};
  const lineup = md.content.lineup;
  const listed = [lineup?.homeTeam, lineup?.awayTeam].flatMap((team) =>
    team ? [...(team.starters ?? []), ...(team.subs ?? [])].map((p) => ({ ...p, teamId: team.id })) : [],
  );
  const rosterSource = listed.length
    ? listed
    : Object.values(stats).map((p) => ({ id: p.id, name: p.name, teamId: p.teamId }));
  const seen = new Set<number>();
  const players: Player[] = [];
  for (const p of rosterSource) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    const s = stats[String(p.id)];
    players.push({
      id: p.id,
      name: p.name,
      key: normWords(p.name),
      teamId: p.teamId,
      assists: playerStat(s, "assists"),
      shots: playerStat(s, "total_shots"),
      shotsOnTarget: playerStat(s, "ShotsOnTarget"),
      saves: playerStat(s, "saves"),
      fouls: playerStat(s, "fouls"),
    });
  }

  const periodStats = (period: "All" | Period) => {
    const map = new Map<Stat, [number, number]>();
    for (const group of md.content.stats?.Periods?.[period]?.stats ?? []) {
      for (const row of group.stats ?? ([] as FmStatRow[])) {
        const stat = FOTMOB_TEAM_STATS[row.key];
        const [a, b] = row.stats ?? [];
        if (!stat || a == null || b == null || map.has(stat)) continue;
        const pair: [number, number] = [toNum(a), toNum(b)];
        if (!Number.isNaN(pair[0]) && !Number.isNaN(pair[1])) map.set(stat, pair);
      }
    }
    return map;
  };

  const status = md.header.status;
  const teamByName = (name: string | null | undefined) =>
    name ? md.header.teams.find((t) => t.name === name)?.id ?? null : null;
  const reason = status.reason?.long ? ` (${status.reason.long})` : "";
  const potmName = md.content.matchFacts?.playerOfTheMatch?.name?.fullName;

  return {
    source: "FotMob",
    teams,
    homeId: home.id,
    awayId: away.id,
    quizOrder,
    players,
    started: !!status.started,
    finished: !!status.finished,
    statusText: `${home.name} ${home.score ?? 0} - ${away.score ?? 0} ${away.name}${reason}`,
    score: { [home.id]: home.score ?? 0, [away.id]: away.score ?? 0 },
    goals,
    cards,
    missedPenalties: events
      .filter((e) => e.type === "MissedPenalty")
      .map((e) => ({ minute: e.time, teamId: sideId(e.isHome), player: e.player?.name ?? "Unknown" })),
    winnerId: home.score > away.score ? home.id : away.score > home.score ? away.id : null,
    wentToExtraTime: !!status.halfs?.firstExtraHalfStarted || status.reason?.longKey === "afterextra",
    shootoutLoserId: teamByName(status.whoLostOnPenalties),
    aggregateLoserId: teamByName(status.whoLostOnAggregated),
    potm: potmName ? [potmName] : [],
    potmRating: md.content.matchFacts?.playerOfTheMatch?.rating?.num ?? null,
    teamStats: { All: periodStats("All"), FirstHalf: periodStats("FirstHalf"), SecondHalf: periodStats("SecondHalf") },
  };
}

/* ---------- Helpers ---------- */

function teamName(f: MatchFacts, id: number | null): string {
  return f.teams.find((t) => t.id === id)?.shortName ?? "—";
}

const other = (f: MatchFacts, id: number) => (id === f.homeId ? f.awayId : f.homeId);

const inPeriod = (minute: number, period: Period | null) =>
  period === "FirstHalf" ? minute <= 45 : period === "SecondHalf" ? minute > 45 && minute <= 90 : true;

const PERIOD_LABEL: Record<Period, string> = { FirstHalf: "1st half", SecondHalf: "2nd half" };

function periodOf(q: string): Period | null {
  if (/\b(first|1st) half\b|\bhalf ?time\b|\bht\b|\bbefore (the )?(half ?time|break|interval)\b|\bat the break\b/.test(q)) {
    return "FirstHalf";
  }
  if (/\b(second|2nd) half\b|\bafter (the )?(half ?time|break|interval)\b/.test(q)) return "SecondHalf";
  return null;
}

/** Minute windows like "first 15 minutes", "after the 80th minute", "stoppage time". */
function minuteWindow(q: string): { test: (g: Goal) => boolean; label: string } | null {
  let m: RegExpMatchArray | null;
  if ((m = q.match(/\bfirst (\d+) min(ute)?s?\b/))) {
    const n = +m[1];
    return { test: (g) => g.minute <= n, label: `first ${n} minutes` };
  }
  if ((m = q.match(/\b(last|final) (\d+) min(ute)?s?\b/))) {
    const n = +m[2];
    return { test: (g) => g.minute > 90 - n && g.minute <= 90, label: `last ${n} minutes of normal time` };
  }
  if ((m = q.match(/\bbefore (the )?(\d+)(st|nd|rd|th)? min/))) {
    const n = +m[2];
    return { test: (g) => g.minute < n, label: `before the ${n}th minute` };
  }
  if ((m = q.match(/\bafter (the )?(\d+)(st|nd|rd|th)? min/))) {
    const n = +m[2];
    return { test: (g) => g.minute > n, label: `after the ${n}th minute` };
  }
  if (/\b(stoppage|injury|added) time\b/.test(q)) {
    return { test: (g) => g.added > 0, label: "stoppage time" };
  }
  return null;
}

/** "Before the 30th minute" etc. as a threshold on a goal's minute. */
function minuteThreshold(q: string): Threshold | undefined {
  let m: RegExpMatchArray | null;
  if ((m = q.match(/\b(first (\d+) min|within (\d+) min)/))) return { op: "<=", value: +(m[2] ?? m[3]) };
  if ((m = q.match(/\bbefore (the )?(\d+)/))) return { op: "<", value: +m[2] };
  if ((m = q.match(/\bafter (the )?(\d+)/))) return { op: ">", value: +m[2] };
  return undefined;
}

function goalLine(f: MatchFacts, g: Goal): string {
  const tag = g.ownGoal ? " (OG)" : g.penalty ? " (pen)" : "";
  return `${g.minute}'${g.added ? `+${g.added}` : ""} ${g.player}${tag} [${teamName(f, g.teamId)}]`;
}

const goalList = (f: MatchFacts, goals: Goal[]) =>
  goals.length ? goals.map((g) => goalLine(f, g)).join(", ") : "none";

const scopeTeamOf = (ctx: Ctx) =>
  ctx.mentionedTeams.length === 1 ? ctx.mentionedTeams[0].id : ctx.roleTeamId;

const wantsLeader = (q: string) => /\b(most|top|highest|leading|more)\b/.test(q);
const wantsLow = (q: string) => /\b(fewer|fewest|less|least|lowest|minimum)\b/.test(q);

/* ---------- Resolvers ---------- */

function resolveWinner(ctx: Ctx, f: MatchFacts): Fact {
  const shootout = f.shootoutLoserId
    ? ` ${teamName(f, other(f, f.shootoutLoserId))} won the shootout.`
    : "";
  const evidence = `Result: ${f.statusText}.${shootout}${f.finished ? "" : " The match isn't finished."}`;
  if (
    ctx.shape === "yesno" &&
    scopeTeamOf(ctx) === null &&
    /\b(draw|drawn|tie|tied|level|stalemate)\b/.test(ctx.q)
  ) {
    return { kind: "boolean", value: f.winnerId === null, evidence };
  }
  if (f.winnerId === null) return { kind: "team", teamId: null, evidence };
  const asksLoser =
    /\b(lose|loses|lost|loser|losing)\b/.test(ctx.q) && !/\b(win|wins|won|winner)\b/.test(ctx.q);
  return { kind: "team", teamId: asksLoser ? other(f, f.winnerId) : f.winnerId, evidence };
}

function resolveHalfTimeResult(f: MatchFacts): Fact {
  const ht = (id: number) => f.goals.filter((g) => g.teamId === id && g.minute <= 45).length;
  const [h, a] = [ht(f.homeId), ht(f.awayId)];
  return {
    kind: "team",
    teamId: h > a ? f.homeId : a > h ? f.awayId : null,
    evidence: `Half-time: ${teamName(f, f.homeId)} ${h}–${a} ${teamName(f, f.awayId)}.`,
  };
}

function resolveAdvance(ctx: Ctx, f: MatchFacts): Fact {
  const loserId =
    f.aggregateLoserId ?? f.shootoutLoserId ?? (f.winnerId !== null ? other(f, f.winnerId) : null);
  if (loserId === null) return none(`No team went out: ${f.statusText}.`);
  const evidence = `${teamName(f, loserId)} went out (${f.statusText}${f.aggregateLoserId ? ", on aggregate" : ""}).`;
  const asksLoser = /\b(knocked out|eliminated|go(es)? out|exit)\b/.test(ctx.q);
  return { kind: "team", teamId: asksLoser ? loserId : other(f, loserId), evidence };
}

function resolveShootout(ctx: Ctx, f: MatchFacts): Fact {
  if (f.shootoutLoserId === null) {
    return ctx.shape === "yesno"
      ? { kind: "boolean", value: false, evidence: `No penalty shootout: ${f.statusText}.` }
      : none(`No penalty shootout: ${f.statusText}.`);
  }
  const winnerId = other(f, f.shootoutLoserId);
  const evidence = `${teamName(f, winnerId)} won the shootout (${f.statusText}).`;
  if (ctx.shape === "yesno" && scopeTeamOf(ctx) === null) return { kind: "boolean", value: true, evidence };
  return { kind: "team", teamId: winnerId, evidence };
}

function resolveBusierHalf(f: MatchFacts): Fact {
  const first = f.goals.filter((g) => g.minute <= 45).length;
  const second = f.goals.filter((g) => g.minute > 45 && g.minute <= 90).length;
  const value = first > second ? "First half" : second > first ? "Second half" : "Equal";
  return {
    kind: "choice",
    value,
    evidence: `Goals: 1st half ${first}, 2nd half ${second}.`,
    matchesOption: (o) => {
      const n = normWords(o);
      if (value === "First half") return /\b(first|1st)\b/.test(n);
      if (value === "Second half") return /\b(second|2nd)\b/.test(n);
      return /\b(equal|same|both|level|draw|tie)\b/.test(n);
    },
  };
}

function noGoalFact(evidence: string): Fact {
  return {
    kind: "choice",
    value: "No goal",
    evidence,
    matchesOption: (o) => NOBODY_OPTION_RE.test(normWords(o)),
    toBoolean: () => false,
  };
}

function resolveNthGoal(ctx: Ctx, f: MatchFacts, which: "first" | "last"): Fact {
  const teamId = scopeTeamOf(ctx);
  // "Who will score first for Leeds?" looks at Leeds' goals; "Will Leeds score first?" at the match's.
  const pool =
    ctx.shape === "players" && teamId !== null ? f.goals.filter((g) => g.teamId === teamId) : f.goals;
  const g = which === "first" ? pool[0] : pool[pool.length - 1];
  const label = which === "first" ? "First goal" : "Last goal";
  if (!g) return noGoalFact(`${label}: no goals (${f.statusText}).`);
  const evidence = `${label}: ${goalLine(f, g)}.`;

  switch (ctx.shape) {
    case "players":
      return g.ownGoal
        ? { kind: "choice", value: "Own goal", evidence, matchesOption: (o) => /\b(own goal|og)\b/.test(normWords(o)) }
        : { kind: "players", names: [g.player], evidence };
    case "number":
      return { kind: "number", value: g.minute, evidence };
    case "yesno":
      if (ctx.mentionedPlayers.length) return { kind: "players", names: g.ownGoal ? [] : [g.player], evidence };
      if (teamId !== null) return { kind: "team", teamId: g.teamId, evidence };
      return { kind: "number", value: g.minute, evidence, implicitThreshold: minuteThreshold(ctx.q) };
    default:
      return { kind: "team", teamId: g.teamId, evidence };
  }
}

function resolveBothTeamsScore(ctx: Ctx, f: MatchFacts): Fact {
  const scored = (id: number) => f.goals.filter((g) => g.teamId === id && inPeriod(g.minute, ctx.period)).length;
  const [h, a] = [scored(f.homeId), scored(f.awayId)];
  const scope = ctx.period ? ` in the ${PERIOD_LABEL[ctx.period]}` : "";
  return {
    kind: "boolean",
    value: h > 0 && a > 0,
    evidence: `Goals${scope}: ${teamName(f, f.homeId)} ${h}, ${teamName(f, f.awayId)} ${a}.`,
  };
}

function resolveCleanSheet(ctx: Ctx, f: MatchFacts): Fact {
  const conceded = (id: number) =>
    f.goals.filter((g) => g.teamId !== id && inPeriod(g.minute, ctx.period)).length;
  const evidence = `Conceded: ${f.teams.map((t) => `${t.shortName} ${conceded(t.id)}`).join(", ")}.`;
  const teamId = scopeTeamOf(ctx);
  if (teamId !== null) return { kind: "boolean", value: conceded(teamId) === 0, evidence };

  const clean = f.teams.filter((t) => conceded(t.id) === 0);
  if (ctx.shape === "yesno") return { kind: "boolean", value: clean.length > 0, evidence };
  if (clean.length === 1) return { kind: "team", teamId: clean[0].id, evidence };
  const both = clean.length === 2;
  return {
    kind: "choice",
    value: both ? "Both" : "Neither",
    evidence,
    matchesOption: (o) =>
      both ? /\bboth\b/.test(normWords(o)) : /\b(neither|none|no team|no one)\b/.test(normWords(o)),
  };
}

function resolveOwnGoals(ctx: Ctx, f: MatchFacts): Fact {
  const own = f.goals.filter((g) => g.ownGoal && inPeriod(g.minute, ctx.period));
  const evidence = `Own goals: ${goalList(f, own)}.`;
  if (ctx.shape === "players") return { kind: "players", names: own.map((g) => g.player), evidence };
  return { kind: "number", value: own.length, isCount: true, evidence };
}

function resolvePenalties(ctx: Ctx, f: MatchFacts): Fact {
  const scored = f.goals
    .filter((g) => g.penalty)
    .map((g) => ({ minute: g.minute, teamId: g.teamId, player: g.player, scored: true }));
  const missed = f.missedPenalties.map((p) => ({ ...p, scored: false }));
  const kind = /\b(miss|missed|misses|saved|save|saves)\b/.test(ctx.q)
    ? "missed"
    : /\b(score|scored|scores|convert|converted|converts|net|nets)\b/.test(ctx.q)
      ? "scored"
      : "awarded";
  const all = [...scored, ...missed]
    .filter((p) => inPeriod(p.minute, ctx.period))
    .sort((a, b) => a.minute - b.minute);
  const list = all.filter((p) => kind === "awarded" || p.scored === (kind === "scored"));
  const evidence = all.length
    ? `Penalties: ${all.map((p) => `${p.minute}' ${p.player} ${p.scored ? "scored" : "missed"} [${teamName(f, p.teamId)}]`).join(", ")}.`
    : "No penalties in the match.";

  if (ctx.shape === "players") return { kind: "players", names: list.map((p) => p.player), evidence };
  if (ctx.shape === "teams") {
    const [h, a] = [f.homeId, f.awayId].map((id) => list.filter((p) => p.teamId === id).length);
    if (h === a) return { kind: "team", teamId: null, evidence };
    return { kind: "team", teamId: h > a !== wantsLow(ctx.q) ? f.homeId : f.awayId, evidence };
  }
  const teamId = scopeTeamOf(ctx);
  const count = teamId === null ? list.length : list.filter((p) => p.teamId === teamId).length;
  return { kind: "number", value: count, isCount: true, evidence };
}

function resolveMargin(ctx: Ctx, f: MatchFacts): Fact {
  const margin = Math.abs(f.score[f.homeId] - f.score[f.awayId]);
  const evidence = `Result: ${f.statusText} (margin ${margin}).`;
  const teamId = scopeTeamOf(ctx);
  if (ctx.shape === "yesno" && teamId !== null) {
    return {
      kind: "boolean",
      value: f.winnerId === teamId && compare(margin, ctx.threshold ?? { op: ">=", value: 1 }),
      evidence,
    };
  }
  if (f.winnerId === null && ctx.shape !== "yesno") {
    return {
      kind: "choice",
      value: "Draw",
      evidence,
      matchesOption: (o) => TIE_OPTION_RE.test(normWords(o)),
    };
  }
  return { kind: "number", value: margin, evidence };
}

const SCORELINE_RE = /^\s*(\d+)\s*[-:–]\s*(\d+)\s*$/;

function asksScoreline(q: string): boolean {
  return (
    /\bscore ?line\b|\b(final|correct|exact|full ?time|ft|half ?time|ht) score\b|\bwhat will (be )?the score\b|\bscore (be|at|end)\b|\bend \d+ \d+\b/.test(q) &&
    !/\bgoals?\b|\bhow many\b|\btotal\b/.test(q)
  );
}

function resolveScoreline(ctx: Ctx, f: MatchFacts): Fact {
  const firstHalf = ctx.period === "FirstHalf";
  const [a, b] = f.quizOrder;
  const count = (id: number) => f.goals.filter((g) => g.teamId === id && (!firstHalf || g.minute <= 45)).length;
  const [ga, gb] = firstHalf ? [count(a), count(b)] : [f.score[a], f.score[b]];
  const note =
    a !== f.homeId ? " Options are read in the quiz's team order, which lists the away team first." : "";
  return {
    kind: "choice",
    value: `${ga}-${gb}`,
    evidence: `${firstHalf ? "Half-time" : "Final"} score: ${teamName(f, a)} ${ga}–${gb} ${teamName(f, b)}.${note}`,
    matchesOption: (o) => {
      const m = o.match(SCORELINE_RE);
      return !!m && +m[1] === ga && +m[2] === gb;
    },
    otherwise: (o) => /\b(any )?other\b/.test(normWords(o)),
    toBoolean: (c) => {
      const m = c.q.match(/\b(\d+) (\d+)\b/);
      return m ? +m[1] === ga && +m[2] === gb : null;
    },
  };
}

function resolveGoals(ctx: Ctx, f: MatchFacts): Fact {
  const { q } = ctx;
  const window = minuteWindow(q);
  const scoped = f.goals.filter((g) => inPeriod(g.minute, ctx.period) && (!window || window.test(g)));
  const scopeLabel =
    [ctx.period ? PERIOD_LABEL[ctx.period] : "", window?.label ?? ""].filter(Boolean).join(", ") || "match";
  const evidence = `Goals (${scopeLabel}): ${goalList(f, scoped)}.`;

  if (ctx.shape === "yesno" && /\b(goalless|scoreless|nil nil|0 0|no goals?)\b/.test(q) && scopeTeamOf(ctx) === null) {
    return { kind: "boolean", value: scoped.length === 0, evidence };
  }

  const milestone: Threshold | undefined = /\bhat ?tricks?\b/.test(q)
    ? { op: ">=", value: 3 }
    : /\bbraces?\b/.test(q)
      ? { op: ">=", value: 2 }
      : undefined;
  const teamId = scopeTeamOf(ctx);

  if (ctx.shape === "players") {
    const tally = new Map<string, number>();
    for (const g of scoped) {
      if (g.ownGoal || (teamId !== null && g.teamId !== teamId)) continue;
      tally.set(g.player, (tally.get(g.player) ?? 0) + 1);
    }
    const entries = [...tally.entries()];
    let names: string[];
    if (wantsLeader(q) && !milestone && !ctx.threshold) {
      const top = Math.max(0, ...entries.map(([, n]) => n));
      names = top > 0 ? entries.filter(([, n]) => n === top).map(([p]) => p) : [];
    } else {
      const t = ctx.threshold ?? milestone ?? { op: ">=" as const, value: 1 };
      names = entries.filter(([, n]) => compare(n, t)).map(([p]) => p);
    }
    return { kind: "players", names, evidence };
  }

  if (ctx.shape === "teams") {
    const [h, a] = [f.homeId, f.awayId].map((id) => scoped.filter((g) => g.teamId === id).length);
    if (h === a) return { kind: "team", teamId: null, evidence };
    return { kind: "team", teamId: h > a !== wantsLow(q) ? f.homeId : f.awayId, evidence };
  }

  if (ctx.mentionedPlayers.length === 1) {
    const p = ctx.mentionedPlayers[0];
    const value = scoped.filter((g) => !g.ownGoal && normWords(g.player) === p.key).length;
    return { kind: "number", value, isCount: true, implicitThreshold: milestone, evidence: `${p.name}: ${value} goal(s). ${evidence}` };
  }
  if (ctx.mentionedPlayers.length > 1) {
    return none(`Mentions several players (${ctx.mentionedPlayers.map((p) => p.name).join(", ")}).`);
  }
  if (teamId !== null) {
    const against = /\bconcede[sd]?\b|\bagainst\b/.test(q);
    const value = scoped.filter((g) => (g.teamId === teamId) !== against).length;
    return {
      kind: "number",
      value,
      isCount: true,
      evidence: `${teamName(f, teamId)} ${against ? "conceded" : "scored"} ${value}. ${evidence}`,
    };
  }
  return { kind: "number", value: scoped.length, isCount: true, evidence };
}

/* ---------- Team / player stats ---------- */

type Stat =
  | "yellow" | "red" | "cards" | "corners" | "possession" | "shots"
  | "shotsOnTarget" | "offsides" | "fouls" | "saves" | "xg" | "assists";

const STAT_LABEL: Record<Stat, string> = {
  yellow: "Yellow cards",
  red: "Red cards",
  cards: "Cards (yellow + red)",
  corners: "Corners",
  possession: "Possession %",
  shots: "Total shots",
  shotsOnTarget: "Shots on target",
  offsides: "Offsides",
  fouls: "Fouls",
  saves: "Keeper saves",
  xg: "Expected goals (xG)",
  assists: "Assists",
};

function detectStat(q: string): Stat | null {
  if (/\bred cards?\b|\bsent off\b|\bsending offs?\b|\bdismissals?\b|\breds\b/.test(q)) return "red";
  if (/\byellow cards?\b|\byellows\b/.test(q)) return "yellow";
  if (/\bcards?\b|\bbookings?\b|\bbooked\b|\bcautions?\b|\bcautioned\b/.test(q)) return "cards";
  if (/\bcorners?\b/.test(q)) return "corners";
  if (/\bpossession\b/.test(q)) return "possession";
  if (/\bshots? on (target|goal)\b|\bon target\b/.test(q)) return "shotsOnTarget";
  if (/\bshots?\b|\battempts?\b/.test(q)) return "shots";
  if (/\boffsides?\b/.test(q)) return "offsides";
  if (/\bfouls?\b/.test(q)) return "fouls";
  if (/\bsaves?\b/.test(q)) return "saves";
  if (/\bxg\b|\bexpected goals\b/.test(q)) return "xg";
  if (/\bassists?\b|\bassisted\b/.test(q)) return "assists";
  return null;
}

function teamStat(f: MatchFacts, stat: Stat, teamId: number, period: Period | null): number | null {
  if (stat === "cards") {
    const y = teamStat(f, "yellow", teamId, period);
    const r = teamStat(f, "red", teamId, period);
    return y === null || r === null ? null : y + r;
  }
  if (stat === "assists") {
    return period ? null : f.players.filter((p) => p.teamId === teamId).reduce((n, p) => n + p.assists, 0);
  }
  const pair = f.teamStats[period ?? "All"].get(stat);
  if (pair) return teamId === f.homeId ? pair[0] : pair[1];
  if (stat === "yellow" || stat === "red") {
    return f.cards.filter((c) => c.teamId === teamId && inPeriod(c.minute, period) && c.red === (stat === "red")).length;
  }
  return null;
}

function playerStatValue(f: MatchFacts, p: Player, stat: Stat): number | null {
  const cards = f.cards.filter((c) => c.playerId === p.id);
  switch (stat) {
    case "yellow": return cards.filter((c) => !c.red).length;
    case "red": return cards.filter((c) => c.red).length;
    case "cards": return cards.length;
    case "shots": return p.shots;
    case "shotsOnTarget": return p.shotsOnTarget;
    case "saves": return p.saves;
    case "fouls": return p.fouls;
    case "assists": return p.assists;
    default: return null;
  }
}

function resolveStat(ctx: Ctx, f: MatchFacts, stat: Stat): Fact {
  const { q, period } = ctx;
  const label = `${STAT_LABEL[stat]}${period ? ` (${PERIOD_LABEL[period]})` : ""}`;
  const [h, a] = [teamStat(f, stat, f.homeId, period), teamStat(f, stat, f.awayId, period)];
  const teamLine = h === null || a === null ? "" : `${teamName(f, f.homeId)} ${h}, ${teamName(f, f.awayId)} ${a}`;
  const isCount = stat !== "possession" && stat !== "xg";

  if (ctx.shape === "players" || ctx.mentionedPlayers.length) {
    if (period) return none(`${f.source} only has full-match player stats, not ${PERIOD_LABEL[period]}.`);
    const teamId = scopeTeamOf(ctx);
    if (ctx.shape !== "players") {
      if (ctx.mentionedPlayers.length > 1) return none("Mentions several players.");
      const p = ctx.mentionedPlayers[0];
      const value = playerStatValue(f, p, stat);
      if (value === null) return none(`${STAT_LABEL[stat]} isn't tracked per player.`);
      return { kind: "number", value, isCount, evidence: `${STAT_LABEL[stat]} — ${p.name}: ${value}.` };
    }
    const pool = ctx.mentionedPlayers.length > 1
      ? ctx.mentionedPlayers
      : f.players.filter((p) => teamId === null || p.teamId === teamId);
    const scored = pool
      .map((p) => ({ p, v: playerStatValue(f, p, stat) }))
      .filter((x): x is { p: Player; v: number } => x.v !== null);
    if (!scored.length) return none(`${STAT_LABEL[stat]} isn't tracked per player.`);
    let leaders: typeof scored;
    const perEvent = stat === "yellow" || stat === "red" || stat === "cards" || stat === "assists";
    if (ctx.threshold) leaders = scored.filter((x) => compare(x.v, ctx.threshold!));
    else if (perEvent && !wantsLeader(q)) leaders = scored.filter((x) => x.v > 0);
    else {
      const top = Math.max(...scored.map((x) => x.v));
      leaders = top > 0 ? scored.filter((x) => x.v === top) : [];
    }
    return {
      kind: "players",
      names: leaders.map((x) => x.p.name),
      evidence: leaders.length
        ? `${STAT_LABEL[stat]}: ${leaders.map((x) => `${x.p.name} ${x.v}`).join(", ")}.`
        : `${STAT_LABEL[stat]}: no player qualifies.`,
    };
  }

  if (h === null || a === null) return none(`${f.source} has no ${label.toLowerCase()} for this match.`);
  const evidence = `${label}: ${teamLine}.`;

  if (ctx.shape === "teams") {
    if (h === a) return { kind: "team", teamId: null, evidence };
    return { kind: "team", teamId: h > a !== wantsLow(q) ? f.homeId : f.awayId, evidence };
  }

  const teamId = scopeTeamOf(ctx);
  if (teamId !== null) {
    return { kind: "number", value: teamId === f.homeId ? h : a, isCount, evidence };
  }
  if (stat === "possession") return none(`${evidence} Possession needs a team to be named.`);
  return { kind: "number", value: Math.round((h + a) * 100) / 100, isCount, evidence };
}

function resolvePlayerOfMatch(f: MatchFacts): Fact {
  if (!f.potm.length) return none(`${f.source} hasn't named a player of the match yet.`);
  return {
    kind: "players",
    names: f.potm,
    evidence: `Player of the match: ${f.potm[0]}${f.potmRating ? ` (${f.source} rating ${f.potmRating})` : ""}.`,
  };
}

function resolveQuestion(ctx: Ctx, f: MatchFacts): Fact {
  const { q } = ctx;
  if (!f.started) return none(`The match hasn't started on ${f.source} (${f.statusText}).`);

  if (/\bshoot ?outs?\b|\bpenalty shoot|\bon penalties\b|\bgo(es)? to penalties\b/.test(q)) {
    return resolveShootout(ctx, f);
  }
  if (/\bextra time\b|\baet\b/.test(q) && !/\bgoals?\b/.test(q)) {
    return {
      kind: "boolean",
      value: f.wentToExtraTime,
      evidence: `${f.statusText}: ${f.wentToExtraTime ? "went" : "didn't go"} to extra time.`,
    };
  }
  if (/\b(player|man|woman) of the match\b|\bpotm\b|\bmotm\b|\bpom\b|\bhighest rated\b/.test(q)) {
    return resolvePlayerOfMatch(f);
  }
  if (/\b(advance|advances|qualify|qualifies|progress|progresses|go(es)? through|knocked out|eliminated)\b/.test(q)) {
    return resolveAdvance(ctx, f);
  }
  if (/\bwhich half\b|\bhalf with (the )?(more|most)\b|\b(higher|highest) scoring half\b/.test(q)) {
    return resolveBusierHalf(f);
  }
  if (/\b(first|opening) goal\b|\bscores? (the )?first\b|\bfirst (to score|goal ?scorer|scorer)\b|\bopens? the scoring\b/.test(q)) {
    return resolveNthGoal(ctx, f, "first");
  }
  if (/\b(last|final) goal\b|\bscores? (the )?last\b|\blast (to score|goal ?scorer|scorer)\b/.test(q)) {
    return resolveNthGoal(ctx, f, "last");
  }
  if (/\bboth (teams|sides)\b.*\bscor|\bbtts\b/.test(q)) return resolveBothTeamsScore(ctx, f);
  if (/\bclean sheets?\b|\bshut ?outs?\b/.test(q)) return resolveCleanSheet(ctx, f);
  if (/\bown goals?\b/.test(q)) return resolveOwnGoals(ctx, f);
  if (/\bpenalt(y|ies)\b|\bspot kicks?\b/.test(q)) return resolvePenalties(ctx, f);
  if (/\bmargin\b|\b(win|wins|won|winning) by\b|\bgoal difference\b/.test(q)) return resolveMargin(ctx, f);
  if (ctx.shape === "choice" || asksScoreline(q)) return resolveScoreline(ctx, f);

  const stat = detectStat(q);
  if (stat) return resolveStat(ctx, f, stat);

  if (/\bgoals?\b|\bscores?\b|\bscored\b|\bscorers?\b|\bscoring\b|\bnet\b|\bhat ?tricks?\b|\bbraces?\b|\bgoalless\b|\bscoreless\b/.test(q)) {
    return resolveGoals(ctx, f);
  }
  if (ctx.period === "FirstHalf" && /\b(lead|leads|leading|ahead|winning|result|win|wins)\b/.test(q)) {
    return resolveHalfTimeResult(f);
  }
  if (/\b(win|wins|won|winner|winning|victory|victorious|beat|beats|lose|loses|lost|loser|losing|draw|drawn|tie|tied|result|outcome)\b/.test(q)) {
    return resolveWinner(ctx, f);
  }
  return none(`No ${f.source} rule matches this question's wording.`);
}

/* ---------- Entry points ---------- */

export function answerFootballQuiz(
  questions: QuizQuestion[],
  match: FmMatchDetails,
  quizTeams: { teamA: QuizTeamLike; teamB: QuizTeamLike },
): MatchAnswerProposal[] {
  return answerFootballFacts(questions, buildMatchFacts(match, quizTeams));
}

/** Answers from facts another site's data was turned into. */
export function answerFootballFacts(
  questions: QuizQuestion[],
  facts: MatchFacts,
): MatchAnswerProposal[] {
  return answerQuestions(questions, (question) => {
    const preQ = normWords(question.questionText ?? "");
    const base = buildAnswerContext(question, {
      teams: facts.teams,
      roster: facts.players,
      winnerId: facts.winnerId,
      choiceOption: asksScoreline(preQ) ? (o) => SCORELINE_RE.test(o) : undefined,
      roleTeamId: (q) =>
        /\bhome (team|side|club)\b|\bhosts\b/.test(q)
          ? facts.homeId
          : /\baway (team|side|club)\b|\bvisitors\b|\bvisiting (team|side)\b/.test(q)
            ? facts.awayId
            : null,
    });
    const ctx: Ctx = { ...base, period: periodOf(base.q) };
    return answerFromFact(resolveQuestion(ctx, facts), ctx);
  });
}

export type {
  Card as FootballCard,
  Goal as FootballGoal,
  MatchFacts as FootballMatchFacts,
  Player as FootballPlayer,
  Stat as FootballStat,
};
