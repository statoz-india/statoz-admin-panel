"use client";

import { useCallback, useEffect, useState } from "react";
import { Bot, Plus, Coins, Loader2, RefreshCw } from "lucide-react";
import type { BotUser } from "@/app/interface/bot-user.interface";
import { botApi } from "./bot-api";
import BotDetailModal from "./BotDetailModal";
import CreateBotModal from "./CreateBotModal";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function BotUsersSection() {
  const [bots, setBots] = useState<BotUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await botApi.list();
      setBots(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bot users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreated = (bot: BotUser) => {
    setBots((prev) => (prev ? [bot, ...prev] : [bot]));
    setShowCreate(false);
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Bot className="h-6 w-6 text-cyan-400" />
            Bot Users
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            AI opponents and their card collections.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            <Plus className="h-4 w-4" />
            Create bot
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading bot users…
        </div>
      ) : bots && bots.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <button
              key={bot._id}
              type="button"
              onClick={() => setSelectedBot(bot)}
              className="group flex flex-col items-start rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
            >
              <div className="flex w-full items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-cyan-400">
                  {bot.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bot.avatarUrl}
                      alt={bot.userName ?? bot.email}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {bot.userName || "Unnamed bot"}
                  </p>
                  <p className="truncate text-xs text-gray-400">{bot.email}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    bot.userStatus === "active"
                      ? "bg-emerald-600/20 text-emerald-300"
                      : "bg-zinc-700 text-gray-300"
                  }`}
                >
                  {bot.userStatus}
                </span>
              </div>
              <div className="mt-4 flex w-full items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <Coins className="h-4 w-4" />
                  {bot.coins.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(bot.createdAt)}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-800 py-20 text-center">
          <Bot className="mx-auto h-10 w-10 text-zinc-600" />
          <p className="mt-3 text-sm text-gray-400">No bot users yet.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            <Plus className="h-4 w-4" />
            Create your first bot
          </button>
        </div>
      )}

      {showCreate && (
        <CreateBotModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {selectedBot && (
        <BotDetailModal
          bot={selectedBot}
          onClose={() => setSelectedBot(null)}
        />
      )}
    </div>
  );
}
