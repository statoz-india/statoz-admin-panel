"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Plus, RefreshCw } from "lucide-react";
import { Atom } from "react-loading-indicators";
import { useAuthStore } from "@/app/store/authStore";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";
import { buildAdminHomeHref } from "@/app/utils/buildAdminHomeHref";
import { apiRequest } from "@/app/utils/apiRequest";
import { Section } from "@/app/utils/enums/section.enum";
import { MatchIdWithCopy } from "@/app/components/matches/MatchCopyChips";
import CreateEventModal from "@/app/components/events/CreateEventModal";
import CreateMotorsportQuizModal from "@/app/components/motorsportMatches/CreateMotorsportQuizModal";
import F1StatsCard from "@/app/components/motorsportMatches/F1StatsCard";
import {
  eventStatusClass,
  formatIst,
  HIDDEN_EVENT_STATUSES,
  quizStatusClass,
  STATUS_STYLES,
} from "@/app/components/motorsportMatches/motorsportHelpers";
import type { MotorsportMatch } from "@/app/models/motorsport-match.model";
import type { MotorsportQuizListItem } from "@/app/models/motorsport-quiz.model";
import type { Event } from "@/app/models/events.model";

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-gray-400">{label}</p>
      <div className="break-words text-white">{children}</div>
    </div>
  );
}

