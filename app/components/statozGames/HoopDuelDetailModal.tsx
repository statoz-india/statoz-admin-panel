"use client";

import { useEffect, useState } from "react";
import { Dribbble, Loader2 } from "lucide-react";
import type {
  HoopDuelDetail,
  HoopDuelListItem,
} from "@/app/interface/game.interface";
import { gamesApi } from "./statoz-games-api";
import {
  DetailModalShell,
  deltaClass,
  formatDateTime,
  formatDecimal,
  Meta,
  orDash,
  signed,
  StatGrid,
  WinBadge,
} from "./game-detail-ui";

export default function HoopDuelDetailModal({
  summary,
  onClose,
}: {
  summary: HoopDuelListItem;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<HoopDuelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const d = await gamesApi.getHoopDuel(summary._id);
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

  // The final score is on the list row; half-time and the stat grid are not.
  const data = detail ?? summary;

  return (
    <DetailModalShell
      title="Hoop duel"
      icon={<Dribbble className="h-5 w-5 text-cyan-400" />}
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
          <p className="text-xs capitalize text-gray-500">
            {orDash(data.difficulty)}
          </p>
        </div>
      </div>

      <StatGrid label="Scoreboard">
        <Meta
          label="Half time"
          value={
            detail
              ? `${detail.halfTimeYourScore} – ${detail.halfTimeOpponentScore}`
              : "…"
          }
        />
        <Meta
          label="Final"
          value={`${data.finalYourScore} – ${data.finalOpponentScore}`}
        />
        <Meta label="Status" value={orDash(data.status)} />
        <Meta label="Difficulty" value={orDash(data.difficulty)} />
      </StatGrid>

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading stats…
        </div>
      ) : detail ? (
        <StatGrid label="Stats">
          <Meta label="FY" value={formatDecimal(detail.fy)} />
          <Meta label="Perfect" value={String(detail.perfect)} />
          <Meta label="3-pt moves" value={String(detail.threePointMove)} />
          <Meta label="Dunks" value={String(detail.dunks)} />
          <Meta label="Blocks" value={String(detail.blocks)} />
          <Meta label="Steals" value={String(detail.steals)} />
          <Meta label="Boards" value={String(detail.boards)} />
          <Meta label="Best run" value={String(detail.bestRun)} />
        </StatGrid>
      ) : (
        <p className="text-sm text-gray-500">No stats available.</p>
      )}
    </DetailModalShell>
  );
}
