"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Tournament } from "@/app/models/tournament.model";
import {
  MOTORSPORT_MATCH_STATUSES,
  type MotorsportMatch,
  type MotorsportMatchStatus,
} from "@/app/models/motorsport-match.model";
import { formatIst, STATUS_STYLES } from "./motorsportHelpers";

interface MotorsportMatchCardProps {
  race: MotorsportMatch;
  /** The race's tournament, for its badge colours (falls back to grey). */
  tournament?: Tournament;
  /** A change to this race is in flight — disable its controls. */
  busy: boolean;
  onChangeStatus: (status: MotorsportMatchStatus) => void;
  onToggleVisible: () => void;
  onEdit: () => void;
  onDelete: () => void;
  /** Opens the race's detail page. */
  onOpen: () => void;
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-gray-400">{label}</p>
      <div className="break-words text-white">{children}</div>
    </div>
  );
}

const orDash = (value: string | null | undefined) => value?.trim() || "—";

/**
 * One race, laid out like a match card: id/tournament header with the actions on
 * the right, a centred block for the fixture, then a grid of details. A race has
 * no two teams, so the centre block shows the tournament badge and race name.
 */
export default function MotorsportMatchCard({
  race,
  tournament,
  busy,
  onChangeStatus,
  onToggleVisible,
  onEdit,
  onDelete,
  onOpen,
}: MotorsportMatchCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-6 transition-colors hover:bg-indigo-500/10"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="mb-1 text-xl font-bold text-white">{race.matchId}</h3>
          <p className="text-gray-400">Tournament: {race.tournament}</p>
          <p className="break-all text-gray-400">Match Mongo ID: {race._id}</p>
        </div>

        {/* The quick controls act in place; they must not open the page. */}
        <div
          className="flex shrink-0 flex-col items-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <select
            value={race.matchStatus}
            disabled={busy}
            onChange={(e) =>
              onChangeStatus(e.target.value as MotorsportMatchStatus)
            }
            aria-label={`Status of ${race.name}`}
            className={`rounded-full border px-3 py-1 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 ${
              STATUS_STYLES[race.matchStatus] ?? STATUS_STYLES.Finished
            }`}
          >
            {MOTORSPORT_MATCH_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy}
            onClick={onToggleVisible}
            title={race.isVisible ? "Click to hide" : "Click to show"}
            className={`rounded-full px-3 py-1 text-sm font-medium disabled:opacity-50 ${
              race.isVisible
                ? "bg-emerald-900 text-emerald-200 hover:bg-emerald-800"
                : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            }`}
          >
            {race.isVisible ? "Visible" : "Hidden"}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-600 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              aria-label={`Delete ${race.name}`}
              className="inline-flex items-center rounded-md border border-zinc-600 px-2 py-1 text-zinc-200 transition-colors hover:border-red-800 hover:bg-red-900/40 hover:text-red-300 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* The fixture */}
      <div className="mb-4 rounded-lg bg-zinc-800 p-4 text-center">
        <div
          className={`mb-2 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full px-1 font-bold ${
            race.tournament.length > 4 ? "text-xs" : "text-lg"
          }`}
          style={{
            backgroundColor: tournament?.primaryColor ?? "#3f3f46",
            color: tournament?.textColor ?? "#ffffff",
          }}
        >
          {race.tournament}
        </div>
        <p className="font-semibold text-white">{race.name}</p>
        <p className="text-sm text-gray-400">Season {race.seasonYear}</p>
      </div>

      {/* Details */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <Detail label="Race Start Time">{formatIst(race.raceStartTime)}</Detail>
        <Detail label="Weekend Starts">
          {formatIst(race.raceEventStartDate)}
        </Detail>
        <Detail label="Weekend Ends">{formatIst(race.raceEventStopDate)}</Detail>
        <Detail label="Season">{race.seasonYear}</Detail>
      </div>

      <div className="grid gap-4 text-sm md:grid-cols-3">
        <Detail label="Tag">{orDash(race.tag)}</Detail>
        <Detail label="Description">{orDash(race.description)}</Detail>
        <Detail label="Summary">{orDash(race.summary)}</Detail>
      </div>
    </div>
  );
}
