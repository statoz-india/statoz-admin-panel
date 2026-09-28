/**
 * Rule-based answers for cricket quiz questions from a Cricbuzz scorecard.
 * The sport-agnostic parts (question parsing, option matching, Yes/No) live
 * in `quiz-answer-core`; this file builds the match facts and the cricket
 * resolvers — toss, result, player of the match, and scorecard metrics
 * (runs, wickets, sixes, powerplay, …) scoped to a player, team, innings or
 * the whole match.
 */

import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchAnswerProposal } from "@/app/interface/match-answers.interface";
import type { CbBatter, CbBowler, CbScorecard } from "./cricbuzz";
import {
  answerFromFact,
  answerQuestions,
  buildAnswerContext,
  buildAnswerTeam,
  compare,
  none,
  normWords,
  OP_TEXT,
  pairQuizTeams,
  type AnswerContext,
  type AnswerPlayer,
  type AnswerTeam,
  type Fact,
  type QuizTeamLike,
  type Threshold,
} from "./quiz-answer-core";

/* ---------- Match facts ---------- */

interface Player extends AnswerPlayer {
  id: number;
  batting: CbBatter[];
  bowling: CbBowler[];
}

interface InningsFacts {
  batTeamId: number;
  bowlTeamId: number;
  runs: number;
  wickets: number;
  overs: number;
  /** Legal balls faced. */
  balls: number;
  revisedOvers: number;
  extras: number;
  wides: number;
  noBalls: number;
  ppRuns: number | null;
  ppWickets: number | null;
  ppOvers: number | null;
  topPartnership: number | null;
  batters: CbBatter[];
  bowlers: CbBowler[];
}

interface MatchFacts {
  teams: AnswerTeam[];
  innings: InningsFacts[];
  players: Player[];
  /** Cricbuzz `matchFormat`: "T20", "ODI", "TEST", … */
  format: string;
  status: string;
  toss: { winnerId: number | null; decision: "bat" | "bowl" | null };
  winnerId: number | null;
  margin: { value: number; unit: "runs" | "wickets" } | null;
  potm: string[];
}

type Ctx = AnswerContext<Player> & { inningsIndex: number | null };

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const maxOf = (xs: number[]) => (xs.length ? Math.max(...xs) : null);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);

const batted = (b: CbBatter) => b.outDesc !== "" || num(b.balls) > 0 || num(b.runs) > 0;
const isOut = (b: CbBatter) => b.outDesc !== "" && !/not out/i.test(b.outDesc);
const isDuck = (b: CbBatter) => isOut(b) && num(b.runs) === 0;
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

  const players = new Map<number, Player>();
  const player = (id: number, name: string, teamId: number) => {
    let p = players.get(id);
    if (!p) {
      p = { id, name, key: normWords(name), teamId, batting: [], bowling: [] };
      players.set(id, p);
    }
    return p;
  };

  const innings: InningsFacts[] = sc.scoreCard.map((inn) => {
    const batters = Object.values(inn.batTeamDetails?.batsmenData ?? {});
    const bowlers = Object.values(inn.bowlTeamDetails?.bowlersData ?? {});
    for (const b of batters) {
      const p = player(b.batId, b.batName, inn.batTeamDetails.batTeamId);
      if (batted(b)) p.batting.push(b);
    }
    for (const b of bowlers) player(b.bowlerId, b.bowlName, inn.bowlTeamDetails.bowlTeamId).bowling.push(b);

    const pp =
      Object.values(inn.ppData ?? {}).find((p) => /mandatory/i.test(p.ppType)) ??
      Object.values(inn.ppData ?? {})[0];
    const ppOvers = pp ? num(pp.ppOversTo) : null;
    const wickets = Object.values(inn.wicketsData ?? {});

    return {
      batTeamId: inn.batTeamDetails.batTeamId,
      bowlTeamId: inn.bowlTeamDetails.bowlTeamId,
      runs: num(inn.scoreDetails?.runs),
      wickets: num(inn.scoreDetails?.wickets),
      overs: num(inn.scoreDetails?.overs),
      balls: inn.scoreDetails?.ballNbr ?? oversToBalls(num(inn.scoreDetails?.overs)),
      revisedOvers: num(inn.scoreDetails?.revisedOvers),
      extras: num(inn.extrasData?.total),
      wides: num(inn.extrasData?.wides),
      noBalls: num(inn.extrasData?.noBalls),
      ppRuns: pp ? num(pp.runsScored) : null,
      ppWickets: ppOvers === null ? null : wickets.filter((w) => num(w.wktOver) <= ppOvers).length,
      ppOvers,
      topPartnership: maxOf(Object.values(inn.partnershipsData ?? {}).map((p) => num(p.totalRuns))),
      batters: batters.filter(batted),
      bowlers,
    };
  });

  const result = header.result;
  const winnerId =
    result?.resultType === "win" && result.winningteamId ? result.winningteamId : null;
  const decision = header.tossResults?.decision;

  return {
    teams,
    innings,
    players: [...players.values()],
    format: header.matchFormat ?? "",
    status: header.status ?? "",
    toss: {
      // Cricbuzz sends 0 / "" when there was no toss.
      winnerId: header.tossResults?.tossWinnerId || null,
      decision: !decision ? null : /bat/i.test(decision) ? "bat" : "bowl",
    },
    winnerId,
    margin:
      winnerId && result?.winningMargin
        ? { value: result.winningMargin, unit: result.winByRuns ? "runs" : "wickets" }
        : null,
    potm: (header.playersOfTheMatch ?? []).map((p) => p.fullName || p.name).filter(Boolean),
  };
}

