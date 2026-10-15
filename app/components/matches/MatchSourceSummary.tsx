"use client";

import { useState, type ReactNode } from "react";
import {
  indexedQuestions,
  lookupSofascoreMatch,
  withSofascoreFallback,
} from "@/app/api/utils/sofascore";
import type {
  MatchAnswerSource,
  MatchAnswerSourceUrl,
  MatchAnswersResult,
  MatchSourceLookup,
} from "@/app/interface/match-answers.interface";

/** A site matches can be looked up on. */
export interface MatchSourceSite {
  id: MatchAnswerSource;
  name: string;
  urlExample: string;
}

export const MATCH_SOURCE_SITES: Record<MatchAnswerSource, MatchSourceSite> = {
  cricbuzz: {
    id: "cricbuzz",
    name: "Cricbuzz",
    urlExample: "https://www.cricbuzz.com/live-cricket-scores/12345/…",
  },
  fotmob: {
    id: "fotmob",
    name: "FotMob",
    urlExample: "https://www.fotmob.com/match/12345",
  },
  sofascore: {
    id: "sofascore",
    name: "Sofascore",
    urlExample: "https://www.sofascore.com/football/match/…#id:12345678",
  },
  espn: {
    id: "espn",
    name: "ESPN",
    urlExample: "https://www.espn.in/football/match/_/gameId/401873742/…",
  },
};

/** The sites each game type's matches can be looked up on, the usual one first. */
const GAME_TYPE_SITES: Record<string, MatchAnswerSource[]> = {
  cricket: ["cricbuzz", "sofascore"],
  football: ["fotmob", "sofascore"],
  basketball: ["sofascore"],
};

export function matchSourceSitesFor(
  gameType: string | null | undefined,
): MatchSourceSite[] {
  const key = gameType?.trim().toLowerCase() ?? "";
  return (GAME_TYPE_SITES[key] ?? []).map((id) => MATCH_SOURCE_SITES[id]);
}

/**
 * Status-only sites: every game type's usual sources plus ESPN. ESPN needs
 * no team-name search — it reads the match's own saved `espnLeagueName` /
 * `matchEvent.id` — but it also has no question-answering engine, so it's
 * left out of `matchSourceSitesFor` (used by the prediction/event answer
 * picker) and only added here, for the match status panel.
 */
export function matchStatusSitesFor(
  gameType: string | null | undefined,
): MatchSourceSite[] {
  const base = matchSourceSitesFor(gameType);
  return base.length ? [...base, MATCH_SOURCE_SITES.espn] : base;
}

/** "Cricbuzz or Sofascore" */
export const siteNames = (sites: MatchSourceSite[]) =>
  sites.map((s) => s.name).join(" or ");

/** The pages a failed lookup read before it failed, when it says. */
export function errorSourceUrls(err: unknown): MatchAnswerSourceUrl[] {
  const urls = (err as { sourceUrls?: unknown } | null)?.sourceUrls;
  return Array.isArray(urls) ? urls : [];
}

type LookupTeam = { name?: string; displayName?: string; abbreviation?: string };

/** Body of `POST /api/match/source-lookup`, less the optional `matchUrl`. */
export interface MatchSourceLookupRequest {
  gameType: string;
  teamA: LookupTeam | undefined;
  teamB: LookupTeam | undefined;
  matchStartTime?: string;
  /** Answered in `proposals`, keyed by index. */
  questions?: { questionText: string; options: string[] }[];
  /** ESPN only: the match's own saved league path (e.g. "cricket/1554562"). */
  espnLeagueName?: string | null;
  /** ESPN only: the match's own saved ESPN event id. */
  espnEventId?: string | null;
}

/** Only the name fields — the route needs nothing else from a team. */
export const lookupTeam = (team: LookupTeam | undefined): LookupTeam => ({
  name: team?.name,
  displayName: team?.displayName,
  abbreviation: team?.abbreviation,
});

/**
 * Looks the match up on `site` — Sofascore from this browser (it blocks
 * server requests), the others through `POST /api/match/source-lookup`.
 * Throws with `sourceUrls` attached when the site says what it read.
 */
