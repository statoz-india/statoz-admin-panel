"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buildAdminHomeHref } from "@/app/utils/buildAdminHomeHref";
import type { Future } from "@/app/models/futures.model";
import { eventStatusBadgeClass } from "@/app/components/events/event-appearance";
import { Atom } from "react-loading-indicators";

export default function FutureDetailView({ futureId }: { futureId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");

  const [future, setFuture] = useState<Future | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFuture = useCallback(async () => {
    if (!futureId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/futures/${encodeURIComponent(futureId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();

      const entity =
        response?.data && typeof response.data === "object"
          ? response.data
          : null;

      if (!res.ok || !response?.success || !entity) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load future";
        setError(message);
        setFuture(null);
        return;
      }

      setFuture(entity as Future);
    } catch (err) {
      setFuture(null);
      setError(err instanceof Error ? err.message : "Failed to load future");
    } finally {
      setLoading(false);
    }
  }, [futureId]);

  useEffect(() => {
    fetchFuture();
  }, [fetchFuture]);

  const backHref = buildAdminHomeHref(fromSection, searchParams);

  if (loading) {
    return (
      <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center bg-black md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error || !future) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="p-6 text-center">
          <p className="mb-4 text-red-400">{error || "Future not found"}</p>
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
          >
            ← Back
          </button>
          <span
            className={`rounded-md px-4 py-2 text-sm font-medium ${eventStatusBadgeClass(future.futureStatus)}`}
          >
            {future.futureStatus}
          </span>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h1 className="mb-2 text-3xl font-bold text-black dark:text-white">
            {future.eventName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Future ID: {future.futureId}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Document ID: {future._id}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Tournament: {future.tournament}
          </p>
          {future.eventDescription ? (
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {future.eventDescription}
            </p>
          ) : null}

          {future.eventImage ? (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Event image
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={future.eventImage}
                alt=""
                className="max-h-48 max-w-full rounded-lg border border-gray-200 object-contain dark:border-zinc-700"
              />
            </div>
          ) : null}

          {future.eventDescriptionImage ? (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Description image
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={future.eventDescriptionImage}
                alt=""
                className="max-h-48 max-w-full rounded-lg border border-gray-200 object-contain dark:border-zinc-700"
              />
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-zinc-700">
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Entry starts
              </p>
              <p className="font-medium text-black dark:text-white">
                {future.entryStartTime
                  ? new Date(future.entryStartTime).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-zinc-700">
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Entry closes
              </p>
              <p className="font-medium text-black dark:text-white">
                {future.entryCloseTime
                  ? new Date(future.entryCloseTime).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Choices ({Array.isArray(future.choices) ? future.choices.length : 0})
          </h2>
          {Array.isArray(future.choices) && future.choices.length > 0 ? (
            <ul className="space-y-4">
              {future.choices.map((c) => (
                <li
                  key={c._id ?? c.choiceId}
                  className="rounded-lg border border-gray-200 p-4 dark:border-zinc-700"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-black dark:text-white">
                      {c.choiceName}
                    </p>
                    <span className="text-xs text-zinc-500">
                      {c.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  {c.choiceDescription ? (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {c.choiceDescription}
                    </p>
                  ) : null}
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-zinc-500">Choice ID</dt>
                      <dd className="font-mono text-xs text-zinc-300">
                        {c.choiceId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Odds</dt>
                      <dd className="text-zinc-200">{c.odds}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Coins</dt>
                      <dd className="text-zinc-200">{c.choiceCoins}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Initial on choice</dt>
                      <dd className="text-zinc-200">{c.initialCoinsOnChoice}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No choices.</p>
          )}
        </div>
      </div>
    </div>
  );
}