/* ---------- Question context ---------- */

const INNINGS_PATTERNS: [RegExp, number][] = [
  [/\b(1st|first) innings\b|\bbat(s|ting)? first\b|\bset(ting)? (the |a )?target\b/, 0],
  [/\b(2nd|second) innings\b|\bbat(s|ting)? second\b|\bchasing\b|\b(run|the) chase\b/, 1],
  [/\b(3rd|third) innings\b/, 2],
  [/\b(4th|fourth) innings\b/, 3],
];

const inningsIndexOf = (q: string) => INNINGS_PATTERNS.find(([re]) => re.test(q))?.[1] ?? null;

function decisionForOption(option: string): "bat" | "bowl" | undefined {
  const o = normWords(option);
  const bat = /\bbat/.test(o);
  const bowl = /\b(bowl|field)/.test(o);
  return bat === bowl ? undefined : bat ? "bat" : "bowl";
}

/* ---------- Resolvers ---------- */

function teamShort(facts: MatchFacts, id: number | null): string {
  return facts.teams.find((t) => t.id === id)?.shortName ?? "—";
}

function resolveToss(ctx: Ctx, facts: MatchFacts): Fact {
  const { winnerId, decision } = facts.toss;
  if (winnerId === null) return none("The toss result isn't on the Cricbuzz scorecard yet.");
  const evidence = `${teamShort(facts, winnerId)} won the toss${decision ? ` and chose to ${decision}` : ""}.`;

  const rest = ctx.q.replace(
    /\btoss (winner|winning team)\b|\btoss winning\b|\b(win|wins|won|winning) the toss\b/g,
    " ",
  );
  if (/\b(win|wins|won)\b.*\b(match|game)\b|\b(match|game) winner\b/.test(rest)) {
    if (facts.winnerId === null) return none(`${evidence} The match has no winner (${facts.status}).`);
    return {
      kind: "boolean",
      value: winnerId === facts.winnerId,
      evidence: `${evidence} Match: ${facts.status}.`,
    };
  }

  const asksDecision =
    ctx.shape === "choice" ||
    (ctx.shape !== "teams" &&
      /\b(choose|chose|choice|elect|elects|elected|opt|opts|decide|decides|decision|call)\b|\bbat or (bowl|field)\b|\b(bowl|field) or bat\b|\bbat first\b|\b(bowl|field) first\b/.test(
        ctx.q,
      ));
  if (asksDecision) {
    if (!decision) return none(`${evidence} The toss decision isn't on the scorecard.`);
    return {
      kind: "choice",
      value: decision === "bat" ? "Bat" : "Bowl",
      evidence,
      matchesOption: (o) => decisionForOption(o) === decision,
      toBoolean: (c) => {
        // "Will India elect to bowl?" when India lost the toss → No.
        if (c.mentionedTeams.length === 1 && c.mentionedTeams[0].id !== winnerId) return false;
        const bat = /\bbat/.test(c.q.replace(/\bbat or (bowl|field)\b|\b(bowl|field) or bat\b/g, " "));
        const bowl = /\b(bowl|field)/.test(c.q);
        if (bat === bowl) return null;
        return decision === (bat ? "bat" : "bowl");
      },
    };
  }

  return { kind: "team", teamId: winnerId, evidence };
}

