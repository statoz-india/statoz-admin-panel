"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Atom } from "react-loading-indicators";
import type { Future } from "../../models/futures.model";
import { eventStatusBadgeClass } from "../events/event-appearance";
import CreateFutureModal from "./CreateFutureModal";

const FUTURES_SCROLL_POSITION_KEY = "admin_futures_scroll_top";
const FUTURES_SHOULD_RESTORE_SCROLL_KEY = "admin_futures_should_restore_scroll";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

export default function FuturesSection() {
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
      from: "futures",
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Futures</h2>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
        >
          Create new future
        </button>
      </div>

      {futures.length === 0 ? (
        <p className="text-zinc-400">No futures yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {futures.map((f) => (
            <li key={f._id}>
              <article
                role="button"
                tabIndex={0}
                onClick={() => handleFutureNavigate(f)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleFutureNavigate(f);
                  }
                }}
                className="h-full cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-sm transition-colors hover:border-zinc-700 hover:bg-zinc-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
              >
                {f.eventImage ? (
                  <div className="relative aspect-video w-full border-b border-zinc-800 bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.eventImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 gap-y-3">
                    <h3 className="pr-2 text-lg font-semibold leading-snug text-white">
                      {f.eventName}
                    </h3>
                    <span
                      className={`inline-flex shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${eventStatusBadgeClass(f.futureStatus)}`}
                    >
                      {f.futureStatus}
                    </span>
                  </div>
                  {f.eventDescription ? (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                      {f.eventDescription}
                    </p>
                  ) : null}
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="text-zinc-500">Tournament</dt>
                      <dd className="mt-0.5 font-medium text-zinc-200">
                        {f.tournament}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Future ID</dt>
                      <dd className="mt-0.5 font-mono text-xs text-zinc-300">
                        {f.futureId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Entry window</dt>
                      <dd className="mt-0.5 text-zinc-300">
                        {f.entryStartTime
                          ? new Date(f.entryStartTime).toLocaleString()
                          : "—"}{" "}
                        –{" "}
                        {f.entryCloseTime
                          ? new Date(f.entryCloseTime).toLocaleString()
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Choices</dt>
                      <dd className="mt-0.5 text-zinc-300">
                        {Array.isArray(f.choices) ? f.choices.length : 0}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </li>
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
