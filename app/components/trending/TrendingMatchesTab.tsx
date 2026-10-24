"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Atom } from "react-loading-indicators";
import {
  TRENDING_TYPE_LABELS,
  TRENDING_TYPE_OPTIONS,
  TRENDING_TYPE_PLURAL_LABELS,
  type TrendingDisplayRecord,
  type TrendingItem,
  type TrendingQuizRace,
  type TrendingType,
} from "@/app/models/trending.model";
import type { Tournament } from "@/app/models/tournament.model";
import { formatIst } from "@/app/components/motorsportMatches/motorsportHelpers";

const TRENDING_URL = "/api/trending";
const TOURNAMENTS_URL = "/api/tournament/getAllTournamentAndDetails";

/** The "add item" picker sources candidates from the same lists the app's
 * home screen shows — items that are currently visible/active and not
 * outdated — rather than the entire history of every prediction/future/event/quiz/match.
 * Races have no home-page list, so they come from the race list filtered to
 * visible races that are still to run or running; each URL's results are merged. */
const POOL_URLS: Record<TrendingType, string[]> = {
  prediction: ["/api/predictions/home-page"],
  future: ["/api/futures/home-page"],
  event: ["/api/events/home-page"],
  quiz: ["/api/quiz/home-page"],
  match: ["/api/match/home-page"],
  motorsportMatch: [
    "/api/match/motorsport?isVisible=true&matchStatus=Upcoming&limit=100",
    "/api/match/motorsport?isVisible=true&matchStatus=Ongoing&limit=100",
  ],
  // No endpoint lists every motorsport quiz: the picker lists races first,
  // then the chosen race's quizzes (`raceQuizzesUrl`).
  motorsportQuiz: [
    "/api/match/motorsport?isVisible=true&matchStatus=Upcoming&limit=100",
    "/api/match/motorsport?isVisible=true&matchStatus=Ongoing&limit=100",
  ],
};

/** A race's visible quizzes; a race without any is an empty list. */
function raceQuizzesUrl(raceId: string) {
  return `/api/quiz/motorsport/race/${encodeURIComponent(raceId)}`;
}

type PoolRecord = TrendingDisplayRecord;

/** Tournament Mongo id → tournament code (e.g. "IPL"). */
type TournamentNames = Map<string, string>;

/** One row in the editable list — the full record is kept for display. */
interface DraftItem {
  key: string;
  type: TrendingType;
  data: PoolRecord;
}

function draftKey(type: TrendingType, id: string) {
  return `${type}:${id}`;
}

function toDraftItems(items: TrendingItem[]): DraftItem[] {
  return items.map((item) => ({
    key: draftKey(item.type, item.data._id),
    type: item.type,
    data: item.data,
  }));
}

/** Row index named in a backend validation message (`trendingMatches[3].data …`). */
export function errorRowIndex(message: string): number | null {
  const match = /trendingMatches\[(\d+)\]/.exec(message);
  return match ? Number(match[1]) : null;
}

function teamLabel(team: PoolRecord["teamA"]): string {
  if (!team) return "Team";
  if (typeof team === "string") return team;
  return team.displayName || team.name || "Team";
}

/** Events and futures store the tournament's Mongo id rather than its code,
 * so resolve it to a readable name where we can. */
function tournamentLabel(
  data: PoolRecord,
  tournamentNames: TournamentNames,
): string {
  if (data.tournamentData?.tournament) return data.tournamentData.tournament;
  if (!data.tournament) return "";
  return tournamentNames.get(data.tournament) ?? data.tournament;
}

/** The race a motorsport quiz embeds, when it came populated. */
function quizRace(data: PoolRecord): TrendingQuizRace | null {
  return data.match && typeof data.match === "object" ? data.match : null;
}

/** True when the query matches either team's name, the race name or the tournament. */
function matchesSearch(
  data: PoolRecord,
  query: string,
  tournamentNames: TournamentNames,
): boolean {
  const race = quizRace(data);
  const haystack = [
    data.teamA ? teamLabel(data.teamA) : "",
    data.teamB ? teamLabel(data.teamB) : "",
    data.name ?? "",
    race?.name ?? "",
    race?.tournament ?? "",
    data.quizId ?? "",
    tournamentLabel(data, tournamentNames),
  ];
  return haystack.some((value) => value.toLowerCase().includes(query));
}

/** Human-readable title/subtitle for any of the six source record shapes —
 * works whether `data` came fully populated (`GET /trending`) or from a
 * leaner home-page list (the "add item" picker). */
