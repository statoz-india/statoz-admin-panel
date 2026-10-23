"use client";

import type { MatchForDate } from "@/app/api/match/for-date/[date]/route";
import type { MatchData } from "@/app/api/match/route";
import { statusBadgeClass } from "@/app/utils/statusBadge";

type MatchListItem = MatchForDate | MatchData;

function teamShortName(match: MatchListItem, side: "A" | "B") {
  const team = side === "A" ? match.teamA : match.teamB;
  return (
    team?.abbreviation?.trim() ||
    team?.name?.trim() ||
    (side === "A" ? "Team A" : "Team B")
  );
}

function fixtureTitle(match: MatchListItem): string {
  return `${teamShortName(match, "A")} vs ${teamShortName(match, "B")}`;
}

function isLiveStatus(status: string | undefined): boolean {
  return status?.toLowerCase() === "live";
}

export default function MatchFixtureCard({
  match,
  showGameType,
  formatStartTime,
  onOpenMatch,
  onOpenStatus,
  onOpenStartTime,
  onEditBanner,
}: {
  match: MatchListItem;
  /** Day view mixes sports — show a game-type chip on the card. */
  showGameType: boolean;
  formatStartTime: (iso: string | undefined) => string;
  onOpenMatch: () => void;
  onOpenStatus: (e: React.MouseEvent) => void;
  onOpenStartTime: (e: React.MouseEvent) => void;
  onEditBanner: (e: React.MouseEvent) => void;
}) {
  const quizCount = match.quizIds?.length ?? 0;
  const predictionCount = match.predictionIds?.length ?? 0;
  const live = isLiveStatus(match.matchStatus);
  const tag = match.tag?.trim();

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
        live
          ? "border-emerald-600/60 ring-1 ring-emerald-500/30"
          : "border-zinc-700"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-white">
            {fixtureTitle(match)}
          </h3>
          <p className="mt-0.5 truncate text-xs text-zinc-400" title={match.matchId}>
            {match.matchId}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenStatus}
          title="Click to update status"
          className={
            match.matchStatus
              ? `shrink-0 rounded-md px-2 py-0.5 text-xs font-medium hover:ring-2 hover:ring-white/60 ${statusBadgeClass(
                  match.matchStatus,
                )}`
              : "shrink-0 rounded-md border border-zinc-600 px-2 py-0.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
          }
        >
          {match.matchStatus ? match.matchStatus.toUpperCase() : "Set status"}
        </button>
      </div>

      <div className="mb-3 flex items-center justify-center gap-3">
        <TeamBadge team={match.teamA} />
        <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          vs
        </span>
        <TeamBadge team={match.teamB} />
      </div>

      <p className="mb-3 text-center text-xs text-zinc-400">
        <span className="text-zinc-300">{match.tournament}</span>
        <span className="mx-1.5 text-zinc-600">·</span>
        <button
          type="button"
          onClick={onOpenStartTime}
          title="Click to edit start time"
          className="text-zinc-300 hover:text-sky-300 hover:underline"
        >
          {formatStartTime(match.matchStartTime)}
        </button>
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <CountChip
          label={quizCount === 1 ? "1 quiz" : `${quizCount} quizzes`}
          active={quizCount > 0}
        />
        <CountChip
          label={
            predictionCount === 1
              ? "1 prediction"
              : `${predictionCount} predictions`
          }
          active={predictionCount > 0}
        />
       
        {live ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        ) : null}
      
      </div>
    </article>
  );
}

function TeamBadge({
  team,
}: {
  team: MatchListItem["teamA"];
}) {
  const label = team?.abbreviation?.trim() || team?.name?.slice(0, 3) || "?";
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{
          backgroundColor: team?.primaryColor ?? "#3f3f46",
          color: team?.textColor ?? "#ffffff",
        }}
        title={team?.name}
      >
        {label}
      </div>
      <p className="w-full truncate text-center text-xs text-zinc-300">
        {team?.name ?? "—"}
      </p>
    </div>
  );
}

function CountChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        active
          ? "bg-emerald-900/70 text-emerald-200"
          : "bg-zinc-700/80 text-zinc-400"
      }`}
    >
      {label}
    </span>
  );
}