function resolvePlayerOfMatch(facts: MatchFacts): Fact {
  if (!facts.potm.length) return none("Cricbuzz hasn't named a player of the match yet.");
  return { kind: "players", names: facts.potm, evidence: `Player of the match: ${facts.potm.join(", ")}.` };
}

function resolveMargin(ctx: Ctx, facts: MatchFacts): Fact {
  if (!facts.margin) return none(`No winning margin: ${facts.status}.`);
  const { value, unit } = facts.margin;
  const asksRuns = /\bruns?\b/.test(ctx.q);
  const asksWickets = /\bwickets?\b|\bwkts?\b/.test(ctx.q);
  if ((asksRuns && !asksWickets && unit !== "runs") || (asksWickets && !asksRuns && unit !== "wickets")) {
    return none(`${facts.status} — the question asks for a margin in ${asksRuns ? "runs" : "wickets"}.`);
  }
  return { kind: "number", value, unit, evidence: `${facts.status} (margin: ${value} ${unit}).` };
}

function resolveWinner(ctx: Ctx, facts: MatchFacts): Fact {
  const evidence = `Result: ${facts.status || "not available"}.`;
  if (facts.winnerId === null) return { kind: "team", teamId: null, evidence };
  const asksLoser =
    /\b(lose|loses|lost|loser|losing)\b/.test(ctx.q) && !/\b(win|wins|won|winner)\b/.test(ctx.q);
  const teamId = asksLoser
    ? facts.teams.find((t) => t.id !== facts.winnerId)?.id ?? null
    : facts.winnerId;
  return { kind: "team", teamId, evidence };
}

function resolveBattingFirst(ctx: Ctx, facts: MatchFacts): Fact {
  const first = facts.innings[0];
  if (!first) return none("No innings on the scorecard yet.");
  const bowlingFirst = /\b(bowl|bowls|bowling|field|fields|fielding) first\b/.test(ctx.q);
  return {
    kind: "team",
    teamId: bowlingFirst ? first.bowlTeamId : first.batTeamId,
    evidence: `${teamShort(facts, first.batTeamId)} batted first.`,
  };
}

function resolveAllOut(ctx: Ctx, facts: MatchFacts): Fact {
  const scopeTeam = ctx.mentionedTeams.length === 1 ? ctx.mentionedTeams[0] : null;
  const list =
    ctx.inningsIndex !== null
      ? facts.innings.slice(ctx.inningsIndex, ctx.inningsIndex + 1)
      : facts.innings.filter((i) => !scopeTeam || i.batTeamId === scopeTeam.id);
  if (!list.length) return none("No matching innings on the Cricbuzz scorecard.");
  return {
    kind: "boolean",
    value: list.some((i) => i.wickets >= 10),
    evidence: list.map((i) => `${teamShort(facts, i.batTeamId)} ${i.runs}/${i.wickets} (${i.overs} ov)`).join(", ") + ".",
  };
}

const SCHEDULED_OVERS: Record<string, number> = { T20: 20, ODI: 50, T10: 10 };

/**
 * How the chase finished: "Will the match go to the final over (6 or fewer
 * balls remaining at the finish)?", "balls left when the match ends".
 * The value is the balls the side batting second had left.
 */
