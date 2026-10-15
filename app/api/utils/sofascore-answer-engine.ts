/**
 * Answers from a Sofascore match: turns the event and its detail endpoints
 * into each sport engine's match facts, then runs that sport's question
 * bank — the same one Cricbuzz (cricket) and FotMob (football) answers use,
 * and the basketball one. Pure code; runs in the browser with `sofascore.ts`.
 */

import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchAnswerProposal } from "@/app/interface/match-answers.interface";
import {
  answerBasketballFacts,
  type BasketballMatchFacts,
  type BasketballPlayer,
  type BasketballStat,
} from "./basketball-answer-engine";
import type { CbBatter, CbBowler } from "./cricbuzz";
import {
  answerCricketFacts,
  type CricketInningsFacts,
  type CricketMatchFacts,
} from "./cricbuzz-answer-engine";
import {
  answerFootballFacts,
  type FootballCard,
  type FootballGoal,
  type FootballMatchFacts,
  type FootballStat,
} from "./fotmob-answer-engine";
import {
  buildAnswerTeam,
  normWords,
  pairQuizTeams,
  type AnswerTeam,
  type ProviderTeam,
  type QuizTeamLike,
} from "./quiz-answer-core";
import type {
  SofascoreMatchData,
  SsBattingLine,
  SsEvent,
  SsInnings,
  SsLineupPlayer,
  SsScore,
  SsStatisticsPeriod,
  SsTeam,
} from "./sofascore";

type QuizTeams = { teamA: QuizTeamLike; teamB: QuizTeamLike };

const SOURCE = "Sofascore";

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);

/**
 * A Sofascore team for name matching and evidence text. The short name is
 * an abbreviation — `shortName` when it is one ("WI"), else `nameCode`
 * ("BHA" for "Brighton") — and the other of the two is another name.
 */
export function sofascoreProviderTeam(t: SsTeam): ProviderTeam {
  const short = t.shortName && t.shortName.length <= 4 ? t.shortName : t.nameCode || t.shortName || t.name;
  return {
    name: t.name,
    shortName: short,
    otherNames: [t.shortName, t.nameCode].filter((n): n is string => !!n && n !== t.name && n !== short),
  };
}

/** [home, away] answer teams. */
function answerTeams(event: SsEvent, quizTeams: QuizTeams): AnswerTeam[] {
  const { homeTeam: home, awayTeam: away } = event;
  const hp = sofascoreProviderTeam(home);
  const ap = sofascoreProviderTeam(away);
  const { t1Quiz, t2Quiz } = pairQuizTeams(quizTeams, hp, ap);
  return [buildAnswerTeam(home.id, hp, t1Quiz), buildAnswerTeam(away.id, ap, t2Quiz)];
}

const started = (e: SsEvent) => !["notstarted", "canceled", "postponed"].includes(e.status.type);

/* ---------- Cricket ---------- */

/**
 * Cricbuzz-style format ("T20", "ODI", "TEST", "T10", "HUNDRED") from the
 * competition's name, or failing that the innings; "" when unknown.
 */
export function cricketFormat(event: SsEvent, innings: SsInnings[] | null): string {
  const names = `${event.tournament?.uniqueTournament?.name ?? ""} ${event.tournament?.name ?? ""}`;
  if (/\btest\b/i.test(names)) return "TEST";
  if (/\bt10\b/i.test(names)) return "T10";
  if (/\bhundred\b/i.test(names)) return "HUNDRED";
  if (/\bt20|twenty ?20\b/i.test(names)) return "T20";
  if (/\bodi\b|\bone[- ]day\b|\b50[- ]overs?\b/i.test(names)) return "ODI";
  // Franchise leagues are T20s.
  if (/premier league|big bash|super league|\bsa20\b|\bilt20\b|major league cricket|\bblast\b|super smash/i.test(names)) {
    return "T20";
  }
  if (innings?.length) {
    // Two innings for a side (ignoring super overs) is a Test; 21–50 overs is an ODI.
    const perTeam = new Map<number, number>();
    for (const i of innings) {
      if (num(i.overs) > 1) perTeam.set(i.battingTeam.id, (perTeam.get(i.battingTeam.id) ?? 0) + 1);
    }
    if ([...perTeam.values()].some((n) => n > 1)) return "TEST";
    if (innings.some((i) => num(i.overs) > 20 && num(i.overs) <= 50)) return "ODI";
  }
  return "";
}

