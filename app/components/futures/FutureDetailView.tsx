"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { buildAdminHomeHref } from "@/app/utils/buildAdminHomeHref";
import type { Future, FutureChoice } from "@/app/models/futures.model";
import { eventStatusBadgeClass } from "@/app/components/events/event-appearance";
import {
  FUTURE_STATUS_VALUES,
  type FutureStatusValue,
} from "@/app/constants/future-status";
import { FutureStatus } from "@/app/utils/enums/future.enum";
import { Atom } from "react-loading-indicators";
import FutureBets from "@/app/components/futures/FutureBets";
import EditFutureChoicesModal from "@/app/components/futures/EditFutureChoicesModal";
import AddFutureChoicesModal from "@/app/components/futures/AddFutureChoicesModal";
import EditFutureDetailsModal from "@/app/components/futures/EditFutureDetailsModal";
import { canEditFutureChoices } from "@/app/utils/future-choices";
import { canEditFuture } from "@/app/utils/future-edit";

type FutureDetailTab = "json" | "bets";

function tabFromSearchParams(sp: URLSearchParams): FutureDetailTab {
  const tab = sp.get("tab");
  if (tab === "future-json") return "json";
  return "bets";
}

function correctChoiceId(future: Future): string | null {
  const cc = future.correctChoice;
  if (!cc) return null;
  if (typeof cc === "string") return cc;
  return cc._id ?? null;
}

function ChoiceTeamLogo({ choice }: { choice: FutureChoice }) {
  if (!choice.teamDetails) return null;
  return (
    <div
      className="flex size-[50px] shrink-0 items-center justify-center rounded-md text-sm font-bold"
      style={{
        backgroundColor: choice.teamDetails.primaryColor,
        color: choice.teamDetails.textColor,
      }}
      title={choice.teamDetails.name}
    >
      {choice.teamDetails.abbreviation}
    </div>
  );
}