function resolveFinish(ctx: Ctx, facts: MatchFacts): Fact {
  const { q } = ctx;
  if (/\bruns?\b|\bwickets?\b|\bsix(es)?\b|\bfours?\b|\bboundar|\bbowl(s|ed|er|ing)?\b|\bdot balls?\b/.test(q)) {
    return none("The Cricbuzz scorecard has no over-by-over detail, so it can't say what happened in a particular over.");
  }
  const chase = facts.innings[1];
  if (!chase) return none("The scorecard has no second innings yet.");

  // Cricbuzz rarely records revised overs; a pre-match reduction shows in the status ("6 over game").
  const reduced = facts.status.match(/\b(\d+)[- ]overs?\s+(game|match|a side|per side|contest)\b/i);
  const rainAffected = /\b(dls|d\/l|vjd|rain|wet outfield|bad light)\b/i.test(facts.status);
  const overs =
    chase.revisedOvers ||
    (reduced ? Number(reduced[1]) : rainAffected ? null : SCHEDULED_OVERS[facts.format.toUpperCase()] ?? null);
  if (!overs) {
    return none(
      rainAffected
        ? `Rain-affected match (${facts.status}) — the scorecard doesn't give the chase's revised overs, so balls remaining can't be worked out.`
        : `Can't tell how many overs a ${facts.format || "this"} match has.`,
    );
  }

  const remaining = Math.max(0, overs * 6 - chase.balls);
  return {
    kind: "number",
    value: remaining,
    evidence: `${teamShort(facts, chase.batTeamId)} batted second: ${chase.runs}/${chase.wickets} in ${chase.overs} of ${overs} overs — ${remaining} ball${remaining === 1 ? "" : "s"} remaining at the finish. ${facts.status}.`,
    // "Final over" means 6 or fewer balls left; "last ball" means none. A number in the question overrides these.
    implicitThreshold: /\b(final|last) ball\b/.test(q)
      ? { op: "<=", value: 0 }
      : /\b(final|last) over\b/.test(q)
        ? { op: "<=", value: 6 }
        : undefined,
  };
}

/* ---------- Metric questions (runs, wickets, sixes, …) ---------- */

type Metric =
  | "runs" | "runsConceded" | "wickets" | "sixes" | "fours" | "boundaries"
  | "extras" | "wides" | "noBalls" | "centuries" | "fifties" | "fiftyPlus"
  | "ducks" | "maidens" | "partnership" | "ppRuns" | "ppWickets" | "fiveFors"
  | "highestScore";

const METRIC_LABEL: Record<Metric, string> = {
  runs: "Runs",
  runsConceded: "Runs conceded",
  wickets: "Wickets",
  sixes: "Sixes",
  fours: "Fours",
  boundaries: "Boundaries (4s + 6s)",
  extras: "Extras",
  wides: "Wides",
  noBalls: "No-balls",
  centuries: "Centuries (100+)",
  fifties: "Fifties (50–99)",
  fiftyPlus: "50+ scores",
  ducks: "Ducks",
  maidens: "Maiden overs",
  partnership: "Highest partnership",
  ppRuns: "Powerplay runs",
  ppWickets: "Powerplay wickets",
  fiveFors: "Five-wicket hauls",
  highestScore: "Highest individual score",
};

/** Metrics where "Will there be …?" means "at least one". */
const COUNT_METRICS = new Set<Metric>([
  "wickets", "sixes", "fours", "boundaries", "extras", "wides", "noBalls",
  "centuries", "fifties", "fiftyPlus", "ducks", "maidens", "ppWickets", "fiveFors",
]);

const RUN_VALUED_METRICS = new Set<Metric>(["runs", "partnership", "ppRuns", "highestScore"]);

/** Metrics a bowling side "owns" when a team is named. */
const BOWLING_METRICS = new Set<Metric>(["maidens", "fiveFors", "runsConceded"]);

