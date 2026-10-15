"use client";

import { useEffect, useState } from "react";
import { Flag, Trophy } from "lucide-react";
import type {
  GrandPrixDashDetail,
  GrandPrixDashListItem,
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
  TextBlock,
} from "./game-detail-ui";

export default function GrandPrixDashDetailModal({
  summary,
  onClose,
}: {
  summary: GrandPrixDashListItem;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<GrandPrixDashDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const d = await gamesApi.getGrandPrixDash(summary._id);
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

  // List rows carry every field but `launch` / `mvpMove`, so the header and
  // race summary render immediately and only the highlights wait.
  const data = detail ?? summary;

  return (
    <DetailModalShell
      title="Grand prix dash"
      icon={<Flag className="h-5 w-5 text-cyan-400" />}
      error={error}
      onClose={onClose}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            {data.username || "—"}
            {data.isWin && <Trophy className="h-4 w-4 text-amber-400" />}
          </p>
          <p className="text-xs text-gray-500">
            {formatDateTime(data.playedAt)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-cyan-300">
            P{data.finishingPosition}
            <span className="text-base text-gray-500"> / {data.totalCars}</span>
          </p>
          <p className="text-xs capitalize text-gray-400">
            {orDash(data.finalStatus)}
          </p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${deltaClass(data.xpDelta)}`}>
            {signed(data.xpDelta)}
          </p>
          <p className="text-xs text-gray-500">XP</p>
        </div>
      </div>

      <StatGrid label="Race summary">
        <Meta label="Laps" value={String(data.totalLap)} />
        <Meta label="Grid size" value={String(data.totalCars)} />
        <Meta
          label="Start → finish"
          value={`P${data.startingPosition} → P${data.finishingPosition}`}
        />
        <Meta
          label="Positions gained"
          value={signed(data.positionsGained)}
          valueClass={deltaClass(data.positionsGained)}
        />
        <Meta label="Race time" value={orDash(data.raceTime)} />
        <Meta label="Status" value={orDash(data.finalStatus)} />
      </StatGrid>

      {loading ? (
        <p className="text-sm text-gray-500">Loading highlights…</p>
      ) : (
        <>
          <TextBlock label="Launch" value={detail?.launch} />
          <TextBlock label="MVP move" value={detail?.mvpMove} />
          {!detail?.launch?.trim() && !detail?.mvpMove?.trim() && (
            <p className="text-sm text-gray-500">No highlights recorded.</p>
          )}
        </>
      )}
    </DetailModalShell>
  );
}
