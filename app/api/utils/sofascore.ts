/**
 * Sofascore lookups for cricket, football and basketball. Unlike Cricbuzz and
 * FotMob these run in the admin's browser, not on our server. Sofascore
 * can reject both browser and server requests. The fetch panels
 * call `lookupSofascoreMatch` directly and get the same `MatchAnswersResult`
 * the server routes return.
 *
 * A lookup makes as few requests as it can: a team
 * search, that team's recent/upcoming events, then the one event's details.
 */

import {
  findBestMatch,
  teamMatchScore,
  teamPairingWarning,
  type QuizTeamLike,
} from "./quiz-answer-core";
import {
  answerSofascoreQuiz,
  cricketFormat,
  sofascoreProviderTeam,
} from "./sofascore-answer-engine";
import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchStatus } from "@/app/constants/match-status";
import type {
  MatchAnswerSourceUrl,
  MatchAnswersResult,
  MatchSourceLookup,
} from "@/app/interface/match-answers.interface";

export const SOFASCORE_ORIGIN = "https://www.sofascore.com";
const SOFASCORE_API = `${SOFASCORE_ORIGIN}/api/v1`;

export const SOFASCORE_SPORTS = ["cricket", "football", "basketball"] as const;
export type SofascoreSport = (typeof SOFASCORE_SPORTS)[number];

export function sofascoreSportFor(gameType: string | null | undefined): SofascoreSport | null {
  const key = gameType?.trim().toLowerCase();
  return SOFASCORE_SPORTS.find((s) => s === key) ?? null;
}

/* ---------- Sofascore payload types (only the fields we read) ---------- */

export interface SsTeam {
  id: number;
  name: string;
  slug?: string;
  /** "Brighton", "WI" — not on search results. */
  shortName?: string;
  /** "BHA", "WIN" */
  nameCode?: string;
  sport?: { slug?: string };
}

export interface SsScore {
  current?: number;
  display?: number;
  /** Halves in football, quarters (or halves) in basketball. */
  period1?: number;
  period2?: number;
  period3?: number;
  period4?: number;
  /** Basketball: all overtime periods together. */
  overtime?: number;
  /** Football extra-time halves. */
  extra1?: number;
  extra2?: number;
  /** Penalty shootout goals. */
  penalties?: number;
  /** Cricket: keyed "inning1", "inning2". */
  innings?: Record<string, { score?: number; wickets?: number; overs?: number }>;
}

export interface SsEvent {
  id: number;
  customId?: string;
  slug?: string;
  /** Epoch seconds. */
  startTimestamp: number;
  /** `type`: "notstarted", "inprogress", "finished", "canceled", "postponed", … */
  status: { code: number; description: string; type: string };
  /** 1 = home, 2 = away, 3 = draw. */
  winnerCode?: number;
  /** Two-legged ties: 1 = home, 2 = away went through. */
  aggregatedWinnerCode?: number;
  homeTeam: SsTeam;
  awayTeam: SsTeam;
  homeScore?: SsScore;
  awayScore?: SsScore;
  tournament?: {
    name?: string;
    uniqueTournament?: { name?: string };
    category?: { sport?: { slug?: string } };
  };
  roundInfo?: { round?: number; name?: string };
  /** Regulation periods: 2 halves in football, 4 quarters (or 2 halves) in basketball. */
  defaultPeriodCount?: number;
  /** Cricket result line: "India beat West Indies by 8 wickets". */
  note?: string;
  /** Cricket: the toss winner's name, and "Batting" / "Bowling". */
  tossWin?: string;
  tossDecision?: string;
}

export interface SsPlayerRef {
  id: number;
  name: string;
}

export interface SsBattingLine {
  player: SsPlayerRef;
  score?: number;
  balls?: number;
  s4?: number;
  s6?: number;
  /** "Caught", "Bowled", "Not out", "Did not bat", … */
  wicketTypeName?: string;
  /** Over the wicket fell in, e.g. 19.2. */
  fowOver?: number;
}

export interface SsBowlingLine {
  player: SsPlayerRef;
  over?: number;
  maiden?: number;
  run?: number;
  wicket?: number;
}

export interface SsInnings {
  number: number;
  battingTeam: SsTeam;
  bowlingTeam: SsTeam;
  score?: number;
  wickets?: number;
  overs?: number;
  extra?: number;
  wide?: number;
  noBall?: number;
  battingLine?: SsBattingLine[];
  bowlingLine?: SsBowlingLine[];
  partnerships?: { score?: number }[];
}

