/**
 * Server-side Cricbuzz scraping. Cricbuzz is a Next.js site: the data behind
 * each page ships in the `self.__next_f.push([1,"…"])` flight chunks, so we
 * decode those and pull the JSON objects out by key (`matchInfo` on list
 * pages, `scorecardApiData` on scorecard pages) instead of parsing markup.
 */

import { findBestMatch, type QuizTeamLike } from "./quiz-answer-core";

export const CRICBUZZ_ORIGIN = "https://www.cricbuzz.com";
export const CRICBUZZ_RECENT_MATCHES_URL = `${CRICBUZZ_ORIGIN}/cricket-match/live-scores/recent-matches`;

export function cricbuzzScorecardUrl(matchId: number, slug?: string): string {
  return `${CRICBUZZ_ORIGIN}/live-cricket-scorecard/${matchId}${slug ? `/${slug}` : ""}`;
}

/* ---------- Cricbuzz payload types (only the fields we read) ---------- */

export interface CbListTeam {
  teamId: number;
  teamName: string;
  teamSName: string;
}

export interface CbMatchInfo {
  matchId: number;
  seriesName: string;
  matchDesc: string;
  matchFormat: string;
  /** Epoch ms, as a number or numeric string. */
  startDate: number | string;
  state: string;
  status: string;
  team1: CbListTeam;
  team2: CbListTeam;
}

export interface CbBatter {
  batId: number;
  batName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  /** "" when the player did not bat, "not out" when unbeaten. */
  outDesc: string;
}

export interface CbBowler {
  bowlerId: number;
  bowlName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
}

export interface CbInnings {
  inningsId: number;
  batTeamDetails: {
    batTeamId: number;
    batTeamName: string;
    batTeamShortName: string;
    batsmenData: Record<string, CbBatter>;
  };
  bowlTeamDetails: {
    bowlTeamId: number;
    bowlTeamName: string;
    bowlTeamShortName: string;
    bowlersData: Record<string, CbBowler>;
  };
  scoreDetails: {
    runs: number;
    wickets: number;
    overs: number;
    /** Legal balls faced. */
    ballNbr?: number;
    /** 0 unless Cricbuzz recorded a revised length (it usually doesn't, even for DLS). */
    revisedOvers?: number;
  };
  extrasData?: {
    total: number;
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalty: number;
  };
  ppData?: Record<
    string,
    { ppOversFrom: number; ppOversTo: number; ppType: string; runsScored: number }
  >;
  wicketsData?: Record<string, { batName: string; wktOver: number; wktNbr: number }>;
  partnershipsData?: Record<
    string,
    { bat1Name: string; bat2Name: string; totalRuns: number; totalBalls: number }
  >;
}

export interface CbMatchHeader {
  matchId: number;
  matchDescription: string;
  matchFormat: string;
  state: string;
  status: string;
  complete: boolean;
  matchStartTimestamp: number;
  seriesName?: string;
  tossResults?: { tossWinnerId?: number; tossWinnerName?: string; decision?: string };
  result?: {
    resultType?: string;
    winningTeam?: string;
    winningteamId?: number;
    winningMargin?: number;
    winByRuns?: boolean;
    winByInnings?: boolean;
  };
  playersOfTheMatch?: { id: number; name: string; fullName?: string }[];
  team1: { id: number; name: string; shortName: string };
  team2: { id: number; name: string; shortName: string };
}

export interface CbScorecard {
  scoreCard: CbInnings[];
  matchHeader: CbMatchHeader;
}

/* ---------- Page fetching + flight decoding ---------- */

async function fetchCricbuzzPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      // Cricbuzz serves the full server-rendered page to browser UAs.
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    throw new Error(`Cricbuzz returned ${res.status} for ${url}`);
  }
  return res.text();
}

