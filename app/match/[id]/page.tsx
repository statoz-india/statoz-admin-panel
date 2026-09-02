"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Atom } from "react-loading-indicators";
import { useAuthStore } from "@/app/store/authStore";
import { MatchData } from "@/app/api/match/route";
import {
  buildAdminHomeHref,
  FROM_MATCH_DETAIL,
  QUERY_PARENT_MATCH_ID,
} from "@/app/utils/buildAdminHomeHref";
import {
  MatchBannerUrlWithCopy,
  MatchIdWithCopy,
} from "@/app/components/matches/MatchCopyChips";
import {
  UpdateMatchBannerDialog,
  UpdateMatchStartTimeDialog,
} from "@/app/components/matches/MatchUpdateDialogs";
import FetchMatchStatsPanel from "@/app/components/matches/FetchMatchStatsPanel";
import type {
  MatchEvent,
  MatchPrediction,
  MatchQuiz,
} from "@/app/interface/match-picks.interface";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";

const QUERY_MATCH_TOURNAMENT = "matchTournament";

function formatDateIST(isoString: string | undefined): string {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

const formatCoins = (value: number | null | undefined): string =>
  typeof value === "number" ? value.toLocaleString("en-IN") : "—";

const formatOdds = (value: number | null | undefined): string =>
  typeof value === "number" ? `${value}%` : "—";

function statusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case "LIVE":
      return "bg-emerald-900 text-emerald-200";
    case "ACTIVE":
      return "bg-teal-900 text-teal-200";
    case "UPCOMING":
      return "bg-violet-900 text-violet-200";
    case "FINISHED":
      return "bg-zinc-700 text-zinc-200";
    case "ENTRYNOTSTARTED":
      return "bg-slate-700 text-slate-200";
    case "ENTRYCLOSED":
      return "bg-amber-900 text-amber-200";
    case "SETTLEMENT_DONE":
      return "bg-purple-900 text-purple-200";
    case "ANSWER_UPDATED":
    case "WINNING_TEAM_UPDATED":
    case "WINNING_OPTION_UPDATED":
      return "bg-blue-900 text-blue-200";
    case "CANCELLED":
    case "DELETED":
      return "bg-red-900 text-red-200";
    case "NOT_VISIBLE":
      return "bg-rose-900 text-rose-200";
    case "ADMIN_VISIBLE":
      return "bg-cyan-900 text-cyan-200";
    default:
      return "bg-zinc-800 text-zinc-200";
  }
}

/** The proxy collapses the backend's 404-on-empty into an empty 200. */
async function fetchMatchScopedList<T>(path: string): Promise<T[]> {
  const res = await fetch(path, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success) {
    throw new Error(
      typeof payload?.message === "string" ? payload.message : "Request failed",
    );
  }
  return Array.isArray(payload.data) ? payload.data : [];
}

/** The match list endpoints are tournament-scoped, so resolve one match out of them. */
async function fetchMatchesForTournament(
  tournament: string,
): Promise<MatchData[]> {
  const endpoint =
    tournament === "LIVE"
      ? "/api/match/live-matches"
      : `/api/match/${encodeURIComponent(tournament)}`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success) {
    throw new Error(
      typeof payload?.message === "string"
        ? payload.message
        : "Failed to load match",
    );
  }
  return Array.isArray(payload.data) ? payload.data : [];
}

function SectionCard({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">
        {title} ({count})
      </h2>
      {children}
    </div>
  );
}

/** Loading / error / empty states shared by the three pick sections. */
function SectionState({
  loading,
  error,
  isEmpty,
  emptyMessage,
}: {
  loading: boolean;
  error: string;
  isEmpty: boolean;
  emptyMessage: string;
}) {
  if (loading) return <p className="text-gray-400">Loading…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (isEmpty) return <p className="text-gray-400">{emptyMessage}</p>;
  return null;
}

