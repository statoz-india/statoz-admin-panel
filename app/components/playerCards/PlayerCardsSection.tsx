"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Loader2,
  RefreshCw,
  Pencil,
  Trash2,
  Star,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ACTION_CATEGORIES,
  CARD_TYPES,
  SPORTS,
  type ActionCard,
  type PlayerCard,
} from "@/app/interface/player-card.interface";
import { cardsApi } from "./cards-api";
import PlayerCardModal from "./PlayerCardModal";
import ActionCardModal from "./ActionCardModal";
import {
  CHAMFER,
  TIER_COLOR,
  TIER_RANK,
  foilGradient,
  hexA,
  stripeOverlay,
  type CardTier,
} from "./TierCard";

/** Action cards have no tier of their own — derive a foil tier from category. */
const CATEGORY_TIER: Record<string, CardTier> = {
  special: "platinum",
  attack: "gold",
  defense: "silver",
};

const CARD_TYPE_STYLES: Record<string, string> = {
  platinum: "bg-cyan-500/20 text-cyan-200",
  gold: "bg-amber-500/20 text-amber-200",
  silver: "bg-zinc-400/20 text-zinc-200",
  bronze: "bg-orange-700/30 text-orange-200",
};

export const PLAYER_CARDS_PAGE_SIZE = 50;

