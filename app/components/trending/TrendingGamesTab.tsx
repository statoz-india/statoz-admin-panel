"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { Atom } from "react-loading-indicators";
import type { Game, GameSection } from "@/app/interface/game-catalog.interface";

const TRENDING_GAMES_URL = "/api/trending/games";
const GAMES_CATALOG_URL = "/api/statoz-games/games";

/** One row in the editable list — the full game record is kept for display. */
interface DraftGame {
  key: string;
  data: Game;
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, item);
  return next;
}

function gameTypeLabel(gameType: string): string {
  if (!gameType) return "—";
  return gameType.charAt(0).toUpperCase() + gameType.slice(1);
}

/**
 * Flattens the grouped-by-sport response into one ordered list. `order` is
 * only meaningful *within* a sport on the home screen (each sport gets its
 * own carousel there), so concatenating the groups in the order the API
 * gives them preserves everything actually visible; saving this flattened,
 * edited list back is always a valid full replacement.
 */
function flattenSections(sections: GameSection[]): Game[] {
  return sections.flatMap((section) => section.games);
}

function toDraftGames(sections: GameSection[]): DraftGame[] {
  return flattenSections(sections).map((game) => ({
    key: game._id,
    data: game,
  }));
}

function iconMapFromSections(
  sections: GameSection[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const section of sections) {
    map[section.gameType] = section.icon;
  }
  return map;
}

/** Pulls the array out of this app's list-response envelope. */
function unwrapArray<T>(body: unknown): T[] {
  if (!body || typeof body !== "object") return [];
  const data = (body as { data?: unknown }).data;
  return Array.isArray(data) ? (data as T[]) : [];
}

async function fetchGamesCatalog(): Promise<GameSection[]> {
  const res = await fetch(GAMES_CATALOG_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || "Failed to load games catalog");
  }
  return unwrapArray<GameSection>(body);
}

function SportBadge({
  gameType,
  icon,
}: {
  gameType: string;
  icon?: string;
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded border-b-2 border-cyan-500 bg-zinc-800 px-2 py-1 text-xs font-bold uppercase tracking-wide text-cyan-300">
      {icon && (
        <span className="material-icons text-sm" aria-hidden>
          {icon}
        </span>
      )}
      {gameTypeLabel(gameType)}
    </span>
  );
}

