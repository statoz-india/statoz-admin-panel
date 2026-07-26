"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Atom } from "react-loading-indicators";
import type { Event } from "../../models/events.model";
import {
  EVENTS_PAGE_SIZE,
  type PaginatedEvents,
} from "@/app/interface/pagination.interface";
import { eventStatusBadgeClass } from "./event-appearance";
import CreateEventModal from "./CreateEventModal";

const EVENTS_SCROLL_POSITION_KEY = "admin_events_scroll_top";
const EVENTS_SHOULD_RESTORE_SCROLL_KEY = "admin_events_should_restore_scroll";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

export default function EventsSection() {
  const router = useRouter();
  const hasRestoredScrollRef = useRef(false);
  // Distinguishes first load (full-screen spinner) from paging refetches, which
  // must keep the list and controls mounted.
  const initialLoadRef = useRef(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<
    Pick<PaginatedEvents, "total" | "totalPages" | "hasMore" | "limit">
  >({
    total: 0,
    totalPages: 0,
    hasMore: false,
    limit: EVENTS_PAGE_SIZE,
  });

  const saveScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    const scrollTop = container ? container.scrollTop : window.scrollY;
    sessionStorage.setItem(EVENTS_SCROLL_POSITION_KEY, String(scrollTop));
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(EVENTS_SCROLL_POSITION_KEY);
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

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
    if (typeof window !== "undefined") {
      const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
      (container ?? window).scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `/api/events?page=${page}&limit=${EVENTS_PAGE_SIZE}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const response = await res.json();

      if (!res.ok || response?.success !== true) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.metadata?.message === "string" &&
            response.metadata.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load events";
        setError(message);
        setEvents([]);
        return;
      }

      const data = response.data ?? {};
      const list: Event[] = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : [];

      setEvents(list);
      setPageInfo({
        total: Number(data.total) || list.length,
        totalPages: Number(data.totalPages) || (list.length ? 1 : 0),
        hasMore: Boolean(data.hasMore),
        limit: Number(data.limit) || EVENTS_PAGE_SIZE,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
      initialLoadRef.current = false;
    }
  }, [page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (loading || hasRestoredScrollRef.current) return;
    const shouldRestore =
      typeof window !== "undefined" &&
      sessionStorage.getItem(EVENTS_SHOULD_RESTORE_SCROLL_KEY) === "1";
    if (shouldRestore) {
      sessionStorage.removeItem(EVENTS_SHOULD_RESTORE_SCROLL_KEY);
      restoreScrollPosition();
    }
    hasRestoredScrollRef.current = true;
  }, [loading, restoreScrollPosition]);

  const handleEventNavigate = (ev: Event) => {
    saveScrollPosition();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(EVENTS_SHOULD_RESTORE_SCROLL_KEY, "1");
    }
    const q = new URLSearchParams({
      id: ev._id,
      from: "events",
    });
    router.push(`/events?${q.toString()}`, { scroll: false });
  };

  if (loading && initialLoadRef.current) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 gap-4">
        <p className="text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => fetchEvents()}
          className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Events</h2>
          <p className="mt-1 text-sm text-gray-400">
            {pageInfo.total.toLocaleString("en-IN")} events
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200"
        >
          Create new event
        </button>
      </div>

      <div
        className={`transition-opacity ${
          loading ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
      >
        {events.length === 0 ? (
          <p className="text-zinc-400">No events yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((ev) => (
              <li key={ev._id}>
                <article
                  role="button"
                  tabIndex={0}
                  onClick={() => handleEventNavigate(ev)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleEventNavigate(ev);
                    }
                  }}
                  className="h-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 shadow-sm transition-colors hover:border-zinc-700 hover:bg-zinc-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 gap-y-3">
                    <h3 className="text-lg font-semibold leading-snug text-white pr-2">
                      {ev.eventName}
                    </h3>
                    <span
                      className={`shrink-0 inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${eventStatusBadgeClass(ev.eventStatus)}`}
                    >
                      {ev.eventStatus}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="text-zinc-500">Tournament</dt>
                      <dd className="mt-0.5 font-medium text-zinc-200">
                        {ev.tournamentData?.tournament ?? ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Entry Stops</dt>
                      <dd className="mt-0.5 text-zinc-300">
                        {ev.entryCloseTime
                          ? new Date(ev.entryCloseTime).toLocaleString()
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Options</dt>
                      <dd className="mt-0.5 text-zinc-300">
                        {ev.haveThreeOptions ? "3-way" : "Yes / No"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Total Coins</dt>
                      <dd className="mt-0.5 text-zinc-300">
                        {ev.totalCoins?.toLocaleString() ?? ""}
                      </dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pageInfo.totalPages > 1 && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            Showing {events.length === 0 ? 0 : (page - 1) * pageInfo.limit + 1}
            {"–"}
            {(page - 1) * pageInfo.limit + events.length} of{" "}
            {pageInfo.total.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-gray-200 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {Math.max(pageInfo.totalPages, 1)}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={!pageInfo.hasMore && page >= pageInfo.totalPages}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-gray-200 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          // A new event sorts into the upcoming group, which may not be on the
          // current page — go back to page 1 so it's visible.
          if (page !== 1) goToPage(1); // triggers a refetch via the dep array
          else fetchEvents();
        }}
      />
    </div>
  );
}
