"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { apiRequest, ApiRequestError } from "@/app/utils/apiRequest";
import F1StatsCharts from "./F1StatsCharts";
import { formatIst } from "./motorsportHelpers";
import type { MotorsportMatch } from "@/app/models/motorsport-match.model";
import {
  F1_RACE_NOT_ON_ESPN,
  F1_STATS_NOT_FOUND,
  type F1RaceStats,
} from "@/app/models/f1-race-stats.model";

/** The backend waits up to 45 s for the live-score service. */
const FETCH_TIMEOUT_MS = 65_000;

const isSuperAdmin = (userType: string | undefined) =>
  userType?.replace(/[\s_-]/g, "").toUpperCase() === "SUPERADMIN";

function summaryStatusClass(status: string | null | undefined): string {
  switch (status?.toLowerCase()) {
    case "final":
      return "bg-emerald-900 text-emerald-200";
    case "in progress":
      return "bg-amber-900 text-amber-200";
    case "scheduled":
      return "bg-sky-900 text-sky-200";
    default:
      return "bg-zinc-700 text-zinc-200";
  }
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-x-2 text-sm">
      <span className="text-gray-400">{label}:</span>
      <span className="min-w-0 break-words text-white">{children}</span>
    </div>
  );
}

/**
 * F1 Stats section on the motorsport race page. Reads the stored stats with
 * `GET /match/matchStats/f1/race/:matchId` and, for super admins, pulls a
 * fresh snapshot from the live-score service with `POST /match/matchStats/f1/race`.
 * Stats never refresh on their own: re-fetch after each session.
 */
