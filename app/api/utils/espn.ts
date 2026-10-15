/**
 * Server-side ESPN summary lookups. Unlike Cricbuzz/FotMob, this never
 * searches for the match by team name: every match already carries the
 * exact league path the live-score sync wrote (`espnLeagueName`, e.g.
 * `"cricket/1554562"`) and the ESPN event id (`matchEvent.id`), so we fetch
 * `sports/{espnLeagueName}/summary?event={id}` directly.
 */

export const ESPN_SUMMARY_BASE = "https://site.api.espn.com/apis/site/v2/sports";

export function espnSummaryUrl(leaguePath: string, eventId: string): string {
  return `${ESPN_SUMMARY_BASE}/${leaguePath}/summary?event=${encodeURIComponent(eventId)}`;
}

export interface EspnCompetitorTeam {
  id: string;
  displayName: string;
  shortDisplayName?: string;
  abbreviation?: string;
}

export interface EspnCompetitor {
  id: string;
  homeAway: "home" | "away";
  winner?: boolean;
  score?: string;
  team: EspnCompetitorTeam;
}

export interface EspnStatusType {
  id: string;
  /** e.g. "STATUS_SCHEDULED", "STATUS_IN_PROGRESS", "STATUS_FULL_TIME". */
  name: string;
  /** "pre" | "in" | "post" */
  state: string;
  /** Present for football/basketball; cricket omits it — use `state` instead. */
  completed?: boolean;
  description: string;
  detail: string;
  shortDetail: string;
}

export interface EspnSummary {
  header: {
    id: string;
    season?: { name?: string };
    competitions: {
      id: string;
      date: string;
      competitors: EspnCompetitor[];
      status: { type: EspnStatusType };
    }[];
  };
}

/** Throws a plain Error with the response status / a missing-data reason. */
export async function fetchEspnSummary(
  leaguePath: string,
  eventId: string,
): Promise<EspnSummary> {
  const url = espnSummaryUrl(leaguePath, eventId);
  const res = await fetch(url, {
    headers: { Accept: "application/json, text/plain, */*" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    throw new Error(`ESPN returned ${res.status} for ${url}`);
  }
  const data = (await res.json()) as EspnSummary;
  if (!data?.header?.competitions?.length) {
    throw new Error(`ESPN has no match data for event ${eventId} (${url})`);
  }
  return data;
}
