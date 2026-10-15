"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Layers,
  Sparkles,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Users,
} from "lucide-react";
import type { Paginated } from "@/app/interface/pagination.interface";
import type {
  AdminUserCards,
  PlayerCardEntry,
  ActionCardEntry,
} from "@/app/interface/userCards.interface";
import { userCardsApi } from "./user-cards-api";

function PlayerCardChip({ entry }: { entry: PlayerCardEntry }) {
  const card = entry.playerCardData;
  if (!card) {
    return (
      <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-gray-500">
        (deleted card)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-gray-200">
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image}
          alt={card.name}
          className="h-5 w-5 rounded-full object-cover"
        />
      ) : (
        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
      )}
      <span className="max-w-[10rem] truncate">
        {card.name ?? card.shortName ?? "Unnamed"}
      </span>
      {typeof card.finalRating === "number" && (
        <span className="text-amber-300">{card.finalRating}</span>
      )}
    </span>
  );
}

function ActionCardChip({ entry }: { entry: ActionCardEntry }) {
  const card = entry.actionCardData;
  if (!card) {
    return (
      <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-gray-500">
        (deleted card)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-gray-200">
      <Layers className="h-3.5 w-3.5 text-purple-400" />
      <span className="max-w-[10rem] truncate">{card.title}</span>
      {typeof card.basePower === "number" && (
        <span className="text-amber-300">{card.basePower}</span>
      )}
    </span>
  );
}

function ExpandedRow({ row }: { row: AdminUserCards }) {
  return (
    <div className="space-y-5 bg-zinc-950/60 px-4 py-4">
      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-300">
          <Sparkles className="h-4 w-4" />
          Player cards ({row.cards.length})
        </p>
        {row.cards.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {row.cards.map((c, i) => (
              <PlayerCardChip key={c.playerCardData?._id ?? i} entry={c} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No player cards.</p>
        )}
      </div>

      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-300">
          <Layers className="h-4 w-4" />
          Action cards ({row.actionCards.length})
        </p>
        {row.actionCards.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {row.actionCards.map((c, i) => (
              <ActionCardChip key={c.actionCardData?._id ?? i} entry={c} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No action cards.</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-200">
          Decks ({row.allDecks.length})
        </p>
        {row.allDecks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {row.allDecks.map((deck, i) => (
              <span
                key={deck._id ?? i}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-gray-200"
              >
                <span className="font-medium">{deck.name ?? "Deck"}</span>
                <span className="text-gray-500">
                  {deck.cards.length}P · {deck.actionCards.length}A
                </span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No decks built.</p>
        )}
      </div>
    </div>
  );
}

export default function UserCardsSection() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<AdminUserCards> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userCardsApi.all(p);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load user cards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
    setExpanded(null);
  }, [page, load]);

  const toggle = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Users className="h-6 w-6 text-cyan-400" />
            User Cards
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Every user&apos;s card collection, decks, and current deck.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load(page)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading user cards…
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="w-10 px-4 py-3" />
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-right">Player cards</th>
                  <th className="px-4 py-3 text-right">Action cards</th>
                  <th className="px-4 py-3 text-right">Decks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.items.map((row, idx) => {
                  const id = row.user?._id ?? `row-${idx}`;
                  const open = expanded === id;
                  return (
                    <Fragment key={id}>
                      <tr
                        onClick={() => toggle(id)}
                        className="cursor-pointer bg-black transition-colors hover:bg-zinc-900"
                      >
                        <td className="px-4 py-3 text-gray-500">
                          {open ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-cyan-400">
                              {row.user?.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={row.user.avatarUrl}
                                  alt={row.user.userName ?? row.user.email}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Users className="h-4 w-4" />
                              )}
                            </div>
                            <span className="font-medium text-white">
                              {row.user?.userName ?? "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {row.user?.email ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-200">
                          {row.cards.length}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-200">
                          {row.actionCards.length}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-200">
                          {row.allDecks.length}
                        </td>
                      </tr>
                      {open && (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <ExpandedRow row={row} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-400">
              Page {data.page} / {Math.max(data.totalPages, 1)}
            </span>
            <button
              type="button"
              disabled={!data.hasMore || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              Next
            </button>
            <span className="ml-auto text-sm text-gray-500">
              {data.total} users total
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-20 text-gray-500">
          No user cards found.
        </div>
      )}
    </div>
  );
}
