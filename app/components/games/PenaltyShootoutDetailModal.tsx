"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Target, Check, Ban } from "lucide-react";
import type {
  CardDetails,
  PenaltyShootoutDetail,
  PenaltyShootoutListItem,
} from "@/app/interface/game.interface";
import { gamesApi } from "./games-api";

/** Pull a human label out of a loosely-typed card-details blob. */
function cardLabel(card: CardDetails): string | null {
  if (!card) return null;
  const c = card as Record<string, unknown>;
  const name = c.name ?? c.shortName ?? c.playerName;
  return typeof name === "string" ? name : null;
}

const DIR_ARROW: Record<string, string> = {
  left: "←",
  center: "↑",
  right: "→",
};

export default function PenaltyShootoutDetailModal({
  summary,
  onClose,
}: {
  summary: PenaltyShootoutListItem;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<PenaltyShootoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const d = await gamesApi.getPenaltyShootout(summary._id);
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
  const kickLog = detail?.kickLog ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Target className="h-5 w-5 text-cyan-400" />
            Penalty shootout
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
                {data.finalScore}
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

          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Meta label="User goals" value={String(data.userGoals)} />
            <Meta label="Opp goals" value={String(data.opponentGoals)} />
            <Meta label="Rounds" value={String(data.totalRounds)} />
            <Meta label="XP" value={String(data.obtainedXp)} />
          </div>

          {(data.finalMessage || data.finalScoreMessage) && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-gray-300">
              {data.finalMessage && <p>{data.finalMessage}</p>}
              {data.finalScoreMessage && (
                <p className="text-gray-400">{data.finalScoreMessage}</p>
              )}
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Kick log
            </p>
            {loading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading kicks…
              </div>
            ) : kickLog.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-zinc-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-2">Taker</th>
                      <th className="px-3 py-2">Shot</th>
                      <th className="px-3 py-2">Dive</th>
                      <th className="px-3 py-2 text-center">Goal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {kickLog.map((kick, i) => {
                      const taker = cardLabel(kick.taker_card_details);
                      const keeper = cardLabel(kick.keeper_card_details);
                      return (
                        <tr key={i} className="text-gray-300">
                          <td className="px-3 py-2">
                            <span className="text-white">{kick.username}</span>
                            {kick.isOpponent && (
                              <span className="ml-1 text-xs text-cyan-400">
                                (opp)
                              </span>
                            )}
                            {taker && (
                              <span className="block text-xs text-gray-500">
                                {taker}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {DIR_ARROW[kick.shoot] ?? ""} {kick.shoot}
                          </td>
                          <td className="px-3 py-2">
                            {DIR_ARROW[kick.dive] ?? ""} {kick.dive}
                            {keeper && (
                              <span className="block text-xs text-gray-500">
                                {keeper}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {kick.isGoal ? (
                              <Check className="mx-auto h-4 w-4 text-emerald-400" />
                            ) : (
                              <Ban className="mx-auto h-4 w-4 text-red-400" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No kick log.</p>
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
      <p className="text-sm font-semibold text-gray-200">{value}</p>
    </div>
  );
}
