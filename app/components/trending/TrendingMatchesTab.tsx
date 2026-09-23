"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  TRENDING_TYPE_LABELS,
  TRENDING_TYPE_OPTIONS,
  TRENDING_TYPE_PLURAL_LABELS,
  type TrendingDisplayRecord,
  type TrendingItem,
  type TrendingType,
} from "@/app/models/trending.model";

const TRENDING_URL = "/api/trending";

/** The "add item" picker sources candidates from the same lists the app's
 * home screen shows — items that are currently visible/active and not
 * outdated — rather than the entire history of every prediction/future/event/quiz/match. */
const HOME_PAGE_POOL_URLS: Record<TrendingType, string> = {
  prediction: "/api/predictions/home-page",
  future: "/api/futures/home-page",
  event: "/api/events/home-page",
  quiz: "/api/quiz/home-page",
  match: "/api/match/home-page",
};

type PoolRecord = TrendingDisplayRecord;

/** One row in the editable list — the full record is kept for display. */
interface DraftItem {
  key: string;
  type: TrendingType;
  data: PoolRecord;
}

function draftKey(type: TrendingType, id: string) {
  return `${type}:${id}`;
}

function toDraftItems(items: TrendingItem[]): DraftItem[] {
  return items.map((item) => ({
    key: draftKey(item.type, item.data._id),
    type: item.type,
    data: item.data,
  }));
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, item);
  return next;
}

function teamLabel(team: PoolRecord["teamA"]): string {
  if (!team) return "Team";
  if (typeof team === "string") return team;
  return team.displayName || team.name || "Team";
}

/** Human-readable title/subtitle for any of the five source record shapes —
 * works whether `data` came fully populated (`GET /trending`) or from a
 * leaner home-page list (the "add item" picker). */
function describeRecord(
  type: TrendingType,
  data: PoolRecord,
): { title: string; subtitle: string } {
  if (type === "prediction" || type === "quiz" || type === "match") {
    const status =
      type === "prediction"
        ? data.predictionStatus
        : type === "quiz"
          ? data.quizStatus
          : data.matchStatus;
    return {
      title: `${teamLabel(data.teamA)} vs ${teamLabel(data.teamB)}`,
      subtitle: [data.tournament, status].filter(Boolean).join(" · ") || "—",
    };
  }

  const status = type === "future" ? data.futureStatus : data.eventStatus;
  return {
    title: data.eventName || "Untitled",
    subtitle: [data.tournament, status].filter(Boolean).join(" · ") || "—",
  };
}

/** Pulls the array out of this app's two list-response envelopes. */
function unwrapList<T>(body: unknown): T[] {
  if (!body || typeof body !== "object") return [];
  const data = (body as { data?: unknown }).data;
  if (Array.isArray(data)) return data as T[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { items?: unknown }).items)
  ) {
    return (data as { items: T[] }).items;
  }
  return [];
}

async function fetchPool(type: TrendingType): Promise<PoolRecord[]> {
  const res = await fetch(HOME_PAGE_POOL_URLS[type], {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || `Failed to load ${type} list`);
  }
  return unwrapList<PoolRecord>(body);
}

