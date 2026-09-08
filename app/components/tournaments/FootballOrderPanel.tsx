"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, RotateCcw } from "lucide-react";
import { Atom } from "react-loading-indicators";
import type { Tournament } from "@/app/models/tournament.model";

const FOOTBALL_TOURNAMENTS_URL = "/api/games/football/tournaments";
const FOOTBALL_ORDER_URL = "/api/tournament/football-order";

const DEFAULT_PRIMARY_COLOR = "#19398A";
const DEFAULT_SECONDARY_COLOR = "#ffffff";
const DEFAULT_TEXT_COLOR = "#ffffff";

/**
 * Same order the match feed renders: curated positions ascending, then anything
 * never ordered, newest first.
 */
function sortByDisplayOrder(tournaments: Tournament[]): Tournament[] {
  const ordered = tournaments.filter((t) => Number.isFinite(t.displayOrder));
  const unordered = tournaments.filter((t) => !Number.isFinite(t.displayOrder));

  ordered.sort(
    (a, b) => (a.displayOrder as number) - (b.displayOrder as number),
  );
  unordered.sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );

  return [...ordered, ...unordered];
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, item);
  return next;
}

function TournamentChip({ tournament }: { tournament: Tournament }) {
  return (
    <span
      className="inline-flex min-w-14 items-center justify-center rounded border-b-2 px-2 py-1 text-xs font-bold tracking-wide"
      style={{
        backgroundColor:
          tournament.primaryColor?.trim() || DEFAULT_PRIMARY_COLOR,
        borderBottomColor:
          tournament.secondaryColor?.trim() || DEFAULT_SECONDARY_COLOR,
        color: tournament.textColor?.trim() || DEFAULT_TEXT_COLOR,
      }}
    >
      {tournament.tournament}
    </span>
  );
}

export default function FootballOrderPanel() {
  const [serverOrder, setServerOrder] = useState<Tournament[]>([]);
  const [order, setOrder] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [moveInput, setMoveInput] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const applyServerOrder = useCallback((tournaments: Tournament[]) => {
    const sorted = sortByDisplayOrder(tournaments);
    setServerOrder(sorted);
    setOrder(sorted);
    setMoveInput(null);
  }, []);

  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(FOOTBALL_TOURNAMENTS_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to fetch football tournaments");
      }
      applyServerOrder(Array.isArray(body.data) ? body.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load football tournaments",
      );
      setServerOrder([]);
      setOrder([]);
    } finally {
      setLoading(false);
    }
  }, [applyServerOrder]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const isDirty = useMemo(
    () =>
      order.length !== serverOrder.length ||
      order.some((t, index) => t._id !== serverOrder[index]?._id),
    [order, serverOrder],
  );

  /** POST — replaces the whole order with what is on screen. */
  const saveOrder = async () => {
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const res = await fetch(FOOTBALL_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tournamentIds: order.map((t) => t._id) }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to save tournament order");
      }
      applyServerOrder(Array.isArray(body.data) ? body.data : []);
      setNotice("Order saved. The football match feed follows it from now on.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save tournament order",
      );
    } finally {
      setSaving(false);
    }
  };

  /** PUT — moves one tournament, leaving the rest in their relative order. */
  const moveToPosition = async (tournament: Tournament, position: number) => {
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const res = await fetch(FOOTBALL_ORDER_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orders: [{ tournamentId: tournament._id, position }],
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to update tournament order");
      }
      applyServerOrder(Array.isArray(body.data) ? body.data : []);
      setNotice(`${tournament.tournament} moved to position ${position}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update tournament order",
      );
    } finally {
      setSaving(false);
    }
  };

  const commitMoveInput = (tournament: Tournament, currentIndex: number) => {
    const raw = moveInput?.value ?? "";
    setMoveInput(null);
    const position = Number(raw);
    if (!Number.isInteger(position) || position < 1) return;
    if (position === currentIndex + 1) return;
    moveToPosition(tournament, Math.min(position, order.length));
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Football order</h1>
          <p className="mt-2 max-w-2xl text-gray-400">
            The order tournament sections appear in the football match feed. Drag
            a row or use the arrows, then save. Tournaments left unordered fall
            below the ordered ones, earliest kick-off first.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={() => setOrder(serverOrder)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={saveOrder}
            disabled={!isDirty || saving}
            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save order"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
          <button
            type="button"
            onClick={fetchTournaments}
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
        <p className="mb-4 text-sm text-amber-300">
          Unsaved changes — “Move to #” is disabled until you save or reset.
        </p>
      )}

      {order.length === 0 ? (
        <p className="text-gray-400">
          No football tournaments yet. Assign a game type to a tournament first.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-md border border-zinc-800 bg-zinc-900/60">
          {order.map((tournament, index) => (
            <li
              key={tournament._id}
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
              className={`flex items-center gap-3 px-4 py-3 ${
                dragIndex === index ? "bg-zinc-800/80" : ""
              }`}
            >
              <GripVertical
                className="h-4 w-4 shrink-0 cursor-grab text-gray-600"
                aria-hidden
              />
              <span className="w-8 shrink-0 text-sm font-semibold text-gray-500">
                {index + 1}
              </span>

              <TournamentChip tournament={tournament} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {tournament.tournamentName}
                </p>
                <p className="text-xs text-gray-500">
                  {tournament.tournamentYear}
                </p>
              </div>

              <input
                type="number"
                min={1}
                max={order.length}
                value={
                  moveInput?.id === tournament._id
                    ? moveInput.value
                    : String(index + 1)
                }
                disabled={isDirty || saving}
                onChange={(e) =>
                  setMoveInput({ id: tournament._id, value: e.target.value })
                }
                onBlur={() => {
                  if (moveInput?.id === tournament._id) {
                    commitMoveInput(tournament, index);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") setMoveInput(null);
                }}
                aria-label={`Move ${tournament.tournament} to position`}
                title={
                  isDirty
                    ? "Save or reset your changes first"
                    : "Move to position"
                }
                className="w-16 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-center text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-40"
              />

              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setOrder((current) => moveItem(current, index, index - 1))
                  }
                  disabled={index === 0 || saving}
                  aria-label={`Move ${tournament.tournament} up`}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOrder((current) => moveItem(current, index, index + 1))
                  }
                  disabled={index === order.length - 1 || saving}
                  aria-label={`Move ${tournament.tournament} down`}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
