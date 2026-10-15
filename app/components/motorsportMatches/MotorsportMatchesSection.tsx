"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Atom } from "react-loading-indicators";
import type { Tournament } from "@/app/models/tournament.model";
import {
  MOTORSPORT_MATCH_STATUSES,
  MOTORSPORT_MATCHES_PAGE_SIZE,
  type MotorsportMatch,
  type MotorsportMatchStatus,
  type PaginatedMotorsportMatches,
  type UpdateMotorsportMatchPayload,
} from "@/app/models/motorsport-match.model";
import { Section } from "@/app/utils/enums/section.enum";
import DeleteRaceDialog from "./DeleteRaceDialog";
import MotorsportMatchCard from "./MotorsportMatchCard";
import MotorsportMatchFormModal from "./MotorsportMatchFormModal";

type Visibility = "all" | "visible" | "hidden";

interface Filters {
  tournament: string;
  seasonYear: string;
  matchStatus: "" | MotorsportMatchStatus;
  /** "all" omits `isVisible` so hidden races come back too — what admins want. */
  visibility: Visibility;
}

const INITIAL_FILTERS: Filters = {
  tournament: "",
  seasonYear: "",
  matchStatus: "",
  visibility: "all",
};

const FILTER_CONTROL_CLASS =
  "rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500";

/** Calls this app's API and unwraps `{ success, data, message }`. */
async function apiRequest<T>(
  url: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body?.success) {
    throw new Error(body?.message || fallbackMessage);
  }
  return body.data as T;
}

async function fetchTournamentList(url: string): Promise<Tournament[]> {
  const data = await apiRequest<Tournament[]>(
    url,
    { method: "GET" },
    "Failed to load tournaments",
  );
  return Array.isArray(data) ? data : [];
}

