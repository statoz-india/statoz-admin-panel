/**
 * Server-side FotMob lookups. The site's pages are filled from JSON
 * endpoints that need no auth: `/api/data/matches?date=YYYYMMDD` behind the
 * date page (`/?date=YYYYMMDD`) and `/api/data/matchDetails?matchId=…`
 * behind a match page (`/match/:id`). We read those, and show the admin the
 * page URLs.
 */

import { findBestMatch, teamMatchScore, type QuizTeamLike } from "./quiz-answer-core";

export const FOTMOB_ORIGIN = "https://www.fotmob.com";

export const fotmobDatePageUrl = (date: string) => `${FOTMOB_ORIGIN}/?date=${date}`;
export const fotmobMatchPageUrl = (matchId: number) => `${FOTMOB_ORIGIN}/match/${matchId}`;

/**
 * Admins are in India, so dates are IST: `fotmob.com/?date=…` opened in
 * their browser lists the same matches we look through.
 */
export const FOTMOB_TIME_ZONE = "Asia/Kolkata";

/** `YYYYMMDD` of a timestamp in FotMob-lookup time (IST). */
export function fotmobDateKey(ms: number): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FOTMOB_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(ms)
    .replace(/-/g, "");
}

/* ---------- FotMob payload types (only the fields we read) ---------- */

export interface FmListTeam {
  id: number;
  name: string;
  shortName?: string;
  longName?: string;
}

export interface FmListMatch {
  id: number;
  leagueName: string;
  home: FmListTeam;
  away: FmListTeam;
  status: { utcTime: string };
}

export interface FmEvent {
  type: string;
  time: number;
  overloadTime?: number | null;
  isHome?: boolean;
  player?: { id: number; name: string } | null;
  ownGoal?: boolean | null;
  goalDescriptionKey?: string | null;
  card?: string | null;
  isPenaltyShootoutEvent?: boolean;
}

export interface FmStatRow {
  key: string;
  title: string;
  stats: [number | string | null, number | string | null];
}

export interface FmPlayerStats {
  name: string;
  id: number;
  teamId: number;
  isGoalkeeper?: boolean;
  stats?: {
    key: string;
    stats: Record<string, { key: string | null; stat?: { value?: number } }>;
  }[];
}

export interface FmLineupTeam {
  id: number;
  name: string;
  starters?: { id: number; name: string }[];
  subs?: { id: number; name: string }[];
}

type FmPeriod = { stats: { key: string; stats: FmStatRow[] }[] };

export interface FmMatchDetails {
  general: {
    matchId: string;
    leagueName: string;
    leagueRoundName?: string;
    matchTimeUTCDate: string;
  };
  header: {
    teams: { id: number; name: string; score: number }[];
    status: {
      utcTime: string;
      started: boolean;
      finished: boolean;
      cancelled: boolean;
      scoreStr?: string;
      reason?: { short?: string; long?: string; longKey?: string };
      halfs?: { firstExtraHalfStarted?: string };
      /** Team name, or null/"" when there was no shootout. */
      whoLostOnPenalties?: string | null;
      whoLostOnAggregated?: string | null;
      aggregatedStr?: string;
    };
  };
  content: {
    matchFacts?: {
      playerOfTheMatch?: { name?: { fullName?: string }; rating?: { num?: string } } | null;
      events?: { events?: FmEvent[] } | null;
    } | null;
    stats?: { Periods?: { All?: FmPeriod; FirstHalf?: FmPeriod; SecondHalf?: FmPeriod } } | null;
    playerStats?: Record<string, FmPlayerStats> | null;
    lineup?: { homeTeam?: FmLineupTeam; awayTeam?: FmLineupTeam } | null;
  };
}

/* ---------- Fetching ---------- */

async function fetchFotmobJson<T>(path: string): Promise<T> {
  const url = `${FOTMOB_ORIGIN}${path}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    throw new Error(`FotMob returned ${res.status} for ${url}`);
  }
  return (await res.json()) as T;
}

/** Every match FotMob lists for a day (`YYYYMMDD`, IST). */
export async function fetchFotmobMatchesForDate(date: string): Promise<FmListMatch[]> {
  const data = await fetchFotmobJson<{
    leagues?: { name: string; matches?: Omit<FmListMatch, "leagueName">[] }[];
  }>(`/api/data/matches?date=${date}&timezone=${encodeURIComponent(FOTMOB_TIME_ZONE)}`);
  return (data.leagues ?? []).flatMap((league) =>
    (league.matches ?? []).map((m) => ({ ...m, leagueName: league.name })),
  );
}

export async function fetchFotmobMatchDetails(matchId: number): Promise<FmMatchDetails> {
  const data = await fetchFotmobJson<FmMatchDetails>(`/api/data/matchDetails?matchId=${matchId}`);
  if (!data?.header?.teams?.length || !data.content) {
    throw new Error("Couldn't read match details from FotMob — the data format may have changed.");
  }
  return data;
}

/**
 * FotMob match id from a match URL: `/match/5795450`, or the
 * `/matches/<teams>/<code>#5795450` form the site links to.
 */
export function parseFotmobMatchId(input: string): number | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.hostname !== "fotmob.com" && !url.hostname.endsWith(".fotmob.com")) return null;
  const hash = url.hash.match(/^#(\d+)$/);
  if (hash) return Number(hash[1]);
  const path = url.pathname.match(/\/match\/(\d+)(?:\/|$)/);
  if (path) return Number(path[1]);
  const query = url.searchParams.get("matchId");
  return query && /^\d+$/.test(query) ? Number(query) : null;
}

const providerTeam = (t: FmListTeam) => ({
  name: t.name,
  shortName: t.shortName ?? t.name,
  otherNames: t.longName ? [t.longName] : [],
});

/** The match with both quiz teams in a day's list (the list already fixes the date). */
export function findFotmobMatchForQuiz(
  matches: FmListMatch[],
  quiz: { teamA: QuizTeamLike; teamB: QuizTeamLike; matchStartTime?: string },
): FmListMatch | null {
  return findBestMatch(
    matches,
    quiz,
    (m) => ({
      teams: [providerTeam(m.home), providerTeam(m.away)],
      startMs: Date.parse(m.status.utcTime),
    }),
    Infinity,
  );
}

/**
 * Listed matches involving at least one of the quiz's teams — shown when
 * the pair isn't found, since a spelling difference is the usual cause.
 */
export function fotmobNearMisses(
  matches: FmListMatch[],
  quiz: { teamA: QuizTeamLike; teamB: QuizTeamLike },
): FmListMatch[] {
  const seen = new Set<number>();
  return matches.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return [m.home, m.away].some((t) =>
      // Same name or abbreviation only — "Chicago" inside "Chicago State" isn't a lead.
      [quiz.teamA, quiz.teamB].some((qt) => teamMatchScore(qt, providerTeam(t)) >= 3),
    );
  });
}
