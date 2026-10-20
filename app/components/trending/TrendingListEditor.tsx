"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Atom } from "react-loading-indicators";
import type { Tournament } from "@/app/models/tournament.model";
import { ApiRequestError, apiRequest } from "@/app/utils/apiRequest";

/** One row of the list being edited; `id` is the tournament's or team's `_id`. */
export interface EditorItem {
  id: string;
  name: string;
}

export type PickerProps<T extends EditorItem> = {
  addedIds: Set<string>;
  onAdd: (item: T) => void;
  onClose: () => void;
};

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, item);
  return next;
}

export const sportLabel = (sport?: string) =>
  sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : "—";

export function SportBadge({ sport }: { sport?: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded border-b-2 border-cyan-500 bg-zinc-800 px-2 py-1 text-xs font-bold uppercase tracking-wide text-cyan-300">
      {sportLabel(sport)}
    </span>
  );
}

export function TournamentChip({ tournament }: { tournament: Tournament }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded border px-2 py-0.5 font-mono text-xs font-bold"
      style={{
        backgroundColor: tournament.primaryColor || "#27272a",
        borderColor: tournament.secondaryColor || "#3f3f46",
        color: tournament.textColor || "#ffffff",
      }}
    >
      {tournament.tournament}
    </span>
  );
}

type Props<Row, T extends EditorItem> = {
  /** This app's GET/PUT route, e.g. `/api/trending/teams`. */
  url: string;
  /** PUT body key and entry id key, e.g. `trendingTeams` / `team`. */
  listKey: string;
  idKey: string;
  /** Singular noun, e.g. `team`. */
  noun: string;
  description: ReactNode;
  /** Turns GET rows into list items, dropping rows whose item was deleted. */
  toItems: (rows: Row[]) => T[];
  renderItem: (item: T) => ReactNode;
  renderPicker: (props: PickerProps<T>) => ReactNode;
};

/**
 * Edits one curated trending list. Changes stay on screen until Save, which
 * sends the whole list in its current order (position becomes `order`) and
 * then reloads it from the server. The backend rejects an empty list, so Save
 * is disabled when nothing is left.
 */
