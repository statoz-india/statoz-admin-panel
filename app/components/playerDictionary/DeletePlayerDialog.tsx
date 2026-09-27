"use client";

import type { Player } from "@/app/models/player.model";

interface DeletePlayerDialogProps {
  player: Player;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onDelete: () => void;
}

/** Deleting a player is permanent — nothing else can bring it back. */
export default function DeletePlayerDialog({
  player,
  busy,
  error,
  onCancel,
  onDelete,
}: DeletePlayerDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6">
        <h2 className="text-xl font-bold text-white">Delete player?</h2>
        <p className="mt-3 text-sm text-gray-300">
          <span className="font-semibold text-white">{player.playerName}</span>{" "}
          will be removed permanently. There’s no undo.
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-zinc-600 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
