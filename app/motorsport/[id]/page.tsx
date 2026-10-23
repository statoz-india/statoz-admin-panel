"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Atom } from "react-loading-indicators";
import { useAuthStore } from "@/app/store/authStore";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";
import {
  buildAdminHomeHref,
  FROM_MOTORSPORT_DETAIL,
  QUERY_PARENT_MATCH_ID,
} from "@/app/utils/buildAdminHomeHref";
import { apiRequest } from "@/app/utils/apiRequest";
import { Section } from "@/app/utils/enums/section.enum";
import { MatchIdWithCopy } from "@/app/components/matches/MatchCopyChips";
import CreateEventModal from "@/app/components/events/CreateEventModal";
import CreateMotorsportQuizModal from "@/app/components/motorsportMatches/CreateMotorsportQuizModal";
import F1StatsCard from "@/app/components/motorsportMatches/F1StatsCard";
import {
  formatIst,
  HIDDEN_EVENT_STATUSES,
} from "@/app/components/motorsportMatches/motorsportHelpers";
import type { MotorsportMatch } from "@/app/models/motorsport-match.model";
import type { MotorsportQuizListItem } from "@/app/models/motorsport-quiz.model";
import type { Event } from "@/app/models/events.model";
import { statusBadgeClass } from "@/app/utils/statusBadge";