export async function requestLookup(
  site: MatchSourceSite,
  request: MatchSourceLookupRequest,
  matchUrl: string,
): Promise<MatchAnswersResult> {
  if (site.id === "sofascore") {
    const alternative = request.gameType.toLowerCase() === "cricket" ? MATCH_SOURCE_SITES.cricbuzz
      : request.gameType.toLowerCase() === "football" ? MATCH_SOURCE_SITES.fotmob : undefined;
    return withSofascoreFallback(() => lookupSofascoreMatch(
      {
        gameType: request.gameType,
        teamA: request.teamA ?? {},
        teamB: request.teamB ?? {},
        matchStartTime: request.matchStartTime,
        questions: indexedQuestions(request.questions ?? []),
      },
      matchUrl,
    ), alternative ? () => requestLookup(alternative, request, "") : undefined, matchUrl);
  }
  const res = await fetch("/api/match/source-lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      ...request,
      site: site.id,
      ...(matchUrl ? { matchUrl } : {}),
    }),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success) {
    throw Object.assign(
      new Error(payload?.message || `Failed to fetch the match from ${site.name}`),
      { sourceUrls: errorSourceUrls(payload) },
    );
  }
  return payload.data as MatchAnswersResult;
}

/** The latest result from each site fetched so far. */
export type MatchSourceResults = Partial<
  Record<MatchAnswerSource, MatchAnswersResult>
>;

/** The fetched results in the sites' order (Cricbuzz before Sofascore), whichever came first. */
export const resultsInSiteOrder = (
  sites: MatchSourceSite[],
  results: MatchSourceResults,
): MatchAnswersResult[] => sites.flatMap((site) => results[site.id] ?? []);

/** One column per site's result, side by side from `md` up. */
export const sourceColumnsClass = (count: number) =>
  `grid gap-3 ${count > 1 ? "md:grid-cols-2" : ""}`;

/**
 * Looks a match up on whichever site the admin picks, and keeps each site's
 * result — fetching from a second site shows it next to the first.
 */
export function useMatchSourceLookup() {
  const [results, setResults] = useState<MatchSourceResults>({});
  const [fetchingSite, setFetchingSite] = useState<MatchSourceSite | null>(null);
  const [error, setError] = useState("");
  const [errorSources, setErrorSources] = useState<MatchAnswerSourceUrl[]>([]);

  /** `buildRequest` may itself fetch (e.g. an event's match); its errors show like the lookup's. */
  const fetchLookup = async (
    site: MatchSourceSite,
    buildRequest: () => MatchSourceLookupRequest | Promise<MatchSourceLookupRequest>,
    matchUrl: string,
  ) => {
    setFetchingSite(site);
    setError("");
    setErrorSources([]);
    try {
      const result = await requestLookup(site, await buildRequest(), matchUrl.trim());
      // Keyed by where it came from: a Sofascore fallback lands under Cricbuzz / FotMob.
      setResults((prev) => ({ ...prev, [result.source]: result }));
    } catch (err) {
      // Drop this site's older result; the other sites' stay up.
      setResults((prev) => {
        const next = { ...prev };
        delete next[site.id];
        return next;
      });
      setErrorSources(errorSourceUrls(err));
      setError(err instanceof Error ? err.message : `Failed to fetch the match from ${site.name}`);
    } finally {
      setFetchingSite(null);
    }
  };

  return {
    results,
    fetching: fetchingSite !== null,
    fetchingSite,
    error,
    errorSources,
    fetchLookup,
  };
}

export type MatchSourceLookupState = ReturnType<typeof useMatchSourceLookup>;

/** One fetch button per site: "Fetch from X", "Fetching from X…", "Fetch again from X". */
export function SiteFetchButtons<S extends MatchSourceSite>({
  sites,
  fetchLabel,
  fetchingSite,
  fetchedSources,
  onFetch,
}: {
  sites: S[];
  /** Button text before the first fetch from that site. */
  fetchLabel: (site: S) => string;
  fetchingSite: MatchSourceSite | null;
  /** Sites whose result is on screen. */
  fetchedSources: MatchAnswerSource[];
  onFetch: (site: S) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sites.map((site) => (
        <button
          key={site.id}
          type="button"
          onClick={() => onFetch(site)}
          disabled={fetchingSite !== null}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {fetchingSite?.id === site.id
            ? `Fetching from ${site.name}…`
            : fetchedSources.includes(site.id)
              ? `Fetch again from ${site.name}`
              : fetchLabel(site)}
        </button>
      ))}
    </div>
  );
}

