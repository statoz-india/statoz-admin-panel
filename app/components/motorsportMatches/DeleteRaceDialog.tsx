"use client";

import type { MotorsportMatch } from "@/app/models/motorsport-match.model";

interface DeleteRaceDialogProps {
  match: MotorsportMatch;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onDelete: () => void;
  /** Safer alternatives — both are a PATCH, so they can be undone. */
  onHide: () => void;
  onMarkCancelled: () => void;
}

/**
 * Deleting a race is a hard delete with no undo, so the safer options (hide it
 * from the app, or mark it Cancelled) are offered alongside it.
 */
export default function DeleteRaceDialog({
  match,
  busy,
  error,
  onCancel,
  onDelete,
  onHide,
  onMarkCancelled,
}: DeleteRaceDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6">
        <h2 className="text-xl font-bold text-white">Delete race?</h2>
        <p className="mt-3 text-sm text-gray-300">
          <span className="font-semibold text-white">
            {match.matchId} — {match.name}
          </span>{" "}
          will be removed permanently. There’s no undo.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          If you only want it off the app, hide it or mark it Cancelled instead
          — both can be reversed.
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-zinc-600 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Keep it
          </button>
          {match.isVisible && (
            <button
              type="button"
              onClick={onHide}
              disabled={busy}
              className="rounded-md border border-zinc-600 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Hide from app
            </button>
          )}
          {match.matchStatus !== "Cancelled" && (
            <button
              type="button"
              onClick={onMarkCancelled}
              disabled={busy}
              className="rounded-md border border-zinc-600 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Mark cancelled
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Working…" : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