const POWERPLAY_OVERS: Record<string, number> = { T20: 6, ODI: 10 };

/** The scorecard's dismissal as Cricbuzz words it: "" = did not bat, "not out", or how they were out. */
function outDesc(b: SsBattingLine): string {
  const type = (b.wicketTypeName ?? "").trim();
  if (/did not bat|yet to bat|\bdnb\b/i.test(type)) return "";
  if (!type) return num(b.balls) > 0 || num(b.score) > 0 ? "not out" : "";
  if (/not out|batting/i.test(type)) return "not out";
  return type.toLowerCase();
}

function buildCricketFacts(data: SofascoreMatchData, quizTeams: QuizTeams): CricketMatchFacts {
  const { event } = data;
  const inningsList = [...(data.innings ?? [])].sort((a, b) => a.number - b.number);
  const format = cricketFormat(event, data.innings);
  const ppOvers = POWERPLAY_OVERS[format] ?? null;

  const innings: CricketInningsFacts[] = inningsList.map((inn) => {
    const batters: CbBatter[] = (inn.battingLine ?? [])
      .filter((b) => b.player?.id)
      .map((b) => ({
        batId: b.player.id,
        batName: b.player.name,
        runs: num(b.score),
        balls: num(b.balls),
        fours: num(b.s4),
        sixes: num(b.s6),
        outDesc: outDesc(b),
      }))
      .filter((b) => b.outDesc !== "" || b.balls > 0 || b.runs > 0);
    const bowlers: CbBowler[] = (inn.bowlingLine ?? [])
      .filter((b) => b.player?.id)
      .map((b) => ({
        bowlerId: b.player.id,
        bowlName: b.player.name,
        overs: num(b.over),
        maidens: num(b.maiden),
        runs: num(b.run),
        wickets: num(b.wicket),
      }));

    // Powerplay runs: the innings score after its last ball inside the powerplay overs.
    const pp =
      ppOvers === null ? [] : (data.balls ?? []).filter((b) => b.inningNumber === inn.number && b.over <= ppOvers);
    const ppRuns = pp.length ? Math.max(...pp.map((b) => Number(b.score.split("/")[0]) || 0)) : null;

    const overs = num(inn.overs);
    return {
      batTeamId: inn.battingTeam.id,
      bowlTeamId: inn.bowlingTeam.id,
      runs: num(inn.score),
      wickets: num(inn.wickets),
      overs,
      balls: Math.floor(overs) * 6 + Math.round((overs % 1) * 10),
      revisedOvers: 0,
      ppRuns,
      ppOvers,
      topPartnership: inn.partnerships?.length
        ? Math.max(...inn.partnerships.map((p) => num(p.score)))
        : null,
      batters,
      bowlers,
    };
  });

  const sideId = (code: number | undefined) =>
    code === 1 ? event.homeTeam.id : code === 2 ? event.awayTeam.id : null;
  const tossWinner = normWords(event.tossWin ?? "");
  const tossTeam = tossWinner
    ? [event.homeTeam, event.awayTeam].find((t) =>
        [t.name, t.shortName, t.nameCode].some((n) => n && normWords(n) === tossWinner),
      )
    : undefined;
  const decision = event.tossDecision ?? "";

  return {
    source: SOURCE,
    teams: answerTeams(event, quizTeams),
    innings,
    format,
    status: event.note || event.status.description,
    toss: {
      winnerId: tossTeam?.id ?? null,
      decision: /bat/i.test(decision) ? "bat" : /bowl|field/i.test(decision) ? "bowl" : null,
    },
    winnerId: event.status.type === "finished" ? sideId(event.winnerCode) : null,
    // Sofascore doesn't name one for cricket.
    potm: [],
  };
}

/* ---------- Football ---------- */