/** "Optional: paste a Cricbuzz or Sofascore match URL …" */
export const matchUrlPlaceholder = (sites: MatchSourceSite[]) =>
  sites.length === 1
    ? `Optional: paste a ${sites[0].name} match URL (e.g. ${sites[0].urlExample}) to use that match instead of auto-matching`
    : `Optional: paste a ${siteNames(sites)} match URL to use that match instead of auto-matching, then fetch from that site`;

/**
 * The fetch-from-site card: title, a fetch button per site, optional match
 * URL, errors, and each site's match side by side with `renderResult` under it.
 */
export function MatchSourceLookupCard({
  sites,
  title,
  description,
  fetchLabel,
  state,
  onFetch,
  renderResult,
}: {
  sites: MatchSourceSite[];
  title: string;
  description: string;
  /** Button text before the first fetch from that site. */
  fetchLabel: (site: MatchSourceSite) => string;
  state: MatchSourceLookupState;
  onFetch: (site: MatchSourceSite, matchUrl: string) => void;
  /** Shown under one site's match. */
  renderResult?: (result: MatchAnswersResult) => ReactNode;
}) {
  const [matchUrl, setMatchUrl] = useState("");
  const { fetchingSite, error, errorSources } = state;
  const results = resultsInSiteOrder(sites, state.results);

  return (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <SiteFetchButtons
          sites={sites}
          fetchLabel={fetchLabel}
          fetchingSite={fetchingSite}
          fetchedSources={results.map((r) => r.source)}
          onFetch={(site) => onFetch(site, matchUrl)}
        />
      </div>

      <input
        type="url"
        value={matchUrl}
        onChange={(e) => setMatchUrl(e.target.value)}
        placeholder={matchUrlPlaceholder(sites)}
        className="mt-4 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
      />

      {error && (
        <div className="mt-4 rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-200">{error}</p>
          <SourceLinks sources={errorSources} />
        </div>
      )}

      {results.length > 0 && (
        <div className={`mt-4 ${sourceColumnsClass(results.length)}`}>
          {results.map((result) => (
            <div key={result.source} className="min-w-0 rounded-lg bg-zinc-800 p-4">
              <MatchSourceSummary lookup={result} />
              {renderResult?.(result)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SourceLinks({ sources }: { sources: MatchAnswerSourceUrl[] }) {
  if (!sources.length) return null;
  return (
    <div className="mt-3 text-sm">
      <p className="text-gray-400 mb-1">Fetched from:</p>
      <ul className="space-y-1">
        {sources.map((s) => (
          <li key={s.url} className="flex flex-wrap gap-x-2 min-w-0">
            <span className="text-gray-400">{s.label}:</span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 underline break-all"
            >
              {s.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The match as the source site has it: teams, state, result and where it came from. */
export function MatchSourceSummary({ lookup }: { lookup: MatchSourceLookup }) {
  return (
    <>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-400">
        {MATCH_SOURCE_SITES[lookup.source].name}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-white font-semibold">{lookup.match.title}</p>
        <span
          className={`px-2 py-0.5 text-xs rounded ${
            lookup.match.isComplete
              ? "bg-green-900 text-green-200"
              : "bg-amber-900 text-amber-200"
          }`}
        >
          {lookup.match.state}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        {lookup.match.subtitle && `${lookup.match.subtitle} · `}
        {new Date(lookup.match.startTime).toLocaleString()} ·{" "}
        {lookup.matchedBy === "auto"
          ? "matched automatically"
          : "from the URL you pasted"}
      </p>
      <p className="text-sm text-gray-200 mt-1">{lookup.match.status}</p>

      <SourceLinks sources={lookup.sourceUrls} />

      {lookup.warnings.map((w) => (
        <p
          key={w}
          className="mt-3 p-3 text-sm bg-amber-900/20 border border-amber-800 rounded text-amber-200"
        >
          {w}
        </p>
      ))}
    </>
  );
}