function GameRow({
  item,
  index,
  total,
  icon,
  dragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  onRemove,
  disabled,
}: {
  item: DraftGame;
  index: number;
  total: number;
  icon?: string;
  dragging: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const game = item.data;

  return (
    <li
      draggable={!disabled}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 px-4 py-3 ${
        dragging ? "bg-zinc-800/80" : ""
      }`}
    >
      <GripVertical
        className="h-4 w-4 shrink-0 cursor-grab text-gray-600"
        aria-hidden
      />
      <span className="w-8 shrink-0 text-sm font-semibold text-gray-500">
        {index + 1}
      </span>

      <SportBadge gameType={game.gameType} icon={icon} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {game.title}
          {game.isLive && (
            <span className="ml-2 rounded bg-red-900/40 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-300">
              Live
            </span>
          )}
          {game.isQuickPlay && (
            <span className="ml-2 rounded bg-emerald-900/40 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
              Quick play
            </span>
          )}
        </p>
        <p className="truncate text-xs text-gray-500">{game.subtitle}</p>
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0 || disabled}
          aria-label={`Move ${game.title} up`}
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1 || disabled}
          aria-label={`Move ${game.title} down`}
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove ${game.title}`}
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-900/40 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function AddGameModal({
  onClose,
  onAdd,
  existingIds,
}: {
  onClose: () => void;
  onAdd: (game: Game) => void;
  existingIds: Set<string>;
}) {
  const [sections, setSections] = useState<GameSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchGamesCatalog();
      setSections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load games");
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pool = useMemo(() => flattenSections(sections), [sections]);
  const iconByType = useMemo(() => iconMapFromSections(sections), [sections]);
  const sportOptions = useMemo(
    () => sections.map((section) => section.gameType),
    [sections],
  );

  const query = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return pool.filter((game) => {
      if (sportFilter !== "all" && game.gameType !== sportFilter) return false;
      if (!query) return true;
      return (
        game.title.toLowerCase().includes(query) ||
        game.subtitle.toLowerCase().includes(query)
      );
    });
  }, [pool, query, sportFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-white">Add trending game</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-zinc-800 p-6 pb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Sport
          </label>
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="all">All sports</option>
            {sportOptions.map((gameType) => (
              <option key={gameType} value={gameType}>
                {gameTypeLabel(gameType)}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or subtitle"
            aria-label="Search"
            className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="min-h-[30vh] flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex min-h-[30vh] items-center justify-center">
              <Atom color="#5CDFFF" size="small" text="" textColor="" />
            </div>
          ) : error ? (
            <p className="p-6 text-sm text-red-300">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-gray-400">
              {query ? "No matches for that search." : "No games found."}
            </p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {filtered.map((game) => {
                const alreadyAdded = existingIds.has(game._id);
                return (
                  <li key={game._id}>
                    <button
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => onAdd(game)}
                      className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <SportBadge
                        gameType={game.gameType}
                        icon={iconByType[game.gameType]}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {game.title}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {game.subtitle}
                        </p>
                      </div>
                      {alreadyAdded ? (
                        <span className="shrink-0 text-xs text-gray-500">
                          Added
                        </span>
                      ) : (
                        <Plus className="h-4 w-4 shrink-0 text-cyan-300" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrendingGamesTab() {
  const [serverGames, setServerGames] = useState<DraftGame[]>([]);
  const [games, setGames] = useState<DraftGame[]>([]);
  const [iconByType, setIconByType] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchTrendingGames = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(TRENDING_GAMES_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to fetch trending games");
      }
      const sections: GameSection[] = Array.isArray(body.data)
        ? body.data
        : [];
      const draft = toDraftGames(sections);
      setIconByType(iconMapFromSections(sections));
      setServerGames(draft);
      setGames(draft);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load trending games",
      );
      setServerGames([]);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingGames();
  }, [fetchTrendingGames]);

  const isDirty = useMemo(
    () =>
      games.length !== serverGames.length ||
      games.some((game, index) => game.key !== serverGames[index]?.key),
    [games, serverGames],
  );

  const existingIds = useMemo(
    () => new Set(games.map((game) => game.key)),
    [games],
  );

  const saveOrder = async () => {
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const res = await fetch(TRENDING_GAMES_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          trendingGames: games.map((game) => ({ game: game.data._id })),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to save trending games");
      }
      // The PUT response is raw/ungrouped, so refetch to display it grouped.
      await fetchTrendingGames();
      setNotice("Trending games saved.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save trending games",
      );
    } finally {
      setSaving(false);
    }
  };

  const addGame = (game: Game) => {
    if (existingIds.has(game._id)) return;
    setGames((current) => [...current, { key: game._id, data: game }]);
    // Stay open so an admin can add several games in one go.
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="max-w-2xl text-gray-400">
            Games surfaced under “Trending” on the home screen, grouped by
            sport there. Drag a row or use the arrows to reorder, then save.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {games.length} game{games.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={() => setGames(serverGames)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-white transition-colors hover:border-zinc-500"
          >
            <Plus className="h-4 w-4" />
            Add game
          </button>
          <button
            type="button"
            onClick={saveOrder}
            disabled={!isDirty || saving}
            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save list"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
          <button
            type="button"
            onClick={fetchTrendingGames}
            className="ml-3 underline hover:text-red-200"
          >
            Reload
          </button>
        </div>
      )}

      {notice && !error && (
        <div className="mb-4 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      {isDirty && (
        <p className="mb-4 text-sm text-amber-300">Unsaved changes.</p>
      )}

      {games.length === 0 ? (
        <p className="text-gray-400">
          Nothing trending yet. Click “Add game” to pick one to feature.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-md border border-zinc-800 bg-zinc-900/60">
          {games.map((item, index) => (
            <GameRow
              key={item.key}
              item={item}
              index={index}
              total={games.length}
              icon={iconByType[item.data.gameType]}
              dragging={dragIndex === index}
              disabled={saving}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex === null) return;
                setGames((current) => moveItem(current, dragIndex, index));
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              onMoveUp={() =>
                setGames((current) => moveItem(current, index, index - 1))
              }
              onMoveDown={() =>
                setGames((current) => moveItem(current, index, index + 1))
              }
              onRemove={() =>
                setGames((current) => current.filter((_, i) => i !== index))
              }
            />
          ))}
        </ul>
      )}

      {isAddOpen && (
        <AddGameModal
          onClose={() => setIsAddOpen(false)}
          onAdd={addGame}
          existingIds={existingIds}
        />
      )}
    </div>
  );
}