function detectMetric(q: string): Metric | null {
  if (/\bpower ?play\b|\bpp\b|\bfirst \d+ overs?\b/.test(q)) {
    return /\bwickets?\b|\bwkts?\b/.test(q) ? "ppWickets" : "ppRuns";
  }
  if (/\bpartnerships?\b|\bstands?\b/.test(q)) return "partnership";
  if (/\b(5|five) (wicket|wkt) hauls?\b|\bfifers?\b|\b(5|five) (for|fer)\b/.test(q)) return "fiveFors";
  if (/\bcentur(y|ies)\b|\bhundreds?\b|\b100s\b/.test(q)) return "centuries";
  if (/\bfift(y|ies)\b|\bhalf centur(y|ies)\b|\b50s\b/.test(q)) return "fifties";
  if (/\bducks?\b/.test(q)) return "ducks";
  if (/\bmaidens?\b/.test(q)) return "maidens";
  if (/\bno ?balls?\b/.test(q)) return "noBalls";
  if (/\bwides?\b/.test(q)) return "wides";
  if (/\bextras?\b/.test(q)) return "extras";
  if (/\bsix(es)?\b|\bmaximums?\b|\b6s\b/.test(q)) return "sixes";
  if (/\bfours\b|\b4s\b|\ba four\b/.test(q)) return "fours";
  if (/\bboundar(y|ies)\b/.test(q)) return "boundaries";
  if (/\bwickets?\b|\bwkts?\b|\bdismissals?\b/.test(q)) return "wickets";
  if (/\bconcede[sd]?\b|\bexpensive\b/.test(q)) return "runsConceded";
  if (/\bhighest (individual )?score\b|\btop score\b/.test(q)) return "highestScore";
  if (/\bruns?\b|\bscores?\b|\bscored\b|\bscorer\b|\btotal\b/.test(q)) return "runs";
  return null;
}

function playerValue(p: Player, metric: Metric): number | null {
  const bat = p.batting;
  const bowl = p.bowling;
  switch (metric) {
    case "runs": return sum(bat.map((b) => num(b.runs)));
    case "highestScore": return maxOf(bat.map((b) => num(b.runs))) ?? 0;
    case "sixes": return sum(bat.map((b) => num(b.sixes)));
    case "fours": return sum(bat.map((b) => num(b.fours)));
    case "boundaries": return sum(bat.map((b) => num(b.fours) + num(b.sixes)));
    case "centuries": return bat.filter((b) => num(b.runs) >= 100).length;
    case "fifties": return bat.filter((b) => num(b.runs) >= 50 && num(b.runs) < 100).length;
    case "fiftyPlus": return bat.filter((b) => num(b.runs) >= 50).length;
    case "ducks": return bat.filter(isDuck).length;
    case "wickets": return sum(bowl.map((b) => num(b.wickets)));
    case "maidens": return sum(bowl.map((b) => num(b.maidens)));
    case "runsConceded": return sum(bowl.map((b) => num(b.runs)));
    case "fiveFors": return bowl.filter((b) => num(b.wickets) >= 5).length;
    default: return null;
  }
}

function playerLine(p: Player, metric: Metric): string {
  if (["wickets", "maidens", "runsConceded", "fiveFors"].includes(metric)) {
    if (!p.bowling.length) return `${p.name} (did not bowl)`;
    const figs = p.bowling.map((b) => `${num(b.wickets)}/${num(b.runs)} in ${num(b.overs)} ov`);
    return `${p.name} ${figs.join(" & ")}`;
  }
  if (!p.batting.length) return `${p.name} (did not bat)`;
  const scores = p.batting.map(
    (b) => `${num(b.runs)}${isOut(b) ? "" : "*"} (${num(b.balls)}b, ${num(b.fours)}x4, ${num(b.sixes)}x6)`,
  );
  return `${p.name} ${scores.join(" & ")}`;
}