/** A cricket delivery, cut down to what the powerplay needs. */
export interface SsBall {
  inningNumber: number;
  /** 1-based: the first over is 1. */
  over: number;
  /** Innings score after the ball, "54/1". */
  score: string;
}

export interface SsIncident {
  /** "goal", "card", "period", "substitution", "inGamePenalty", "penaltyShootout", … */
  incidentType: string;
  /** goal: "regular" | "penalty" | "ownGoal"; card: "yellow" | "red" | "yellowRed". */
  incidentClass?: string;
  time?: number;
  /** Stoppage-time minutes; 999 on period markers. */
  addedTime?: number;
  isHome?: boolean;
  player?: SsPlayerRef | null;
  playerName?: string;
  /** Running score after a goal. */
  homeScore?: number;
  awayScore?: number;
}

export interface SsStatisticsItem {
  key?: string;
  name: string;
  home?: string;
  away?: string;
  homeValue?: number;
  awayValue?: number;
}

export interface SsStatisticsPeriod {
  /** "ALL", "1ST", "2ND", "Q1", … */
  period: string;
  groups: { groupName: string; statisticsItems: SsStatisticsItem[] }[];
}

export interface SsLineupPlayer {
  player: SsPlayerRef;
  teamId?: number;
  substitute?: boolean;
  /** Keys are left out when the value is 0. */
  statistics?: Record<string, unknown>;
}

export interface SsLineups {
  home?: { players?: SsLineupPlayer[] };
  away?: { players?: SsLineupPlayer[] };
}

/** One event and whatever detail endpoints its sport needs (null when missing). */
export interface SofascoreMatchData {
  sport: SofascoreSport;
  event: SsEvent;
  /** Cricket. */
  innings: SsInnings[] | null;
  /** Cricket, limited-overs matches only. */
  balls: SsBall[] | null;
  /** Football. */
  incidents: SsIncident[] | null;
  /** Football and basketball. */
  statistics: SsStatisticsPeriod[] | null;
  lineups: SsLineups | null;
  /** Football: `/best-players/summary`. */
  playerOfTheMatch: { name: string; rating: string | null } | null;
}

/* ---------- Errors ---------- */

/** A lookup failure to show the admin, with the pages read before it. */
export class SofascoreLookupError extends Error {
  readonly sourceUrls: MatchAnswerSourceUrl[];
  constructor(message: string, sourceUrls: MatchAnswerSourceUrl[], readonly status?: number) {
    super(message);
    this.name = "SofascoreLookupError";
    this.sourceUrls = sourceUrls;
  }
}

/** Keep explicit match URLs tied to their provider; never substitute another match. */
export async function withSofascoreFallback(
  lookup: () => Promise<MatchAnswersResult>,
  fallback: (() => Promise<MatchAnswersResult>) | undefined,
  matchUrl: string,
): Promise<MatchAnswersResult> {
  try {
    return await lookup();
  } catch (error) {
    if (!(error instanceof SofascoreLookupError) ||
        ![403, 429].includes(error.status ?? 0) || !fallback || matchUrl.trim()) throw error;
    try {
      const result = await fallback();
      return {
        ...result,
        warnings: [`Sofascore was unavailable (${error.status}). Fetched from ${result.source === "cricbuzz" ? "Cricbuzz" : "FotMob"} instead.`, ...result.warnings],
      };
    } catch (fallbackError) {
      throw new SofascoreLookupError(
        `${error.message} The alternative source also failed: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`,
        error.sourceUrls,
        error.status,
      );
    }
  }
}

/* ---------- Fetching (browser only) ---------- */