export default function MotorsportMatchesSection() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedMotorsportMatches | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentHint, setTournamentHint] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<MotorsportMatch | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<MotorsportMatch | null>(
    null,
  );
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Guards against an older, slower request overwriting a newer one.
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(MOTORSPORT_MATCHES_PAGE_SIZE),
      });
      if (filters.tournament) params.set("tournament", filters.tournament);
      if (filters.seasonYear.trim()) {
        params.set("seasonYear", filters.seasonYear.trim());
      }
      if (filters.matchStatus) params.set("matchStatus", filters.matchStatus);
      if (filters.visibility !== "all") {
        params.set("isVisible", String(filters.visibility === "visible"));
      }

      const result = await apiRequest<PaginatedMotorsportMatches>(
        `/api/match/motorsport?${params.toString()}`,
        { method: "GET" },
        "Failed to load motorsport matches",
      );
      if (requestIdRef.current !== requestId) return;
      setData(result);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      setError(
        err instanceof Error ? err.message : "Failed to load motorsport matches",
      );
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
      // Prefer tournaments already set to the racing game type; fall back to
      // all of them if none are, so a race can still be created.
      const racing = await fetchTournamentList(
        "/api/games/racing/tournaments",
      );
      if (racing.length > 0) {
        setTournaments(racing);
        setTournamentHint("");
        return;
      }
      setTournaments(
        await fetchTournamentList("/api/tournament/getAllTournamentAndDetails"),
      );
      setTournamentHint(
        "No tournament is set to the racing game type yet, so all tournaments are listed.",
      );
    } catch {
      setTournaments([]);
      setTournamentHint("Couldn’t load tournaments.");
    }
  }, []);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  const updateFilters = (patch: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const patchRace = async (
    race: MotorsportMatch,
    patch: UpdateMotorsportMatchPayload,
  ) => {
    const updated = await apiRequest<MotorsportMatch>(
      `/api/match/motorsport/${encodeURIComponent(race._id)}`,
      { method: "PATCH", body: JSON.stringify(patch) },
      "Failed to update the race",
    );
    setData((current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              item._id === updated._id ? updated : item,
            ),
          }
        : current,
    );
  };

  /** Quick, in-place changes from the table (status, visibility). */
  const runRowAction = async (
    race: MotorsportMatch,
    action: () => Promise<void>,
  ) => {
    setBusyId(race._id);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update the race");
    } finally {
      setBusyId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (race: MotorsportMatch) => {
    setEditing(race);
    setIsFormOpen(true);
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setDeleteError("");
  };

  /** Runs one of the dialog's actions, closing it on success. */
  const runDeleteAction = async (action: () => Promise<void>) => {
    setDeleteBusy(true);
    setDeleteError("");
    try {
      await action();
      closeDelete();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  const deleteRace = async (race: MotorsportMatch) => {
    await apiRequest(
      `/api/match/motorsport/${encodeURIComponent(race._id)}`,
      { method: "DELETE" },
      "Failed to delete the race",
    );
    // Deleting the last row of a later page leaves that page empty — step back.
    if (page > 1 && data?.items.length === 1) {
      setPage(page - 1);
    } else {
      await load();
    }
  };

  const items = data?.items ?? [];
  const hasFilters =
    filters.tournament !== "" ||
    filters.seasonYear.trim() !== "" ||
    filters.matchStatus !== "" ||
    filters.visibility !== "all";

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Motorsport Matches</h2>
          <p className="mt-1 text-sm text-gray-400">
            Racing fixtures, separate from regular matches. A race’s status is
            set by hand as the weekend goes on.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {data
              ? `${data.total} race${data.total === 1 ? "" : "s"}${hasFilters ? " matched" : ""}`
              : " "}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          Create race
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={filters.tournament}
          onChange={(e) => updateFilters({ tournament: e.target.value })}
          aria-label="Filter by tournament"
          className={FILTER_CONTROL_CLASS}
        >
          <option value="">All tournaments</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t.tournament}>
              {t.tournament}
              {t.tournamentName ? ` — ${t.tournamentName}` : ""}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={filters.seasonYear}
          onChange={(e) => updateFilters({ seasonYear: e.target.value })}
          placeholder="Season, e.g. 2026"
          aria-label="Filter by season year"
          className={`${FILTER_CONTROL_CLASS} w-40`}
        />

        <select
          value={filters.matchStatus}
          onChange={(e) =>
            updateFilters({
              matchStatus: e.target.value as "" | MotorsportMatchStatus,
            })
          }
          aria-label="Filter by status"
          className={FILTER_CONTROL_CLASS}
        >
          <option value="">All statuses</option>
          {MOTORSPORT_MATCH_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filters.visibility}
          onChange={(e) =>
            updateFilters({ visibility: e.target.value as Visibility })
          }
          aria-label="Filter by visibility"
          className={FILTER_CONTROL_CLASS}
        >
          <option value="all">Visible and hidden</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setFilters(INITIAL_FILTERS);
              setPage(1);
            }}
            className="rounded-md px-3 py-2 text-sm text-gray-400 underline hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>

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
              ? "No races match these filters."
              : "No races yet. Click “Create race” to add the first one."}
          </p>
        )
      ) : (
        <div
          className={`grid gap-6 transition-opacity ${
            loading ? "opacity-60" : ""
          }`}
        >
          {items.map((race) => (
            <MotorsportMatchCard
              key={race._id}
              race={race}
              tournament={tournaments.find((t) => t.tournament === race.tournament)}
              busy={busyId === race._id}
              onChangeStatus={(matchStatus) =>
                runRowAction(race, () => patchRace(race, { matchStatus }))
              }
              onToggleVisible={() =>
                runRowAction(race, () =>
                  patchRace(race, { isVisible: !race.isVisible }),
                )
              }
              onEdit={() => openEdit(race)}
              onDelete={() => setDeleteTarget(race)}
              onOpen={() =>
                router.push(
                  `/motorsport/${encodeURIComponent(race._id)}?from=${Section.MOTORSPORT_MATCHES}`,
                )
              }
            />
          ))}
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
        <MotorsportMatchFormModal
          key={editing?._id ?? "new"}
          match={editing}
          tournaments={tournaments}
          tournamentHint={tournamentHint}
          onClose={() => setIsFormOpen(false)}
          onSaved={async () => {
            setIsFormOpen(false);
            await load();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteRaceDialog
          match={deleteTarget}
          busy={deleteBusy}
          error={deleteError}
          onCancel={closeDelete}
          onHide={() =>
            runDeleteAction(() =>
              patchRace(deleteTarget, { isVisible: false }),
            )
          }
          onMarkCancelled={() =>
            runDeleteAction(() =>
              patchRace(deleteTarget, { matchStatus: "Cancelled" }),
            )
          }
          onDelete={() => runDeleteAction(() => deleteRace(deleteTarget))}
        />
      )}
    </div>
  );
}