function inningsValue(list: InningsFacts[], metric: Metric): number | null {
  const batters = list.flatMap((i) => i.batters);
  const bowlers = list.flatMap((i) => i.bowlers);
  switch (metric) {
    case "runs":
    case "runsConceded": return sum(list.map((i) => i.runs));
    case "wickets": return sum(list.map((i) => i.wickets));
    case "sixes": return sum(batters.map((b) => num(b.sixes)));
    case "fours": return sum(batters.map((b) => num(b.fours)));
    case "boundaries": return sum(batters.map((b) => num(b.fours) + num(b.sixes)));
    case "extras": return sum(list.map((i) => i.extras));
    case "wides": return sum(list.map((i) => i.wides));
    case "noBalls": return sum(list.map((i) => i.noBalls));
    case "centuries": return batters.filter((b) => num(b.runs) >= 100).length;
    case "fifties": return batters.filter((b) => num(b.runs) >= 50 && num(b.runs) < 100).length;
    case "fiftyPlus": return batters.filter((b) => num(b.runs) >= 50).length;
    case "ducks": return batters.filter(isDuck).length;
    case "maidens": return sum(bowlers.map((b) => num(b.maidens)));
    case "fiveFors": return bowlers.filter((b) => num(b.wickets) >= 5).length;
    case "highestScore": return maxOf(batters.map((b) => num(b.runs))) ?? 0;
    case "partnership": return maxOf(list.map((i) => i.topPartnership ?? 0)) ?? 0;
    case "ppRuns":
      return list.some((i) => i.ppRuns === null) ? null : sum(list.map((i) => i.ppRuns ?? 0));
    case "ppWickets":
      return list.some((i) => i.ppWickets === null) ? null : sum(list.map((i) => i.ppWickets ?? 0));
  }
}

/** A team's innings for the metric: batting by default, bowling for wickets taken / extras conceded. */
function teamInnings(team: AnswerTeam, metric: Metric, q: string, facts: MatchFacts) {
  let side: "batting" | "bowling" = BOWLING_METRICS.has(metric) ? "bowling" : "batting";
  if (metric === "wickets" || metric === "ppWickets") {
    if (/\b(take|takes|took|taken|pick|picks|picked|claim|claims|bag|bags|get|gets|bowlers?)\b/.test(q)) {
      side = "bowling";
    }
  } else if (metric === "extras" || metric === "wides" || metric === "noBalls") {
    side = /\b(receive|receives|received|benefit|batting)\b/.test(q) ? "batting" : "bowling";
  }
  const list = facts.innings.filter((i) => (side === "batting" ? i.batTeamId : i.bowlTeamId) === team.id);
  return { list, label: `${team.shortName} ${side}` };
}

function milestoneThreshold(q: string): Threshold | undefined {
  if (/\bdouble centur/.test(q)) return { op: ">=", value: 200 };
  if (/\bcentur(y|ies)\b|\bhundreds?\b/.test(q)) return { op: ">=", value: 100 };
  if (/\bfift(y|ies)\b|\bhalf centur/.test(q)) return { op: ">=", value: 50 };
  return undefined;
}