function describeRecord(
  type: TrendingType,
  data: PoolRecord,
  tournamentNames: TournamentNames,
): { title: string; subtitle: string } {
  const tournament = tournamentLabel(data, tournamentNames);
  if (type === "motorsportQuiz") {
    // Titled by the race; `tournament` is an id, the code is on the race.
    const race = quizRace(data);
    const startTime = data.raceStartTime ?? race?.raceStartTime;
    return {
      title: race?.name || "Untitled race",
      subtitle:
        [
          data.quizId,
          race?.tournament || tournament,
          data.quizStatus,
          typeof data.questionCount === "number"
            ? `${data.questionCount} question${data.questionCount === 1 ? "" : "s"}`
            : "",
          startTime ? formatIst(startTime) : "",
        ]
          .filter(Boolean)
          .join(" · ") || "—",
    };
  }
  if (type === "motorsportMatch") {
    // Races have no teams; statuses are capitalised (`Upcoming`, `Finished`…).
    return {
      title: data.name || "Untitled race",
      subtitle:
        [
          tournament,
          data.seasonYear,
          data.matchStatus,
          data.raceStartTime ? formatIst(data.raceStartTime) : "",
        ]
          .filter(Boolean)
          .join(" · ") || "—",
    };
  }
  if (type === "prediction" || type === "quiz" || type === "match") {
    const status =
      type === "prediction"
        ? data.predictionStatus
        : type === "quiz"
          ? data.quizStatus
          : data.matchStatus;
    return {
      title: `${teamLabel(data.teamA)} vs ${teamLabel(data.teamB)}`,
      subtitle:
        [
          tournament,
          status,
          data.matchStartTime ? formatIst(data.matchStartTime) : "",
        ]
          .filter(Boolean)
          .join(" · ") || "—",
    };
  }

  const status = type === "future" ? data.futureStatus : data.eventStatus;
  const closes =
    type === "event" && data.entryCloseTime
      ? `Closes ${formatIst(data.entryCloseTime)}`
      : "";
  return {
    title: data.eventName || "Untitled",
    subtitle: [tournament, status, closes].filter(Boolean).join(" · ") || "—",
  };
}

/** Pulls the array out of this app's two list-response envelopes. */
function unwrapList<T>(body: unknown): T[] {
  if (!body || typeof body !== "object") return [];
  const data = (body as { data?: unknown }).data;
  if (Array.isArray(data)) return data as T[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { items?: unknown }).items)
  ) {
    return (data as { items: T[] }).items;
  }
  return [];
}

async function fetchPool(
  type: TrendingType,
  urls: string[] = POOL_URLS[type],
): Promise<PoolRecord[]> {
  const lists = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.success === false) {
        throw new Error(
          body?.message ||
            `Failed to load ${TRENDING_TYPE_PLURAL_LABELS[type]} list`,
        );
      }
      return unwrapList<PoolRecord>(body);
    }),
  );
  return lists.flat();
}

async function fetchTournamentNames(): Promise<TournamentNames> {
  const res = await fetch(TOURNAMENTS_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) return new Map();
  const list = Array.isArray(body?.data?.data)
    ? body.data.data
    : unwrapList<Tournament>(body);
  return new Map(
    (list as Tournament[]).map((t) => [t._id, t.tournament] as const),
  );
}

type TeamLike = {
  name?: string;
  displayName?: string;
  abbreviation?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
};

/** Full-card muted tint — prediction (teal) vs match (indigo) stay distinct. */
const TYPE_CARD_THEME: Record<
  TrendingType,
  { border: string; bg: string; hover: string; badge: string }
> = {
  prediction: {
    border: "border-teal-900/45",
    bg: "bg-teal-950/35",
    hover: "hover:bg-teal-950/45",
    badge: "border-teal-900/70 bg-teal-950/50 text-teal-300/90",
  },
  future: {
    border: "border-sky-900/45",
    bg: "bg-sky-950/30",
    hover: "hover:bg-sky-950/40",
    badge: "border-sky-900/70 bg-sky-950/50 text-sky-300/85",
  },
  event: {
    border: "border-fuchsia-900/45",
    bg: "bg-fuchsia-950/30",
    hover: "hover:bg-fuchsia-950/40",
    badge: "border-fuchsia-900/70 bg-fuchsia-950/50 text-fuchsia-300/85",
  },
  quiz: {
    border: "border-amber-900/45",
    bg: "bg-amber-950/28",
    hover: "hover:bg-amber-950/38",
    badge: "border-amber-900/70 bg-amber-950/50 text-amber-300/85",
  },
  match: {
    border: "border-indigo-900/45",
    bg: "bg-indigo-950/35",
    hover: "hover:bg-indigo-950/45",
    badge: "border-indigo-900/70 bg-indigo-950/50 text-indigo-300/90",
  },
  motorsportMatch: {
    border: "border-rose-900/45",
    bg: "bg-rose-950/30",
    hover: "hover:bg-rose-950/40",
    badge: "border-rose-900/70 bg-rose-950/50 text-rose-300/85",
  },
  motorsportQuiz: {
    border: "border-orange-900/45",
    bg: "bg-orange-950/28",
    hover: "hover:bg-orange-950/38",
    badge: "border-orange-900/70 bg-orange-950/50 text-orange-300/80",
  },
};