function SectionCard({
  title,
  count,
  action,
  children,
}: {
  title: string;
  count: number;
  action: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">
          {title} ({count})
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function CreateButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

const orDash = (value: string | null | undefined) => value?.trim() || "—";

/**
 * Detail page for one motorsport race, the racing counterpart of `/match/[id]`.
 * Quizzes and events for the race are created from here.
 *
 * Quizzes come from `GET /quiz/motorsport/race/:matchId` (visible ones only,
 * without questions); clicking one opens `/motorsport/[id]/quiz/[quizId]`.
 * Events come from `GET /events/motorsport/race/:matchId` (racing events only,
 * every status); cancelled and deleted ones are hidden unless toggled on.
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
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [quizzesError, setQuizzesError] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
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

  const fetchQuizzes = useCallback(async () => {
    if (!raceId) return;
    setQuizzesLoading(true);
    setQuizzesError("");
    try {
      const list = await apiRequest<MotorsportQuizListItem[]>(
        `/api/quiz/motorsport/race/${encodeURIComponent(raceId)}`,
        { method: "GET" },
        "Failed to load quizzes",
      );
      setQuizzes(Array.isArray(list) ? list : []);
    } catch (err) {
      setQuizzes([]);
      setQuizzesError(
        err instanceof Error ? err.message : "Failed to load quizzes",
      );
    } finally {
      setQuizzesLoading(false);
    }
  }, [raceId]);

  const fetchEvents = useCallback(async () => {
    if (!raceId) return;
    setEventsLoading(true);
    setEventsError("");
    try {
      const list = await apiRequest<Event[]>(
        `/api/events/motorsport/race/${encodeURIComponent(raceId)}`,
        { method: "GET" },
        "Failed to load events",
      );
      setEvents(Array.isArray(list) ? list : []);
    } catch (err) {
      setEvents([]);
      setEventsError(
        err instanceof Error ? err.message : "Failed to load events",
      );
    } finally {
      setEventsLoading(false);
    }
  }, [raceId]);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) void fetchRace();
  }, [fetchRace, hasHydrated, isAuthenticated]);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) void fetchQuizzes();
  }, [fetchQuizzes, hasHydrated, isAuthenticated]);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) void fetchEvents();
  }, [fetchEvents, hasHydrated, isAuthenticated]);

  const backHref = buildAdminHomeHref(
    searchParams.get("from") ?? Section.MOTORSPORT_MATCHES,
    searchParams,
  );

  if (!hasHydrated || !isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error || !race) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error || "Race not found"}</p>
          <button
            onClick={() => router.push(backHref)}
            className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
          >
            Back to Motorsport Matches
          </button>
        </div>
      </div>
    );
  }

  // Carry this page's query (its `from`) so the quiz page can return here.
  const openQuiz = (id: string) =>
    router.push(
      `/motorsport/${encodeURIComponent(raceId)}/quiz/${encodeURIComponent(id)}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`,
    );
  const hiddenEventCount = events.filter((e) =>
    HIDDEN_EVENT_STATUSES.has(e.eventStatus?.toUpperCase()),
  ).length;
  const visibleEvents = showHiddenEvents
    ? events
    : events.filter(
        (e) => !HIDDEN_EVENT_STATUSES.has(e.eventStatus?.toUpperCase()),
      );

  const openEvent = (id: string) =>
    router.push(`/events?id=${encodeURIComponent(id)}`);

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
              onClick={() => setIsEventModalOpen(true)}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Create event
            </button>
            <button
              type="button"
              onClick={() => setIsQuizModalOpen(true)}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
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

        {/* Race info */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="mb-2 text-3xl font-bold text-white">
                {race.matchId}
              </h1>
              <p className="text-gray-400">Tournament: {race.tournament}</p>
              <p className="break-all text-gray-400">
                Match Mongo ID: {race._id}
              </p>
              <p className="text-gray-400">Gametype: {race.gameType ?? "—"}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${
                  STATUS_STYLES[race.matchStatus] ?? STATUS_STYLES.Finished
                }`}
              >
                {race.matchStatus}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  race.isVisible
                    ? "bg-emerald-900 text-emerald-200"
                    : "bg-zinc-700 text-zinc-200"
                }`}
              >
                {race.isVisible ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-zinc-800 p-4 text-center">
            <p className="text-lg font-semibold text-white">{race.name}</p>
            <p className="text-sm text-gray-400">Season {race.seasonYear}</p>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <Detail label="Race Start Time">
              {formatIst(race.raceStartTime)}
            </Detail>
            <Detail label="Weekend Starts">
              {formatIst(race.raceEventStartDate)}
            </Detail>
            <Detail label="Weekend Ends">
              {formatIst(race.raceEventStopDate)}
            </Detail>
            <Detail label="Tag">{orDash(race.tag)}</Detail>
          </div>

          <div className="mb-4 grid gap-4 text-sm md:grid-cols-2">
            <Detail label="Description">{orDash(race.description)}</Detail>
            <Detail label="Summary">{orDash(race.summary)}</Detail>
          </div>

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

        {/* F1 stats (results, track, weekend charts) from the live-score service */}
        <F1StatsCard race={race} onNotice={setNotice} />

        {/* Quizzes */}
        <SectionCard
          title="Quizzes"
          count={quizzes.length}
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchQuizzes()}
                disabled={quizzesLoading}
                aria-label="Refresh quizzes"
                className="rounded-md border border-zinc-600 p-2 text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${quizzesLoading ? "animate-spin" : ""}`}
                />
              </button>
              <CreateButton
                label="Create quiz"
                onClick={() => setIsQuizModalOpen(true)}
              />
            </div>
          }
        >
          {quizzesLoading ? (
            <p className="text-gray-400">Loading…</p>
          ) : quizzesError ? (
            <p className="text-red-400">
              {quizzesError}{" "}
              <button
                type="button"
                onClick={() => fetchQuizzes()}
                className="underline hover:text-red-300"
              >
                Retry
              </button>
            </p>
          ) : quizzes.length === 0 ? (
            <p className="text-gray-400">
              No quizzes on this race yet. Hidden quizzes aren’t listed.
            </p>
          ) : (
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openQuiz(quiz._id)}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openQuiz(quiz._id);
                    }
                  }}
                  className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-4 transition-colors hover:bg-indigo-500/10"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                      {quiz.quizId}
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${quizStatusClass(
                        quiz.quizStatus,
                      )}`}
                    >
                      {quiz.quizStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <Detail label="Entry Start">
                      {formatIst(quiz.entryStartTime)}
                    </Detail>
                    <Detail label="Entry Stop">
                      {formatIst(quiz.entryStopTime)}
                    </Detail>
                    <Detail label="Questions">{quiz.questionCount}</Detail>
                    <Detail label="Created">{formatIst(quiz.createdAt)}</Detail>
                  </div>

                  <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <MatchIdWithCopy id={quiz._id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Events */}
        <SectionCard
          title="Events"
          count={visibleEvents.length}
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchEvents()}
                disabled={eventsLoading}
                aria-label="Refresh events"
                className="rounded-md border border-zinc-600 p-2 text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${eventsLoading ? "animate-spin" : ""}`}
                />
              </button>
              <CreateButton
                label="Create event"
                onClick={() => setIsEventModalOpen(true)}
              />
            </div>
          }
        >
          {hiddenEventCount > 0 && !eventsLoading && !eventsError && (
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
          {eventsLoading ? (
            <p className="text-gray-400">Loading…</p>
          ) : eventsError ? (
            <p className="text-red-400">
              {eventsError}{" "}
              <button
                type="button"
                onClick={() => fetchEvents()}
                className="underline hover:text-red-300"
              >
                Retry
              </button>
            </p>
          ) : visibleEvents.length === 0 ? (
            <p className="text-gray-400">
              {events.length === 0
                ? "No events on this race yet."
                : "Only cancelled or deleted events on this race."}
            </p>
          ) : (
            <div className="grid gap-4">
              {visibleEvents.map((event) => (
                <div
                  key={event._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEvent(event._id)}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openEvent(event._id);
                    }
                  }}
                  className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-4 transition-colors hover:bg-indigo-500/10"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                        {event.eventName}
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
                      </h3>
                      <p className="font-mono text-xs text-gray-400">
                        {event.eventId}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${eventStatusClass(
                        event.eventStatus,
                      )}`}
                    >
                      {event.eventStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <Detail label="Entry Start">
                      {formatIst(event.entryStartTime)}
                    </Detail>
                    <Detail label="Entry Close">
                      {formatIst(event.entryCloseTime)}
                    </Detail>
                    <Detail label="Pool">{event.totalCoins ?? "—"}</Detail>
                    <Detail label="Odds">
                      {event.oddsYes != null && event.oddsNo != null
                        ? `${event.yesPlaceholder} ${event.oddsYes}% · ${
                            event.noPlaceholder
                          } ${event.oddsNo}%${
                            event.haveThreeOptions && event.oddsMaybe != null
                              ? ` · ${event.maybePlaceholder ?? "Maybe"} ${event.oddsMaybe}%`
                              : ""
                          }`
                        : "—"}
                    </Detail>
                  </div>

                  {event.winningOption && (
                    <p className="mt-3 text-sm text-gray-400">
                      Winning option: {event.winningOption}
                    </p>
                  )}

                  <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <MatchIdWithCopy id={event._id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Raw JSON */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Race details JSON</h2>
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
            void fetchQuizzes();
            setNotice(`Quiz ${quiz.quizId} created. Its id is ${quiz._id}.`);
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
          void fetchEvents();
          if (event) setNotice(`Event ${event.eventId} created.`);
        }}
      />
    </div>
  );
}
