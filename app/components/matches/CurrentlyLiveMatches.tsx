"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Atom } from "react-loading-indicators";
import type { LiveRegistryMatch } from "@/app/api/match/currently-live/route";
import {
  useMatchStatsSocket,
  useRelativeTime,
  formatRelativeTime,
  type MatchStatsPayload,
  type SocketStatus,
} from "@/app/utils/matchStatsSocket";
import { MatchSummaryByGameType } from "./MatchStatsResultView";

/** The registry refills on the backend's 30s live-score tick. */
const REGISTRY_POLL_MS = 30_000;
/** The stats poller's own interval — how long a first payload can take. */
const STATS_POLL_SECONDS = 60;

const GAME_TYPES = ["cricket", "football", "basketball"] as const;
const ALL_GAME_TYPES = "__ALL__";

const STATUS_LABEL: Record<SocketStatus, string> = {
  idle: "Not connected",
  connecting: "Connecting…",
  connected: "Live",
  disconnected: "Reconnecting…",
  error: "Socket error",
};

const STATUS_STYLE: Record<SocketStatus, string> = {
  idle: "bg-zinc-700 text-zinc-200",
  connecting: "bg-amber-900 text-amber-200",
  connected: "bg-emerald-900 text-emerald-200",
  disconnected: "bg-amber-900 text-amber-200",
  error: "bg-red-900 text-red-200",
};

