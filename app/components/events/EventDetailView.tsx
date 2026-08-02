"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { buildDetailBackHref } from "@/app/utils/buildAdminHomeHref";
import type { Event, EventWinningOption } from "@/app/models/events.model";
import { eventStatusBadgeClass } from "@/app/components/events/event-appearance";
import {
  EVENT_STATUS_VALUES,
  type EventStatusValue,
} from "@/app/constants/event-status";
import { EventStatus } from "@/app/utils/enums/event.enum";
import { Atom } from "react-loading-indicators";
import EventsBets from "@/app/components/events/EventsBets";
import EditEventDetailsModal from "@/app/components/events/EditEventDetailsModal";
import { canEditEvent } from "@/app/utils/event-edit";

type EventDetailTab = "json" | "bets";

function tabFromSearchParams(sp: URLSearchParams): EventDetailTab {
  const tab = sp.get("tab");
  if (tab === "event-json") return "json";
  return "bets";
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

type OutcomeOption = {
  value: EventWinningOption;
  label: string;
  descriptionClass: string;
};

function outcomeOptions(ev: Event): OutcomeOption[] {
  const options: OutcomeOption[] = [
    {
      value: "Y",
      label: ev.yesPlaceholder,
      descriptionClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      value: "N",
      label: ev.noPlaceholder,
      descriptionClass: "text-rose-600 dark:text-rose-400",
    },
  ];
  if (ev.haveThreeOptions) {
    options.push({
      value: "M",
      label: ev.maybePlaceholder ?? "Maybe",
      descriptionClass: "text-amber-600 dark:text-amber-400",
    });
  }
  return options;
}

function winningOptionLabel(ev: Event): string | null {
  if (!ev.winningOption) return null;
  return (
    outcomeOptions(ev).find((o) => o.value === ev.winningOption)?.label ?? null
  );
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
  const [setWinningOptionOpen, setSetWinningOptionOpen] = useState(false);
  const [selectedWinningOption, setSelectedWinningOption] =
    useState<EventWinningOption | null>(null);
  const [submittingWinningOption, setSubmittingWinningOption] = useState(false);
  const [setWinningOptionError, setSetWinningOptionError] = useState("");
  const [distributePayoutOpen, setDistributePayoutOpen] = useState(false);
  const [distributingPayout, setDistributingPayout] = useState(false);
  const [distributePayoutError, setDistributePayoutError] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [detailsSaveMessage, setDetailsSaveMessage] = useState("");

  const selectPanelTab = (next: EventDetailTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("id", eventId);
    if (fromSection) sp.set("from", fromSection);
    if (next === "json") sp.set("tab", "event-json");
    else sp.delete("tab");
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const fetchEvent = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!eventId) return;
      try {
        if (!options?.silent) {
          setLoading(true);
        }
        setError("");
        const res = await fetch(`/api/events/${encodeURIComponent(eventId)}`, {
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
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [eventId],
  );

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    if (!statusDropdownOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [statusDropdownOpen]);

  const updateEventStatus = async (eventStatus: EventStatusValue) => {
    if (!eventId) return;
    try {
      setStatusUpdateLoading(true);
      const res = await fetch(
        `/api/events/${encodeURIComponent(eventId)}/update-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ eventStatus }),
        },
      );
      const response = await res.json();
      if (!res.ok || !response?.success) {
        throw new Error(response?.message || "Failed to update event status");
      }
      setStatusDropdownOpen(false);
      await fetchEvent({ silent: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update event status",
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleSubmitWinningOption = async () => {
    if (!eventId || !selectedWinningOption) return;
    setSubmittingWinningOption(true);
    setSetWinningOptionError("");
    try {
      const res = await fetch(
        `/api/events/${encodeURIComponent(eventId)}/update-result`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ winningOption: selectedWinningOption }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setSetWinningOptionError(
          data?.message || "Failed to update winning option",
        );
        return;
      }
      setSetWinningOptionOpen(false);
      setSelectedWinningOption(null);
      await fetchEvent({ silent: true });
    } catch (err) {
      setSetWinningOptionError(
        err instanceof Error ? err.message : "Failed to update winning option",
      );
    } finally {
      setSubmittingWinningOption(false);
    }
  };

  const handleDistributePayout = async () => {
    if (!eventId) return;
    setDistributingPayout(true);
    setDistributePayoutError("");
    try {
      const res = await fetch(
        `/api/events/${encodeURIComponent(eventId)}/distribute-payout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({}),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setDistributePayoutError(
          data?.message || "Failed to distribute payouts",
        );
        return;
      }
      setDistributePayoutOpen(false);
      await fetchEvent({ silent: true });
    } catch (err) {
      setDistributePayoutError(
        err instanceof Error ? err.message : "Failed to distribute payouts",
      );
    } finally {
      setDistributingPayout(false);
    }
  };

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
              router.push(buildDetailBackHref(fromSection, searchParams))
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
  const isSettlementDone =
    event.eventStatus.toUpperCase() === EventStatus.SETTLEMENT_DONE;
  const eventEditable = canEditEvent(event.eventStatus);
  const canDistributePayout =
    event.eventStatus.toUpperCase() === EventStatus.WINNING_OPTION_UPDATED &&
    event.winningOption != null;
  const options = outcomeOptions(event);
  const currentWinnerLabel = winningOptionLabel(event);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(buildDetailBackHref(fromSection, searchParams))
            }
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            ← Back
          </button>
          <div className="flex flex-wrap items-center gap-3">
            {!isSettlementDone && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSetWinningOptionError("");
                    setSelectedWinningOption(event.winningOption ?? null);
                    setSetWinningOptionOpen(true);
                  }}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Update winning option
                </button>
                {canDistributePayout && (
                  <button
                    type="button"
                    onClick={() => {
                      setDistributePayoutError("");
                      setDistributePayoutOpen(true);
                    }}
                    className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                  >
                    Distribute payouts
                  </button>
                )}
              </>
            )}
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                disabled={statusUpdateLoading || isSettlementDone}
                onClick={() => {
                  if (isSettlementDone) return;
                  setStatusDropdownOpen((open) => !open);
                }}
                className={`rounded-md px-4 py-2 text-sm font-medium ${eventStatusBadgeClass(event.eventStatus)} ${
                  isSettlementDone
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-pointer"
                } ${statusUpdateLoading ? "cursor-wait opacity-60" : ""}`}
              >
                {event.eventStatus}
              </button>
              {statusDropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 min-w-[240px] rounded-md border border-zinc-700 bg-zinc-900 p-1 shadow-lg">
                  {EVENT_STATUS_VALUES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateEventStatus(status)}
                      className={`w-full rounded px-3 py-2 text-left text-sm ${
                        event.eventStatus.toUpperCase() === status
                          ? "bg-white text-black"
                          : "text-zinc-200 hover:bg-zinc-800"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {setWinningOptionOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="winning-option-dialog-title"
          >
            <div
              className="fixed inset-0 bg-black/50 dark:bg-black/70"
              aria-hidden
              onClick={() =>
                !submittingWinningOption && setSetWinningOptionOpen(false)
              }
            />
            <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900">
              <h2
                id="winning-option-dialog-title"
                className="mb-2 text-lg font-semibold text-black dark:text-white"
              >
                Update winning option
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Select the winning outcome for this event.
              </p>
              <div className="mb-6 space-y-3">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedWinningOption(option.value)}
                    disabled={submittingWinningOption}
                    className={`flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-colors ${
                      selectedWinningOption === option.value
                        ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30"
                        : "border-gray-200 hover:border-gray-300 dark:border-zinc-600 dark:hover:border-zinc-500"
                    }`}
                  >
                    <span className={`font-medium ${option.descriptionClass}`}>
                      {option.label}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                      {option.value}
                    </span>
                  </button>
                ))}
              </div>
              {setWinningOptionError ? (
                <p className="mb-4 text-sm text-red-500 dark:text-red-400">
                  {setWinningOptionError}
                </p>
              ) : null}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSetWinningOptionOpen(false)}
                  disabled={submittingWinningOption}
                  className="rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitWinningOption}
                  disabled={!selectedWinningOption || submittingWinningOption}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {submittingWinningOption ? "Updating…" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {distributePayoutOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="distribute-payout-dialog-title"
          >
            <div
              className="fixed inset-0 bg-black/50 dark:bg-black/70"
              aria-hidden
              onClick={() =>
                !distributingPayout && setDistributePayoutOpen(false)
              }
            />
            <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900">
              <h2
                id="distribute-payout-dialog-title"
                className="mb-4 text-lg font-semibold text-black dark:text-white"
              >
                Distribute payouts
              </h2>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to distribute payout
                {currentWinnerLabel ? ` to "${currentWinnerLabel}"` : ""}?
              </p>
              {distributePayoutError ? (
                <p className="mb-4 text-sm text-red-500 dark:text-red-400">
                  {distributePayoutError}
                </p>
              ) : null}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDistributePayoutOpen(false)}
                  disabled={distributingPayout}
                  className="rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDistributePayout}
                  disabled={distributingPayout}
                  className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  {distributingPayout ? "Distributing…" : "Yes, distribute"}
                </button>
              </div>
            </div>
          </div>
        )}

        {detailsSaveMessage ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            {detailsSaveMessage}
          </p>
        ) : null}

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-6 mb-6">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              {event.eventName}
            </h1>
            {eventEditable ? (
              <button
                type="button"
                onClick={() => {
                  setDetailsSaveMessage("");
                  setEditDetailsOpen(true);
                }}
                className="shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
              >
                Edit details
              </button>
            ) : null}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Event ID: {event.eventId}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Document ID: {event._id}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Tournament: {event.tournamentData?.tournament ?? ""}
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
              <div className="mt-2 flex flex-wrap gap-2">
                {options.map((option) => (
                  <span
                    key={option.value}
                    className={`inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-sm dark:border-zinc-600 ${option.descriptionClass}`}
                  >
                    {option.label}
                    {event.winningOption === option.value ? (
                      <span className="rounded bg-emerald-600/20 px-1.5 py-0.5 text-xs font-medium text-emerald-400">
                        Winner
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
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
            onClick={() => selectPanelTab("bets")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              panelTab === "bets"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-gray-300 dark:border-zinc-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            User Bets
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

        {panelTab === "bets" && (
          <EventsBets
            eventId={eventId}
            optionLabels={{
              Y: event.yesPlaceholder,
              N: event.noPlaceholder,
              ...(event.haveThreeOptions
                ? { M: event.maybePlaceholder ?? "Maybe" }
                : {}),
            }}
          />
        )}

        {panelTab === "json" && (
          <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-zinc-950 p-4 overflow-x-auto">
            <pre className="text-xs text-zinc-300 whitespace-pre-wrap break-all">
              {JSON.stringify(event, null, 2)}
            </pre>
          </div>
        )}

        {editDetailsOpen && eventEditable ? (
          <EditEventDetailsModal
            isOpen={editDetailsOpen}
            event={event}
            onClose={() => setEditDetailsOpen(false)}
            onSuccess={async () => {
              setDetailsSaveMessage("Event details updated successfully.");
              await fetchEvent({ silent: true });
            }}
          />
        ) : null}
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