function asTeam(value: PoolRecord["teamA"]): TeamLike | null {
  if (!value || typeof value === "string") return null;
  return value;
}

function teamMarkLabel(team: TeamLike): string {
  return (
    team.abbreviation?.trim() ||
    team.displayName?.trim()?.slice(0, 3) ||
    team.name?.trim()?.slice(0, 3) ||
    "?"
  );
}

function TeamMark({ team }: { team: TeamLike }) {
  const label = teamMarkLabel(team);
  if (team.logo?.trim()) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={team.logo}
        alt={team.displayName || team.name || label}
        className="h-11 w-11 shrink-0 rounded-full bg-zinc-900/80 object-contain ring-1 ring-white/10"
      />
    );
  }
  return (
    <span
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ring-white/10"
      style={{
        backgroundColor: team.primaryColor || "#3f3f46",
        color: team.textColor || "#ffffff",
      }}
      title={team.displayName || team.name}
    >
      {label}
    </span>
  );
}

function TournamentMark({ code }: { code: string }) {
  const label = code.trim() || "?";
  return (
    <span
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full px-1 text-center font-bold ring-1 ring-white/15 ${
        label.length > 4 ? "text-[9px] leading-tight" : "text-sm"
      }`}
      style={{
        backgroundColor: "#3f3f46",
        color: "#ffffff",
      }}
      title={label}
    >
      {label}
    </span>
  );
}

function CoverMark({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  if (src?.trim()) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="h-12 w-12 shrink-0 rounded-lg bg-zinc-900/80 object-cover ring-1 ring-white/10"
      />
    );
  }
  return (
    <span
      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-200 ring-1 ring-white/10"
      aria-hidden
    >
      {fallback.slice(0, 2).toUpperCase()}
    </span>
  );
}

function TrendingItemVisual({
  type,
  data,
  tournamentNames,
}: {
  type: TrendingType;
  data: PoolRecord;
  tournamentNames: TournamentNames;
}) {
  if (type === "motorsportMatch") {
    const code = data.tournament?.trim() || "RACE";
    return (
      <div className="flex justify-center py-1">
        <TournamentMark code={code} />
      </div>
    );
  }

  if (type === "motorsportQuiz") {
    const race = quizRace(data);
    const code =
      race?.tournament?.trim() ||
      tournamentLabel(data, tournamentNames) ||
      "F1";
    return (
      <div className="flex justify-center py-1">
        <TournamentMark code={code} />
      </div>
    );
  }

  if (type === "prediction" || type === "quiz" || type === "match") {
    const teamA = asTeam(data.teamA);
    const teamB = asTeam(data.teamB);
    if (teamA && teamB) {
      return (
        <div className="flex items-center justify-center gap-3 py-1">
          <TeamMark team={teamA} />
          <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            vs
          </span>
          <TeamMark team={teamB} />
        </div>
      );
    }
    const lone = teamA ?? teamB;
    if (lone) {
      return (
        <div className="flex justify-center py-1">
          <TeamMark team={lone} />
        </div>
      );
    }
  }

  if (type === "event" || type === "future") {
    const title = data.eventName || "Event";
    return (
      <div className="flex justify-center py-1">
        <CoverMark
          src={data.eventImage}
          alt={title}
          fallback={title}
        />
      </div>
    );
  }

  return null;
}

function TypeBadge({ type }: { type: TrendingType }) {
  const theme = TYPE_CARD_THEME[type];
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${theme.badge}`}
    >
      {TRENDING_TYPE_LABELS[type]}
    </span>
  );
}