function resolveMetric(ctx: Ctx, facts: MatchFacts, detected: Metric): Fact {
  if (!facts.innings.length) return none("No innings on the Cricbuzz scorecard yet.");
  const { q, shape } = ctx;
  // Yes/no and "who" questions about fifties mean 50 or more.
  const metric: Metric = detected === "fifties" && shape !== "number" ? "fiftyPlus" : detected;
  const label = METRIC_LABEL[metric];

  const oversAsked = q.match(/\bfirst (\d+) overs?\b/);
  if (oversAsked && (metric === "ppRuns" || metric === "ppWickets")) {
    const ppOvers = facts.innings[0]?.ppOvers;
    if (ppOvers !== Number(oversAsked[1])) {
      return none(`Cricbuzz only totals the powerplay (first ${ppOvers ?? "?"} overs), not the first ${oversAsked[1]}.`);
    }
  }

  const scopeTeam = ctx.mentionedTeams.length === 1 ? ctx.mentionedTeams[0] : null;
  const teamPlayers = scopeTeam
    ? facts.players.filter((p) => p.teamId === scopeTeam.id)
    : facts.players;

  // "Who …" — the player(s) leading the metric.
  if (shape === "players") {
    const pool = ctx.mentionedPlayers.length > 1 ? ctx.mentionedPlayers : teamPlayers;
    const scored = pool
      .map((p) => ({ p, v: playerValue(p, metric === "highestScore" ? "runs" : metric) }))
      .filter((x): x is { p: Player; v: number } => x.v !== null);
    if (!scored.length) return none(`${label} isn't tracked per player.`);

    const threshold = ctx.threshold;
    const milestone = ["centuries", "fiftyPlus", "ducks", "fiveFors"].includes(metric);
    let leaders: { p: Player; v: number }[];
    if (milestone || threshold) {
      leaders = scored.filter((x) => (threshold ? compare(x.v, threshold) : x.v > 0));
    } else {
      const top = Math.max(...scored.map((x) => x.v));
      leaders = top > 0 ? scored.filter((x) => x.v === top) : [];
    }
    const scope = scopeTeam ? ` for ${scopeTeam.shortName}` : "";
    return {
      kind: "players",
      names: leaders.map((x) => x.p.name),
      evidence: leaders.length
        ? `${label}${scope}: ${leaders.map((x) => playerLine(x.p, metric)).join("; ")}.`
        : `${label}${scope}: no player qualifies.`,
    };
  }

  // "Which team …" — compare the two sides.
  if (shape === "teams") {
    const [a, b] = facts.teams;
    const va = inningsValue(teamInnings(a, metric, q, facts).list, metric);
    const vb = inningsValue(teamInnings(b, metric, q, facts).list, metric);
    if (va === null || vb === null) return none(`${label} isn't on the scorecard for both teams.`);
    const evidence = `${label}: ${a.shortName} ${va}, ${b.shortName} ${vb}.`;
    if (va === vb) return { kind: "team", teamId: null, evidence };
    const wantLow = /\b(fewer|fewest|less|least|lowest|minimum)\b/.test(q);
    return { kind: "team", teamId: va > vb !== wantLow ? a.id : b.id, evidence };
  }

  const numberFact = (value: number | null, scope: string, detail = ""): Fact =>
    value === null
      ? none(`${label} (${scope}) isn't on the scorecard.`)
      : {
          kind: "number",
          value,
          isCount: COUNT_METRICS.has(metric),
          // "century partnership", "fifty in the powerplay": a runs milestone, not a count.
          implicitThreshold: RUN_VALUED_METRICS.has(metric) ? milestoneThreshold(q) : undefined,
          evidence: `${label} — ${scope}: ${value}${detail ? ` (${detail})` : ""}.`,
        };

  // "How many batters score 30+?" — count players meeting the threshold.
  if (/\b(how many|number of|no of) (players|batters|batsmen|bowlers)\b/.test(q)) {
    const t = ctx.threshold ?? { op: ">" as const, value: 0 };
    const baseMetric = metric === "fiftyPlus" || metric === "fifties" ? "fiftyPlus" : metric;
    const hits = teamPlayers.filter((p) => {
      const v = playerValue(p, baseMetric);
      return v !== null && compare(v, t);
    });
    const fact = numberFact(
      hits.length,
      `players with ${METRIC_LABEL[baseMetric].toLowerCase()} ${OP_TEXT[t.op]} ${t.value}`,
      hits.map((p) => playerLine(p, baseMetric)).join("; "),
    );
    // The threshold described who to count; don't reapply it for Yes/No.
    return fact.kind === "number" ? { ...fact, isCount: true, implicitThreshold: undefined } : fact;
  }

  if (ctx.mentionedPlayers.length === 1) {
    const p = ctx.mentionedPlayers[0];
    return numberFact(playerValue(p, metric), p.name, playerLine(p, metric));
  }
  if (ctx.mentionedPlayers.length > 1) {
    return none(`Mentions several players (${ctx.mentionedPlayers.map((p) => p.name).join(", ")}).`);
  }

  if (/\b(any|a single|an individual)( single)? (player|batter|batsman|bowler|one|individual)\b|\b(anyone|anybody|someone)\b/.test(q)) {
    const scored = teamPlayers
      .map((p) => ({ p, v: playerValue(p, metric) }))
      .filter((x): x is { p: Player; v: number } => x.v !== null);
    if (scored.length) {
      const best = scored.reduce((a, b) => (b.v > a.v ? b : a));
      // Milestones ("any century?") count across players; stats ("anyone 5+ wickets?") use the best player.
      const value = ["centuries", "fiftyPlus", "fifties", "ducks", "fiveFors"].includes(metric)
        ? sum(scored.map((x) => x.v))
        : best.v;
      return numberFact(value, `best individual${scopeTeam ? `, ${scopeTeam.shortName}` : ""}`, playerLine(best.p, metric));
    }
  }

  if (ctx.inningsIndex !== null) {
    const inn = facts.innings[ctx.inningsIndex];
    if (!inn) return none(`Innings ${ctx.inningsIndex + 1} isn't on the scorecard.`);
    return numberFact(
      inningsValue([inn], metric),
      `innings ${ctx.inningsIndex + 1}, ${teamShort(facts, inn.batTeamId)} batting`,
    );
  }

  if (scopeTeam) {
    const { list, label: scope } = teamInnings(scopeTeam, metric, q, facts);
    if (!list.length) return none(`${scopeTeam.shortName} has no ${scope.split(" ")[1]} innings on the scorecard.`);
    return numberFact(inningsValue(list, metric), scope);
  }

  const perInnings = facts.innings
    .map((i) => `${teamShort(facts, i.batTeamId)} bat ${inningsValue([i], metric) ?? "—"}`)
    .join(", ");
  return numberFact(inningsValue(facts.innings, metric), "whole match", perInnings);
}