async function sofascoreJson<T>(path: string, optional = false): Promise<T | null> {
  let res: Response;
  try {
    // Only CORS-safelisted headers, so the browser sends no preflight.
    res = await fetch(`${SOFASCORE_API}${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new Error(
      "Couldn't reach Sofascore from this browser — check the connection, or whether an extension is blocking sofascore.com.",
    );
  }
  if (res.status === 404 && optional) return null;
  if (res.status === 403) {
    throw new SofascoreLookupError(
      "Sofascore denied access (403). Its response does not say why or when access will return. Use another available source, or enter answers manually from the match page.",
      [], 403,
    );
  }
  if (!res.ok) {
    throw new SofascoreLookupError(`Sofascore returned ${res.status} for ${path}.`, [], res.status);
  }
  return (await res.json()) as T;
}

/* ---------- URLs ---------- */

export function sofascoreMatchPageUrl(sport: SofascoreSport, event: SsEvent): string {
  return event.slug && event.customId
    ? `${SOFASCORE_ORIGIN}/${sport}/match/${event.slug}/${event.customId}#id:${event.id}`
    : `${SOFASCORE_API}/event/${event.id}`;
}

const teamPageUrl = (sport: SofascoreSport, team: SsTeam) =>
  `${SOFASCORE_ORIGIN}/team/${sport}/${team.slug ?? "team"}/${team.id}`;

/**
 * Sofascore event id from a match URL — the page URL carries it after
 * `#id:` (`…/football/match/arsenal-chelsea/RsR#id:12345678`) — or from an
 * API URL (`/api/v1/event/12345678`).
 */
export function parseSofascoreEventId(input: string): number | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.hostname !== "sofascore.com" && !url.hostname.endsWith(".sofascore.com")) return null;
  const hash = url.hash.match(/(?:^#|,)id:(\d+)/);
  if (hash) return Number(hash[1]);
  const path = url.pathname.match(/\/event\/(\d+)(?:\/|$)/);
  return path ? Number(path[1]) : null;
}

/* ---------- Finding the event ---------- */

const sportOf = (e: SsEvent) => e.tournament?.category?.sport?.slug ?? e.homeTeam.sport?.slug;

/**
 * The search results that best match one of our teams by name (containment
 * or better), in Sofascore's relevance order — at most two.
 */
async function searchTeams(sport: SofascoreSport, team: QuizTeamLike): Promise<SsTeam[]> {
  const data = await sofascoreJson<{ results?: { type?: string; entity?: SsTeam }[] }>(
    `/search/teams?q=${encodeURIComponent(team.name ?? "")}&page=0`,
  );
  const scored = (data?.results ?? [])
    .map((r) => r.entity)
    .filter((t): t is SsTeam => !!t?.id && t.sport?.slug === sport)
    .map((t) => ({ t, score: teamMatchScore(team, sofascoreProviderTeam(t)) }))
    .filter((x) => x.score >= 2);
  const best = Math.max(0, ...scored.map((x) => x.score));
  return scored
    .filter((x) => x.score === best)
    .slice(0, 2)
    .map((x) => x.t);
}

/** Team-events pages to read, at most, before giving up. */
const MAX_EVENT_LISTS = 4;

async function findEvent(
  sport: SofascoreSport,
  target: { teamA: QuizTeamLike; teamB: QuizTeamLike; matchStartTime?: string },
  sourceUrls: MatchAnswerSourceUrl[],
): Promise<SsEvent> {
  const start = target.matchStartTime ? Date.parse(target.matchStartTime) : NaN;
  // Settling happens after the match, so its team's recent events come first.
  const lists = Number.isNaN(start) || start <= Date.now() ? ["last", "next"] : ["next", "last"];
  const teamsSeen: string[] = [];
  let listsRead = 0;

  // Either team's fixtures list the match; the other team is the fallback
  // for when the first one's name found the wrong club.
  for (const quizTeam of [target.teamA, target.teamB]) {
    if (!quizTeam?.name?.trim() || listsRead >= MAX_EVENT_LISTS) continue;
    for (const team of await searchTeams(sport, quizTeam)) {
      if (teamsSeen.includes(team.name)) continue;
      teamsSeen.push(team.name);
      sourceUrls.push({ label: `Team: ${team.name}`, url: teamPageUrl(sport, team) });
      for (const which of lists) {
        if (listsRead >= MAX_EVENT_LISTS) break;
        listsRead++;
        const data = await sofascoreJson<{ events?: SsEvent[] }>(`/team/${team.id}/events/${which}/0`, true);
        const found = findBestMatch(data?.events ?? [], target, (e) => ({
          teams: [sofascoreProviderTeam(e.homeTeam), sofascoreProviderTeam(e.awayTeam)],
          startMs: e.startTimestamp * 1000,
        }));
        if (found) return found;
      }
    }
  }

  const teams = `${target.teamA?.name} vs ${target.teamB?.name}`;
  throw new Error(
    teamsSeen.length
      ? `Couldn't find ${teams} (within 36h of the match start) in ${teamsSeen.join(" / ")}'s recent and upcoming matches on Sofascore. Paste the Sofascore match URL to use it directly.`
      : `Sofascore has no ${sport} team matching "${target.teamA?.name}" or "${target.teamB?.name}". Paste the Sofascore match URL to use a match directly.`,
  );
}

/* ---------- Event details ---------- */

async function fetchMatchData(sport: SofascoreSport, event: SsEvent): Promise<SofascoreMatchData> {
  const data: SofascoreMatchData = {
    sport,
    event,
    innings: null,
    balls: null,
    incidents: null,
    statistics: null,
    lineups: null,
    playerOfTheMatch: null,
  };
  // Nothing to read before the start; don't spend requests on it.
  if (event.status.type === "notstarted") return data;
  const detail = <T>(path: string) => sofascoreJson<T>(`/event/${event.id}/${path}`, true);

  if (sport === "cricket") {
    data.innings = (await detail<{ innings?: SsInnings[] }>("innings"))?.innings ?? null;
    // Ball-by-ball is only needed for powerplay totals, which Tests don't have.
    const format = cricketFormat(event, data.innings);
    if (format === "T20" || format === "ODI") {
      const incidents = (await detail<{ incidents?: Record<string, unknown>[] }>("incidents"))?.incidents;
      data.balls =
        incidents
          ?.filter((i) => i.incidentType === "ball")
          .map((i) => ({ inningNumber: Number(i.inningNumber), over: Number(i.over), score: String(i.score ?? "") })) ??
        null;
    }
    return data;
  }

  const [statistics, lineups, incidents, best] = await Promise.all([
    detail<{ statistics?: SsStatisticsPeriod[] }>("statistics"),
    detail<SsLineups>("lineups"),
    sport === "football" ? detail<{ incidents?: SsIncident[] }>("incidents") : null,
    sport === "football"
      ? detail<{ playerOfTheMatch?: { player?: SsPlayerRef; value?: string } | null }>("best-players/summary")
      : null,
  ]);
  data.statistics = statistics?.statistics ?? null;
  data.lineups = lineups;
  data.incidents = incidents?.incidents ?? null;
  const potm = best?.playerOfTheMatch;
  data.playerOfTheMatch = potm?.player?.name ? { name: potm.player.name, rating: potm.value ?? null } : null;
  return data;
}

/* ---------- Status ---------- */

/** Sofascore's status as our match status. */
function sofascoreMatchStatus(event: SsEvent): MatchStatus {
  const { type, description } = event.status;
  const text = `${description} ${event.note ?? ""}`;
  if (/no result/i.test(text)) return "no_result";
  if (/abandon/i.test(text)) return "abandoned";
  if (type === "postponed" || /postpon/i.test(description)) return "postponed";
  if (type === "canceled" || /cancel/i.test(description)) return "canceled";
  if (type === "finished") return "result";
  if (type === "notstarted") return "upcoming";
  // In progress, interrupted, a break…
  return "live";
}

/** Why answers read off this match might be missing or still change, if so. */
function sofascoreAnswersWarning(event: SsEvent): string | null {
  const { type, description } = event.status;
  if (type === "notstarted") return "The match hasn't started on Sofascore yet, so nothing can be answered.";
  if (type === "canceled" || type === "postponed") return `Sofascore lists this match as "${description}".`;
  if (type !== "finished") return `Sofascore shows this match as "${description}" — answers can still change.`;
  return null;
}

function scoreLine(sport: SofascoreSport, event: SsEvent): string {
  const { homeTeam: home, awayTeam: away, homeScore: hs = {}, awayScore: as = {} } = event;
  if (sport === "cricket") {
    if (event.note) return event.note;
    const side = (team: SsTeam, s: SsScore) => {
      const innings = Object.values(s.innings ?? {}).map(
        (i) => `${i.score ?? 0}/${i.wickets ?? 0}${i.overs !== undefined ? ` (${i.overs})` : ""}`,
      );
      return `${team.name} ${innings.join(" & ") || "—"}`;
    };
    return `${side(home, hs)} · ${side(away, as)}`;
  }
  const goals = (s: SsScore) => s.display ?? s.current ?? 0;
  const pens =
    hs.penalties !== undefined && as.penalties !== undefined ? ` (pens ${hs.penalties}-${as.penalties})` : "";
  return `${home.name} ${goals(hs)} - ${goals(as)} ${away.name}${pens}`;
}

/* ---------- Entry point ---------- */

/**
 * A prediction's / event's `{ questionText, options }` as quiz questions
 * keyed by index — the same shape `/api/match/source-lookup` answers.
 */
export function indexedQuestions(list: { questionText: string; options: string[] }[]): QuizQuestion[] {
  return list.flatMap(({ questionText, options }, idx) =>
    questionText.trim()
      ? [{ _id: String(idx), questionNumber: idx + 1, questionText, questionType: "MCQ", options, xp: 0, correctAnswer: "" }]
      : [],
  );
}

export interface SofascoreLookupRequest {
  gameType: string;
  teamA: QuizTeamLike;
  teamB: QuizTeamLike;
  matchStartTime?: string;
  /** Answered in `proposals`, keyed like the quiz's settle page (`_id`, then number, then index). */
  questions?: QuizQuestion[];
}

/**
 * The request's match on Sofascore — found by team, or from `matchUrl` —
 * with its status, and answers to any questions. Browser only; throws a
 * `SofascoreLookupError`.
 */
export async function lookupSofascoreMatch(
  request: SofascoreLookupRequest,
  matchUrl: string,
): Promise<MatchAnswersResult> {
  const sourceUrls: MatchAnswerSourceUrl[] = [];
  try {
    const sport = sofascoreSportFor(request.gameType);
    if (!sport) {
      throw new Error(
        `Sofascore lookup is available for cricket, football and basketball (this is ${request.gameType || "missing a game type"}).`,
      );
    }
    const target = { teamA: request.teamA, teamB: request.teamB, matchStartTime: request.matchStartTime };

    let eventId: number;
    if (matchUrl.trim()) {
      const parsed = parseSofascoreEventId(matchUrl);
      if (!parsed) {
        throw new Error(
          "That isn't a Sofascore match URL. Copy it from the address bar with the #id:… at the end (e.g. https://www.sofascore.com/football/match/arsenal-chelsea/RsR#id:12345678).",
        );
      }
      eventId = parsed;
    } else {
      eventId = (await findEvent(sport, target, sourceUrls)).id;
    }

    // List entries leave fields out (the toss, for one), so read the event itself.
    const event = (await sofascoreJson<{ event?: SsEvent }>(`/event/${eventId}`))?.event;
    if (!event?.homeTeam || !event.awayTeam) {
      throw new Error("Couldn't read the match from Sofascore — its data format may have changed.");
    }
    sourceUrls.push({ label: "Match", url: sofascoreMatchPageUrl(sport, event) });
    const eventSport = sportOf(event);
    if (eventSport && eventSport !== sport) {
      throw new Error(`That Sofascore match is ${eventSport}, but this is ${sport}.`);
    }

    const questions = request.questions ?? [];
    const data = questions.length ? await fetchMatchData(sport, event) : null;
    const warnings: string[] = [];
    const stateWarning = questions.length ? sofascoreAnswersWarning(event) : null;
    if (stateWarning) warnings.push(stateWarning);
    const pairingWarning = teamPairingWarning(
      target,
      sofascoreProviderTeam(event.homeTeam),
      sofascoreProviderTeam(event.awayTeam),
      "Sofascore",
    );
    if (pairingWarning) warnings.push(pairingWarning);

    const round = event.roundInfo?.name ?? (event.roundInfo?.round ? `Round ${event.roundInfo.round}` : "");
    const lookup: MatchSourceLookup = {
      source: "sofascore",
      match: {
        externalMatchId: event.id,
        title: `${event.homeTeam.name} vs ${event.awayTeam.name}`,
        subtitle: [event.tournament?.name, round].filter(Boolean).join(" · "),
        state: event.status.description,
        status: scoreLine(sport, event),
        startTime: new Date(event.startTimestamp * 1000).toISOString(),
        isComplete: event.status.type === "finished",
      },
      sourceUrls,
      matchedBy: matchUrl.trim() ? "url" : "auto",
      suggestedStatus: sofascoreMatchStatus(event),
      warnings,
    };
    return {
      ...lookup,
      proposals: data ? answerSofascoreQuiz(questions, data, target) : [],
    };
  } catch (err) {
    throw new SofascoreLookupError(
      err instanceof Error ? err.message : "Failed to fetch the match from Sofascore",
      sourceUrls,
      err instanceof SofascoreLookupError ? err.status : undefined,
    );
  }
}
