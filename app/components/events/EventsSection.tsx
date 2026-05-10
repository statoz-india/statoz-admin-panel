"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Atom } from "react-loading-indicators";
import type { Event } from "../../api/models/events.model";
import { eventStatusBadgeClass } from "./event-appearance";
import CreateEventModal from "./CreateEventModal";

const EVENTS_SCROLL_POSITION_KEY = "admin_events_scroll_top";
const EVENTS_SHOULD_RESTORE_SCROLL_KEY = "admin_events_should_restore_scroll";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

export default function EventsSection() {
  const router = useRouter();
  const hasRestoredScrollRef = useRef(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/events", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();

      if (!res.ok) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load events";
        setError(message);
        setEvents([]);
        return;
      }

      if (!response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to load events",
        );
        setEvents([]);
        return;
      }

      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setEvents(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  if (loading) {
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
        <h2 className="text-2xl font-bold text-white">Events</h2>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200"
        >
          Create new event
        </button>
      </div>

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
                      {ev.tournament}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Entry starts</dt>
                    <dd className="mt-0.5 text-zinc-300">
                      {ev.entryStartTime
                        ? new Date(ev.entryStartTime).toLocaleString()
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Options</dt>
                    <dd className="mt-0.5 text-zinc-300">
                      {ev.haveThreeOptions ? "3-way" : "Yes / No"}
                    </dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}

      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchEvents()}
      />
    </div>
  );
}