function SocketStatusPill({ status }: { status: SocketStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLE[status]}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status === "connected" ? "animate-pulse bg-emerald-400" : "bg-current"
        }`}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

function LiveForBadge({ since }: { since?: string }) {
  const relative = useRelativeTime(since ?? null);
  if (!since) return null;
  return (
    <span className="text-xs text-zinc-400">Live since {relative}</span>
  );
}

function LiveMatchCard({
  entry,
  payload,
  onOpenMatch,
}: {
  entry: LiveRegistryMatch;
  payload?: MatchStatsPayload;
  onOpenMatch: (matchId: string) => void;
}) {
  const updatedRelative = useRelativeTime(payload?.updatedAt ?? null);

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-white">
              {entry.league || "Unknown league"}
            </h3>
            {entry.gameType && (
              <span className="rounded-full bg-sky-900 px-3 py-1 text-xs font-medium capitalize text-sky-200">
                {entry.gameType}
              </span>
            )}
          </div>
          <p className="break-all text-sm text-gray-400">
            ESPN event ID: {entry.espnEventId}
          </p>
          <p className="break-all text-sm text-gray-400">
            Match Mongo ID: {entry.matchId ?? "unresolved"}
          </p>
          <LiveForBadge since={entry.wentLiveAt} />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {payload ? (
            <span className="rounded-full bg-emerald-900 px-3 py-1 text-xs font-medium text-emerald-200">
              Updated {updatedRelative}
            </span>
          ) : (
            <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-200">
              Waiting for first tick
            </span>
          )}
          {entry.matchId ? (
            <button
              type="button"
              onClick={() => onOpenMatch(entry.matchId as string)}
              className="rounded-md border border-zinc-600 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
            >
              Open match
            </button>
          ) : (
            <span
              className="rounded-md border border-amber-800 px-3 py-1 text-xs text-amber-300"
              title="The live feed could not be matched to a Match document, so nothing is persisted against a match here."
            >
              No match document
            </span>
          )}
        </div>
      </div>

      {payload ? (
        <MatchSummaryByGameType
          gameType={String(payload.gameType ?? entry.gameType ?? "")}
          summary={payload.summary}
          fetchedAt={payload.updatedAt}
          espnId={payload.espnEventId}
          showRawJson={false}
        />
      ) : (
        <div className="rounded-lg bg-zinc-900/60 p-4">
          <p className="text-sm text-gray-400">
            Subscribed. The poller pushes once every {STATS_POLL_SECONDS}s and
            there is no replay on subscribe, so the first payload can take up to
            a minute. Nothing arrives at all for tennis, racing, a match with no
            game type, or while ESPN fetches are failing.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * The matches the backend's stats poller is currently working on, with their
 * summaries streamed in over Socket.IO.
 *
 * Distinct from "Show Live Matches": that lists matches flagged live in the
 * database, this is the poller's in-memory registry. The registry is
 * per-process and empties on a backend restart, so behind a load balancer this
 * shows whichever instance served the request.
 */
export default function CurrentlyLiveMatches({
  onOpenMatch,
}: {
  onOpenMatch: (matchId: string) => void;
}) {
  const [entries, setEntries] = useState<LiveRegistryMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const [gameTypeFilter, setGameTypeFilter] = useState<string>(ALL_GAME_TYPES);
  const initialLoadRef = useRef(true);

  const fetchRegistry = useCallback(async (options?: { quiet?: boolean }) => {
    const quiet = options?.quiet === true;
    try {
      if (!quiet) setLoading(true);
      const res = await fetch("/api/match/currently-live", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to fetch live matches");
      }
      const list = Array.isArray(body.data) ? body.data : [];
      setEntries(
        (list as LiveRegistryMatch[]).filter(
          (entry) => typeof entry?.espnEventId === "string",
        ),
      );
      setError("");
      setRefreshedAt(new Date().toISOString());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load live matches",
      );
    } finally {
      if (!quiet) setLoading(false);
      initialLoadRef.current = false;
    }
  }, []);

  useEffect(() => {
    void fetchRegistry();
    const timer = setInterval(
      () => void fetchRegistry({ quiet: true }),
      REGISTRY_POLL_MS,
    );
    return () => clearInterval(timer);
  }, [fetchRegistry]);

  const visibleEntries = useMemo(() => {
    if (gameTypeFilter === ALL_GAME_TYPES) return entries;
    return entries.filter((entry) => entry.gameType === gameTypeFilter);
  }, [entries, gameTypeFilter]);

  // Subscribe to everything live, not just what the filter shows, so flipping
  // the filter doesn't throw away a payload that already arrived.
  const espnEventIds = useMemo(
    () => entries.map((entry) => entry.espnEventId),
    [entries],
  );
  const { status, error: socketError, statsByEventId, lastPayloadAt } =
    useMatchStatsSocket(espnEventIds);

  const refreshedRelative = useRelativeTime(refreshedAt);

  if (loading && initialLoadRef.current) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold text-white">Currently live</h3>
          <SocketStatusPill status={status} />
          <span className="text-xs text-zinc-400">
            {entries.length} in the registry
            {lastPayloadAt
              ? ` · last payload ${formatRelativeTime(lastPayloadAt)}`
              : ""}
            {refreshedAt ? ` · list refreshed ${refreshedRelative}` : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={() => void fetchRegistry({ quiet: true })}
          className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Refresh list
        </button>
      </div>

      {socketError && (
        <div className="mb-4 rounded-lg border border-amber-800 bg-amber-900/20 p-4">
          <p className="text-sm text-amber-300">
            Live statistics socket: {socketError}
          </p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {[ALL_GAME_TYPES, ...GAME_TYPES].map((gameType) => {
            const count =
              gameType === ALL_GAME_TYPES
                ? entries.length
                : entries.filter((entry) => entry.gameType === gameType).length;
            return (
              <button
                key={gameType}
                type="button"
                onClick={() => setGameTypeFilter(gameType)}
                className={`rounded-md px-4 py-2 font-medium capitalize transition-colors ${
                  gameTypeFilter === gameType
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {gameType === ALL_GAME_TYPES ? "All sports" : gameType}
                <span className="ml-2 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      ) : visibleEntries.length === 0 ? (
        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">
            {entries.length === 0
              ? "Nothing is live right now. A match enters the registry on the backend's 30s live-score tick and leaves it the moment it finishes; a backend restart empties the registry until the next tick."
              : `No live ${gameTypeFilter} matches right now.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {visibleEntries.map((entry) => (
            <LiveMatchCard
              key={entry.espnEventId}
              entry={entry}
              payload={statsByEventId[entry.espnEventId]}
              onOpenMatch={onOpenMatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}