const SOFASCORE_FOOTBALL_STATS: Record<string, FootballStat> = {
  yellowCards: "yellow",
  redCards: "red",
  cornerKicks: "corners",
  ballPossession: "possession",
  totalShotsOnGoal: "shots",
  shotsOnGoal: "shotsOnTarget",
  fouls: "fouls",
};

/** [home, away] per stat for one statistics period, keyed by `pick(item)`. */
function statsPeriod<S>(
  period: SsStatisticsPeriod | undefined,
  pick: (item: { key?: string; name: string }) => S | undefined,
): Map<S, [number, number]> {
  const map = new Map<S, [number, number]>();
  for (const group of period?.groups ?? []) {
    for (const item of group.statisticsItems ?? []) {
      const stat = pick(item);
      if (stat === undefined || map.has(stat)) continue;
      const h = item.homeValue ?? parseFloat(item.home ?? "");
      const a = item.awayValue ?? parseFloat(item.away ?? "");
      if (Number.isFinite(h) && Number.isFinite(a)) map.set(stat, [h, a]);
    }
  }
  return map;
}

const lineupPlayers = (data: SofascoreMatchData): (SsLineupPlayer & { side: "home" | "away" })[] => [
  ...(data.lineups?.home?.players ?? []).map((p) => ({ ...p, side: "home" as const })),
  ...(data.lineups?.away?.players ?? []).map((p) => ({ ...p, side: "away" as const })),
];

const FOOTBALL_STATUS: Record<string, string> = {
  Ended: "Full-Time",
  AET: "After extra time",
  AP: "After penalties",
};

function buildFootballFacts(data: SofascoreMatchData, quizTeams: QuizTeams): FootballMatchFacts {
  const { event } = data;
  const homeId = event.homeTeam.id;
  const awayId = event.awayTeam.id;
  const hs: SsScore = event.homeScore ?? {};
  const as: SsScore = event.awayScore ?? {};
  const incidents = data.incidents ?? [];

  // Goals in scoring order; the running score says which side each counts
  // for, which also settles own goals.
  const goals: FootballGoal[] = [];
  let prev = [0, 0];
  for (const g of incidents
    .filter((i) => i.incidentType === "goal")
    .sort((a, b) => num(a.homeScore) + num(a.awayScore) - (num(b.homeScore) + num(b.awayScore)))) {
    const now = [g.homeScore ?? prev[0], g.awayScore ?? prev[1]];
    const home = now[0] > prev[0] ? true : now[1] > prev[1] ? false : !!g.isHome;
    prev = now;
    goals.push({
      minute: num(g.time),
      added: g.addedTime && g.addedTime < 999 ? g.addedTime : 0,
      teamId: home ? homeId : awayId,
      player: g.player?.name ?? g.playerName ?? "Unknown",
      ownGoal: g.incidentClass === "ownGoal",
      penalty: g.incidentClass === "penalty",
    });
  }

  const cards: FootballCard[] = incidents
    .filter((i) => i.incidentType === "card")
    .map((c) => ({
      teamId: c.isHome ? homeId : awayId,
      red: c.incidentClass === "red" || c.incidentClass === "yellowRed",
    }));

  const goalsOf = (s: SsScore) => num(s.display ?? s.current);
  const [homeGoals, awayGoals] = [goalsOf(hs), goalsOf(as)];
  const description = event.status.description;
  const reason = FOOTBALL_STATUS[description] ?? description;

  return {
    source: SOURCE,
    teams: answerTeams(event, quizTeams),
    homeId,
    awayId,
    started: started(event),
    statusText: `${event.homeTeam.name} ${homeGoals} - ${awayGoals} ${event.awayTeam.name}${reason ? ` (${reason})` : ""}`,
    score: { [homeId]: homeGoals, [awayId]: awayGoals },
    goals,
    cards,
    teamStats: statsPeriod(
      data.statistics?.find((p) => p.period === "ALL"),
      (item) => (item.key ? SOFASCORE_FOOTBALL_STATS[item.key] : undefined),
    ),
  };
}

/* ---------- Basketball ---------- */

