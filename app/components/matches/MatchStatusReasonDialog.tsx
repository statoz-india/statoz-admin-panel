"use client";

import { useState } from "react";
import {
  MATCH_STATUS_LABELS,
  type MatchStatus,
} from "@/app/constants/match-status";

export function MatchStatusReasonDialog({
  matchLabel,
  status,
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  matchLabel: string;
  status: MatchStatus;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [localError, setLocalError] = useState("");

  const submit = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setLocalError("Enter a reason for this status change.");
      return;
    }
    setLocalError("");
    onConfirm(trimmed);
  };

  const displayError = localError || error;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-status-reason-title"
        className="w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-zinc-800 p-6">
          <h2
            id="match-status-reason-title"
            className="text-xl font-bold text-white"
          >
            Reason required
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {matchLabel} → {MATCH_STATUS_LABELS[status]}
          </p>
        </div>

        <div className="p-6">
          {displayError ? (
            <div className="mb-4 rounded-lg bg-red-950/40 p-3">
              <p className="text-sm text-red-300">{displayError}</p>
            </div>
          ) : null}

          <label
            htmlFor="match-status-reason"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Reason *
          </label>
          <textarea
            id="match-status-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (localError) setLocalError("");
            }}
            rows={4}
            disabled={busy}
            placeholder="e.g. Match washed out — no play possible"
            className="mb-6 w-full resize-y rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none disabled:opacity-50"
          />

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
            >
              {busy ? "Updating…" : "Update status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