function OddsBar({
  segments,
}: {
  segments: { label: string; odds: number; color: string }[];
}) {
  const total = segments.reduce((sum, s) => sum + (s.odds || 0), 0);
  return (
    <div className="mt-3">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        {segments.map((segment) => (
          <div
            key={segment.label}
            style={{
              width: total > 0 ? `${(segment.odds / total) * 100}%` : "0%",
              backgroundColor: segment.color,
            }}
            title={`${segment.label}: ${formatOdds(segment.odds)}`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {segments.map((segment) => (
          <span key={segment.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-gray-400">{segment.label}</span>
            <span className="font-medium text-white">
              {formatOdds(segment.odds)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const hasHydrated = useAuthHydrated();

  const matchId = params?.id as string;
  const fromSection = searchParams.get("from");
  const tournamentParam =
    searchParams.get(QUERY_MATCH_TOURNAMENT) ?? searchParams.get("tournament");

  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isStartTimeDialogOpen, setIsStartTimeDialogOpen] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const [quizzes, setQuizzes] = useState<MatchQuiz[]>([]);
  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [picksLoading, setPicksLoading] = useState(true);
  const [quizzesError, setQuizzesError] = useState("");
  const [predictionsError, setPredictionsError] = useState("");
  const [eventsError, setEventsError] = useState("");

  const fetchMatch = useCallback(
    async (options?: { quiet?: boolean }) => {
      if (!matchId) return;
      const quiet = options?.quiet === true;
      try {
        if (!quiet) setLoading(true);
        setError("");

        // Try the tournament we navigated from first, then fall back to live matches.
        const candidates = [tournamentParam, "LIVE"].filter(
          (value, index, all): value is string =>
            Boolean(value) && all.indexOf(value) === index,
        );

        let found: MatchData | null = null;
        let lastError: Error | null = null;
        for (const candidate of candidates) {
          try {
            const list = await fetchMatchesForTournament(candidate);
            const hit = list.find((item) => item._id === matchId);
            if (hit) {
              found = hit;
              break;
            }
          } catch (err) {
            lastError = err instanceof Error ? err : new Error("Unknown error");
          }
        }

        if (!found) {
          throw lastError ?? new Error("Match not found");
        }
        setMatch(found);
      } catch (err) {
        setMatch(null);
        setError(err instanceof Error ? err.message : "Failed to load match");
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [matchId, tournamentParam],
  );

  /** Quizzes, predictions and events load in parallel; one failure can't blank the others. */
  const fetchPicks = useCallback(async () => {
    if (!matchId) return;
    const id = encodeURIComponent(matchId);
    setPicksLoading(true);
    setQuizzesError("");
    setPredictionsError("");
    setEventsError("");

    const [quizResult, predictionResult, eventResult] =
      await Promise.allSettled([
        fetchMatchScopedList<MatchQuiz>(`/api/quiz/match/${id}`),
        fetchMatchScopedList<MatchPrediction>(`/api/predictions/match/${id}`),
        fetchMatchScopedList<MatchEvent>(`/api/events/match/${id}`),
      ]);

    if (quizResult.status === "fulfilled") setQuizzes(quizResult.value);
    else {
      setQuizzes([]);
      setQuizzesError(quizResult.reason?.message ?? "Failed to load quizzes");
    }

    if (predictionResult.status === "fulfilled")
      setPredictions(predictionResult.value);
    else {
      setPredictions([]);
      setPredictionsError(
        predictionResult.reason?.message ?? "Failed to load predictions",
      );
    }

    if (eventResult.status === "fulfilled") setEvents(eventResult.value);
    else {
      setEvents([]);
      setEventsError(eventResult.reason?.message ?? "Failed to load events");
    }

    setPicksLoading(false);
  }, [matchId]);

  useEffect(() => {
    void fetchMatch();
  }, [fetchMatch]);

  useEffect(() => {
    void fetchPicks();
  }, [fetchPicks]);

  const backHref = buildAdminHomeHref(fromSection ?? "matches", searchParams);

  /** Nested detail links carry this match as their back target. */
  const detailHrefWithContext = useCallback(
    (path: string) => {
      const sep = path.includes("?") ? "&" : "?";
      const sp = new URLSearchParams({
        from: FROM_MATCH_DETAIL,
        [QUERY_PARENT_MATCH_ID]: matchId,
      });
      if (tournamentParam) sp.set(QUERY_MATCH_TOURNAMENT, tournamentParam);
      return `${path}${sep}${sp.toString()}`;
    },
    [matchId, tournamentParam],
  );

  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error || "Match not found"}</p>
          <button
            onClick={() => router.push(backHref)}
            className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const openQuiz = (id: string) =>
    router.push(detailHrefWithContext(`/quiz/${encodeURIComponent(id)}`));
  const openPrediction = (id: string) =>
    router.push(detailHrefWithContext(`/prediction/${encodeURIComponent(id)}`));
  const openEvent = (id: string) =>
    router.push(detailHrefWithContext(`/events?id=${encodeURIComponent(id)}`));

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.push(backHref)}
            className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800"
          >
            ← Back
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsStartTimeDialogOpen(true)}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Update start time
            </button>
            <button
              type="button"
              onClick={() => setIsBannerDialogOpen(true)}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Update banner
            </button>
          </div>
        </div>

        {/* Match Info Card */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
          <div className="mb-4">
            <h1 className="mb-2 text-3xl font-bold text-white">
              {match.matchId}
            </h1>
            <p className="text-gray-400">Tournament: {match.tournament}</p>
            <p className="break-all text-gray-400">
              Match Mongo ID: {match._id}
            </p>
            <p className="break-all text-gray-400">
              Gametype: {match.gameType ?? "—"}
            </p>
            <p className="break-all text-gray-400">
              ESPN league: {match.espnLeagueName ?? "—"}
            </p>
            <p className="break-all text-gray-400">
              ESPN Match ID: {match.matchEvent?.id ?? "—"}
            </p>
          </div>

          {/* Teams */}
          <div className="mb-6 flex items-center gap-4 rounded-lg bg-zinc-800 p-4">
            <div className="flex-1 text-center">
              <div
                className="mb-3 inline-flex h-20 w-20 items-center justify-center rounded-full text-lg font-bold"
                style={{
                  backgroundColor: match.teamA?.primaryColor ?? "#3f3f46",
                  color: match.teamA?.textColor ?? "#ffffff",
                }}
              >
                {match.teamA?.abbreviation}
              </div>
              <p className="text-lg font-semibold text-white">
                {match.teamA?.name}
              </p>
            </div>
            <span className="text-xl font-bold text-gray-500">VS</span>
            <div className="flex-1 text-center">
              <div
                className="mb-3 inline-flex h-20 w-20 items-center justify-center rounded-full text-lg font-bold"
                style={{
                  backgroundColor: match.teamB?.primaryColor ?? "#3f3f46",
                  color: match.teamB?.textColor ?? "#ffffff",
                }}
              >
                {match.teamB?.abbreviation}
              </div>
              <p className="text-lg font-semibold text-white">
                {match.teamB?.name}
              </p>
            </div>
          </div>

          {/* Match Details */}
          <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <p className="mb-1 text-gray-400">Match Start Time</p>
              <button
                type="button"
                onClick={() => setIsStartTimeDialogOpen(true)}
                title="Click to edit start time"
                className="cursor-pointer text-left text-white hover:text-sky-300 hover:underline"
              >
                {formatDateIST(match.matchStartTime)}
              </button>
            </div>
            <div>
              <p className="mb-1 text-gray-400">Tag</p>
              <p className="text-white">{match.tag?.trim() || "—"}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-400">Quizzes</p>
              <p className="text-white">{match.quizIds?.length ?? 0}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-400">Predictions</p>
              <p className="text-white">{match.predictionIds?.length ?? 0}</p>
            </div>
          </div>

          {/* Created By */}
          <div className="border-t border-zinc-700 pt-4 text-sm">
            <p className="text-gray-400">
              Created at: {formatDateIST(match.createdAt)}
            </p>
            {match.createdByUserData?.email && (
              <p className="text-gray-400">
                Created by: {match.createdByUserData.email} (
                {match.createdByUserData.userType})
              </p>
            )}
          </div>
        </div>

        <FetchMatchStatsPanel match={match} />

        {/* Banner */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Match banner</h2>
          <MatchBannerUrlWithCopy url={match.matchBanner} />
          {match.matchBanner?.trim() ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={match.matchBanner}
                alt={`${match.matchId} banner`}
                className="max-h-72 w-full object-contain"
              />
            </div>
          ) : (
            <p className="mt-4 text-gray-400">No banner set for this match.</p>
          )}
        </div>

        {/* Quizzes */}
        <SectionCard title="Quizzes" count={quizzes.length}>
          <SectionState
            loading={picksLoading}
            error={quizzesError}
            isEmpty={quizzes.length === 0}
            emptyMessage="No quizzes on this match yet."
          />
          {!picksLoading && !quizzesError && quizzes.length > 0 && (
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openQuiz(quiz._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openQuiz(quiz._id);
                    }
                  }}
                  className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-4 transition-colors hover:bg-indigo-500/10"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {quiz.quizId}
                      </h3>
                      {quiz.tag && (
                        <p className="text-sm text-gray-400">{quiz.tag}</p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${statusBadgeClass(
                        quiz.quizStatus,
                      )}`}
                    >
                      {quiz.quizStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <p className="mb-1 text-gray-400">Entry Start</p>
                      <p className="text-white">
                        {formatDateIST(quiz.entryStartTime)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-gray-400">Entry Stop</p>
                      <p className="text-white">
                        {formatDateIST(quiz.entryStopTime)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-gray-400">Match Start</p>
                      <p className="text-white">
                        {formatDateIST(quiz.matchStartTime)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-gray-400">Visible</p>
                      <p className="text-white">
                        {quiz.isVisible ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <MatchIdWithCopy id={quiz._id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Predictions */}
        <SectionCard title="Predictions" count={predictions.length}>
          <SectionState
            loading={picksLoading}
            error={predictionsError}
            isEmpty={predictions.length === 0}
            emptyMessage="No predictions on this match yet."
          />
          {!picksLoading && !predictionsError && predictions.length > 0 && (
            <div className="grid gap-4">
              {predictions.map((prediction) => {
                const hasDraw = prediction.oddsDraw !== null;
                return (
                  <div
                    key={prediction._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openPrediction(prediction._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openPrediction(prediction._id);
                      }
                    }}
                    className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-4 transition-colors hover:bg-indigo-500/10"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {prediction.predictionId}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {prediction.teamA?.abbreviation} vs{" "}
                          {prediction.teamB?.abbreviation}
                          {prediction.winningTeam
                            ? ` · Winner: ${prediction.winningTeam}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${statusBadgeClass(
                          prediction.predictionStatus,
                        )}`}
                      >
                        {prediction.predictionStatus}
                      </span>
                    </div>

                    <OddsBar
                      segments={[
                        {
                          label: prediction.teamA?.abbreviation ?? "Team A",
                          odds: prediction.oddsTeamA,
                          color: prediction.teamA?.primaryColor ?? "#38bdf8",
                        },
                        ...(hasDraw
                          ? [
                              {
                                label: "Draw",
                                odds: prediction.oddsDraw as number,
                                color: "#a1a1aa",
                              },
                            ]
                          : []),
                        {
                          label: prediction.teamB?.abbreviation ?? "Team B",
                          odds: prediction.oddsTeamB,
                          color: prediction.teamB?.primaryColor ?? "#f43f5e",
                        },
                      ]}
                    />

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="mb-1 text-gray-400">
                          Coins on {prediction.teamA?.abbreviation ?? "A"}
                        </p>
                        <p className="text-white">
                          {formatCoins(prediction.coinsOnTeamA)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-400">
                          Coins on {prediction.teamB?.abbreviation ?? "B"}
                        </p>
                        <p className="text-white">
                          {formatCoins(prediction.coinsOnTeamB)}
                        </p>
                      </div>
                      {hasDraw && (
                        <div>
                          <p className="mb-1 text-gray-400">Coins on draw</p>
                          <p className="text-white">
                            {formatCoins(prediction.coinsOnDraw)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="mb-1 text-gray-400">Total coins</p>
                        <p className="text-white">
                          {formatCoins(prediction.totalCoins)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-400">Entry Start</p>
                        <p className="text-white">
                          {formatDateIST(prediction.entryStartTime)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-zinc-500">
                      Seeded coins:{" "}
                      {formatCoins(prediction.initialCoinsOnTeamA)} /{" "}
                      {formatCoins(prediction.initialCoinsOnTeamB)}
                      {hasDraw
                        ? ` / ${formatCoins(prediction.initialCoinsOnDraw)}`
                        : ""}{" "}
                      — included in odds, not in the payout pot
                    </p>

                    <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                      <MatchIdWithCopy id={prediction._id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Events */}
        <SectionCard title="Events" count={events.length}>
          <SectionState
            loading={picksLoading}
            error={eventsError}
            isEmpty={events.length === 0}
            emptyMessage="No events on this match yet."
          />
          {!picksLoading && !eventsError && events.length > 0 && (
            <div className="grid gap-4">
              {events.map((event) => {
                const options = [
                  {
                    key: "Y",
                    label: event.yesPlaceholder || "Yes",
                    odds: event.oddsYes,
                    coins: event.coinsOnYes,
                    bg: event.yesPlaceholderColor ?? "#2CA85E",
                    fg: event.yesTextColor ?? "#FFFFFF",
                  },
                  {
                    key: "N",
                    label: event.noPlaceholder || "No",
                    odds: event.oddsNo,
                    coins: event.coinsOnNo,
                    bg: event.noPlaceholderColor ?? "#FF3B30",
                    fg: event.noTextColor ?? "#FFFFFF",
                  },
                  ...(event.haveThreeOptions
                    ? [
                        {
                          key: "M",
                          label: event.maybePlaceholder || "Maybe",
                          odds: event.oddsMaybe ?? 0,
                          coins: event.coinsOnMaybe ?? 0,
                          bg: event.maybePlaceholderColor ?? "#71717a",
                          fg: event.maybeTextColor ?? "#FFFFFF",
                        },
                      ]
                    : []),
                ];

                return (
                  <div
                    key={event._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEvent(event._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openEvent(event._id);
                      }
                    }}
                    className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-4 transition-colors hover:bg-indigo-500/10"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {event.eventName}
                        </h3>
                        <p className="font-mono text-xs text-gray-400">
                          {event.eventId}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${statusBadgeClass(
                          event.eventStatus,
                        )}`}
                      >
                        {event.eventStatus}
                      </span>
                    </div>

                    {event.eventDescription && (
                      <p className="mb-3 text-sm text-gray-400">
                        {event.eventDescription}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {options.map((option) => (
                        <span
                          key={option.key}
                          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${
                            event.winningOption === option.key
                              ? "ring-2 ring-white"
                              : ""
                          }`}
                          style={{
                            backgroundColor: option.bg,
                            color: option.fg,
                          }}
                        >
                          {option.label}
                          <span className="opacity-80">
                            {formatOdds(option.odds)}
                          </span>
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      {options.map((option) => (
                        <div key={`coins-${option.key}`}>
                          <p className="mb-1 text-gray-400">
                            Coins on {option.label}
                          </p>
                          <p className="text-white">
                            {formatCoins(option.coins)}
                          </p>
                        </div>
                      ))}
                      <div>
                        <p className="mb-1 text-gray-400">Total coins</p>
                        <p className="text-white">
                          {formatCoins(event.totalCoins)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-400">Entry window</p>
                        <p className="text-white">
                          {formatDateIST(event.entryStartTime)} →{" "}
                          {formatDateIST(event.entryCloseTime)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                      <MatchIdWithCopy id={event._id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Raw JSON */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Match details JSON</h2>
            <button
              type="button"
              onClick={() => setShowJson((prev) => !prev)}
              className="rounded-md bg-zinc-600 px-3 py-1.5 text-sm text-white hover:bg-zinc-500"
            >
              {showJson ? "Hide" : "Show"}
            </button>
          </div>
          {showJson && (
            <pre className="mt-4 max-h-96 overflow-auto rounded-lg border border-zinc-700 bg-zinc-950 p-4 font-mono text-xs text-gray-300">
              {JSON.stringify({ match, quizzes, predictions, events }, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {isBannerDialogOpen && (
        <UpdateMatchBannerDialog
          match={match}
          onClose={() => setIsBannerDialogOpen(false)}
          onUpdated={() => fetchMatch({ quiet: true })}
        />
      )}

      {isStartTimeDialogOpen && (
        <UpdateMatchStartTimeDialog
          match={match}
          onClose={() => setIsStartTimeDialogOpen(false)}
          onUpdated={() => fetchMatch({ quiet: true })}
        />
      )}
    </div>
  );
}