export function PlayerCardsTab() {
  const [cards, setCards] = useState<PlayerCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sport, setSport] = useState("");
  const [cardType, setCardType] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<PlayerCard | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cardsApi.listPlayerCards({
        page,
        limit: PLAYER_CARDS_PAGE_SIZE,
        sport: sport ? (sport as PlayerCard["sport"]) : undefined,
        cardType: cardType ? (cardType as PlayerCard["cardType"]) : undefined,
      });
      setCards(res.items);
      setTotalPages(Math.max(res.totalPages, 1));
      setTotal(res.total);
    } catch (e) {
      setCards([]);
      setError(e instanceof Error ? e.message : "Failed to load player cards");
    } finally {
      setLoading(false);
    }
  }, [page, sport, cardType]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = (card: PlayerCard) => {
    setCards((prev) => {
      if (!prev) return [card];
      const idx = prev.findIndex((c) => c._id === card._id);
      if (idx === -1) return [card, ...prev];
      const next = [...prev];
      next[idx] = card;
      return next;
    });
    setShowCreate(false);
    setEditing(null);
  };

  const handleDelete = async (card: PlayerCard) => {
    if (!window.confirm(`Delete "${card.name}"? This cannot be undone.`)) return;
    setDeletingId(card._id);
    try {
      await cardsApi.deletePlayerCard(card._id);
      setCards((prev) => prev?.filter((c) => c._id !== card._id) ?? null);
      setTotal((t) => Math.max(0, t - 1));
      if (cards && cards.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        void load();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete card");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={sport}
          onChange={(e) => {
            setSport(e.target.value);
            setPage(1);
          }}
          className={filterClass}
        >
          <option value="">All sports</option>
          {SPORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={cardType}
          onChange={(e) => {
            setCardType(e.target.value);
            setPage(1);
          }}
          className={filterClass}
        >
          <option value="">All card types</option>
          {CARD_TYPES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            <Plus className="h-4 w-4" />
            Create card
          </button>
        </div>
      </div>

      {!loading && (
        <p className="mb-4 text-sm text-gray-400">
          {total} card{total !== 1 ? "s" : ""}
          {totalPages > 1 && ` · page ${page} of ${totalPages}`}
        </p>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading player cards…" />
      ) : cards && cards.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((card) => {
            const tier = (card.cardType as CardTier) ?? "bronze";
            const accent = TIER_COLOR[tier];
            return (
              <div
                key={card._id}
                style={{
                  clipPath: CHAMFER,
                  background: hexA(accent, 0.85),
                  padding: 2,
                }}
                className="flex"
              >
                {/* inner foil layer, inset so the accent reads as a full border */}
                <div
                  style={{
                    position: "relative",
                    clipPath: CHAMFER,
                    background: foilGradient(accent, TIER_RANK[tier]),
                  }}
                  className="group flex flex-1 flex-col overflow-hidden"
                >
                  {/* diagonal foil stripes */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: stripeOverlay(accent),
                    }}
                  />
                  <div className="relative flex flex-1 flex-col">
                    <div className="relative h-52 bg-black/30">
                      {card.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={card.image}
                          alt={card.name}
                          className="h-full w-full object-contain object-top"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-zinc-600">
                          <Star className="h-8 w-8" />
                        </div>
                      )}
                      {card.cardType && (
                        <span
                          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            CARD_TYPE_STYLES[card.cardType] ??
                            "bg-zinc-700 text-gray-200"
                          }`}
                        >
                          {card.cardType}
                        </span>
                      )}
                      <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                        {card.finalRating ?? card.ratings}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="truncate font-semibold text-white">
                        {card.name}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {card.team}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-gray-300">
                        <span className="rounded bg-black/30 px-1.5 py-0.5">
                          {card.position}
                        </span>
                        {card.playerType && (
                          <span className="rounded bg-black/30 px-1.5 py-0.5 capitalize">
                            {card.playerType}
                          </span>
                        )}
                        <span className="rounded bg-black/30 px-1.5 py-0.5 capitalize">
                          {card.sport}
                        </span>
                        <span className="rounded bg-amber-900/50 px-1.5 py-0.5 text-amber-200">
                          {card.coinValue ?? 0} coins
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditing(card)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-gray-200 hover:bg-black/40"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(card)}
                          disabled={deletingId === card._id}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-400/40 bg-black/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                        >
                          {deletingId === card._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          label="No player cards yet."
          onCreate={() => setShowCreate(true)}
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {(showCreate || editing) && (
        <PlayerCardModal
          card={editing ?? undefined}
          onClose={() => {
            setShowCreate(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Action cards tab                                                    */
/* ------------------------------------------------------------------ */

export function ActionCardsTab() {
  const [cards, setCards] = useState<ActionCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<ActionCard | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cardsApi.listActionCards({
        limit: 100,
        category: category ? (category as ActionCard["category"]) : undefined,
      });
      setCards(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load action cards");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = (card: ActionCard) => {
    setCards((prev) => {
      if (!prev) return [card];
      const idx = prev.findIndex((c) => c._id === card._id);
      if (idx === -1) return [card, ...prev];
      const next = [...prev];
      next[idx] = card;
      return next;
    });
    setShowCreate(false);
    setEditing(null);
  };

  const handleDelete = async (card: ActionCard) => {
    if (!window.confirm(`Delete "${card.title}"? This cannot be undone.`)) return;
    setDeletingId(card._id);
    try {
      await cardsApi.deleteActionCard(card._id);
      setCards((prev) => prev?.filter((c) => c._id !== card._id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete card");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={filterClass}
        >
          <option value="">All categories</option>
          {ACTION_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            <Plus className="h-4 w-4" />
            Create card
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading action cards…" />
      ) : cards && cards.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => {
            const tier = CATEGORY_TIER[card.category] ?? "bronze";
            const accent = TIER_COLOR[tier];
            return (
              <div
                key={card._id}
                style={{
                  clipPath: CHAMFER,
                  background: hexA(accent, 0.85),
                  padding: 2,
                }}
                className="flex"
              >
                {/* inner layer, inset so the accent reads as a full border */}
                <div
                  style={{
                    position: "relative",
                    clipPath: CHAMFER,
                  }}
                  className="flex flex-1 flex-col overflow-hidden bg-zinc-900 p-4"
                >
                  <div className="relative flex flex-1 flex-col">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/30">
                      {card.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={card.icon}
                          alt={card.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Zap className="h-5 w-5 text-cyan-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {card.title}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {card.baseId}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        color: accent,
                      }}
                    >
                      {card.basePower}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-gray-300">
                    {card.effectTemplate}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                    <span className="rounded bg-black/30 px-1.5 py-0.5 capitalize text-gray-200">
                      {card.category}
                    </span>
                    {card.risky && (
                      <span className="rounded bg-red-900/50 px-1.5 py-0.5 text-red-200">
                        risky
                      </span>
                    )}
                    {card.isVisible === false && (
                      <span className="rounded bg-black/40 px-1.5 py-0.5 text-gray-300">
                        hidden
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditing(card)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-gray-200 hover:bg-black/40"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(card)}
                      disabled={deletingId === card._id}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-400/40 bg-black/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                    >
                      {deletingId === card._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          label="No action cards yet."
          onCreate={() => setShowCreate(true)}
        />
      )}

      {(showCreate || editing) && (
        <ActionCardModal
          card={editing ?? undefined}
          onClose={() => {
            setShowCreate(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const filterClass =
  "rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none";

function Pagination({
  page,
  totalPages,
  loading,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1 || loading}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>
      <span className="text-sm text-gray-400">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages || loading}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      {label}
    </div>
  );
}

function EmptyState({
  label,
  onCreate,
}: {
  label: string;
  onCreate: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 py-20 text-center">
      <Layers className="mx-auto h-10 w-10 text-zinc-600" />
      <p className="mt-3 text-sm text-gray-400">{label}</p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
      >
        <Plus className="h-4 w-4" />
        Create your first card
      </button>
    </div>
  );
}
