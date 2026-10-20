"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Atom } from "react-loading-indicators";
import type { Tournament } from "@/app/models/tournament.model";
import {
  TRENDING_SPORTS,
  isTrendingSport,
  type TrendingSport,
  type TrendingTeamInfo,
} from "@/app/models/trending-curated.model";
import { apiRequest } from "@/app/utils/apiRequest";
import {
  type EditorItem,
  type PickerProps,
  SportBadge,
  TournamentChip,
  sportLabel,
} from "./TrendingListEditor";

const ALL_TOURNAMENTS_URL = "/api/tournament/getAllTournamentAndDetails";
const teamsUrl = (code: string) =>
  `/api/tournament/teams?tournament=${encodeURIComponent(code)}`;

export interface TournamentItem extends EditorItem {
  tournament: Tournament;
  sportsType?: string;
}

export interface TeamItem extends EditorItem {
  team: TrendingTeamInfo;
  tournament: Tournament | null;
  sportsType?: string;
}

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export const tournamentName = (t: Tournament) =>
  t.tournamentName || t.tournament;

export const teamName = (t: TrendingTeamInfo) =>
  t.displayName || t.name || t.abbreviation;

export function TeamBadge({ team }: { team: TrendingTeamInfo }) {
  const label = teamName(team);
  if (team.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={team.logo}
        alt={label}
        className="h-7 w-7 shrink-0 rounded-full bg-zinc-800 object-contain"
      />
    );
  }
  return (
    <span
      className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded border px-1 text-[10px] font-bold"
      style={{
        backgroundColor: team.primaryColor || "#27272a",
        borderColor: team.secondaryColor || "#3f3f46",
        color: team.textColor || "#ffffff",
      }}
    >
      {team.abbreviation || label.slice(0, 3).toUpperCase()}
    </span>
  );
}

/** Every tournament a trending list can hold (sport is one of the four), newest first. */
async function fetchTrendingTournamentCatalog(): Promise<Tournament[]> {
  const list = await apiRequest<Tournament[]>(
    ALL_TOURNAMENTS_URL,
    { method: "GET" },
    "Failed to load tournaments",
  );
  return (Array.isArray(list) ? list : [])
    .filter((t) => isTrendingSport(t.gameType))
    .sort(
      (a, b) =>
        (b.tournamentYear ?? "").localeCompare(a.tournamentYear ?? "") ||
        tournamentName(a).localeCompare(tournamentName(b)),
    );
}

function useTrendingTournamentCatalog() {
  const [catalog, setCatalog] = useState<Tournament[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchTrendingTournamentCatalog()
      .then((list) => {
        if (!cancelled) setCatalog(list);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, "Failed to load tournaments"));
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setCatalog(null);
    setError("");
    setAttempt((n) => n + 1);
  };

  return { catalog, error, retry };
}

function PickerModal({
  title,
  onClose,
  header,
  children,
}: {
  title: ReactNode;
  onClose: () => void;
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {header && (
          <div className="border-b border-zinc-800 p-6 pb-4">{header}</div>
        )}
        <div className="min-h-[30vh] flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <Atom color="#5CDFFF" size="small" text="" textColor="" />
    </div>
  );
}

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <p className="p-6 text-sm text-red-300">
      {message}{" "}
      <button type="button" onClick={onRetry} className="underline hover:text-red-200">
        Retry
      </button>
    </p>
  );
}

const inputClass =
  "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500";

