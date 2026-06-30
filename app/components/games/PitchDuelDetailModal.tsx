"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Swords } from "lucide-react";
import type {
  CardDetails,
  PitchDuelDetail,
  PitchDuelListItem,
} from "@/app/interface/game.interface";
import { gamesApi } from "./games-api";

/** Pull a human label out of a loosely-typed card-details blob. */
function cardLabel(card: CardDetails): string | null {
  if (!card) return null;
  const c = card as Record<string, unknown>;
  const name = c.name ?? c.shortName ?? c.playerName;
  return typeof name === "string" ? name : null;
}

export default function PitchDuelDetailModal({
  summary,
  onClose,
}: {
  summary: PitchDuelListItem;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<PitchDuelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const d = await gamesApi.getPitchDuel(summary._id);
        if (active) setDetail(d);
      } catch (e) {
        if (active)
          setError(e instanceof Error ? e.message : "Failed to load detail");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [summary._id]);

  const data = detail ?? summary;
  const mvpLabel = detail
    ? cardLabel(detail.finalScore?.mvp_card_details)
    : null;
  const duelLog = detail?.duelLog ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Swords className="h-5 w-5 text-cyan-400" />
            Pitch duel
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                {data.username}
              </p>
              <p className="text-xs text-gray-500">player</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-300">
                {data.userScore} - {data.opponentScore}
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  data.isWin
                    ? "bg-emerald-600/20 text-emerald-300"
                    : "bg-red-900/40 text-red-300"
                }`}
              >
                {data.isWin ? "Win" : "Loss"}
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                {data.opponentUsername}
              </p>
              <p className="text-xs text-gray-500">opponent</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <Meta label="Status" value={data.status} />
            <Meta label="Toss" value={data.toss} />
            <Meta
              label="Toss pick"
              value={`${data.tossUserSelection} ${
                data.hasUserWonToss ? "✓" : "✗"
              }`}
            />
            <Meta
              label="XP delta"
              value={`${data.xpDelta > 0 ? "+" : ""}${data.xpDelta}`}
            />
            <Meta label="Rounds" value={String(data.totalRounds)} />
            <Meta label="MVP" value={mvpLabel ?? data.mvp ?? "—"} />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Duel log
            </p>
            {loading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading rounds…
              </div>
            ) : duelLog.length > 0 ? (
              <pre className="max-h-72 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs text-gray-300">
                {JSON.stringify(duelLog, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-gray-500">No duel log.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="truncate text-sm font-semibold capitalize text-gray-200">
        {value}
      </p>
    </div>
  );
}
