"use client";

import { Pencil } from "lucide-react";
import type { Tournament } from "@/app/models/tournament.model";
import {
  MOTORSPORT_MATCH_STATUSES,
  type MotorsportMatch,
  type MotorsportMatchStatus,
} from "@/app/models/motorsport-match.model";
import { statusBadgeClass } from "@/app/utils/statusBadge";

function isOngoing(status: string | undefined): boolean {
  return status?.toLowerCase() === "ongoing";
}

export default function MotorsportFixtureCard({
  race,
  tournament,
  formatStartTime,
  busy,
  onOpenMatch,
  onChangeStatus,
  onToggleVisible,
  onEdit,
}: {
  race: MotorsportMatch;
  tournament?: Tournament;
  formatStartTime: (iso: string | null | undefined) => string;
  busy: boolean;
  onOpenMatch: () => void;
  onChangeStatus: (status: MotorsportMatchStatus) => void;
  onToggleVisible: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}) {
  const ongoing = isOngoing(race.matchStatus);
  const tag = race.tag?.trim();

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpenMatch}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenMatch();
        }
      }}
      className={`flex h-full cursor-pointer flex-col rounded-lg border bg-zinc-800/90 p-4 transition-colors hover:bg-indigo-500/10 ${
        ongoing
          ? "border-emerald-600/60 ring-1 ring-emerald-500/30"
          : "border-zinc-700"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-white">
            {race.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-zinc-400" title={race.matchId}>
            {race.matchId}
          </p>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={race.matchStatus}
            disabled={busy}
            onChange={(e) =>
              onChangeStatus(e.target.value as MotorsportMatchStatus)
            }
            aria-label={`Status of ${race.name}`}
            className={`max-w-[7.5rem] shrink-0 truncate rounded-md px-2 py-0.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-white/60 disabled:opacity-50 ${statusBadgeClass(
              race.matchStatus,
            )}`}
          >
            {MOTORSPORT_MATCH_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3 flex flex-col items-center justify-center gap-1">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full px-1 text-sm font-bold ${
            race.tournament.length > 4 ? "text-[10px]" : ""
          }`}
          style={{
            backgroundColor: tournament?.primaryColor ?? "#3f3f46",
            color: tournament?.textColor ?? "#ffffff",
          }}
          title={race.tournament}
        >
          {race.tournament}
        </div>
        <p className="w-full truncate text-center text-xs text-zinc-300">
          Season {race.seasonYear}
        </p>
      </div>

      <p className="mb-3 text-center text-xs text-zinc-400">
        <span className="text-zinc-300">{race.tournament}</span>
        <span className="mx-1.5 text-zinc-600">·</span>
        <span className="text-zinc-300">
          {formatStartTime(race.raceStartTime)}
        </span>
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          disabled={busy}
          onClick={onToggleVisible}
          title={race.isVisible ? "Click to hide" : "Click to show"}
          className={`rounded-full px-2 py-0.5 text-xs font-medium disabled:opacity-50 ${
            race.isVisible
              ? "bg-emerald-900/70 text-emerald-200 hover:bg-emerald-900"
              : "bg-zinc-700/80 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          {race.isVisible ? "Visible" : "Hidden"}
        </button>
        {tag ? (
          <span
            className="max-w-full truncate rounded-full bg-zinc-700/80 px-2 py-0.5 text-xs font-medium text-zinc-300"
            title={tag}
          >
            {tag}
          </span>
        ) : null}
        {ongoing ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Ongoing
          </span>
        ) : null}
        <div
          className="ml-auto flex gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onEdit}
            disabled={busy}
            aria-label={`Edit ${race.name}`}
            className="rounded-md border border-zinc-600 p-1 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
