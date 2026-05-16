"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { buildAdminHomeHref } from "@/app/utils/buildAdminHomeHref";
import type { Event } from "@/app/models/events.model";
import { eventStatusBadgeClass } from "@/app/components/events/event-appearance";
import { Atom } from "react-loading-indicators";

type EventDetailTab = "overview" | "json";

function tabFromSearchParams(sp: URLSearchParams): EventDetailTab {
  return sp.get("tab") === "event-json" ? "json" : "overview";
}

function formatInIST(iso: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function netSideCoins(
  gross: number | undefined | null,
  initial: number | undefined | null,
) {
  return (gross ?? 0) - (initial ?? 0);
}

/** User-attributed total: gross totals minus seeded initial coins (matches prediction detail). */
function netTotalCoins(ev: Event) {
  const initMaybe = ev.haveThreeOptions ? (ev.initialCoinsOnMaybe ?? 0) : 0;
  if (ev.totalCoins != null && Number.isFinite(ev.totalCoins)) {
    return (
      ev.totalCoins -
      (ev.initialCoinsOnYes ?? 0) -
      (ev.initialCoinsOnNo ?? 0) -
      initMaybe
    );
  }
  return (
    netSideCoins(ev.coinsOnYes, ev.initialCoinsOnYes) +
    netSideCoins(ev.coinsOnNo, ev.initialCoinsOnNo) +
    (ev.haveThreeOptions
      ? netSideCoins(ev.coinsOnMaybe, ev.initialCoinsOnMaybe)
      : 0)
  );
}

export default function EventDetailView({ eventId }: { eventId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");
  const panelTab = tabFromSearchParams(searchParams);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectPanelTab = (next: EventDetailTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("id", eventId);
    if (fromSection) sp.set("from", fromSection);
    if (next === "overview") sp.delete("tab");
    else sp.set("tab", "event-json");
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/events/${eventId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();
      if (!res.ok || !response?.success) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load event";
        setError(message);
        setEvent(null);
        return;
      }
      setEvent(response.data ?? null);
    } catch (err) {
      setEvent(null);
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen bg-black">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center p-6">
          <p className="text-red-400 mb-4">{error || "Event not found"}</p>
          <button
            type="button"
            onClick={() =>
              router.push(buildAdminHomeHref(fromSection, searchParams))
            }
            className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const netYes = netSideCoins(event.coinsOnYes, event.initialCoinsOnYes);
  const netNo = netSideCoins(event.coinsOnNo, event.initialCoinsOnNo);
  const netMaybe = event.haveThreeOptions
    ? netSideCoins(event.coinsOnMaybe, event.initialCoinsOnMaybe)
    : 0;
  const netTotal = netTotalCoins(event);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(buildAdminHomeHref(fromSection, searchParams))
            }
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            ← Back
          </button>
          <span
            className={`px-4 py-2 rounded-md text-sm font-medium ${eventStatusBadgeClass(event.eventStatus)}`}
          >
            {event.eventStatus}
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-6 mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            {event.eventName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Event ID: {event.eventId}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Document ID: {event._id}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Tournament: {event.tournament}
          </p>
          {event.eventDescription ? (
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {event.eventDescription}
            </p>
          ) : null}

          {event.eventImage ? (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Event image
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.eventImage}
                alt=""
                className="max-h-48 max-w-full rounded-lg border border-gray-200 dark:border-zinc-700 object-contain"
              />
            </div>
          ) : null}

          {event.eventDescriptionImage ? (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Description image
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.eventDescriptionImage}
                alt=""
                className="max-h-48 max-w-full rounded-lg border border-gray-200 dark:border-zinc-700 object-contain"
              />
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Entry starts
              </p>
              <p className="font-medium text-black dark:text-white">
                {formatInIST(event.entryStartTime)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Entry closes
              </p>
              <p className="font-medium text-black dark:text-white">
                {formatInIST(event.entryCloseTime)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Options
              </p>
              <p className="font-medium text-black dark:text-white">
                {event.haveThreeOptions ? "Yes / No / Maybe" : "Yes / No"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {event.yesPlaceholder}
                </span>
                {" · "}
                <span className="text-rose-600 dark:text-rose-400">
                  {event.noPlaceholder}
                </span>
                {event.haveThreeOptions && event.maybePlaceholder ? (
                  <>
                    {" · "}
                    <span className="text-amber-600 dark:text-amber-400">
                      {event.maybePlaceholder}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Total coins" value={netTotal} />
            <Stat label={`${event.yesPlaceholder} coins`} value={netYes} />
            <Stat label={`${event.noPlaceholder} coins`} value={netNo} />
            {event.haveThreeOptions ? (
              <Stat
                label={`${event.maybePlaceholder ?? "Maybe"} coins`}
                value={netMaybe}
              />
            ) : null}
          </div>

          {(event.oddsYes != null || event.oddsNo != null) && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.oddsYes != null && (
                <Stat
                  label={`${event.yesPlaceholder} odds`}
                  value={`${event.oddsYes.toFixed(2)}%`}
                />
              )}
              {event.oddsNo != null && (
                <Stat
                  label={`${event.noPlaceholder} odds`}
                  value={`${event.oddsNo.toFixed(2)}%`}
                />
              )}
              {event.oddsMaybe != null && (
                <Stat
                  label="Maybe odds"
                  value={`${event.oddsMaybe.toFixed(2)}%`}
                />
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Created: {formatInIST(event.createdAt)}</p>
            <p>Updated: {formatInIST(event.updatedAt)}</p>
            {event.createdByUserData &&
              (event.createdByUserData.email ||
                event.createdByUserData.userName) && (
                <p>
                  Created by:{" "}
                  {event.createdByUserData.email ||
                    event.createdByUserData.userName}
                  {event.createdByUserData.userType
                    ? ` (${event.createdByUserData.userType})`
                    : ""}
                </p>
              )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => selectPanelTab("overview")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              panelTab === "overview"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-gray-300 dark:border-zinc-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => selectPanelTab("json")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              panelTab === "json"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-gray-300 dark:border-zinc-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            Event JSON
          </button>
        </div>

        {panelTab === "json" && (
          <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-zinc-950 p-4 overflow-x-auto">
            <pre className="text-xs text-zinc-300 whitespace-pre-wrap break-all">
              {JSON.stringify(event, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string | null | undefined;
  sub?: string;
}) {
  const display =
    typeof value === "number"
      ? value.toLocaleString()
      : value != null && value !== ""
        ? String(value)
        : "—";
  return (
    <div className="p-4 bg-gray-50 dark:bg-zinc-800/80 rounded-lg border border-gray-200 dark:border-zinc-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-semibold text-black dark:text-white">
        {display}
      </p>
      {sub && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
      )}
    </div>
  );
}