/** Concatenate the decoded Next.js flight chunks embedded in the page. */
function decodeFlight(html: string): string {
  const chunkRe = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g;
  let flight = "";
  let m: RegExpExecArray | null;
  while ((m = chunkRe.exec(html))) {
    try {
      flight += JSON.parse(m[1]) as string;
    } catch {
      // A malformed chunk shouldn't sink the rest of the page.
    }
  }
  return flight;
}

/** Every `"key":{…}` object in `text` that parses as JSON. */
function extractObjectsByKey<T>(text: string, key: string): T[] {
  const needle = `"${key}":{`;
  const out: T[] = [];
  let from = 0;
  for (;;) {
    const at = text.indexOf(needle, from);
    if (at === -1) break;
    const start = at + needle.length - 1;
    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = start;
    for (; end < text.length; end++) {
      const c = text[end];
      if (inString) {
        if (escaped) escaped = false;
        else if (c === "\\") escaped = true;
        else if (c === '"') inString = false;
        continue;
      }
      if (c === '"') inString = true;
      else if (c === "{") depth++;
      else if (c === "}" && --depth === 0) break;
    }
    try {
      out.push(JSON.parse(text.slice(start, end + 1)) as T);
    } catch {
      // Skip objects that were truncated or aren't plain JSON.
    }
    from = end + 1;
  }
  return out;
}

/* ---------- Public API ---------- */

export interface CricbuzzListedMatch extends CbMatchInfo {
  /** URL slug from the page's match links, when one was found. */
  slug?: string;
}

/** Matches on the recent-matches page, de-duplicated by match id. */
export async function fetchRecentCricbuzzMatches(): Promise<CricbuzzListedMatch[]> {
  const html = await fetchCricbuzzPage(CRICBUZZ_RECENT_MATCHES_URL);

  const slugs = new Map<number, string>();
  const linkRe = /href="\/live-cricket-scores\/(\d+)\/([^"?#]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html))) {
    const id = Number(m[1]);
    if (!slugs.has(id)) slugs.set(id, m[2]);
  }

  const byId = new Map<number, CricbuzzListedMatch>();
  for (const info of extractObjectsByKey<CbMatchInfo>(decodeFlight(html), "matchInfo")) {
    if (!info?.matchId || !info.team1 || !info.team2 || byId.has(info.matchId)) continue;
    byId.set(info.matchId, { ...info, slug: slugs.get(info.matchId) });
  }
  return [...byId.values()];
}

export async function fetchCricbuzzScorecard(matchId: number, slug?: string): Promise<CbScorecard> {
  const html = await fetchCricbuzzPage(cricbuzzScorecardUrl(matchId, slug));
  const data = extractObjectsByKey<CbScorecard>(decodeFlight(html), "scorecardApiData").find(
    (d) => d?.matchHeader?.matchId === matchId,
  );
  if (!data) {
    throw new Error(
      "Couldn't read scorecard data from the Cricbuzz page — its layout may have changed.",
    );
  }
  return { scoreCard: Array.isArray(data.scoreCard) ? data.scoreCard : [], matchHeader: data.matchHeader };
}

/** Cricbuzz match id from any cricbuzz.com match URL (scores, scorecard, commentary…). */
export function parseCricbuzzMatchId(input: string): number | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.hostname !== "cricbuzz.com" && !url.hostname.endsWith(".cricbuzz.com")) return null;
  const m = url.pathname.match(/^\/[a-z-]+\/(\d+)(?:\/|$)/);
  return m ? Number(m[1]) : null;
}

/* ---------- Matching a quiz to a Cricbuzz match ---------- */

export function findCricbuzzMatchForQuiz(
  matches: CricbuzzListedMatch[],
  quiz: { teamA: QuizTeamLike; teamB: QuizTeamLike; matchStartTime?: string },
): CricbuzzListedMatch | null {
  return findBestMatch(matches, quiz, (m) => ({
    teams: [
      { name: m.team1.teamName, shortName: m.team1.teamSName },
      { name: m.team2.teamName, shortName: m.team2.teamSName },
    ],
    startMs: Number(m.startDate),
  }));
}
