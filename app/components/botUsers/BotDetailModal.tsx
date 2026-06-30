"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Sparkles, Layers, Check, Loader2 } from "lucide-react";
import type {
  BotUser,
  BotCardsResponse,
} from "@/app/interface/bot-user.interface";
import { botApi } from "./bot-api";

type Banner = { kind: "ok" | "err"; text: string } | null;

interface BotDetailModalProps {
  bot: BotUser;
  onClose: () => void;
}

export default function BotDetailModal({ bot, onClose }: BotDetailModalProps) {
  const [data, setData] = useState<BotCardsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<Banner>(null);

  // Deck creation state.
  const [deckName, setDeckName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set(),
  );
  const [selectedActions, setSelectedActions] = useState<Set<string>>(
    new Set(),
  );

  // In-flight action flags.
  const [assigningPack, setAssigningPack] = useState(false);
  const [creatingDeck, setCreatingDeck] = useState(false);
  const [settingDeckId, setSettingDeckId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await botApi.cards(bot._id);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [bot._id]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePlayer = (id: string) => {
    setSelectedPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAction = (id: string) => {
    setSelectedActions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAssignPack = async () => {
    setBanner(null);
    setAssigningPack(true);
    try {
      await botApi.assignStarterPack(bot._id);
      setBanner({ kind: "ok", text: "Starter pack assigned." });
      await load();
    } catch (e) {
      setBanner({
        kind: "err",
        text: e instanceof Error ? e.message : "Failed to assign starter pack",
      });
    } finally {
      setAssigningPack(false);
    }
  };

  const handleCreateDeck = async () => {
    setBanner(null);
    const name = deckName.trim();
    if (!name) {
      setBanner({ kind: "err", text: "Deck name is required." });
      return;
    }
    if (selectedPlayers.size === 0 && selectedActions.size === 0) {
      setBanner({ kind: "err", text: "Select at least one card." });
      return;
    }
    setCreatingDeck(true);
    try {
      await botApi.createDeck(bot._id, {
        name,
        playerCardIds: Array.from(selectedPlayers),
        actionCardIds: Array.from(selectedActions),
      });
      setBanner({ kind: "ok", text: `Deck "${name}" created.` });
      setDeckName("");
      setSelectedPlayers(new Set());
      setSelectedActions(new Set());
      await load();
    } catch (e) {
      setBanner({
        kind: "err",
        text: e instanceof Error ? e.message : "Failed to create deck",
      });
    } finally {
      setCreatingDeck(false);
    }
  };

  const handleSetCurrent = async (deckId: string) => {
    setBanner(null);
    setSettingDeckId(deckId);
    try {
      await botApi.setCurrentDeck(bot._id, deckId);
      setBanner({ kind: "ok", text: "Current deck updated." });
      await load();
    } catch (e) {
      setBanner({
        kind: "err",
        text: e instanceof Error ? e.message : "Failed to set current deck",
      });
    } finally {
      setSettingDeckId(null);
    }
  };

  const hasCards =
    !!data && (data.cards.length > 0 || data.actionCards.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
      <div className="my-8 w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {bot.userName || "Unnamed bot"}
            </h3>
            <p className="text-sm text-gray-400">{bot.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {banner && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                banner.kind === "ok"
                  ? "border-emerald-700 bg-emerald-950/40 text-emerald-300"
                  : "border-red-700 bg-red-950/40 text-red-300"
              }`}
            >
              {banner.text}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading cards…
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : data ? (
            <>
              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAssignPack}
                  disabled={assigningPack || hasCards}
                  title={
                    hasCards
                      ? "Starter pack already assigned"
                      : "Assign a random starter pack"
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-600/60 bg-cyan-600/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-600/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {assigningPack ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Assign starter pack
                </button>
              </div>

              {/* Decks */}
              <section>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  Decks ({data.allDecks.length})
                </h4>
                {data.allDecks.length === 0 ? (
                  <p className="text-sm text-gray-500">No decks yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {data.allDecks.map((deck) => {
                      const isCurrent =
                        !!data.currentDeck &&
                        data.currentDeck.cards.length === deck.cards.length &&
                        deck.cards.every((c, i) =>
                          data.currentDeck
                            ? data.currentDeck.cards[i]?.playerCardData?._id ===
                              c.playerCardData?._id
                            : false,
                        );
                      return (
                        <div
                          key={deck._id}
                          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">
                              {deck.name}
                            </span>
                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                                <Check className="h-3 w-3" /> Active
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetCurrent(deck._id)}
                                disabled={settingDeckId === deck._id}
                                className="inline-flex items-center gap-1 rounded-md border border-zinc-700 px-2 py-1 text-xs text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
                              >
                                {settingDeckId === deck._id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : null}
                                Set active
                              </button>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {deck.cards.length} players ·{" "}
                            {deck.actionCards.length} actions
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Collection */}
              <section>
                <h4 className="mb-3 text-sm font-semibold text-white">
                  Player cards ({data.cards.length})
                </h4>
                {data.cards.length === 0 ? (
                  <p className="text-sm text-gray-500">No player cards owned.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {data.cards.map((entry) => {
                      const card = entry.playerCardData;
                      const selected = selectedPlayers.has(card._id);
                      return (
                        <button
                          key={card._id}
                          type="button"
                          onClick={() => togglePlayer(card._id)}
                          className={`flex flex-col items-start rounded-lg border p-3 text-left transition-colors ${
                            selected
                              ? "border-cyan-500 bg-cyan-500/10"
                              : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                          }`}
                        >
                          <span className="text-sm font-medium text-white">
                            {card.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {card.team ?? "—"} · {card.position ?? "—"}
                          </span>
                          <span className="mt-1 text-xs text-cyan-400">
                            {card.cardType ?? ""}{" "}
                            {card.finalRating != null
                              ? `· ${card.finalRating}`
                              : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <h4 className="mb-3 text-sm font-semibold text-white">
                  Action cards ({data.actionCards.length})
                </h4>
                {data.actionCards.length === 0 ? (
                  <p className="text-sm text-gray-500">No action cards owned.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {data.actionCards.map((entry) => {
                      const card = entry.actionCardData;
                      const selected = selectedActions.has(card._id);
                      return (
                        <button
                          key={card._id}
                          type="button"
                          onClick={() => toggleAction(card._id)}
                          className={`flex flex-col items-start rounded-lg border p-3 text-left transition-colors ${
                            selected
                              ? "border-cyan-500 bg-cyan-500/10"
                              : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                          }`}
                        >
                          <span className="text-sm font-medium text-white">
                            {card.title}
                          </span>
                          <span className="text-xs text-gray-400">
                            {card.category ?? "—"}
                            {card.basePower != null
                              ? ` · ${card.basePower}`
                              : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Create deck */}
              {hasCards && (
                <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-white">
                    Create a deck
                  </h4>
                  <p className="mb-3 text-xs text-gray-500">
                    Select cards above, then name and save the deck.{" "}
                    {selectedPlayers.size} players · {selectedActions.size}{" "}
                    actions selected.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={deckName}
                      onChange={(e) => setDeckName(e.target.value)}
                      placeholder="Deck name"
                      className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateDeck}
                      disabled={creatingDeck}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                    >
                      {creatingDeck ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      Create deck
                    </button>
                  </div>
                </section>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
