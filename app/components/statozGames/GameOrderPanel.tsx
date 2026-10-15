"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Pencil,
  RotateCcw,
} from "lucide-react";
import type { GameType } from "@/app/constants/game-type";
import type { Game } from "@/app/interface/game-catalog.interface";
import { GamesApiError, gamesApi } from "./statoz-games-api";

/** Labels for the id lists the backend returns when an order is rejected. */
const ID_DETAIL_LABELS: Record<string, string> = {
  missingIds: "Missing",
  unknownIds: "Not found",
  invalidIds: "Invalid",
  duplicateIds: "Duplicated",
};

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, item);
  return next;
}

/** Backend message plus any rejected ids, named by game title where known. */
function describeSaveError(err: unknown, games: Game[]): string {
  if (!(err instanceof Error)) return "Failed to save game order";
  if (!(err instanceof GamesApiError)) return err.message;

  const titleById = new Map(games.map((g) => [g._id, g.title]));
  const parts = Object.entries(ID_DETAIL_LABELS).flatMap(([field, label]) => {
    const ids = err.body[field];
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const names = ids.map((id) => titleById.get(String(id)) ?? String(id));
    return [`${label}: ${names.join(", ")}`];
  });

  return parts.length > 0 ? `${err.message} (${parts.join("; ")})` : err.message;
}

interface GameOrderPanelProps {
  gameType: GameType;
  /** Every game of `gameType`, already in display order from the backend. */
  games: Game[];
  /** Called with the re-ordered games the backend returns. */
  onSaved: (games: Game[]) => void;
  /** Open the edit form for a game. */
  onEdit?: (game: Game) => void;
}

export default function GameOrderPanel({
  gameType,
  games,
  onSaved,
  onEdit,
}: GameOrderPanelProps) {
  const serverOrder = games;
  const [order, setOrder] = useState<Game[]>(serverOrder);
  const [syncedOrder, setSyncedOrder] = useState<Game[]>(serverOrder);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // New data from the parent (a refresh or a save) replaces local edits.
  if (syncedOrder !== serverOrder) {
    setSyncedOrder(serverOrder);
    setOrder(serverOrder);
  }

  const isDirty =
    order.length !== serverOrder.length ||
    order.some((g, index) => g._id !== serverOrder[index]?._id);

  const saveOrder = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const updated = await gamesApi.setGameOrder(
        gameType,
        order.map((g) => g._id),
      );
      onSaved(Array.isArray(updated) ? updated : []);
      setNotice(`Order saved for ${gameType} games.`);
    } catch (err) {
      setError(describeSaveError(err, order));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p className="text-sm text-gray-400">
          Drag a row or use the arrows, then save. Games without a saved
          position are listed last, newest first.
        </p>
        <div className="ml-auto flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={() => setOrder(serverOrder)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={saveOrder}
            disabled={!isDirty || saving}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save order"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {notice && !error && (
        <div className="mb-4 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      {order.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 py-20 text-center text-sm text-gray-400">
          No {gameType} games yet.
        </div>
      ) : (
        <ul className="divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800">
          {order.map((game, index) => (
            <li
              key={game._id}
              draggable={!saving}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex === null) return;
                setOrder((current) => moveItem(current, dragIndex, index));
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`flex items-center gap-3 px-4 py-3 text-gray-300 ${
                dragIndex === index ? "bg-zinc-800/80" : "hover:bg-zinc-900"
              }`}
            >
              <GripVertical
                className="h-4 w-4 shrink-0 cursor-grab text-gray-600"
                aria-hidden
              />
              <span className="w-8 shrink-0 text-sm font-semibold text-gray-500">
                {index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {game.title}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {game.subtitle}
                </p>
              </div>

              <span className="hidden font-mono text-xs text-gray-500 sm:inline">
                {game.key}
              </span>
              {game.isLive && (
                <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                  Live
                </span>
              )}
              {game.isQuickPlay && (
                <span className="rounded-full bg-cyan-600/20 px-2 py-0.5 text-xs font-medium text-cyan-300">
                  Quick play
                </span>
              )}

              <div className="flex shrink-0 gap-1">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(game)}
                    // Saving an edit reloads the list, which would drop an
                    // unsaved order.
                    disabled={isDirty || saving}
                    title={
                      isDirty ? "Save or reset the order first" : "Edit game"
                    }
                    aria-label={`Edit ${game.title}`}
                    className="rounded p-1.5 text-gray-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setOrder((current) => moveItem(current, index, index - 1))
                  }
                  disabled={index === 0 || saving}
                  aria-label={`Move ${game.title} up`}
                  className="rounded p-1.5 text-gray-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOrder((current) => moveItem(current, index, index + 1))
                  }
                  disabled={index === order.length - 1 || saving}
                  aria-label={`Move ${game.title} down`}
                  className="rounded p-1.5 text-gray-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