function formatDateIST(isoString: string | null | undefined): string {
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

function eventOptionChips(event: Event) {
  return [
    {
      key: "Y" as const,
      label: event.yesPlaceholder || "Yes",
      odds: event.oddsYes,
      coins: event.coinsOnYes,
      bg: event.yesPlaceholderColor ?? "#2CA85E",
      fg: event.yesTextColor ?? "#FFFFFF",
    },
    {
      key: "N" as const,
      label: event.noPlaceholder || "No",
      odds: event.oddsNo,
      coins: event.coinsOnNo,
      bg: event.noPlaceholderColor ?? "#FF3B30",
      fg: event.noTextColor ?? "#FFFFFF",
    },
    ...(event.haveThreeOptions
      ? [
          {
            key: "M" as const,
            label: event.maybePlaceholder || "Maybe",
            odds: event.oddsMaybe ?? 0,
            coins: event.coinsOnMaybe ?? 0,
            bg: event.maybePlaceholderColor ?? "#71717a",
            fg: event.maybeTextColor ?? "#FFFFFF",
          },
        ]
      : []),
  ];
}

/**
 * Detail page for one motorsport race, aligned with `/match/[id]`.
 */
export default function MotorsportMatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const hasHydrated = useAuthHydrated();

  const raceId = params?.id as string;

  const [race, setRace] = useState<MotorsportMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJson, setShowJson] = useState(false);

  const [quizzes, setQuizzes] = useState<MotorsportQuizListItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [picksLoading, setPicksLoading] = useState(true);
  const [quizzesError, setQuizzesError] = useState("");
  const [eventsError, setEventsError] = useState("");
  const [showHiddenEvents, setShowHiddenEvents] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const fetchRace = useCallback(async () => {
    if (!raceId) return;
    setLoading(true);
    setError("");
    try {
      setRace(
        await apiRequest<MotorsportMatch>(
          `/api/match/motorsport/${encodeURIComponent(raceId)}`,
          { method: "GET" },
          "Failed to load the race",
        ),
      );
    } catch (err) {
      setRace(null);
      setError(err instanceof Error ? err.message : "Failed to load the race");
    } finally {
      setLoading(false);
    }
  }, [raceId]);

  const fetchPicks = useCallback(async () => {
    if (!raceId) return;
    const id = encodeURIComponent(raceId);
    setPicksLoading(true);
    setQuizzesError("");
    setEventsError("");

    const [quizResult, eventResult] = await Promise.allSettled([
      apiRequest<MotorsportQuizListItem[]>(
        `/api/quiz/motorsport/race/${id}`,
        { method: "GET" },
        "Failed to load quizzes",
      ),
      apiRequest<Event[]>(
        `/api/events/motorsport/race/${id}`,
        { method: "GET" },
        "Failed to load events",
      ),
    ]);

    if (quizResult.status === "fulfilled") {
      setQuizzes(Array.isArray(quizResult.value) ? quizResult.value : []);
    } else {
      setQuizzes([]);
      setQuizzesError(
        quizResult.reason instanceof Error
          ? quizResult.reason.message
          : "Failed to load quizzes",
      );
    }

    if (eventResult.status === "fulfilled") {
      setEvents(Array.isArray(eventResult.value) ? eventResult.value : []);
    } else {
      setEvents([]);
      setEventsError(
        eventResult.reason instanceof Error
          ? eventResult.reason.message
          : "Failed to load events",
      );
    }

    setPicksLoading(false);
  }, [raceId]);

  useEffect(() => {
    void fetchRace();
  }, [fetchRace]);

  useEffect(() => {
    void fetchPicks();
  }, [fetchPicks]);

  const backHref = buildAdminHomeHref(
    searchParams.get("from") ?? Section.MATCHES,
    searchParams,
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

  if (error || !race) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error || "Race not found"}</p>
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
    router.push(
      `/motorsport/${encodeURIComponent(raceId)}/quiz/${encodeURIComponent(id)}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`,
    );

  const openEvent = (id: string) =>
    router.push(
      `/events?${new URLSearchParams({
        id,
        from: FROM_MOTORSPORT_DETAIL,
        [QUERY_PARENT_MATCH_ID]: raceId,
      }).toString()}`,
    );

  const hiddenEventCount = events.filter((e) =>
    HIDDEN_EVENT_STATUSES.has(e.eventStatus?.toUpperCase()),
  ).length;
  const visibleEvents = showHiddenEvents
    ? events
    : events.filter(
        (e) => !HIDDEN_EVENT_STATUSES.has(e.eventStatus?.toUpperCase()),
      );

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-6xl">
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
              onClick={() => setIsEventModalOpen(true)}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Create event
            </button>
            <button
              type="button"
              onClick={() => setIsQuizModalOpen(true)}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Create quiz
            </button>
          </div>
        </div>

        {notice && (
          <div className="mb-6 flex items-start justify-between gap-3 rounded-md border border-emerald-600/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="underline hover:text-emerald-100"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
          <div className="mb-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <h1 className="min-w-0 break-all text-3xl font-bold text-white">
                {race.matchId}
              </h1>
              <span
                className={`shrink-0 rounded-md px-3 py-1 text-sm font-medium ${statusBadgeClass(
                  race.matchStatus,
                )}`}
              >
                {race.matchStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-400">Tournament: {race.tournament}</p>
            <p className="break-all text-gray-400">
              Match Mongo ID: {race._id}
            </p>
            <p className="break-all text-gray-400">
              Gametype: {race.gameType ?? "—"}
            </p>
          </div>

          <div className="mb-6 flex items-center justify-center rounded-lg bg-zinc-800 p-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-white">{race.name}</p>
              <p className="text-sm text-gray-400">Season {race.seasonYear}</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <p className="mb-1 text-gray-400">Race start time</p>
              <p className="text-white">{formatDateIST(race.raceStartTime)}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-400">Tag</p>
              <p className="text-white">{race.tag?.trim() || "—"}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-400">Quizzes</p>
              <p className="text-white">{quizzes.length}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-400">Events</p>
              <p className="text-white">{events.length}</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <p className="mb-1 text-gray-400">Weekend starts</p>
              <p className="text-white">
                {formatDateIST(race.raceEventStartDate)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-gray-400">Weekend ends</p>
              <p className="text-white">
                {formatDateIST(race.raceEventStopDate)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-gray-400">Visible</p>
              <p className="text-white">{race.isVisible ? "Yes" : "No"}</p>
            </div>
          </div>

          {(race.description?.trim() || race.summary?.trim()) && (
            <div className="mb-4 grid gap-4 text-sm md:grid-cols-2">
              {race.description?.trim() && (
                <div>
                  <p className="mb-1 text-gray-400">Description</p>
                  <p className="text-white">{race.description}</p>
                </div>
              )}
              {race.summary?.trim() && (
                <div>
                  <p className="mb-1 text-gray-400">Summary</p>
                  <p className="text-white">{race.summary}</p>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-zinc-700 pt-4 text-sm">
            <p className="text-gray-400">
              Created at: {formatIst(race.createdAt)}
            </p>
            {race.createdBy?.email && (
              <p className="text-gray-400">
                Created by: {race.createdBy.email}
                {race.createdBy.userType ? ` (${race.createdBy.userType})` : ""}
              </p>
            )}
          </div>
        </div>

        <F1StatsCard race={race} onNotice={setNotice} />

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
                      <p className="mb-1 text-gray-400">Race start</p>
                      <p className="text-white">
                        {formatDateIST(race.raceStartTime)}
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

        <SectionCard title="Events" count={visibleEvents.length}>
          {hiddenEventCount > 0 && !picksLoading && !eventsError && (
            <label className="mb-4 flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={showHiddenEvents}
                onChange={(e) => setShowHiddenEvents(e.target.checked)}
                className="h-4 w-4 accent-white"
              />
              Show cancelled / deleted ({hiddenEventCount})
            </label>
          )}
          <SectionState
            loading={picksLoading}
            error={eventsError}
            isEmpty={visibleEvents.length === 0}
            emptyMessage={
              events.length === 0
                ? "No events on this match yet."
                : "Only cancelled or deleted events on this match."
            }
          />
          {!picksLoading && !eventsError && visibleEvents.length > 0 && (
            <div className="grid gap-4">
              {visibleEvents.map((event) => {
                const options = eventOptionChips(event);
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
              {JSON.stringify({ race, quizzes, events }, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {isQuizModalOpen && (
        <CreateMotorsportQuizModal
          race={race}
          onClose={() => setIsQuizModalOpen(false)}
          onCreated={(quiz) => {
            setIsQuizModalOpen(false);
            void fetchPicks();
            setNotice(`Quiz ${quiz.quizId} created.`);
          }}
        />
      )}

      <CreateEventModal
        isOpen={isEventModalOpen}
        lockedTournamentId={race.tournamentId}
        linkedMatch={{
          matchId: race._id,
          isRacingMatchEvent: true,
          label: `${race.matchId} · ${race.name}`,
        }}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={(event) => {
          setIsEventModalOpen(false);
          void fetchPicks();
          if (event?.eventId) {
            setNotice(`Event ${event.eventId} created.`);
          } else {
            setNotice("Event created.");
          }
        }}
      />
    </div>
  );
}
