"use client";

import { useEffect, useState } from "react";
import { Volleyball, Loader2 } from "lucide-react";
import type {
  TennisRallyDetail,
  TennisRallyListItem,
} from "@/app/interface/game.interface";
import { gamesApi } from "./statoz-games-api";
import {
  DetailModalShell,
  deltaClass,
  formatDateTime,
  Meta,
  orDash,
  signed,
  StatGrid,
  WinBadge,
} from "./game-detail-ui";

export default function TennisRallyDetailModal({
  summary,
  onClose,
}: {
  summary: TennisRallyListItem;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<TennisRallyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const d = await gamesApi.getTennisRally(summary._id);
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

  // The scoreline is on the list row; the rally stats only come with detail.
  const data = detail ?? summary;

  return (
    <DetailModalShell
      title="Tennis rally"
      icon={<Volleyball className="h-5 w-5 text-cyan-400" />}
      error={error}
      onClose={onClose}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div>
          <p className="text-sm font-semibold text-white">
            {data.username || "—"}
          </p>
          <p className="text-xs text-gray-500">
            {formatDateTime(data.playedAt)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-cyan-300">
            {data.finalYourScore} – {data.finalOpponentScore}
          </p>
          <div className="mt-1">
            <WinBadge win={data.isWin} />
          </div>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${deltaClass(data.xpDelta)}`}>
            {signed(data.xpDelta)}
          </p>
          <p className="text-xs text-gray-500">
            Grade {orDash(data.grade)}
          </p>
        </div>
      </div>

      <StatGrid label="Scoreboard">
        <Meta label="You" value={String(data.finalYourScore)} />
        <Meta label="Opponent" value={String(data.finalOpponentScore)} />
        <Meta label="Status" value={orDash(data.status)} />
        <Meta label="Grade" value={orDash(data.grade)} />
      </StatGrid>

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading stats…
        </div>
      ) : detail ? (
        <StatGrid label="Stats">
          <Meta label="First serve" value={String(detail.firstServe)} />
          <Meta label="Winners" value={String(detail.playingWinners)} />
          <Meta label="Errors" value={String(detail.playingErrors)} />
          <Meta label="Longest rally" value={String(detail.longestRally)} />
          <Meta
            label="Perfect contacts"
            value={String(detail.perfectContacts)}
          />
        </StatGrid>
      ) : (
        <p className="text-sm text-gray-500">No stats available.</p>
      )}
    </DetailModalShell>
  );
}