export default function FutureDetailView({ futureId }: { futureId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");
  const panelTab = tabFromSearchParams(searchParams);

  const [future, setFuture] = useState<Future | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [setCorrectChoiceOpen, setSetCorrectChoiceOpen] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [submittingCorrectChoice, setSubmittingCorrectChoice] = useState(false);
  const [setCorrectError, setSetCorrectError] = useState("");
  const [distributePayoutOpen, setDistributePayoutOpen] = useState(false);
  const [distributingPayout, setDistributingPayout] = useState(false);
  const [distributePayoutError, setDistributePayoutError] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [editChoicesOpen, setEditChoicesOpen] = useState(false);
  const [addChoicesOpen, setAddChoicesOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [choicesSaveMessage, setChoicesSaveMessage] = useState("");
  const [detailsSaveMessage, setDetailsSaveMessage] = useState("");

  const selectPanelTab = (next: FutureDetailTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("id", futureId);
    if (fromSection) sp.set("from", fromSection);
    if (next === "json") sp.set("tab", "future-json");
    else sp.delete("tab");
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const fetchFuture = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!futureId) return;
      try {
        if (!options?.silent) {
          setLoading(true);
        }
        setError("");
        const res = await fetch(
          `/api/futures/${encodeURIComponent(futureId)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );
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
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [futureId],
  );

  useEffect(() => {
    fetchFuture();
  }, [fetchFuture]);

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

  const updateFutureStatus = async (futureStatus: FutureStatusValue) => {
    if (!futureId) return;
    try {
      setStatusUpdateLoading(true);
      const res = await fetch(
        `/api/futures/${encodeURIComponent(futureId)}/update-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ futureStatus }),
        },
      );
      const response = await res.json();
      if (!res.ok || !response?.success) {
        throw new Error(response?.message || "Failed to update future status");
      }
      setStatusDropdownOpen(false);
      await fetchFuture({ silent: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update future status",
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleSubmitCorrectChoice = async () => {
    if (!futureId || !selectedChoiceId) return;
    setSubmittingCorrectChoice(true);
    setSetCorrectError("");
    try {
      const res = await fetch(
        `/api/futures/${encodeURIComponent(futureId)}/correct-choice`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ correctChoiceId: selectedChoiceId }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setSetCorrectError(data?.message || "Failed to update correct answer");
        return;
      }
      setSetCorrectChoiceOpen(false);
      setSelectedChoiceId(null);
      await fetchFuture({ silent: true });
    } catch (err) {
      setSetCorrectError(
        err instanceof Error ? err.message : "Failed to update correct answer",
      );
    } finally {
      setSubmittingCorrectChoice(false);
    }
  };

  const handleDistributePayout = async () => {
    if (!futureId) return;
    setDistributingPayout(true);
    setDistributePayoutError("");
    try {
      const res = await fetch(
        `/api/futures/${encodeURIComponent(futureId)}/distribute-payout`,
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
      await fetchFuture({ silent: true });
    } catch (err) {
      setDistributePayoutError(
        err instanceof Error ? err.message : "Failed to distribute payouts",
      );
    } finally {
      setDistributingPayout(false);
    }
  };

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

  const isSettlementDone =
    future.futureStatus.toUpperCase() === FutureStatus.SETTLEMENT_DONE;
  const futureEditable = canEditFuture(future.futureStatus);
  const choicesEditable = canEditFutureChoices(future.futureStatus);
  const canDistributePayout =
    future.futureStatus.toUpperCase() === FutureStatus.WINNING_OPTION_UPDATED &&
    correctChoiceId(future) != null;
  const choices = Array.isArray(future.choices) ? future.choices : [];

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
          <div className="flex flex-wrap items-center gap-3">
            {!isSettlementDone && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSetCorrectError("");
                    setSelectedChoiceId(correctChoiceId(future));
                    setSetCorrectChoiceOpen(true);
                  }}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Update correct answer
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
                className={`rounded-md px-4 py-2 text-sm font-medium ${eventStatusBadgeClass(future.futureStatus)} ${
                  isSettlementDone
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-pointer"
                } ${statusUpdateLoading ? "cursor-wait opacity-60" : ""}`}
              >
                {future.futureStatus}
              </button>
              {statusDropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 min-w-[240px] rounded-md border border-zinc-700 bg-zinc-900 p-1 shadow-lg">
                  {FUTURE_STATUS_VALUES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateFutureStatus(status)}
                      className={`w-full rounded px-3 py-2 text-left text-sm ${
                        future.futureStatus.toUpperCase() === status
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

        {setCorrectChoiceOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="correct-choice-dialog-title"
          >
            <div
              className="fixed inset-0 bg-black/50 dark:bg-black/70"
              aria-hidden
              onClick={() =>
                !submittingCorrectChoice && setSetCorrectChoiceOpen(false)
              }
            />
            <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900">
              <h2
                id="correct-choice-dialog-title"
                className="mb-2 text-lg font-semibold text-black dark:text-white"
              >
                Update correct answer
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Select the winning choice for this future.
              </p>
              <div className="mb-6 space-y-3">
                {choices.map((choice) => (
                  <button
                    key={choice._id ?? choice.choiceId}
                    type="button"
                    onClick={() => setSelectedChoiceId(choice._id)}
                    disabled={submittingCorrectChoice}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors ${
                      selectedChoiceId === choice._id
                        ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30"
                        : "border-gray-200 hover:border-gray-300 dark:border-zinc-600 dark:hover:border-zinc-500"
                    }`}
                  >
                    <ChoiceTeamLogo choice={choice} />
                    <div className="min-w-0">
                      <span className="block font-medium text-black dark:text-white">
                        {choice.choiceName}
                      </span>
                      {choice.teamDetails ? (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {choice.teamDetails.name}
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
              {setCorrectError ? (
                <p className="mb-4 text-sm text-red-500 dark:text-red-400">
                  {setCorrectError}
                </p>
              ) : null}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSetCorrectChoiceOpen(false)}
                  disabled={submittingCorrectChoice}
                  className="rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCorrectChoice}
                  disabled={!selectedChoiceId || submittingCorrectChoice}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {submittingCorrectChoice ? "Updating…" : "Submit"}
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
                Are you sure you want to distribute payout?
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

        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          {future.eventImage ? (
            <div className="relative aspect-video w-full border-b border-gray-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={future.eventImage}
                alt={future.eventName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="p-6">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-bold text-black dark:text-white">
                {future.eventName}
              </h1>
              {futureEditable ? (
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
              Future ID: {future.futureId}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Document ID: {future._id}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Tournament: {future.tournamentData?.tournament ?? ""}
            </p>
            {future.eventDescription ? (
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {future.eventDescription}
              </p>
            ) : null}

            {future.eventDescriptionImage ? (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description image
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={future.eventDescriptionImage}
                  alt={`${future.eventName} description`}
                  className="max-h-80 w-full rounded-lg border border-gray-200 object-contain dark:border-zinc-700"
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
        </div>

        {detailsSaveMessage ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            {detailsSaveMessage}
          </p>
        ) : null}

        {choicesSaveMessage ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            {choicesSaveMessage}
          </p>
        ) : null}

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Choices (
              {Array.isArray(future.choices) ? future.choices.length : 0})
            </h2>
            {choicesEditable ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setChoicesSaveMessage("");
                    setAddChoicesOpen(true);
                  }}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
                >
                  Add choices
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChoicesSaveMessage("");
                    setEditChoicesOpen(true);
                  }}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
                >
                  Edit choices
                </button>
              </div>
            ) : null}
          </div>
          {Array.isArray(future.choices) && future.choices.length > 0 ? (
            <ul className="space-y-4">
              {future.choices.map((c) => (
                <li
                  key={c._id ?? c.choiceId}
                  className="rounded-lg border border-gray-200 p-4 dark:border-zinc-700"
                >
                  <div className="flex items-start gap-3">
                    {c.choiceImage?.trim() ? (
                      <div className="size-[50px] shrink-0 overflow-hidden rounded-md border border-gray-200 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.choiceImage.trim()}
                          alt={c.choiceName}
                          className="size-full object-cover"
                        />
                      </div>
                    ) : null}
                    <ChoiceTeamLogo choice={c} />
                    <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2">
                      <p className="font-medium text-black dark:text-white">
                        {c.choiceName}
                      </p>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {correctChoiceId(future) === c._id ? (
                          <span className="rounded-md bg-emerald-600/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                            Winner
                          </span>
                        ) : null}
                        <span className="text-xs text-zinc-500">
                          {c.isVisible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>
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
                      <dd className="text-zinc-200">
                        {c.initialCoinsOnChoice}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No choices.</p>
          )}
        </div>

        <div className="mb-6 mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectPanelTab("bets")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              panelTab === "bets"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-gray-300 text-black hover:bg-gray-100 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
            }`}
          >
            User Bets
          </button>
          <button
            type="button"
            onClick={() => selectPanelTab("json")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              panelTab === "json"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-gray-300 text-black hover:bg-gray-100 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
            }`}
          >
            Future JSON
          </button>
        </div>

        {panelTab === "bets" && <FutureBets futureId={futureId} />}

        {panelTab === "json" && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-zinc-950 p-4 dark:border-zinc-700">
            <pre className="whitespace-pre-wrap break-all text-xs text-zinc-300">
              {JSON.stringify(future, null, 2)}
            </pre>
          </div>
        )}

        {editDetailsOpen && futureEditable ? (
          <EditFutureDetailsModal
            isOpen={editDetailsOpen}
            future={future}
            onClose={() => setEditDetailsOpen(false)}
            onSuccess={async () => {
              setDetailsSaveMessage("Event details updated successfully.");
              await fetchFuture({ silent: true });
            }}
          />
        ) : null}

        {editChoicesOpen && choicesEditable ? (
          <EditFutureChoicesModal
            isOpen={editChoicesOpen}
            future={future}
            onClose={() => setEditChoicesOpen(false)}
            onSuccess={async () => {
              setChoicesSaveMessage("Choices updated successfully.");
              await fetchFuture({ silent: true });
            }}
          />
        ) : null}

        {addChoicesOpen && choicesEditable ? (
          <AddFutureChoicesModal
            isOpen={addChoicesOpen}
            future={future}
            onClose={() => setAddChoicesOpen(false)}
            onSuccess={async () => {
              setChoicesSaveMessage("Choices added successfully.");
              await fetchFuture({ silent: true });
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