/** Search box and sport filter over the trending-eligible tournaments. */
function useTournamentFilter(catalog: Tournament[] | null) {
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState<TrendingSport | "all">("all");
  const query = search.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      (catalog ?? []).filter(
        (t) =>
          (sport === "all" || t.gameType === sport) &&
          (!query ||
            [t.tournament, t.tournamentName, t.tournamentYear].some((f) =>
              f?.toLowerCase().includes(query),
            )),
      ),
    [catalog, query, sport],
  );

  const controls = (
    <>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by code, name or year"
        aria-label="Search tournaments"
        autoFocus
        className={inputClass}
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(["all", ...TRENDING_SPORTS] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setSport(value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              sport === value
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-200"
                : "border-zinc-700 text-gray-400 hover:text-gray-200"
            }`}
          >
            {value === "all" ? "All sports" : sportLabel(value)}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Only football, cricket, basketball and racing tournaments can be trending.
      </p>
    </>
  );

  return { filtered, controls, hasQuery: !!query || sport !== "all" };
}

function TournamentOption({
  tournament,
  trailing,
  disabled,
  onClick,
}: {
  tournament: Tournament;
  trailing: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <TournamentChip tournament={tournament} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-white">
            {tournamentName(tournament)}
          </span>
          <span className="block truncate text-xs text-gray-500">
            {sportLabel(tournament.gameType)} · {tournament.tournamentYear || "No year"}
          </span>
        </span>
        {trailing}
      </button>
    </li>
  );
}

export function AddTournamentPicker({
  addedIds,
  onAdd,
  onClose,
}: PickerProps<TournamentItem>) {
  const { catalog, error, retry } = useTrendingTournamentCatalog();
  const { filtered, controls, hasQuery } = useTournamentFilter(catalog);

  return (
    <PickerModal title="Add trending tournament" onClose={onClose} header={controls}>
      {error ? (
        <LoadError message={error} onRetry={retry} />
      ) : catalog === null ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <p className="p-6 text-sm text-gray-400">
          {hasQuery ? "No tournaments match." : "No tournaments can be trending."}
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800">
          {filtered.map((t) => {
            const added = addedIds.has(t._id);
            return (
              <TournamentOption
                key={t._id}
                tournament={t}
                disabled={added}
                onClick={() =>
                  onAdd({
                    id: t._id,
                    name: tournamentName(t),
                    tournament: t,
                    sportsType: t.gameType,
                  })
                }
                trailing={
                  added ? (
                    <span className="shrink-0 text-xs text-gray-500">Added</span>
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-cyan-300" />
                  )
                }
              />
            );
          })}
        </ul>
      )}
    </PickerModal>
  );
}

/** Pick a tournament first, then add teams from it. */
export function AddTeamPicker({ addedIds, onAdd, onClose }: PickerProps<TeamItem>) {
  const { catalog, error, retry } = useTrendingTournamentCatalog();
  const { filtered, controls, hasQuery } = useTournamentFilter(catalog);
  const [selected, setSelected] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<TrendingTeamInfo[] | null>(null);
  const [teamsError, setTeamsError] = useState("");
  const [teamSearch, setTeamSearch] = useState("");

  const loadTeams = useCallback(async (tournament: Tournament) => {
    setTeams(null);
    setTeamsError("");
    try {
      const list = await apiRequest<TrendingTeamInfo[]>(
        teamsUrl(tournament.tournament),
        { method: "GET" },
        "Failed to load teams",
      );
      setTeams(
        (Array.isArray(list) ? list : []).sort((a, b) =>
          teamName(a).localeCompare(teamName(b)),
        ),
      );
    } catch (err) {
      setTeamsError(errorMessage(err, "Failed to load teams"));
    }
  }, []);

  const choose = (tournament: Tournament) => {
    setSelected(tournament);
    setTeamSearch("");
    void loadTeams(tournament);
  };

  if (!selected) {
    return (
      <PickerModal title="Add trending team" onClose={onClose} header={controls}>
        {error ? (
          <LoadError message={error} onRetry={retry} />
        ) : catalog === null ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">
            {hasQuery ? "No tournaments match." : "No tournaments can be trending."}
          </p>
        ) : (
          <>
            <p className="px-6 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Choose the team&apos;s tournament
            </p>
            <ul className="divide-y divide-zinc-800">
              {filtered.map((t) => (
                <TournamentOption
                  key={t._id}
                  tournament={t}
                  onClick={() => choose(t)}
                  trailing={<span className="shrink-0 text-xs text-gray-500">Teams →</span>}
                />
              ))}
            </ul>
          </>
        )}
      </PickerModal>
    );
  }

  const query = teamSearch.trim().toLowerCase();
  const shownTeams = (teams ?? []).filter(
    (t) =>
      !query ||
      [t.name, t.displayName, t.abbreviation].some((f) =>
        f?.toLowerCase().includes(query),
      ),
  );

  return (
    <PickerModal
      title={
        <>
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Back to tournaments"
            className="rounded p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <TournamentChip tournament={selected} />
          <span className="truncate">Add team</span>
        </>
      }
      onClose={onClose}
      header={
        <>
          <input
            type="text"
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value)}
            placeholder="Search teams"
            aria-label="Search teams"
            autoFocus
            className={inputClass}
          />
          <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            {tournamentName(selected)} {selected.tournamentYear}
            <SportBadge sport={selected.gameType} />
          </p>
        </>
      }
    >
      {teamsError ? (
        <LoadError message={teamsError} onRetry={() => void loadTeams(selected)} />
      ) : teams === null ? (
        <Loading />
      ) : shownTeams.length === 0 ? (
        <p className="p-6 text-sm text-gray-400">
          {query ? "No teams match." : "This tournament has no teams."}
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800">
          {shownTeams.map((team) => {
            const added = addedIds.has(team._id);
            return (
              <li key={team._id}>
                <button
                  type="button"
                  disabled={added}
                  onClick={() =>
                    onAdd({
                      id: team._id,
                      name: teamName(team),
                      team,
                      tournament: selected,
                      sportsType: selected.gameType,
                    })
                  }
                  className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <TeamBadge team={team} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">
                      {teamName(team)}
                    </span>
                    {team.abbreviation && (
                      <span className="block truncate text-xs text-gray-500">
                        {team.abbreviation}
                      </span>
                    )}
                  </span>
                  {added ? (
                    <span className="shrink-0 text-xs text-gray-500">Added</span>
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-cyan-300" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </PickerModal>
  );
}
