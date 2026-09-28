"use client";

import { useState, type ReactNode } from "react";
import type {
  MatchAnswerSourceUrl,
  MatchAnswersResult,
  MatchSourceLookup,
} from "@/app/interface/match-answers.interface";

/** The site a game type's matches are looked up on. */
export interface MatchSourceSite {
  name: string;
  urlExample: string;
}

export const MATCH_SOURCE_SITES = {
  cricket: {
    name: "Cricbuzz",
    urlExample: "https://www.cricbuzz.com/live-cricket-scores/12345/…",
  },
  football: {
    name: "FotMob",
    urlExample: "https://www.fotmob.com/match/12345",
  },
} satisfies Record<string, MatchSourceSite>;

export function matchSourceSiteFor(
  gameType: string | null | undefined,
): MatchSourceSite | null {
  const key = gameType?.trim().toLowerCase();
  return key && key in MATCH_SOURCE_SITES
    ? MATCH_SOURCE_SITES[key as keyof typeof MATCH_SOURCE_SITES]
    : null;
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
}

/** Only the name fields — the route needs nothing else from a team. */
export const lookupTeam = (team: LookupTeam | undefined): LookupTeam => ({
  name: team?.name,
  displayName: team?.displayName,
  abbreviation: team?.abbreviation,
});

/** Calls `POST /api/match/source-lookup` and keeps its result or error. */
export function useMatchSourceLookup(site: MatchSourceSite) {
  const [result, setResult] = useState<MatchAnswersResult | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [errorSources, setErrorSources] = useState<MatchAnswerSourceUrl[]>([]);

  /** `buildRequest` may itself fetch (e.g. an event's match); its errors show like the lookup's. */
  const fetchLookup = async (
    buildRequest: () => MatchSourceLookupRequest | Promise<MatchSourceLookupRequest>,
    matchUrl: string,
  ) => {
    const failure = `Failed to fetch the match from ${site.name}`;
    setFetching(true);
    setError("");
    setErrorSources([]);
    try {
      const request = await buildRequest();
      const res = await fetch("/api/match/source-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...request,
          ...(matchUrl.trim() ? { matchUrl: matchUrl.trim() } : {}),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.success) {
        setErrorSources(
          Array.isArray(payload?.sourceUrls) ? payload.sourceUrls : [],
        );
        throw new Error(payload?.message || failure);
      }
      setResult(payload.data as MatchAnswersResult);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : failure);
    } finally {
      setFetching(false);
    }
  };

  return { result, fetching, error, errorSources, fetchLookup };
}

export type MatchSourceLookupState = ReturnType<typeof useMatchSourceLookup>;

/**
 * The fetch-from-Cricbuzz/FotMob card: title, fetch button, optional match
 * URL, errors, and the found match with `children` under it.
 */
export function MatchSourceLookupCard({
  site,
  title,
  description,
  fetchLabel,
  state,
  onFetch,
  children,
}: {
  site: MatchSourceSite;
  title: string;
  description: string;
  /** Button text before the first fetch. */
  fetchLabel: string;
  state: MatchSourceLookupState;
  onFetch: (matchUrl: string) => void;
  children?: ReactNode;
}) {
  const [matchUrl, setMatchUrl] = useState("");
  const { result, fetching, error, errorSources } = state;

  return (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => onFetch(matchUrl)}
          disabled={fetching}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {fetching
            ? `Fetching from ${site.name}…`
            : result
              ? "Fetch again"
              : fetchLabel}
        </button>
      </div>

      <input
        type="url"
        value={matchUrl}
        onChange={(e) => setMatchUrl(e.target.value)}
        placeholder={`Optional: paste a ${site.name} match URL (e.g. ${site.urlExample}) to use that match instead of auto-matching`}
        className="mt-4 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
      />

      {error && (
        <div className="mt-4 rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-200">{error}</p>
          <SourceLinks sources={errorSources} />
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg bg-zinc-800 p-4">
          <MatchSourceSummary lookup={result} />
          {children}
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
