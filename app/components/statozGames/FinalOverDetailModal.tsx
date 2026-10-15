"use client";

import { useEffect, useState } from "react";
import { X, Loader2, CircleDot } from "lucide-react";
import type {
  FinalOverDetail,
  FinalOverListItem,
} from "@/app/interface/game.interface";
import { gamesApi } from "./statoz-games-api";

/** Colour one ball of the chase by its outcome. */
function ballClass(outcome: string): string {
  const o = outcome.trim().toUpperCase();
  if (o === "W") return "border-red-700 bg-red-950/50 text-red-300";
  if (o === "6") return "border-emerald-600 bg-emerald-950/50 text-emerald-300";
  if (o === "4") return "border-cyan-600 bg-cyan-950/50 text-cyan-300";
  if (o === "0") return "border-zinc-700 bg-zinc-900 text-gray-500";
  return "border-zinc-700 bg-zinc-900 text-gray-200";
}

export default function FinalOverDetailModal({
  summary,
  onClose,
}: {
  summary: FinalOverListItem;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<FinalOverDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const d = await gamesApi.getFinalOver(summary._id);
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

  // List rows carry everything but `theChase`, so the summary renders the
  // whole header while the ball-by-ball array is still in flight.
  const data = detail ?? summary;
  const chase = detail?.theChase ?? [];
  const needed = data.chasing - data.scored;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <CircleDot className="h-5 w-5 text-cyan-400" />
            Final over
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
                {data.username || "—"}
              </p>
              <p className="text-xs text-gray-500">player</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-300">
                {data.scored} / {data.chasing}
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
                {data.isWin ? "Chased down" : `${needed} short`}
              </p>
              <p className="text-xs text-gray-500">
                {data.ballsPlayed} ball{data.ballsPlayed === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <Meta label="Chasing" value={String(data.chasing)} />
            <Meta label="Scored" value={String(data.scored)} />
            <Meta label="Wickets lost" value={String(data.wicketLost)} />
            <Meta label="Sixes" value={String(data.sixes)} />
            <Meta label="Fours" value={String(data.fours)} />
            <Meta label="Balls played" value={String(data.ballsPlayed)} />
            <Meta
              label="XP delta"
              value={`${data.xpDelta > 0 ? "+" : ""}${data.xpDelta}`}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              The chase
            </p>
            {loading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading the chase…
              </div>
            ) : chase.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {chase.map((outcome, i) => (
                  <div
                    // Ball outcomes repeat, so position is the only stable key.
                    key={i}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${ballClass(
                        outcome,
                      )}`}
                    >
                      {outcome}
                    </span>
                    <span className="text-[10px] text-gray-600">{i + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No ball-by-ball recorded.</p>
            )}
          </div>

          {(data.message || data.description) && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Result copy
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
                {data.message && (
                  <p className="text-sm font-semibold text-gray-200">
                    {data.message}
                  </p>
                )}
                {data.description && (
                  <p className="mt-1 text-sm text-gray-400">
                    {data.description}
                  </p>
                )}
              </div>
            </div>
          )}
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
      <p className="truncate text-sm font-semibold text-gray-200">{value}</p>
    </div>
  );
}
