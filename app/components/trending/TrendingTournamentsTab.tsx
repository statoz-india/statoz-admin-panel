"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { Atom } from "react-loading-indicators";
import { isGameType } from "@/app/constants/game-type";
import type { Tournament } from "@/app/models/tournament.model";
import type {
  TrendingTournamentSection,
  TrendingTournamentTeam,
} from "@/app/models/trending-tournaments.model";
import { ApiRequestError, apiRequest } from "@/app/utils/apiRequest";

const TRENDING_URL = "/api/tournament/trending";
const ALL_TOURNAMENTS_URL = "/api/tournament/getAllTournamentAndDetails";
/** Where a tournament without a sport gets one. */
const UNASSIGNED_TOURNAMENTS_HREF =
  "/?section=teamstournaments&gamesTab=unassigned";
const MAX_TEAM_LOGOS = 8;

/** Tournaments added on this screen have no `teams` until saved and reloaded. */
type DraftTournament = Tournament & { teams?: TrendingTournamentTeam[] };
/** The list being edited, by sport. */
type Draft = Record<string, DraftTournament[]>;

const sportLabel = (sport: string) =>
  sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : "—";

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

function toDraft(sections: TrendingTournamentSection[]): Draft {
  return Object.fromEntries(
    sections.map((section) => [section.sportsType, section.tournamentList]),
  );
}

function fetchTrending() {
  return apiRequest<TrendingTournamentSection[]>(
    TRENDING_URL,
    { method: "GET" },
    "Failed to load trending tournaments",
  );
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, item);
  return next;
}

/** A backend row error (`does not reference …`) as something an admin can act on. */
function describeRowError(detail: string): string {
  if (detail.startsWith("does not reference an existing tournament")) {
    return "This tournament has been deleted. Remove it and save again.";
  }
  if (detail.startsWith("needs a gameType")) {
    return "Its sport isn’t football, cricket, basketball or racing. Set its sport in Teams & Tournaments first.";
  }
  if (detail.startsWith("is listed more than once")) {
    return "Listed more than once. Remove the duplicate.";
  }
  return `Tournament ${detail}`;
}

function TournamentChip({ tournament }: { tournament: Tournament }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded border px-2 py-0.5 font-mono text-xs font-bold"
      style={{
        backgroundColor: tournament.primaryColor || "#27272a",
        borderColor: tournament.secondaryColor || "#3f3f46",
        color: tournament.textColor || "#ffffff",
      }}
    >
      {tournament.tournament}
    </span>
  );
}

function TeamsPreview({ teams }: { teams?: TrendingTournamentTeam[] }) {
  if (!teams) {
    return (
      <span className="text-xs text-gray-500">Teams show after saving</span>
    );
  }
  if (teams.length === 0) {
    return <span className="text-xs text-amber-300">No teams yet</span>;
  }
  const shown = teams.slice(0, MAX_TEAM_LOGOS);
  return (
    <span className="flex flex-wrap items-center gap-1">
      <span className="mr-1 text-xs text-gray-400">
        {teams.length} team{teams.length === 1 ? "" : "s"}
      </span>
      {shown.map((team) => {
        const label = team.displayName || team.name;
        return team.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={team._id}
            src={team.logo}
            alt={label}
            title={label}
            className="h-5 w-5 rounded-full bg-zinc-800 object-contain"
          />
        ) : (
          <span
            key={team._id}
            title={label}
            className="rounded bg-zinc-800 px-1 text-[10px] font-semibold text-gray-300"
          >
            {team.abbreviation || label.slice(0, 3).toUpperCase()}
          </span>
        );
      })}
      {teams.length > shown.length && (
        <span className="text-xs text-gray-500">
          +{teams.length - shown.length}
        </span>
      )}
    </span>
  );
}

