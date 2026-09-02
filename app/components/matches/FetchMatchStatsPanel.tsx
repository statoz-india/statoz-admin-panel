"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, BarChart3 } from "lucide-react";
import type { MatchData } from "@/app/api/match/route";
import type { MatchStatsDocument } from "@/app/interface/match-stats.interface";
import { isMatchStatsGameType } from "@/app/interface/match-stats.interface";
import { useMatchStatsSocket } from "@/app/utils/matchStatsSocket";
import { asRecord } from "./match-stats-ui";
import MatchStatsResultView from "./MatchStatsResultView";

interface FetchMatchStatsPanelProps {
  match: MatchData;
}

export default function FetchMatchStatsPanel({
  match,
}: FetchMatchStatsPanelProps) {
  const gameType = String(match.gameType ?? "")
    .trim()
    .toLowerCase();

  if (!isMatchStatsGameType(gameType)) {
    return null;
  }

  return <FetchMatchStatsPanelInner match={match} />;
}

function FetchMatchStatsPanelInner({ match }: FetchMatchStatsPanelProps) {
  const prefilledEspnId = match.matchEvent?.id?.trim() ?? "";
  const [espnId, setEspnId] = useState(prefilledEspnId);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MatchStatsDocument | null>(null);

  const loadExisting = useCallback(async () => {
    if (!match._id) {
      setStats(null);
      setLoadingExisting(false);
      return;
    }
    setLoadingExisting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/match/matchStats/${encodeURIComponent(match._id)}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) {
        throw new Error(
          typeof body?.message === "string"
            ? body.message
            : `Failed to load match stats (${res.status})`,
        );
      }
      // Null / missing document → hide the summary, keep the fetch controls.
      setStats(
        body.data && typeof body.data === "object"
          ? (body.data as MatchStatsDocument)
          : null,
      );
    } catch (e) {
      setStats(null);
      setError(
        e instanceof Error ? e.message : "Failed to load existing match stats",
      );
    } finally {
      setLoadingExisting(false);
    }
  }, [match._id]);

  useEffect(() => {
    setEspnId(match.matchEvent?.id?.trim() ?? "");
    setError(null);
    void loadExisting();
  }, [match._id, match.matchEvent?.id, loadExisting]);

  const subscribeId = (stats?.espnId || espnId).trim();
  const socketIds = useMemo(
    () => (subscribeId ? [subscribeId] : []),
    [subscribeId],
  );
  const socket = useMatchStatsSocket(socketIds, {
    enabled: Boolean(stats && subscribeId),
  });
  const livePayload = subscribeId
    ? socket.statsByEventId[subscribeId]
    : undefined;

  const hasFetched = Boolean(stats?.fetchedAt);
  const canSubmit = Boolean(
    match.matchId?.trim() && match._id?.trim() && espnId.trim(),
  );

  const fetchStats = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/match/matchStats", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchUniqueId: match.matchId.trim(),
          matchId: match._id.trim(),
          espnId: espnId.trim(),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) {
        throw new Error(
          typeof body?.message === "string"
            ? body.message
            : `Failed to fetch match stats (${res.status})`,
        );
      }
      setStats(body.data as MatchStatsDocument);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch match stats");
    } finally {
      setLoading(false);
    }
  };

  // Live socket replaces the summary in place when a newer tick arrives.
  useEffect(() => {
    if (!livePayload?.summary) return;
    const nextSummary = asRecord(livePayload.summary);
    if (!nextSummary) return;
    setStats((prev) => {
      if (!prev) return prev;
      if (prev.fetchedAt === livePayload.updatedAt) return prev;
      return {
        ...prev,
        matchSummary: nextSummary,
        gameType: String(livePayload.gameType ?? prev.gameType),
        fetchedAt: livePayload.updatedAt ?? prev.fetchedAt,
      };
    });
  }, [livePayload]);

  return (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Match stats
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Loads saved MatchStats for this match. Fetch / refresh pulls a new
            ESPN summary (up to ~45s).
          </p>
        </div>
        <button
          type="button"
          onClick={fetchStats}
          disabled={!canSubmit || loading || loadingExisting}
          className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading
            ? "Fetching…"
            : hasFetched
              ? "Refresh match stats"
              : "Fetch match stats"}
        </button>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Match unique id
          </span>
          <input
            type="text"
            value={match.matchId}
            readOnly
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-300"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            ESPN event ID
          </span>
          <input
            type="text"
            value={espnId}
            onChange={(e) => setEspnId(e.target.value)}
            disabled={loading}
            placeholder="e.g. 401879295"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none disabled:opacity-60"
          />
        </label>
        <div className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            League (from match)
          </span>
          <p className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-zinc-300">
            {match.espnLeagueName || match.tournament || "—"}
          </p>
        </div>
      </div>

      {!match.espnLeagueName && !match.tournament && (
        <p className="mb-4 text-xs text-amber-400">
          This match has no espnLeagueName / tournament — the backend will
          reject the fetch.
        </p>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loadingExisting && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          Loading saved stats…
        </div>
      )}

      {loading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          Waiting on the summary service…
        </div>
      )}

      {!loadingExisting && stats && (
        <>
          {socket.status === "connected" && (
            <p className="mb-3 text-xs text-emerald-400">
              Live socket connected — summary refreshes on each poller tick.
            </p>
          )}
          <MatchStatsResultView doc={stats} />
        </>
      )}
    </div>
  );
}