export default function TrendingListEditor<Row, T extends EditorItem>({
  url,
  listKey,
  idKey,
  noun,
  description,
  toItems,
  renderItem,
  renderPicker,
}: Props<Row, T>) {
  const nouns = `${noun}s`;
  const [saved, setSaved] = useState<T[]>([]);
  const [items, setItems] = useState<T[]>([]);
  /** Rows the GET returned whose tournament/team no longer exists. */
  const [deletedCount, setDeletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);
  /** Ids of rows a failed save pointed at. */
  const [badIds, setBadIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const fetchList = useCallback(async () => {
    const rows = await apiRequest<Row[]>(
      url,
      { method: "GET" },
      `Failed to load trending ${nouns}`,
    );
    const list = Array.isArray(rows) ? rows : [];
    const next = toItems(list);
    setSaved(next);
    setItems(next);
    setDeletedCount(list.length - next.length);
  }, [url, nouns, toItems]);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    setSaveErrors([]);
    setBadIds(new Set());
    setNotice("");
    try {
      await fetchList();
    } catch (err) {
      setLoadError(errorMessage(err, `Failed to load trending ${nouns}`));
    } finally {
      setLoading(false);
    }
  }, [fetchList, nouns]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addedIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);
  const isDirty =
    saved.length !== items.length ||
    saved.some((item, i) => item.id !== items[i]?.id);

  const edit = (change: (list: T[]) => T[]) => {
    setItems(change);
    setNotice("");
  };

  const reset = () => {
    setItems(saved);
    setSaveErrors([]);
    setBadIds(new Set());
    setNotice("");
  };

  const save = async () => {
    if (items.length === 0) return;
    const sent = items;
    setSaving(true);
    setSaveErrors([]);
    setBadIds(new Set());
    setNotice("");
    try {
      await apiRequest(
        url,
        {
          method: "PUT",
          body: JSON.stringify({
            [listKey]: sent.map((item) => ({ [idKey]: item.id })),
          }),
        },
        `Failed to save trending ${nouns}`,
      );
    } catch (err) {
      const messages = [
        errorMessage(err, `Failed to save trending ${nouns}`),
        ...(err instanceof ApiRequestError ? err.errors : []),
      ];
      // `listKey[n]` names the entry's position in the list that was sent.
      const pattern = new RegExp(`${listKey}\\[(\\d+)\\]`, "g");
      const bad = new Set<string>();
      for (const message of messages) {
        for (const [, index] of message.matchAll(pattern)) {
          const row = sent[Number(index)];
          if (row) bad.add(row.id);
        }
      }
      setSaveErrors([...new Set(messages)]);
      setBadIds(bad);
      setSaving(false);
      return;
    }

    try {
      await fetchList();
      setNotice(`Trending ${nouns} saved.`);
    } catch (err) {
      setSaveErrors([
        `Saved, but reloading the list failed: ${errorMessage(err, "unknown error")}. Reload to see the saved list.`,
      ]);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {loadError}
        <button
          type="button"
          onClick={() => void reload()}
          className="ml-3 underline hover:text-red-200"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="max-w-2xl text-gray-400">{description}</p>
          <p className="mt-2 text-sm text-gray-500">
            {items.length} {items.length === 1 ? noun : nouns}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={reset}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-white transition-colors hover:border-zinc-500 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add {noun}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!isDirty || saving || items.length === 0}
            title={
              items.length === 0
                ? `The list needs at least one ${noun}`
                : undefined
            }
            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save list"}
          </button>
        </div>
      </div>

      {saveErrors.length > 0 && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {saveErrors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      {notice && (
        <div className="mb-4 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      {deletedCount > 0 && (
        <p className="mb-4 text-sm text-gray-500">
          {deletedCount} saved {deletedCount === 1 ? noun : nouns} no longer
          exist{deletedCount === 1 ? "s" : ""} and {deletedCount === 1 ? "is" : "are"}{" "}
          hidden here; the next save drops {deletedCount === 1 ? "it" : "them"}.
        </p>
      )}

      {isDirty && (
        <p className="mb-4 text-sm text-amber-300">
          Unsaved changes.
          {items.length === 0 &&
            ` The list can't be saved empty; add at least one ${noun}.`}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-gray-400">
          Nothing trending yet. Click “Add {noun}” to pick one.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-md border border-zinc-800 bg-zinc-900/60">
          {items.map((item, index) => (
            <li
              key={item.id}
              draggable={!saving}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) {
                  edit((list) => moveItem(list, dragIndex, index));
                }
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`flex items-center gap-3 px-4 py-3 ${
                dragIndex === index ? "bg-zinc-800/80" : ""
              } ${badIds.has(item.id) ? "bg-red-950/30" : ""}`}
            >
              <GripVertical
                className="h-4 w-4 shrink-0 cursor-grab text-gray-600"
                aria-hidden
              />
              <span className="w-6 shrink-0 text-sm font-semibold text-gray-500">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {renderItem(item)}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => edit((l) => moveItem(l, index, index - 1))}
                  disabled={index === 0 || saving}
                  aria-label={`Move ${item.name} up`}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => edit((l) => moveItem(l, index, index + 1))}
                  disabled={index === items.length - 1 || saving}
                  aria-label={`Move ${item.name} down`}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => edit((l) => l.filter((_, i) => i !== index))}
                  disabled={saving}
                  aria-label={`Remove ${item.name}`}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-900/40 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isPickerOpen &&
        renderPicker({
          addedIds,
          onAdd: (item) => {
            if (addedIds.has(item.id)) return;
            // The picker stays open so several can be added in one go.
            edit((list) => [...list, item]);
          },
          onClose: () => setIsPickerOpen(false),
        })}
    </div>
  );
}