function TrendingRow({
  item,
  index,
  onRemove,
  disabled,
  rowError,
  tournamentNames,
}: {
  item: DraftItem;
  index: number;
  onRemove: () => void;
  disabled: boolean;
  /** The save failed on this row; the message is shown under it. */
  rowError: string | null;
  tournamentNames: TournamentNames;
}) {
  const { title, subtitle } = describeRecord(
    item.type,
    item.data,
    tournamentNames,
  );
  const hidden = item.data.isVisible === false;
  const finishedRace =
    item.type === "motorsportMatch" &&
    (item.data.matchStatus === "Finished" ||
      item.data.matchStatus === "Cancelled");
  const theme = TYPE_CARD_THEME[item.type];

  return (
    <li className="h-full">
      <article
        className={`flex h-full flex-col rounded-lg border p-4 transition-colors ${
          rowError
            ? "border-red-800/50 bg-red-950/25"
            : `${theme.border} ${theme.bg} ${theme.hover}`
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="text-xs font-medium tabular-nums text-zinc-400">
            #{index + 1}
          </span>
          <TypeBadge type={item.type} />
        </div>

        <TrendingItemVisual
          type={item.type}
          data={item.data}
          tournamentNames={tournamentNames}
        />

        <h3 className="truncate text-center text-sm font-semibold text-white">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-center text-xs text-zinc-400/90">
          {subtitle}
        </p>

        {hidden && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-amber-300">
            <EyeOff className="h-3 w-3 shrink-0" aria-hidden />
            {item.type === "motorsportQuiz"
              ? "Hidden quiz — still shown while listed"
              : "Hidden from players"}
          </p>
        )}
        {finishedRace && !hidden && (
          <p className="mt-2 text-xs text-zinc-400">
            Race is {item.data.matchStatus?.toLowerCase()} for players.
          </p>
        )}
        {rowError && <p className="mt-2 text-xs text-red-300">{rowError}</p>}

        <div className="mt-auto flex justify-end border-t border-white/5 pt-3">
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${title}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-red-800/80 hover:bg-red-950/40 hover:text-red-200 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </article>
    </li>
  );
}

function AddItemModal({
  onClose,
  onAdd,
  existingKeys,
  tournamentNames,
}: {
  onClose: () => void;
  onAdd: (type: TrendingType, record: PoolRecord) => void;
  existingKeys: Set<string>;
  tournamentNames: TournamentNames;
}) {
  const [type, setType] = useState<TrendingType>("prediction");
  // A race being added that players won't see (hidden or already over).
  const [pendingRace, setPendingRace] = useState<PoolRecord | null>(null);
  // Race quizzes: the race whose quizzes are listed; null while picking one.
  const [quizRaceChoice, setQuizRaceChoice] = useState<PoolRecord | null>(null);
  const [pool, setPool] = useState<PoolRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  // Guards against an older, slower request overwriting a newer one.
  const requestIdRef = useRef(0);
  // Read when a race's quizzes load; arriving names shouldn't reload the list.
  const tournamentNamesRef = useRef(tournamentNames);
  tournamentNamesRef.current = tournamentNames;

  const choosingRace = type === "motorsportQuiz" && !quizRaceChoice;

  const loadPool = useCallback(
    async (poolType: TrendingType, race: PoolRecord | null) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError("");
      setSearch("");
      try {
        let records = await fetchPool(
          poolType,
          race ? [raceQuizzesUrl(race._id)] : POOL_URLS[poolType],
        );
        if (race) {
          // Rows show the race's name and start time; keep them even if the
          // quiz list leaves the race out.
          const fallback: TrendingQuizRace = {
            _id: race._id,
            matchId: race.matchId ?? undefined,
            name: race.name,
            tournament: tournamentLabel(race, tournamentNamesRef.current),
            matchStatus: race.matchStatus,
            raceStartTime: race.raceStartTime,
          };
          records = records.map((quiz) =>
            quizRace(quiz) ? quiz : { ...quiz, match: fallback },
          );
        }
        if (requestIdRef.current !== requestId) return;
        setPool(records);
      } catch (err) {
        if (requestIdRef.current !== requestId) return;
        setError(err instanceof Error ? err.message : "Failed to load list");
        setPool([]);
      } finally {
        if (requestIdRef.current === requestId) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadPool(type, type === "motorsportQuiz" ? quizRaceChoice : null);
  }, [type, quizRaceChoice, loadPool]);

  // While choosing a race for a quiz, rows describe races.
  const listType: TrendingType = choosingRace ? "motorsportMatch" : type;

  const query = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return pool;
    return pool.filter((record) => {
      const { title, subtitle } = describeRecord(
        listType,
        record,
        tournamentNames,
      );
      return (
        title.toLowerCase().includes(query) ||
        subtitle.toLowerCase().includes(query)
      );
    });
  }, [pool, query, listType, tournamentNames]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Add trending item</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-zinc-700 px-6 py-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as TrendingType);
              setQuizRaceChoice(null);
              setPendingRace(null);
            }}
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            {TRENDING_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {TRENDING_TYPE_LABELS[option]}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tournament"
            aria-label="Search"
            className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />

          {type === "motorsportQuiz" && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              {quizRaceChoice ? (
                <>
                  <button
                    type="button"
                    onClick={() => setQuizRaceChoice(null)}
                    className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    All races
                  </button>
                  <span className="min-w-0 truncate text-gray-400">
                    · Quizzes for{" "}
                    <span className="text-white">
                      {quizRaceChoice.name || "this race"}
                    </span>
                  </span>
                </>
              ) : (
                <span className="text-gray-400">
                  Pick a race, then one of its quizzes. Only visible quizzes
                  are listed.
                </span>
              )}
            </div>
          )}
        </div>

        <div className="min-h-[30vh] flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex min-h-[30vh] items-center justify-center">
              <Atom color="#5CDFFF" size="small" text="" textColor="" />
            </div>
          ) : error ? (
            <p className="p-6 text-sm text-red-300">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-gray-400">
              {query
                ? "No matches for that search."
                : quizRaceChoice && type === "motorsportQuiz"
                  ? "No quizzes for this race."
                  : listType === "motorsportMatch"
                    ? "No visible upcoming or ongoing races."
                    : `No ${TRENDING_TYPE_PLURAL_LABELS[type]} currently on the home screen.`}
            </p>
          ) : (
            <ul className="divide-y divide-zinc-700/80">
              {filtered.map((record) => {
                const { title, subtitle } = describeRecord(
                  listType,
                  record,
                  tournamentNames,
                );
                const alreadyAdded =
                  !choosingRace && existingKeys.has(draftKey(type, record._id));
                return (
                  <li key={record._id}>
                    <button
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => {
                        if (choosingRace) {
                          setQuizRaceChoice(record);
                          return;
                        }
                        const unseen =
                          type === "motorsportMatch" &&
                          (record.isVisible === false ||
                            record.matchStatus === "Finished" ||
                            record.matchStatus === "Cancelled");
                        if (unseen) setPendingRace(record);
                        else onAdd(type, record);
                      }}
                      className="flex w-full items-center justify-between gap-3 px-6 py-3.5 text-left transition-colors hover:bg-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {title}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {subtitle}
                        </p>
                      </div>
                      {choosingRace ? (
                        <ChevronRight
                          className="h-4 w-4 shrink-0 text-gray-400"
                          aria-label="Show quizzes"
                        />
                      ) : alreadyAdded ? (
                        <span className="shrink-0 text-xs text-gray-500">
                          Added
                        </span>
                      ) : (
                        <Plus className="h-4 w-4 shrink-0 text-cyan-300" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {pendingRace && (
          <div className="border-t border-zinc-800 bg-amber-500/10 p-4 text-sm text-amber-200">
            <p>
              {pendingRace.isVisible === false
                ? "This race is hidden, so players won't see it in Trending."
                : `This race is ${pendingRace.matchStatus?.toLowerCase()}; players will see it as such.`}{" "}
              Add it anyway?
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onAdd("motorsportMatch", pendingRace);
                  setPendingRace(null);
                }}
                className="rounded-md bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-500"
              >
                Add anyway
              </button>
              <button
                type="button"
                onClick={() => setPendingRace(null)}
                className="rounded-md border border-zinc-600 px-3 py-1.5 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrendingMatchesTab() {
  const [serverItems, setServerItems] = useState<DraftItem[]>([]);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // The row (by position in `items`) a failed save points at, if any.
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tournamentNames, setTournamentNames] = useState<TournamentNames>(
    () => new Map(),
  );

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setErrorIndex(null);
      const res = await fetch(TRENDING_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to fetch trending list");
      }
      const draft = toDraftItems(body.data?.items ?? []);
      setServerItems(draft);
      setItems(draft);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load trending list",
      );
      setServerItems([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  useEffect(() => {
    // Best effort: without it, events/futures just show the raw tournament id.
    fetchTournamentNames()
      .then(setTournamentNames)
      .catch(() => {});
  }, []);

  // The server orders the list itself on every read, so only the set of
  // items matters — not their position.
  const isDirty = useMemo(() => {
    if (items.length !== serverItems.length) return true;
    const saved = new Set(serverItems.map((item) => item.key));
    return items.some((item) => !saved.has(item.key));
  }, [items, serverItems]);

  const existingKeys = useMemo(
    () => new Set(items.map((item) => item.key)),
    [items],
  );

  const query = search.trim().toLowerCase();
  const isFiltering = query.length > 0;
  // Keep each row's position in the full list so numbering and error
  // highlighting stay correct while only a subset is shown.
  const visibleItems = useMemo(
    () =>
      items
        .map((item, index) => ({ item, index }))
        .filter(
          ({ item }) =>
            !query || matchesSearch(item.data, query, tournamentNames),
        ),
    [items, query, tournamentNames],
  );

  const saveOrder = async () => {
    try {
      setSaving(true);
      setError("");
      setErrorIndex(null);
      setNotice("");
      const res = await fetch(TRENDING_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          trendingMatches: items.map((item) => ({
            type: item.type,
            data: item.data._id,
          })),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        const message: string =
          body?.message || "Failed to save trending list";
        const rowIndex = errorRowIndex(message);
        if (rowIndex !== null && rowIndex < items.length) {
          setErrorIndex(rowIndex);
        }
        throw new Error(message);
      }
      // The PUT response doesn't populate `data`, so refetch to display it.
      await fetchTrending();
      setNotice("Trending list saved.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save trending list",
      );
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type: TrendingType, record: PoolRecord) => {
    const key = draftKey(type, record._id);
    if (existingKeys.has(key)) return;
    setItems((current) => [...current, { key, type, data: record }]);
    setErrorIndex(null);
    // Stay open so an admin can add several items in one go — they close it
    // themselves (✕) once done.
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-gray-400">
            Predictions, futures, events, quizzes, matches, races and race
            quizzes featured under “Trending” on the home screen. Add or remove
            items, then save. Player-facing order is computed in the app (by day,
            type mix, then start time) — not the order below. Race quizzes in
            this list stay visible to players regardless of quiz status.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={() => {
                setItems(serverItems);
                setErrorIndex(null);
              }}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            Add item
          </button>
          <button
            type="button"
            onClick={saveOrder}
            disabled={!isDirty || saving}
            className="rounded-md border border-cyan-600 bg-cyan-950/40 px-4 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-950/60 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-transparent disabled:text-zinc-500"
          >
            {saving ? "Saving…" : "Save list"}
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            On list
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {items.length}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Showing
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {isFiltering ? visibleItems.length : items.length}
          </p>
        </div>
        <div
          className={`col-span-2 rounded-lg border px-4 py-3 sm:col-span-1 ${
            isDirty
              ? "border-amber-600/50 bg-amber-950/20"
              : "border-zinc-700 bg-zinc-900/80"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Status
          </p>
          <p
            className={`mt-1 text-sm font-medium ${
              isDirty ? "text-amber-200" : "text-emerald-300/90"
            }`}
          >
            {isDirty ? "Unsaved changes" : "Saved"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
          <button
            type="button"
            onClick={fetchTrending}
            className="ml-3 underline hover:text-red-200"
          >
            Reload
          </button>
        </div>
      )}

      {notice && !error && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-md border border-emerald-600/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="shrink-0 underline hover:text-emerald-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="relative mb-4">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            aria-hidden
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by team, race or tournament"
            aria-label="Search trending items by team, race or tournament"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2.5 pl-9 pr-9 text-sm text-white placeholder-gray-500 focus:border-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-600/50"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-10 text-center">
          <p className="text-lg font-medium text-white">Nothing trending yet</p>
          <p className="mt-2 text-sm text-gray-400">
            Click “Add item” to feature a prediction, future, event, quiz, match,
            race or race quiz.
          </p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-8 text-center text-gray-400">
          No trending items match that search.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map(({ item, index }) => (
            <TrendingRow
              key={item.key}
              item={item}
              index={index}
              disabled={saving}
              rowError={errorIndex === index ? error : null}
              tournamentNames={tournamentNames}
              onRemove={() => {
                setItems((current) =>
                  current.filter((entry) => entry.key !== item.key),
                );
                setErrorIndex(null);
              }}
            />
          ))}
        </ul>
      )}

      {isAddOpen && (
        <AddItemModal
          onClose={() => setIsAddOpen(false)}
          onAdd={addItem}
          existingKeys={existingKeys}
          tournamentNames={tournamentNames}
        />
      )}
    </div>
  );
}