export default function F1StatsCard({
  race,
  onNotice,
}: {
  race: MotorsportMatch;
  onNotice: (message: string) => void;
}) {
  const { user } = useAuthStore();
  const [forbidden, setForbidden] = useState(false);
  const canFetch = isSuperAdmin(user?.userType) && !forbidden;

  const [stats, setStats] = useState<F1RaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [espnName, setEspnName] = useState(race.name ?? "");
  const [year, setYear] = useState(race.seasonYear ?? "");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [nameError, setNameError] = useState("");
  const [showJson, setShowJson] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setStats(
        await apiRequest<F1RaceStats>(
          `/api/match/matchStats/f1/race/${encodeURIComponent(race._id)}`,
          { method: "GET" },
          "Failed to load F1 stats",
        ),
      );
    } catch (err) {
      setStats(null);
      if (
        err instanceof ApiRequestError &&
        err.status === 404 &&
        err.message === F1_STATS_NOT_FOUND
      ) {
        return; // Never fetched: show the empty state.
      }
      setLoadError(
        err instanceof ApiRequestError && err.status === 404
          ? "Race not found"
          : err instanceof Error
            ? err.message
            : "Failed to load F1 stats",
      );
    } finally {
      setLoading(false);
    }
  }, [race._id]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fetching) return;

    const trimmedName = espnName.trim();
    const trimmedYear = year.trim();
    setFetchError("");
    setNameError("");
    if (trimmedYear && !/^\d{4}$/.test(trimmedYear)) {
      setFetchError("Year must be four digits, e.g. 2026");
      return;
    }

    setFetching(true);
    try {
      const saved = await apiRequest<F1RaceStats>(
        "/api/match/matchStats/f1/race",
        {
          method: "POST",
          body: JSON.stringify({
            matchId: race._id,
            ...(trimmedName ? { name: trimmedName } : {}),
            ...(trimmedYear ? { year: trimmedYear } : {}),
          }),
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        },
        "Failed to fetch F1 stats",
      );
      setStats(saved);
      onNotice("F1 stats updated.");
    } catch (err) {
      if (!(err instanceof ApiRequestError)) {
        const timedOut =
          err instanceof Error &&
          (err.name === "TimeoutError" || err.name === "AbortError");
        setFetchError(
          timedOut
            ? "The request timed out. Stats service may be slow, try again shortly."
            : err instanceof Error
              ? err.message
              : "Failed to fetch F1 stats",
        );
        return;
      }
      if (err.status === 404 && err.message === F1_RACE_NOT_ON_ESPN) {
        setNameError(
          `ESPN has no race called '${trimmedName || race.name}' in ${
            trimmedYear || race.seasonYear
          }. Check the ESPN race name.`,
        );
      } else if (err.status === 403) {
        setForbidden(true);
        setFetchError("Only a super admin can fetch F1 stats.");
      } else if (err.status === 409) {
        setFetchError(
          "These ESPN stats are already saved on another race. Check the ESPN name.",
        );
      } else if (err.status === 502 || err.status === 504) {
        setFetchError("Stats service unavailable, try again shortly.");
      } else if (err.status === 404) {
        setFetchError(
          err.message === "Motorsport match not found"
            ? "Race not found"
            : err.message,
        );
      } else {
        setFetchError(err.message);
      }
    } finally {
      setFetching(false);
    }
  };

  const summary = stats?.matchSummary;
  const track = summary?.track;
  const winner = summary?.winner;
  const stages = summary?.charts?.weekendPositionTrack?.stages ?? [];
  const qualifyingSeries =
    summary?.charts?.qualifyingElimination?.series?.length ?? 0;
  const classified = summary?.classification?.length ?? 0;
  const trackPlace = [track?.city, track?.country].filter(Boolean).join(", ");

  return (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">F1 Stats</h2>
        <button
          type="button"
          onClick={() => loadStats()}
          disabled={loading || fetching}
          aria-label="Reload F1 stats"
          className="rounded-md border border-zinc-600 p-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : loadError ? (
        <p className="text-red-400">
          {loadError}{" "}
          <button
            type="button"
            onClick={() => loadStats()}
            className="underline hover:text-red-300"
          >
            Retry
          </button>
        </p>
      ) : !stats || !summary ? (
        <p className="text-gray-400">
          Not fetched yet. Players won’t see stats for this race until they are
          fetched.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {track?.picture && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.picture}
              alt={track.name ?? "Track"}
              className="h-24 w-36 shrink-0 rounded-md bg-zinc-800 object-contain"
            />
          )}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`rounded-full px-3 py-0.5 font-medium ${summaryStatusClass(
                  summary.status,
                )}`}
              >
                {summary.status ?? "Unknown"}
              </span>
              <span className="text-gray-400">
                Last fetched {formatIst(stats.fetchedAt ?? stats.updatedAt)}
              </span>
            </div>
            <p className="text-lg font-semibold text-white">
              {summary.name ?? "—"}
              {summary.seasonYear ? ` (${summary.seasonYear})` : ""}
            </p>
            {(track?.name || trackPlace) && (
              <Row label="Track">
                {[track?.name, trackPlace].filter(Boolean).join(" · ")}
              </Row>
            )}
            <Row label="Weekend">
              {formatIst(summary.startDate)} → {formatIst(summary.endDate)}
            </Row>
            <Row label="Winner">
              {winner?.name
                ? `${winner.name}${winner.team ? ` (${winner.team})` : ""}`
                : "No result yet"}
              {" · "}
              {classified} classified
            </Row>
            <Row label="Sessions">
              {stages.length > 0 ? (
                <span className="inline-flex flex-wrap gap-1">
                  {stages.map((stage) => (
                    <span
                      key={stage}
                      className="rounded bg-zinc-700 px-1.5 py-0.5 font-mono text-xs text-zinc-100"
                    >
                      {stage}
                    </span>
                  ))}
                </span>
              ) : (
                "None yet"
              )}
            </Row>
            <Row label="Qualifying data">
              {qualifyingSeries > 0
                ? `${qualifyingSeries} drivers`
                : "None yet"}
            </Row>
            <Row label="ESPN event id">
              <span className="font-mono">{stats.espnId}</span>
            </Row>
          </div>
        </div>
      )}

      {canFetch && (
        <form
          onSubmit={handleFetch}
          className="mt-6 border-t border-zinc-700 pt-4"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_8rem]">
            <label className="block text-sm">
              <span className="mb-1 block text-gray-400">ESPN race name</span>
              <input
                type="text"
                value={espnName}
                onChange={(e) => {
                  setEspnName(e.target.value);
                  setNameError("");
                }}
                disabled={fetching}
                placeholder={race.name}
                className={`w-full rounded-md border bg-zinc-800 px-3 py-2 text-white outline-none focus:border-zinc-400 disabled:opacity-60 ${
                  nameError ? "border-red-500" : "border-zinc-600"
                }`}
              />
              <span className="mt-1 block text-xs text-gray-500">
                ESPN’s official name, usually with the sponsor (e.g. “Pirelli
                Italian Grand Prix”).
              </span>
              {nameError && (
                <span className="mt-1 block text-xs text-red-400">
                  {nameError}
                </span>
              )}
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-gray-400">Year</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={fetching}
                placeholder={race.seasonYear}
                className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-zinc-400 disabled:opacity-60"
              />
            </label>
          </div>

          {fetchError && (
            <p className="mt-3 text-sm text-red-400">{fetchError}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            {fetching && (
              <span className="text-sm text-gray-400">
                Pulling from the stats service, this can take up to a minute…
              </span>
            )}
            <button
              type="submit"
              disabled={fetching}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-60"
            >
              {fetching && <Loader2 className="h-4 w-4 animate-spin" />}
              {stats ? "Re-fetch" : "Fetch"}
            </button>
          </div>
        </form>
      )}

      {!loading && !loadError && summary && (
        <F1StatsCharts key={stats?.updatedAt} summary={summary} />
      )}

      {stats && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowJson((prev) => !prev)}
            className="rounded-md bg-zinc-600 px-3 py-1.5 text-sm text-white hover:bg-zinc-500"
          >
            {showJson ? "Hide stats JSON" : "Show stats JSON"}
          </button>
          {showJson && (
            <pre className="mt-4 max-h-96 overflow-auto rounded-lg border border-zinc-700 bg-zinc-950 p-4 font-mono text-xs text-gray-300">
              {JSON.stringify(stats, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