function TournamentRow({
  item,
  index,
  total,
  errors,
  dragging,
  disabled,
  onDragStart,
  onDrop,
  onDragEnd,
  onMove,
  onRemove,
}: {
  item: DraftTournament;
  index: number;
  total: number;
  errors?: string[];
  dragging: boolean;
  disabled: boolean;
  onDragStart: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  const name = item.tournamentName || item.tournament;
  return (
    <li
      draggable={!disabled}
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      className={`px-4 py-3 ${dragging ? "bg-zinc-800/80" : ""} ${
        errors?.length ? "bg-red-950/30" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <GripVertical
          className="h-4 w-4 shrink-0 cursor-grab text-gray-600"
          aria-hidden
        />
        <span className="w-6 shrink-0 text-sm font-semibold text-gray-500">
          {index + 1}
        </span>
        <TournamentChip tournament={item} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {name}
            {item.tournamentYear && (
              <span className="ml-2 text-gray-500">{item.tournamentYear}</span>
            )}
          </p>
          <div className="mt-1">
            <TeamsPreview teams={item.teams} />
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onMove(index - 1)}
            disabled={index === 0 || disabled}
            aria-label={`Move ${name} up`}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index + 1)}
            disabled={index === total - 1 || disabled}
            aria-label={`Move ${name} down`}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${name}`}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-900/40 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {errors?.map((message) => (
        <p key={message} className="mt-2 pl-17 text-xs text-red-300">
          {message}
        </p>
      ))}
    </li>
  );
}

function PickerRow({
  tournament,
  status,
  onAdd,
}: {
  tournament: Tournament;
  status: "available" | "added" | "noSport";
  onAdd?: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        disabled={status !== "available"}
        onClick={onAdd}
        className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <TournamentChip tournament={tournament} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-white">
            {tournament.tournamentName || tournament.tournament}
          </span>
          <span className="block truncate text-xs text-gray-500">
            {tournament.tournamentYear || "No year"}
          </span>
        </span>
        {status === "added" ? (
          <span className="shrink-0 text-xs text-gray-500">Added</span>
        ) : status === "noSport" ? (
          <span className="shrink-0 text-xs text-amber-300">No sport set</span>
        ) : (
          <Plus className="h-4 w-4 shrink-0 text-cyan-300" />
        )}
      </button>
    </li>
  );
}

function AddTournamentModal({
  sport,
  icon,
  catalog,
  catalogError,
  onRetry,
  addedIds,
  onAdd,
  onClose,
}: {
  sport: string;
  icon: string;
  /** `null` while loading. */
  catalog: Tournament[] | null;
  catalogError: string;
  onRetry: () => void;
  addedIds: Set<string>;
  onAdd: (tournament: Tournament) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const { available, noSport, noSportCount } = useMemo(() => {
    const matches = (t: Tournament) =>
      !query ||
      [t.tournament, t.tournamentName, t.tournamentYear].some((field) =>
        field?.toLowerCase().includes(query),
      );
    const newestFirst = (a: Tournament, b: Tournament) =>
      (b.tournamentYear ?? "").localeCompare(a.tournamentYear ?? "") ||
      (a.tournamentName ?? "").localeCompare(b.tournamentName ?? "");
    const all = catalog ?? [];
    // No sport, or one that isn't a sport (e.g. "trending"): can't be trending.
    const withoutSport = all.filter((t) => !isGameType(t.gameType));
    return {
      available: all
        .filter((t) => t.gameType === sport && matches(t))
        .sort(newestFirst),
      // Only listed while searching, to explain a missing tournament.
      noSport: query ? withoutSport.filter(matches).sort(newestFirst) : [],
      noSportCount: withoutSport.length,
    };
  }, [catalog, query, sport]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="material-icons text-cyan-300" aria-hidden>
              {icon}
            </span>
            Add {sportLabel(sport)} tournament
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

        <div className="border-b border-zinc-800 p-6 pb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name or year"
            aria-label="Search tournaments"
            autoFocus
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Only tournaments whose sport is {sportLabel(sport)} are listed.
          </p>
        </div>

        <div className="min-h-[30vh] flex-1 overflow-y-auto">
          {catalogError ? (
            <p className="p-6 text-sm text-red-300">
              {catalogError}{" "}
              <button
                type="button"
                onClick={onRetry}
                className="underline hover:text-red-200"
              >
                Retry
              </button>
            </p>
          ) : catalog === null ? (
            <div className="flex min-h-[30vh] items-center justify-center">
              <Atom color="#5CDFFF" size="small" text="" textColor="" />
            </div>
          ) : (
            <>
              {available.length === 0 ? (
                <p className="p-6 text-sm text-gray-400">
                  {query
                    ? `No ${sportLabel(sport)} tournaments match that search.`
                    : `No tournaments have ${sportLabel(sport)} as their sport.`}
                </p>
              ) : (
                <ul className="divide-y divide-zinc-800">
                  {available.map((t) => (
                    <PickerRow
                      key={t._id}
                      tournament={t}
                      status={addedIds.has(t._id) ? "added" : "available"}
                      onAdd={() => onAdd(t)}
                    />
                  ))}
                </ul>
              )}

              {noSport.length > 0 && (
                <>
                  <p className="border-t border-zinc-800 px-6 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    No sport set, so these can’t be trending
                  </p>
                  <ul className="divide-y divide-zinc-800">
                    {noSport.map((t) => (
                      <PickerRow key={t._id} tournament={t} status="noSport" />
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>

        {catalog !== null && noSportCount > 0 && (
          <p className="border-t border-zinc-800 px-6 py-3 text-xs text-gray-500">
            {noSportCount} tournament{noSportCount === 1 ? " has" : "s have"} no
            sport set and can’t be trending until one is set.{" "}
            <a
              href={UNASSIGNED_TOURNAMENTS_HREF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            >
              Set sports in Teams & Tournaments
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Edits the trending tournaments the app shows, one list per sport. Changes
 * stay on screen until Save, which replaces the whole list (every sport) with
 * `PUT /tournament/trending`; the list is then reloaded so names and teams
 * come from the server.
 */
export default function TrendingTournamentsTab() {
  const [sections, setSections] = useState<TrendingTournamentSection[]>([]);
  const [draft, setDraft] = useState<Draft>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);
  // Save errors by tournament `_id`.
  const [rowErrors, setRowErrors] = useState<Record<string, string[]>>({});
  const [notice, setNotice] = useState("");
  const [drag, setDrag] = useState<{ sport: string; index: number } | null>(
    null,
  );
  const [pickerSport, setPickerSport] = useState<string | null>(null);
  // Every tournament, for the picker; loaded when it first opens.
  const [catalog, setCatalog] = useState<Tournament[] | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchTrending()
      .then((next) => {
        if (cancelled) return;
        setSections(next);
        setDraft(toDraft(next));
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(errorMessage(err, "Failed to load trending tournaments"));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = async () => {
    setLoading(true);
    setLoadError("");
    setSaveErrors([]);
    setRowErrors({});
    setNotice("");
    try {
      const next = await fetchTrending();
      setSections(next);
      setDraft(toDraft(next));
    } catch (err) {
      setLoadError(errorMessage(err, "Failed to load trending tournaments"));
    } finally {
      setLoading(false);
    }
  };

  const loadCatalog = async () => {
    if (catalogLoading) return;
    setCatalogLoading(true);
    setCatalogError("");
    try {
      const list = await apiRequest<Tournament[]>(
        ALL_TOURNAMENTS_URL,
        { method: "GET" },
        "Failed to load tournaments",
      );
      setCatalog(Array.isArray(list) ? list : []);
    } catch (err) {
      setCatalogError(errorMessage(err, "Failed to load tournaments"));
    } finally {
      setCatalogLoading(false);
    }
  };

  const openPicker = (sport: string) => {
    setPickerSport(sport);
    if (catalog === null) void loadCatalog();
  };

  const isDirty = sections.some((section) => {
    const saved = section.tournamentList;
    const current = draft[section.sportsType] ?? [];
    return (
      saved.length !== current.length ||
      saved.some((t, i) => t._id !== current[i]?._id)
    );
  });

  const addedIds = useMemo(
    () =>
      new Set(
        Object.values(draft)
          .flat()
          .map((t) => t._id),
      ),
    [draft],
  );
  const totalCount = addedIds.size;

  const editSport = (
    sport: string,
    change: (list: DraftTournament[]) => DraftTournament[],
  ) => {
    setDraft((current) => ({ ...current, [sport]: change(current[sport] ?? []) }));
    setNotice("");
  };

  const reset = () => {
    setDraft(toDraft(sections));
    setSaveErrors([]);
    setRowErrors({});
    setNotice("");
  };

  const showSaveError = (err: unknown, sent: DraftTournament[]) => {
    if (err instanceof ApiRequestError && err.status === 409) {
      setSaveErrors([
        "Another save ran at the same moment, so the saved list may be a mix of both. Reload, check the list and save again.",
      ]);
      return;
    }

    const general: string[] = [];
    const byRow: Record<string, string[]> = {};
    const messages =
      err instanceof ApiRequestError && err.errors.length > 0
        ? err.errors
        : [errorMessage(err, "Failed to save trending tournaments")];
    for (const message of messages) {
      // `[n]` is the tournament's position in the list that was sent.
      const match = /^trendingTournaments\[(\d+)\]\.tournament\s+(.*)$/.exec(
        message,
      );
      const row = match ? sent[Number(match[1])] : undefined;
      if (match && row) {
        (byRow[row._id] ??= []).push(describeRowError(match[2]));
      } else {
        general.push(message);
      }
    }
    if (Object.keys(byRow).length > 0) {
      general.unshift(
        "Nothing was saved. Fix the tournaments marked below and save again.",
      );
    }
    setSaveErrors(general);
    setRowErrors(byRow);
  };

  const save = async () => {
    // Each sport's list in order; the order across sports doesn't matter.
    const sent = sections.flatMap((s) => draft[s.sportsType] ?? []);
    setSaving(true);
    setSaveErrors([]);
    setRowErrors({});
    setNotice("");
    try {
      await apiRequest(
        TRENDING_URL,
        {
          method: "PUT",
          body: JSON.stringify({
            trendingTournaments: sent.map((t) => ({ tournament: t._id })),
          }),
        },
        "Failed to save trending tournaments",
      );
    } catch (err) {
      showSaveError(err, sent);
      setSaving(false);
      return;
    }

    try {
      const next = await fetchTrending();
      setSections(next);
      setDraft(toDraft(next));
      setNotice(
        sent.length === 0
          ? "Saved. No tournament is trending now."
          : "Trending tournaments saved.",
      );
    } catch (err) {
      setSaveErrors([
        `Saved, but reloading the list failed: ${errorMessage(err, "unknown error")}. Reload to see the saved list.`,
      ]);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {loadError}
        <button
          type="button"
          onClick={reload}
          className="ml-3 underline hover:text-red-200"
        >
          Reload
        </button>
      </div>
    );
  }

  const pickerSection = sections.find((s) => s.sportsType === pickerSport);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="max-w-2xl text-gray-400">
            Tournaments the app shows as trending, grouped by sport. Drag a row
            or use the arrows to reorder within a sport. Saving replaces the
            whole list for every sport, so the last save wins.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {totalCount} tournament{totalCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={reset}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!isDirty || saving}
            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save list"}
          </button>
        </div>
      </div>

      {saveErrors.length > 0 && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {saveErrors.map((message) => (
            <p key={message}>{message}</p>
          ))}
          <button
            type="button"
            onClick={reload}
            disabled={saving}
            className="mt-2 underline hover:text-red-200 disabled:opacity-50"
          >
            Reload (discards unsaved changes)
          </button>
        </div>
      )}

      {notice && (
        <div className="mb-4 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      {isDirty && (
        <p className="mb-4 text-sm text-amber-300">Unsaved changes.</p>
      )}

      <div className="grid gap-6">
        {sections.map((section) => {
          const sport = section.sportsType;
          const list = draft[sport] ?? [];
          return (
            <div
              key={sport}
              className="rounded-md border border-zinc-800 bg-zinc-900/60"
            >
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <span className="material-icons text-cyan-300" aria-hidden>
                    {section.icon}
                  </span>
                  {sportLabel(sport)}
                  <span className="text-sm font-normal text-gray-500">
                    ({list.length})
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => openPicker(sport)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-white transition-colors hover:border-zinc-500 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Add tournament
                </button>
              </div>

              {list.length === 0 ? (
                <p className="px-4 py-4 text-sm text-gray-500">
                  Nothing trending for {sportLabel(sport)}.
                </p>
              ) : (
                <ul className="divide-y divide-zinc-800">
                  {list.map((item, index) => (
                    <TournamentRow
                      key={item._id}
                      item={item}
                      index={index}
                      total={list.length}
                      errors={rowErrors[item._id]}
                      dragging={drag?.sport === sport && drag.index === index}
                      disabled={saving}
                      onDragStart={() => setDrag({ sport, index })}
                      onDrop={() => {
                        // Rows only move within their own sport.
                        if (drag?.sport === sport) {
                          editSport(sport, (l) => moveItem(l, drag.index, index));
                        }
                        setDrag(null);
                      }}
                      onDragEnd={() => setDrag(null)}
                      onMove={(to) =>
                        editSport(sport, (l) => moveItem(l, index, to))
                      }
                      onRemove={() =>
                        editSport(sport, (l) => l.filter((_, i) => i !== index))
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {pickerSport && pickerSection && (
        <AddTournamentModal
          sport={pickerSport}
          icon={pickerSection.icon}
          catalog={catalog}
          catalogError={catalogError}
          onRetry={loadCatalog}
          addedIds={addedIds}
          onAdd={(tournament) => {
            if (addedIds.has(tournament._id)) return;
            // Stays open so several can be added in one go.
            editSport(pickerSport, (l) => [...l, tournament]);
          }}
          onClose={() => setPickerSport(null)}
        />
      )}
    </div>
  );
}