function TrendingRow({
  item,
  index,
  total,
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
  item: DraftItem;
  index: number;
  total: number;
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
  const { title, subtitle } = describeRecord(item.type, item.data);

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

      <span className="shrink-0 rounded border-b-2 border-cyan-500 bg-zinc-800 px-2 py-1 text-xs font-bold uppercase tracking-wide text-cyan-300">
        {TRENDING_TYPE_LABELS[item.type]}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{title}</p>
        <p className="truncate text-xs text-gray-500">{subtitle}</p>
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0 || disabled}
          aria-label={`Move ${title} up`}
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1 || disabled}
          aria-label={`Move ${title} down`}
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove ${title}`}
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-900/40 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function AddItemModal({
  onClose,
  onAdd,
  existingKeys,
}: {
  onClose: () => void;
  onAdd: (type: TrendingType, record: PoolRecord) => void;
  existingKeys: Set<string>;
}) {
  const [type, setType] = useState<TrendingType>("prediction");
  const [pool, setPool] = useState<PoolRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  // Guards against an older, slower request overwriting a newer one.
  const requestIdRef = useRef(0);

  const loadPool = useCallback(async (poolType: TrendingType) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError("");
    setSearch("");
    try {
      const records = await fetchPool(poolType);
      if (requestIdRef.current !== requestId) return;
      setPool(records);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      setError(err instanceof Error ? err.message : "Failed to load list");
      setPool([]);
    } finally {
      if (requestIdRef.current === requestId) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPool(type);
  }, [type, loadPool]);

  const query = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return pool;
    return pool.filter((record) => {
      const { title, subtitle } = describeRecord(type, record);
      return (
        title.toLowerCase().includes(query) ||
        subtitle.toLowerCase().includes(query)
      );
    });
  }, [pool, query, type]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-white">Add trending item</h2>
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
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TrendingType)}
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            {TRENDING_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {TRENDING_TYPE_LABELS[option]}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tournament"
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
              {query
                ? "No matches for that search."
                : `No ${TRENDING_TYPE_PLURAL_LABELS[type]} currently on the home screen.`}
            </p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {filtered.map((record) => {
                const { title, subtitle } = describeRecord(type, record);
                const alreadyAdded = existingKeys.has(
                  draftKey(type, record._id),
                );
                return (
                  <li key={record._id}>
                    <button
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => onAdd(type, record)}
                      className="flex w-full items-center justify-between gap-3 px-6 py-3 text-left transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {title}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {subtitle}
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

export default function TrendingMatchesTab() {
  const [serverItems, setServerItems] = useState<DraftItem[]>([]);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(TRENDING_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to fetch trending list");
      }
      const draft = toDraftItems(body.data?.items ?? []);
      setServerItems(draft);
      setItems(draft);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load trending list",
      );
      setServerItems([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const isDirty = useMemo(
    () =>
      items.length !== serverItems.length ||
      items.some((item, index) => item.key !== serverItems[index]?.key),
    [items, serverItems],
  );

  const existingKeys = useMemo(
    () => new Set(items.map((item) => item.key)),
    [items],
  );

  const saveOrder = async () => {
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const res = await fetch(TRENDING_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          trendingMatches: items.map((item) => ({
            type: item.type,
            data: item.data._id,
          })),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to save trending list");
      }
      // The PUT response doesn't populate `data`, so refetch to display it.
      await fetchTrending();
      setNotice("Trending list saved.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save trending list",
      );
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type: TrendingType, record: PoolRecord) => {
    const key = draftKey(type, record._id);
    if (existingKeys.has(key)) return;
    setItems((current) => [...current, { key, type, data: record }]);
    // Stay open so an admin can add several items in one go — they close it
    // themselves (✕) once done.
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
            Predictions, futures, events, quizzes and matches surfaced under
            “Trending” on the home screen. Drag a row or use the arrows to
            reorder, then save.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={() => setItems(serverItems)}
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
            Add item
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
            onClick={fetchTrending}
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

      {items.length === 0 ? (
        <p className="text-gray-400">
          Nothing trending yet. Click “Add item” to pick a prediction, future,
          event, quiz or match to feature.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-md border border-zinc-800 bg-zinc-900/60">
          {items.map((item, index) => (
            <TrendingRow
              key={item.key}
              item={item}
              index={index}
              total={items.length}
              dragging={dragIndex === index}
              disabled={saving}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex === null) return;
                setItems((current) => moveItem(current, dragIndex, index));
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              onMoveUp={() =>
                setItems((current) => moveItem(current, index, index - 1))
              }
              onMoveDown={() =>
                setItems((current) => moveItem(current, index, index + 1))
              }
              onRemove={() =>
                setItems((current) => current.filter((_, i) => i !== index))
              }
            />
          ))}
        </ul>
      )}

      {isAddOpen && (
        <AddItemModal
          onClose={() => setIsAddOpen(false)}
          onAdd={addItem}
          existingKeys={existingKeys}
        />
      )}
    </div>
  );
}