function resolveQuestion(ctx: Ctx, facts: MatchFacts): Fact {
  const { q } = ctx;
  if (/\btoss\b/.test(q)) return resolveToss(ctx, facts);
  if (/\b(player|man|woman) of the match\b|\bpotm\b|\bmotm\b|\bpom\b/.test(q)) {
    return resolvePlayerOfMatch(facts);
  }
  if (/\b(final|last) (over|ball)\b|\bballs?\b.*\b(remaining|remain|left|to spare|to go)\b/.test(q)) {
    return resolveFinish(ctx, facts);
  }
  if (/\bmargin\b|\b(win|wins|won|winning) by\b/.test(q)) return resolveMargin(ctx, facts);
  if (/\b(all out|bowled out)\b/.test(q)) return resolveAllOut(ctx, facts);

  const metric = detectMetric(q);
  if (metric) return resolveMetric(ctx, facts, metric);

  if (/\b(win|wins|won|winner|winning|victory|victorious|beat|beats|lose|loses|lost|loser|losing)\b/.test(q)) {
    return resolveWinner(ctx, facts);
  }
  if (/\b(bat|bats|batting|bowl|bowls|bowling|field|fields|fielding) first\b/.test(q)) {
    return resolveBattingFirst(ctx, facts);
  }
  if (/\bsuper over\b/.test(q)) {
    return { kind: "boolean", value: /super over/i.test(facts.status), evidence: `Result: ${facts.status}.` };
  }
  if (/\b(tie|tied)\b/.test(q)) {
    return { kind: "boolean", value: /\btied?\b/i.test(facts.status), evidence: `Result: ${facts.status}.` };
  }
  return none("No scorecard rule matches this question's wording.");
}

/* ---------- Entry point ---------- */

export function answerCricketQuiz(
  questions: QuizQuestion[],
  scorecard: CbScorecard,
  quizTeams: { teamA: QuizTeamLike; teamB: QuizTeamLike },
): MatchAnswerProposal[] {
  const facts = buildMatchFacts(scorecard, quizTeams);
  return answerQuestions(questions, (question) => {
    const base = buildAnswerContext(question, {
      teams: facts.teams,
      roster: facts.players,
      winnerId: facts.winnerId,
      choiceOption: (o) => decisionForOption(o) !== undefined,
      roleTeamId: (q) => {
        const idx = inningsIndexOf(q);
        return idx === null ? null : facts.innings[idx]?.batTeamId ?? null;
      },
    });
    const ctx: Ctx = { ...base, inningsIndex: inningsIndexOf(base.q) };
    return answerFromFact(resolveQuestion(ctx, facts), ctx);
  });
}
