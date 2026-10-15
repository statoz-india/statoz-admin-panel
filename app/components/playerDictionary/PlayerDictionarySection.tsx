"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil, Plus, Search, Trash2, User } from "lucide-react";
import { Atom } from "react-loading-indicators";
import type { Team } from "@/app/api/tournament/teams/route";
import type { Tournament } from "@/app/models/tournament.model";
import {
  PLAYERS_PAGE_SIZE,
  type PaginatedPlayers,
  type Player,
} from "@/app/models/player.model";
import { apiRequest } from "@/app/utils/apiRequest";
import { getTeamSeasonOptions } from "@/app/utils/team-season-options";
import DeletePlayerDialog from "./DeletePlayerDialog";
import PlayerFormModal from "./PlayerFormModal";

interface Filters {
  tournamentId: string;
  team: string;
  season: string;
  search: string;
}

const INITIAL_FILTERS: Filters = {
  tournamentId: "",
  team: "",
  season: "",
  search: "",
};

const SEARCH_DEBOUNCE_MS = 350;

const FILTER_CONTROL_CLASS =
  "rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50";

/** Oldest season first, so "2025 · Red Bull, 2026 · Red Bull" reads as a career. */
function sortedEntries(player: Player) {
  return [...player.seasonYear].sort((a, b) =>
    a.season.localeCompare(b.season),
  );
}

