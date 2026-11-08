"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Atom } from "react-loading-indicators";
import { formatDistanceToNowStrict } from "date-fns";
import { Award, ChevronRight, Clock, Coins, Plus } from "lucide-react";
import type { Future, FutureChoice } from "../../models/futures.model";
import { eventStatusBadgeClass } from "../events/event-appearance";
import CreateFutureModal from "./CreateFutureModal";

const FUTURES_SCROLL_POSITION_KEY = "admin_futures_scroll_top";
const FUTURES_SHOULD_RESTORE_SCROLL_KEY = "admin_futures_should_restore_scroll";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

type FuturesSectionProps = {
  /** Drops the page padding when shown inside another section. */
  embedded?: boolean;
  /** Query added to a future's page link; its `from` decides where Back goes. */
  detailParams?: Record<string, string>;
};

export default function FuturesSection({
  embedded = false,
  detailParams = { from: "futures" },
}: FuturesSectionProps = {}) {
  const router = useRouter();
  const hasRestoredScrollRef = useRef(false);
  const [futures, setFutures] = useState<Future[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const saveScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    const scrollTop = container ? container.scrollTop : window.scrollY;
    sessionStorage.setItem(FUTURES_SCROLL_POSITION_KEY, String(scrollTop));
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(FUTURES_SCROLL_POSITION_KEY);
    if (!raw) return;
    const parsedScrollTop = Number(raw);
    if (!Number.isFinite(parsedScrollTop)) return;
    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTo({ top: parsedScrollTop, behavior: "auto" });
      } else {
        window.scrollTo({ top: parsedScrollTop, behavior: "auto" });
      }
    });
  }, []);

  const fetchFutures = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/futures", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();

      const list = Array.isArray(response.data)
        ? response.data
        : response?.data && Array.isArray(response.data.data)
          ? response.data.data
          : [];

      if (response?.success === true) {
        setFutures(list);
        setError("");
        return;
      }

      if (!res.ok) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.metadata?.message === "string" &&
            response.metadata.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load futures";
        setError(message);
        setFutures([]);
        return;
      }

      setError(
        (typeof response?.message === "string" && response.message) ||
          "Failed to load futures",
      );
      setFutures([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load futures");
      setFutures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFutures();
  }, [fetchFutures]);

  useEffect(() => {
    if (loading || hasRestoredScrollRef.current) return;
    const shouldRestore =
      typeof window !== "undefined" &&
      sessionStorage.getItem(FUTURES_SHOULD_RESTORE_SCROLL_KEY) === "1";
    if (shouldRestore) {
      sessionStorage.removeItem(FUTURES_SHOULD_RESTORE_SCROLL_KEY);
      restoreScrollPosition();
    }
    hasRestoredScrollRef.current = true;
  }, [loading, restoreScrollPosition]);

  const handleFutureNavigate = (f: Future) => {
    saveScrollPosition();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(FUTURES_SHOULD_RESTORE_SCROLL_KEY, "1");
    }
    const q = new URLSearchParams({
      id: f._id,
      ...detailParams,
    });
    router.push(`/futures?${q.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => fetchFutures()}
          className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={embedded ? "" : "p-6"}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Futures</h2>
          <p className="mt-1 text-sm text-gray-400">
            {futures.length === 1
              ? "1 future"
              : `${futures.length.toLocaleString("en-IN")} futures`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Create new future
        </button>
      </div>

      {futures.length === 0 ? (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-10 text-center">
          <p className="text-lg font-medium text-white">No futures yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Create one to start taking bets on a tournament outcome.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {futures.map((f) => (
            <FutureCard
              key={f._id}
              future={f}
              onOpen={() => handleFutureNavigate(f)}
            />
          ))}
        </ul>
      )}

      <CreateFutureModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchFutures()}
      />
    </div>
  );
}

const TOP_CHOICES = 3;

function formatDateIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Where the entry window stands right now, for the card's time line. */
function entryWindow(future: Future): { label: string; tone: string } {
  const now = Date.now();
  const opens = future.entryStartTime ? new Date(future.entryStartTime) : null;
  const closes = future.entryCloseTime ? new Date(future.entryCloseTime) : null;
  if (opens && !Number.isNaN(opens.getTime()) && opens.getTime() > now) {
    return {
      label: `Opens in ${formatDistanceToNowStrict(opens)}`,
      tone: "text-violet-300",
    };
  }
  if (closes && !Number.isNaN(closes.getTime())) {
    return closes.getTime() > now
      ? {
          label: `Open · closes in ${formatDistanceToNowStrict(closes)}`,
          tone: "text-emerald-300",
        }
      : {
          label: `Closed ${formatDistanceToNowStrict(closes)} ago`,
          tone: "text-zinc-400",
        };
  }
  return { label: "No entry window", tone: "text-zinc-400" };
}

/** `correctChoice` arrives populated or as a bare id. */
function winningChoice(future: Future): FutureChoice | null {
  const correct = future.correctChoice;
  if (!correct) return null;
  if (typeof correct === "object") return correct;
  return (
    future.choices?.find((c) => c._id === correct || c.choiceId === correct) ??
    null
  );
}

const choiceColor = (choice: FutureChoice) =>
  choice.placeholderColor || choice.teamDetails?.primaryColor || "#52525b";

function FutureCard({
  future,
  onOpen,
}: {
  future: Future;
  onOpen: () => void;
}) {
  const choices = Array.isArray(future.choices) ? future.choices : [];
  // Most-backed choices first: what players are actually betting on.
  const topChoices = [...choices]
    .sort((a, b) => (b.choiceCoins ?? 0) - (a.choiceCoins ?? 0))
    .slice(0, TOP_CHOICES);
  const winner = winningChoice(future);
  const entry = entryWindow(future);
  const tournament = future.tournamentData;
  const tournamentLabel = tournament
    ? [
        tournament.tournamentName || tournament.tournament,
        tournament.tournamentYear,
      ]
        .filter(Boolean)
        .join(" · ")
    : "—";

  return (
    <li>
      <article
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 transition-all hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600/50"
      >
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide ${eventStatusBadgeClass(
                future.futureStatus,
              )}`}
            >
              {future.futureStatus}
            </span>
            <span
              className="truncate font-mono text-[11px] text-zinc-500"
              title={future.futureId}
            >
              {future.futureId}
            </span>
          </div>
          <h3
            className="line-clamp-2 text-sm font-semibold leading-snug text-white"
            title={future.eventName}
          >
            {future.eventName}
          </h3>
          <p
            className="mt-1 truncate text-xs text-zinc-400"
            title={tournamentLabel}
          >
            {tournamentLabel}
          </p>

          {winner ? (
            <div className="mt-3 flex items-center gap-1.5 rounded-md border border-emerald-700/50 bg-emerald-950/40 px-2.5 py-1.5 text-xs">
              <Award
                className="h-3.5 w-3.5 shrink-0 text-emerald-300"
                aria-hidden
              />
              <span className="text-emerald-200/80">Winner</span>
              <span className="truncate font-medium text-emerald-100">
                {winner.choiceName}
              </span>
            </div>
          ) : null}

          <div className="mt-3 rounded-md bg-zinc-800/60 px-2.5 py-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock
                className="h-3.5 w-3.5 shrink-0 text-cyan-400"
                aria-hidden
              />
              <span className={`truncate font-medium ${entry.tone}`}>
                {entry.label}
              </span>
            </div>
            <p
              className="mt-1 truncate text-zinc-400"
              title={`${formatDateIST(future.entryStartTime)} – ${formatDateIST(future.entryCloseTime)}`}
            >
              {formatDateIST(future.entryStartTime)} –{" "}
              {formatDateIST(future.entryCloseTime)}
            </p>
          </div>

          {topChoices.length > 0 ? (
            <div className="mt-3">
              <p className="mb-1.5 text-[11px] uppercase tracking-wide text-zinc-500">
                Top choices
              </p>
              <ul className="space-y-1.5">
                {topChoices.map((choice) => (
                  <li
                    key={choice._id}
                    className={`flex items-center gap-2 text-xs ${
                      choice.isVisible === false ? "opacity-50" : ""
                    }`}
                    title={
                      choice.isVisible === false
                        ? `${choice.choiceName} (hidden)`
                        : choice.choiceName
                    }
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/10"
                      style={{ backgroundColor: choiceColor(choice) }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-zinc-200">
                      {choice.choiceName}
                    </span>
                    {typeof choice.odds === "number" ? (
                      <span className="shrink-0 tabular-nums text-zinc-400">
                        {choice.odds.toFixed(2)}x
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              {choices.length > TOP_CHOICES ? (
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  +{choices.length - TOP_CHOICES} more
                </p>
              ) : null}
            </div>
          ) : null}

          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-zinc-800 pt-3">
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-zinc-500">
                Choices
              </dt>
              <dd className="text-sm text-zinc-100">{choices.length}</dd>
            </div>
            <div className="min-w-0">
              <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-zinc-500">
                <Coins className="h-3 w-3" aria-hidden />
                Coins placed
              </dt>
              <dd className="truncate text-sm text-zinc-100">
                {typeof future.totalCoinsPlaced === "number"
                  ? future.totalCoinsPlaced.toLocaleString("en-IN")
                  : "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex items-center justify-end gap-1 pt-3 text-xs text-zinc-500 transition-colors group-hover:text-cyan-300">
            Open
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </div>
        </div>
      </article>
    </li>
  );
}
