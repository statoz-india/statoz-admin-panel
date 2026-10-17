"use client";

import { useState } from "react";
import {
  PREDICTION_STATUS_VALUES,
  type PredictionStatus,
} from "@/app/constants/prediction-status";
import { statusBadgeClass } from "@/app/utils/statusBadge";

/** Matches the predictions list: only settlement is locked from admin edits. */
function isPredictionStatusLocked(status: string): boolean {
  return status.toUpperCase() === "SETTLEMENT_DONE";
}

/**
 * Prediction status on the detail page. Click the badge to pick a new status
 * (same options as the predictions list).
 */
export default function PredictionStatusControl({
  predictionId,
  status,
  onUpdated,
}: {
  predictionId: string;
  status: string;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const locked = isPredictionStatusLocked(status);

  const updateStatus = async (next: PredictionStatus) => {
    if (next === status?.toUpperCase()) {
      setOpen(false);
      return;
    }
    if (
      next === "SETTLEMENT_DONE" &&
      !window.confirm(
        "Set this prediction to SETTLEMENT_DONE? Use “Distribute payouts” when a winner is declared unless you mean to close it administratively.",
      )
    ) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `/api/predictions/${predictionId}/update-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ predictionStatus: next }),
        },
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.success) {
        throw new Error(
          payload?.message || "Failed to update prediction status",
        );
      }
      setOpen(false);
      onUpdated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update prediction status",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          disabled={locked || saving}
          onClick={() => setOpen((o) => !o)}
          title={
            locked
              ? "Settlement done — status can't be changed here"
              : "Change prediction status"
          }
          className={`px-4 py-2 rounded text-sm font-medium ${statusBadgeClass(
            status ?? "",
          )} ${locked ? "cursor-not-allowed opacity-80" : "cursor-pointer"} ${
            saving ? "opacity-60 cursor-wait" : ""
          }`}
        >
          {status || "UNKNOWN"}
          {!locked && " ▾"}
        </button>

        {open && !locked && (
          <div className="absolute right-0 mt-2 min-w-[220px] bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-20 p-1">
            {PREDICTION_STATUS_VALUES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void updateStatus(s)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  status?.toUpperCase() === s
                    ? "bg-white text-black"
                    : "text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {s}
                {s === "SETTLEMENT_DONE" && (
                  <span className="ml-2 text-xs text-zinc-500">final</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {locked && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Settlement done — can&apos;t be changed
        </span>
      )}
      {error && (
        <span className="text-sm text-red-500 dark:text-red-400">{error}</span>
      )}
    </>
  );
}