export default function PlayerDictionarySection() {
  const [data, setData] = useState<PaginatedPlayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filterTeams, setFilterTeams] = useState<Team[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Guards against an older, slower request overwriting a newer one.
  const requestIdRef = useRef(0);
  const filterTeamsRequestRef = useRef(0);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PLAYERS_PAGE_SIZE),
      });
      if (filters.tournamentId)
        params.set("tournamentId", filters.tournamentId);
      if (filters.team) params.set("team", filters.team);
      if (filters.season) params.set("season", filters.season);
      if (filters.search.trim()) params.set("search", filters.search.trim());

      const result = await apiRequest<PaginatedPlayers>(
        `/api/player-dictionary?${params.toString()}`,
        { method: "GET" },
        "Failed to load player-dictionary",
      );
      if (requestIdRef.current !== requestId) return;
      setData(result);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      setError(err instanceof Error ? err.message : "Failed to load players");
      setData(null);
    } finally {
      if (requestIdRef.current === requestId) setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const loadTournaments = useCallback(async () => {
    try {
      const list = await apiRequest<Tournament[]>(
        "/api/tournament/getAllTournamentAndDetails",
        { method: "GET" },
        "Failed to load tournaments",
      );
      setTournaments(Array.isArray(list) ? list : []);
    } catch {
      setTournaments([]);
    }
  }, []);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  // Don't leave a pending search timer behind if the page is left mid-typing.
  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    },
    [],
  );

  const updateFilters = (patch: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const changeTournamentFilter = async (tournamentId: string) => {
    // Teams and seasons are scoped to a tournament, so its old picks go.
    updateFilters({ tournamentId, team: "", season: "" });
    setFilterTeams([]);
    const requestId = ++filterTeamsRequestRef.current;

    const code = tournaments.find((t) => t._id === tournamentId)?.tournament;
    if (!code) return;
    try {
      const list = await apiRequest<Team[]>(
        `/api/tournament/teams?tournament=${encodeURIComponent(code)}`,
        { method: "GET" },
        "Failed to load teams",
      );
      if (filterTeamsRequestRef.current !== requestId) return;
      setFilterTeams(Array.isArray(list) ? list : []);
    } catch {
      if (filterTeamsRequestRef.current !== requestId) return;
      setFilterTeams([]);
    }
  };

  const changeSearch = (value: string) => {
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(
      () => updateFilters({ search: value }),
      SEARCH_DEBOUNCE_MS,
    );
  };

  const clearFilters = () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setSearchInput("");
    setFilterTeams([]);
    filterTeamsRequestRef.current += 1;
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (player: Player) => {
    setEditing(player);
    setIsFormOpen(true);
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setDeleteError("");
  };

  const deletePlayer = async (player: Player) => {
    setDeleteBusy(true);
    setDeleteError("");
    try {
      await apiRequest(
        `/api/player-dictionary/${encodeURIComponent(player._id)}`,
        { method: "DELETE" },
        "Failed to delete the player",
      );
      closeDelete();
      // Deleting the last row of a later page leaves that page empty — step back.
      if (page > 1 && data?.items.length === 1) {
        setPage(page - 1);
      } else {
        await load();
      }
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete the player",
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  const tournamentById = (id: string) =>
    tournaments.find((t) => t._id === id)?.tournament ?? "—";

  const selectedTournamentCode =
    tournaments.find((t) => t._id === filters.tournamentId)?.tournament ?? "";

  const items = data?.items ?? [];
  const hasFilters =
    filters.tournamentId !== "" ||
    filters.team !== "" ||
    filters.season !== "" ||
    filters.search.trim() !== "" ||
    searchInput !== "";

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Player Dictionary</h2>
          <p className="mt-1 text-sm text-gray-400">
            Players (for example F1 drivers) and the teams they’ve played for,
            season by season.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {data
              ? `${data.total} player${data.total === 1 ? "" : "s"}${hasFilters ? " matched" : ""}`
              : " "}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          Add player
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => changeSearch(e.target.value)}
            placeholder="Search by name"
            aria-label="Search players by name"
            className={`${FILTER_CONTROL_CLASS} w-56 pl-9`}
          />
        </div>

        <select
          value={filters.tournamentId}
          onChange={(e) => changeTournamentFilter(e.target.value)}
          aria-label="Filter by tournament"
          className={FILTER_CONTROL_CLASS}
        >
          <option value="">All tournaments</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.tournament}
              {t.tournamentName ? ` — ${t.tournamentName}` : ""}
            </option>
          ))}
        </select>

        <select
          value={filters.team}
          onChange={(e) => updateFilters({ team: e.target.value })}
          disabled={!filters.tournamentId}
          title={
            filters.tournamentId
              ? undefined
              : "Pick a tournament to filter by team"
          }
          aria-label="Filter by team"
          className={FILTER_CONTROL_CLASS}
        >
          <option value="">All teams</option>
          {filterTeams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.displayName || team.name}
            </option>
          ))}
        </select>

        <select
          value={filters.season}
          onChange={(e) => updateFilters({ season: e.target.value })}
          aria-label="Filter by season"
          className={FILTER_CONTROL_CLASS}
        >
          <option value="">All seasons</option>
          {getTeamSeasonOptions(selectedTournamentCode).map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md px-3 py-2 text-sm text-gray-400 underline hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>

      {filters.team && filters.season && (
        <p className="-mt-3 mb-4 text-xs text-gray-500">
          Team and season match the same entry — players who were on that team
          <em> in that season</em>.
        </p>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
          <button
            type="button"
            onClick={() => load()}
            className="ml-3 underline hover:text-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {loading && !data ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      ) : items.length === 0 ? (
        !error && (
          <p className="text-gray-400">
            {hasFilters
              ? "No players match these filters."
              : "No players yet. Click “Add player” to add the first one."}
          </p>
        )
      ) : (
        <div
          className={`overflow-x-auto rounded-md border border-zinc-800 bg-zinc-900/60 transition-opacity ${
            loading ? "opacity-60" : ""
          }`}
        >
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Player</th>
                <th className="px-4 py-3 font-medium">Tournament</th>
                <th className="px-4 py-3 font-medium">Teams by season</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((player) => {
                const image = player.playerImage?.[0];
                return (
                  <tr key={player._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-full bg-zinc-800 object-cover"
                          />
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-gray-500">
                            <User className="h-5 w-5" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-white">
                            {player.playerName}
                          </p>
                          {player.description && (
                            <p className="max-w-xs truncate text-xs text-gray-500">
                              {player.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                      {tournamentById(player.tournamentId)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {sortedEntries(player).map((entry, index) => (
                          <span
                            key={`${entry.season}-${entry.team?._id ?? index}-${index}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-gray-200"
                          >
                            <span className="text-gray-500">
                              {entry.season}
                            </span>
                            {entry.team?.displayName || entry.team?.name || "—"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(player)}
                        aria-label={`Edit ${player.playerName}`}
                        className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(player)}
                        aria-label={`Delete ${player.playerName}`}
                        className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-900/40 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>
            Page {data.page} of {data.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.hasMore || loading}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <PlayerFormModal
          key={editing?._id ?? "new"}
          player={editing}
          tournaments={tournaments}
          onClose={() => setIsFormOpen(false)}
          onSaved={async () => {
            setIsFormOpen(false);
            await load();
          }}
        />
      )}

      {deleteTarget && (
        <DeletePlayerDialog
          player={deleteTarget}
          busy={deleteBusy}
          error={deleteError}
          onCancel={closeDelete}
          onDelete={() => deletePlayer(deleteTarget)}
        />
      )}
    </div>
  );
}