/** Team statistics by their Sofascore name ("3 pointers", "Rebounds", …). */
const BASKETBALL_TEAM_STATS: [RegExp, BasketballStat][] = [
  [/^(3|three) point/, "threes"],
  [/^(total )?rebounds$/, "rebounds"],
  [/^assists$/, "assists"],
  [/^steals$/, "steals"],
];

/** Box-score keys per stat, first one present wins. */
const BASKETBALL_PLAYER_STATS: Record<BasketballStat, string[]> = {
  points: ["points"],
  rebounds: ["rebounds", "totalRebounds"],
  assists: ["assists"],
  steals: ["steals"],
  threes: ["threePointsMade", "threePointersMade", "threePointsScored"],
};

function basketballPlayerStats(s: Record<string, unknown> | undefined): BasketballPlayer["stats"] {
  const stats: BasketballPlayer["stats"] = {};
  if (!s) return stats;
  for (const [stat, keys] of Object.entries(BASKETBALL_PLAYER_STATS) as [BasketballStat, string[]][]) {
    // Keys are left out at 0, so a missing stat reads as 0.
    const key = keys.find((k) => s[k] !== undefined);
    stats[stat] = key ? num(s[key]) : 0;
  }
  if (s.rebounds === undefined && s.totalRebounds === undefined) {
    stats.rebounds = num(s.defensiveRebounds) + num(s.offensiveRebounds);
  }
  return stats;
}

function buildBasketballFacts(data: SofascoreMatchData, quizTeams: QuizTeams): BasketballMatchFacts {
  const { event } = data;
  const homeId = event.homeTeam.id;
  const awayId = event.awayTeam.id;
  const hs: SsScore = event.homeScore ?? {};
  const as: SsScore = event.awayScore ?? {};

  const periodCount = event.defaultPeriodCount === 2 ? 2 : 4;
  const periodKeys = (["period1", "period2", "period3", "period4"] as const).slice(0, periodCount);
  const periods: [number, number][] = periodKeys
    .filter((k) => hs[k] !== undefined || as[k] !== undefined)
    .map((k) => [num(hs[k]), num(as[k])]);

  const seen = new Set<number>();
  const players: BasketballPlayer[] = [];
  for (const p of lineupPlayers(data)) {
    if (!p.player?.id || seen.has(p.player.id)) continue;
    seen.add(p.player.id);
    players.push({
      id: p.player.id,
      name: p.player.name,
      key: normWords(p.player.name),
      teamId: p.teamId ?? (p.side === "home" ? homeId : awayId),
      stats: basketballPlayerStats(p.statistics),
    });
  }

  const [homePts, awayPts] = [num(hs.display ?? hs.current), num(as.display ?? as.current)];
  const description = event.status.description;
  return {
    source: SOURCE,
    teams: answerTeams(event, quizTeams),
    homeId,
    awayId,
    players,
    started: started(event),
    finished: event.status.type === "finished",
    statusText: `${event.homeTeam.name} ${homePts} - ${awayPts} ${event.awayTeam.name}${description ? ` (${description})` : ""}`,
    score: { [homeId]: homePts, [awayId]: awayPts },
    periods,
    overtime: hs.overtime !== undefined || as.overtime !== undefined ? [num(hs.overtime), num(as.overtime)] : null,
    winnerId: homePts > awayPts ? homeId : awayPts > homePts ? awayId : null,
    teamStats: statsPeriod(data.statistics?.find((p) => p.period === "ALL"), (item) => {
      const name = normWords(item.name);
      return BASKETBALL_TEAM_STATS.find(([re]) => re.test(name))?.[1];
    }),
  };
}

/* ---------- Entry point ---------- */

export function answerSofascoreQuiz(
  questions: QuizQuestion[],
  data: SofascoreMatchData,
  quizTeams: QuizTeams,
): MatchAnswerProposal[] {
  switch (data.sport) {
    case "cricket":
      return answerCricketFacts(questions, buildCricketFacts(data, quizTeams));
    case "football":
      return answerFootballFacts(questions, buildFootballFacts(data, quizTeams));
    case "basketball":
      return answerBasketballFacts(questions, buildBasketballFacts(data, quizTeams));
  }
}
