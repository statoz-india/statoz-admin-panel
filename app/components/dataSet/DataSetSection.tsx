"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Atom } from "react-loading-indicators";
import { ChevronRight, Clock, EyeOff, RefreshCw } from "lucide-react";
import type { Team } from "@/app/api/tournament/teams/route";
import {
  DATA_SET_TABS,
  isDataSetTab,
  type DataSetEvent,
  type DataSetItem,
  type DataSetMatch,
  type DataSetPrediction,
  type DataSetQuiz,
  type DataSetTab,
  type StatusPage,
} from "@/app/interface/data-set.interface";
import { apiRequest } from "@/app/utils/apiRequest";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";
import { statusBadgeClass } from "@/app/utils/statusBadge";
import FuturesSection from "@/app/components/futures/FuturesSection";

const QUERY_DATA_SET_TAB = "datasetTab";
const QUERY_DATA_SET_STATUS = "datasetStatus";

/** Futures has no status endpoints, so its tab shows the Futures section's list. */
type DataSetView = DataSetTab | "futures";

const VIEWS: readonly DataSetView[] = [...DATA_SET_TABS, "futures"];

const TAB_LABELS: Record<DataSetView, string> = {
  matches: "Matches",
  quizzes: "Quizzes",
  predictions: "Predictions",
  events: "Events",
  futures: "Futures",
};

/** The "All" status tab: `byStatus` with no status. */
const ALL = "";

type StatusesState = { statuses: string[] | null; error: string };

type ListState = {
  items: DataSetItem[];
  /** Last page loaded; 0 when the first page failed. */
  page: number;
  total: number;
  hasMore: boolean;
  error: string;
  loadingMore: boolean;
};

const listKey = (tab: DataSetTab, status: string) => `${tab}|${status}`;

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

const formatNumber = (value: number | null | undefined) =>
  typeof value === "number" ? value.toLocaleString("en-IN") : "—";

function formatDateIST(iso: string | null | undefined, empty = "—"): string {
  if (!iso) return empty;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return empty;
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function teamLabel(team: Team | null | undefined): string | null {
  return team?.displayName || team?.name || team?.abbreviation || null;
}

function fixtureLabel(
  teamA: Team | null | undefined,
  teamB: Team | null | undefined,
): string | null {
  const left = teamLabel(teamA);
  const right = teamLabel(teamB);
  return left && right ? `${left} v ${right}` : null;
}

const joinParts = (...parts: (string | null | undefined)[]) =>
  parts.filter(Boolean).join(" · ") || "—";

/** Items can change status between page loads, shifting later pages by one. */
function appendNew(prev: DataSetItem[], next: DataSetItem[]): DataSetItem[] {
  const seen = new Set(prev.map((item) => item._id));
  return [...prev, ...next.filter((item) => !seen.has(item._id))];
}

const fetchStatuses = (tab: DataSetTab) =>
  apiRequest<string[]>(
    `/api/data-set/${tab}/statuses`,
    { method: "GET" },
    `Failed to load ${tab} statuses`,
  );

const fetchPage = (tab: DataSetTab, status: string, page: number) => {
  const sp = new URLSearchParams({ page: String(page) });
  if (status) sp.set("status", status);
  return apiRequest<StatusPage<DataSetItem>>(
    `/api/data-set/${tab}?${sp.toString()}`,
    { method: "GET" },
    `Failed to load ${tab}`,
  );
};

const tabFrom = (value: string | null): DataSetTab =>
  isDataSetTab(value) ? value : "matches";

const viewFrom = (value: string | null): DataSetView =>
  value === "futures" ? value : tabFrom(value);

/**
 * Matches, quizzes, predictions and events by status. Each tab loads its
 * statuses only when first opened, and each status loads only when picked.
 */
export default function DataSetSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<DataSetView>(() =>
    viewFrom(searchParams.get(QUERY_DATA_SET_TAB)),
  );
  const showFutures = view === "futures";
  // The status logic below only runs for the status tabs.
  const tab: DataSetTab = view === "futures" ? "matches" : view;
  const [requestedStatus, setRequestedStatus] = useState<
    Partial<Record<DataSetTab, string>>
  >(() => ({
    [tabFrom(searchParams.get(QUERY_DATA_SET_TAB))]:
      searchParams.get(QUERY_DATA_SET_STATUS) ?? ALL,
  }));
  const [statusesByTab, setStatusesByTab] = useState<
    Partial<Record<DataSetTab, StatusesState>>
  >({});
  const [lists, setLists] = useState<Record<string, ListState>>({});
  // Stops StrictMode's double effect from sending the same request twice.
  const inFlight = useRef(new Set<string>());

  const statusesState = statusesByTab[tab];
  const statuses = statusesState?.statuses ?? null;
  const requested = requestedStatus[tab] ?? ALL;
  // Send the server's spelling; a status from the URL it doesn't know falls back to All.
  const status =
    requested && statuses
      ? (statuses.find((s) => s.toLowerCase() === requested.toLowerCase()) ??
        ALL)
      : requested;
  const key = listKey(tab, status);
  const listState = lists[key];

  const loadStatuses = useCallback(async (target: DataSetTab) => {
    const flightKey = `statuses|${target}`;
    if (inFlight.current.has(flightKey)) return;
    inFlight.current.add(flightKey);
    let next: StatusesState;
    try {
      next = { statuses: await fetchStatuses(target), error: "" };
    } catch (err) {
      next = { statuses: null, error: messageOf(err) };
    } finally {
      inFlight.current.delete(flightKey);
    }
    setStatusesByTab((prev) => ({ ...prev, [target]: next }));
  }, []);

  const loadPage = useCallback(
    async (target: DataSetTab, forStatus: string, page: number) => {
      const targetKey = listKey(target, forStatus);
      const flightKey = `${targetKey}|${page}`;
      if (inFlight.current.has(flightKey)) return;
      inFlight.current.add(flightKey);
      try {
        const data = await fetchPage(target, forStatus, page);
        setLists((prev) => {
          const current = prev[targetKey];
          return {
            ...prev,
            [targetKey]: {
              items:
                page === 1 || !current
                  ? data.items
                  : appendNew(current.items, data.items),
              page: data.page,
              total: data.total,
              hasMore: data.hasMore,
              error: "",
              loadingMore: false,
            },
          };
        });
      } catch (err) {
        const error = messageOf(err);
        setLists((prev) => {
          const current = prev[targetKey];
          return {
            ...prev,
            // A failed "Load more" keeps the rows already shown.
            [targetKey]:
              current && page > 1
                ? { ...current, error, loadingMore: false }
                : {
                    items: [],
                    page: 0,
                    total: 0,
                    hasMore: false,
                    error,
                    loadingMore: false,
                  },
          };
        });
      } finally {
        inFlight.current.delete(flightKey);
      }
    },
    [],
  );

  useEffect(() => {
    if (!showFutures && !statusesState) void loadStatuses(tab);
  }, [showFutures, tab, statusesState, loadStatuses]);

  // The list waits for the statuses, so the status tabs show first.
  useEffect(() => {
    if (!showFutures && statuses && !listState) void loadPage(tab, status, 1);
  }, [showFutures, tab, status, statuses, listState, loadPage]);

  const replaceQuery = useCallback(
    (nextTab: DataSetView, nextStatus: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", Section.DATA_SET);
      sp.set(QUERY_DATA_SET_TAB, nextTab);
      if (nextStatus) sp.set(QUERY_DATA_SET_STATUS, nextStatus);
      else sp.delete(QUERY_DATA_SET_STATUS);
      stripAdminHomeQueryNoise(Section.DATA_SET, sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const selectTab = (next: DataSetView) => {
    setView(next);
    replaceQuery(
      next,
      next === "futures" ? ALL : (requestedStatus[next] ?? ALL),
    );
  };

  const selectStatus = (next: string) => {
    setRequestedStatus((prev) => ({ ...prev, [tab]: next }));
    replaceQuery(tab, next);
  };

  // Dropping cached state makes the effects above fetch again.
  const retryStatuses = () =>
    setStatusesByTab((prev) => {
      const next = { ...prev };
      delete next[tab];
      return next;
    });

  const retryList = () =>
    setLists((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const refresh = () => {
    retryStatuses();
    setLists((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([k]) => !k.startsWith(`${tab}|`)),
      ),
    );
  };

  const loadMore = () => {
    if (!listState || listState.loadingMore) return;
    setLists((prev) => ({
      ...prev,
      [key]: { ...listState, loadingMore: true, error: "" },
    }));
    void loadPage(tab, status, listState.page + 1);
  };

  // Carry the tab and status so the detail page's Back lands on them again.
  const openDetail = (href: string) => {
    const sp = new URLSearchParams({
      from: Section.DATA_SET,
      [QUERY_DATA_SET_TAB]: tab,
    });
    if (status) sp.set(QUERY_DATA_SET_STATUS, status);
    const sep = href.includes("?") ? "&" : "?";
    router.push(`${href}${sep}${sp.toString()}`, { scroll: false });
  };

  const loading =
    !showFutures && (!statusesState || (statuses !== null && !listState));
  const countOf = (value: string): number | null => {
    const state = lists[listKey(tab, value)];
    return state && state.page > 0 ? state.total : null;
  };
  const noun = TAB_LABELS[tab].toLowerCase();

  return (
    <div className="p-6">
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Data Set</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              Every match, quiz, prediction and event by status, latest start
              time first. &ldquo;All&rdquo; includes deleted and hidden items.
              Futures lists every future.
            </p>
          </div>
          {!showFutures ? (
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden
              />
              {loading ? "Loading…" : "Refresh"}
            </button>
          ) : null}
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-700">
          {VIEWS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => selectTab(value)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                view === value
                  ? "border-cyan-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {TAB_LABELS[value]}
            </button>
          ))}
        </div>

        {showFutures ? (
          // Back on a future's page returns to this tab.
          <FuturesSection
            embedded
            detailParams={{
              from: Section.DATA_SET,
              [QUERY_DATA_SET_TAB]: "futures",
            }}
          />
        ) : !statusesState ? (
          <Spinner />
        ) : statusesState.error ? (
          <ErrorBox message={statusesState.error} onRetry={retryStatuses} />
        ) : (
          <>
            <div
              role="group"
              aria-label={`${TAB_LABELS[tab]} status`}
              className="mb-6 flex flex-wrap gap-2"
            >
              {[ALL, ...(statuses ?? [])].map((value) => {
                const count = countOf(value);
                return (
                  <button
                    key={value || "all"}
                    type="button"
                    aria-pressed={status === value}
                    onClick={() => selectStatus(value)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      status === value
                        ? "border-cyan-600 bg-cyan-950/50 text-cyan-100"
                        : "border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {value || "All"}
                    {count !== null ? (
                      <span className="ml-1.5 text-xs tabular-nums opacity-75">
                        {formatNumber(count)}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {!listState ? (
              <Spinner />
            ) : listState.page === 0 ? (
              <ErrorBox message={listState.error} onRetry={retryList} />
            ) : listState.items.length === 0 ? (
              <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-10 text-center">
                <p className="text-lg font-medium text-white">
                  No {noun} {status ? `in ${status}` : "yet"}
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-gray-400">
                  Showing {formatNumber(listState.items.length)} of{" "}
                  {formatNumber(listState.total)} {noun}
                  {status ? ` in ${status}` : ""}
                </p>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                  {listState.items.map((item) => (
                    <DataSetRow
                      key={item._id}
                      tab={tab}
                      item={item}
                      onOpen={openDetail}
                    />
                  ))}
                </ul>
                {listState.error ? (
                  <p className="mt-4 text-sm text-red-300">{listState.error}</p>
                ) : null}
                {listState.hasMore ? (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={listState.loadingMore}
                      className="rounded-md border border-zinc-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {listState.loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Atom color="#5CDFFF" size="medium" text="" textColor="" />
    </div>
  );
}

function ErrorBox({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-red-800/60 bg-red-950/30 p-4">
      <p className="text-red-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Retry
      </button>
    </div>
  );
}

type RowProps = {
  /** Readable id, e.g. `quizId`; shown small next to the status. */
  id: string;
  status: string;
  /** Both teams when the item belongs to a fixture; else `title` is the heading. */
  teams: [Team, Team] | null;
  title: string;
  meta: string;
  when: { label: string; value: string };
  facts: { label: string; value: string }[];
  hidden: boolean;
  href: string;
};

const hasTeams = (
  teamA: Team | null | undefined,
  teamB: Team | null | undefined,
): [Team, Team] | null =>
  teamLabel(teamA) && teamLabel(teamB) ? [teamA!, teamB!] : null;

/** Card content per tab; the API returns a different shape for each. */
function rowProps(tab: DataSetTab, item: DataSetItem): RowProps {
  switch (tab) {
    case "matches": {
      const match = item as DataSetMatch;
      return {
        id: match.matchId,
        status: match.matchStatus ?? "—",
        teams: hasTeams(match.teamA, match.teamB),
        title: match.matchId,
        meta: joinParts(match.tournament, match.gameType, match.tag),
        when: {
          label: "Starts",
          value: formatDateIST(match.matchStartTime, "No start time"),
        },
        facts: [
          { label: "Quizzes", value: String(match.quizIds?.length ?? 0) },
          {
            label: "Predictions",
            value: String(match.predictionIds?.length ?? 0),
          },
          { label: "Created by", value: match.createdByUserData?.email ?? "—" },
        ],
        hidden: false,
        href: `/match/${match._id}?matchTournament=${encodeURIComponent(
          match.tournament ?? "",
        )}`,
      };
    }
    case "quizzes": {
      const quiz = item as DataSetQuiz;
      return {
        id: quiz.quizId,
        status: quiz.quizStatus ?? "—",
        teams: hasTeams(quiz.teamA, quiz.teamB),
        title: quiz.quizId,
        meta: joinParts(quiz.tournament, quiz.gameType, quiz.tag),
        when: {
          label: "Match starts",
          value: formatDateIST(quiz.matchStartTime),
        },
        facts: [
          { label: "Entry opens", value: formatDateIST(quiz.entryStartTime) },
          { label: "Entry closes", value: formatDateIST(quiz.entryStopTime) },
        ],
        hidden: quiz.isVisible === false,
        href: `/quiz/${quiz._id}`,
      };
    }
    case "predictions": {
      const prediction = item as DataSetPrediction;
      return {
        id: prediction.predictionId,
        status: prediction.predictionStatus ?? "—",
        teams: hasTeams(prediction.teamA, prediction.teamB),
        title: prediction.predictionId,
        meta: joinParts(
          prediction.tournamentData?.tournamentName ?? prediction.tournament,
          prediction.gameType,
          prediction.tag,
        ),
        when: {
          label: "Match starts",
          value: formatDateIST(prediction.matchStartTime),
        },
        facts: [
          { label: "Total coins", value: formatNumber(prediction.totalCoins) },
          { label: "Winner", value: prediction.winningTeam ?? "—" },
        ],
        hidden: prediction.isVisible === false,
        href: `/prediction/${prediction._id}`,
      };
    }
    case "events": {
      const event = item as DataSetEvent;
      const winner =
        event.winningOption === "Y"
          ? event.yesPlaceholder
          : event.winningOption === "N"
            ? event.noPlaceholder
            : event.winningOption === "M"
              ? event.maybePlaceholder
              : null;
      return {
        id: event.eventId,
        status: event.eventStatus ?? "—",
        // The event's own name is the heading; its fixture goes in the meta line.
        teams: null,
        title: event.eventName || event.eventId,
        meta: joinParts(
          // `tournament` is the tournament's _id; show its name instead.
          event.tournamentData?.tournamentName ??
            event.tournamentData?.tournament,
          fixtureLabel(event.teamA, event.teamB),
        ),
        when: event.matchStartTime
          ? {
              label: "Match starts",
              value: formatDateIST(event.matchStartTime),
            }
          : {
              label: "Entry opens",
              value: formatDateIST(event.entryStartTime),
            },
        facts: [
          { label: "Entry closes", value: formatDateIST(event.entryCloseTime) },
          { label: "Total coins", value: formatNumber(event.totalCoins) },
          { label: "Result", value: winner || "—" },
          { label: "Options", value: event.haveThreeOptions ? "3" : "2" },
        ],
        hidden: false,
        href: `/events?id=${event._id}`,
      };
    }
  }
}

/** `alignEnd` mirrors the away side so the badge sits on the card's outer edge. */
function TeamLine({
  team,
  alignEnd = false,
}: {
  team: Team;
  alignEnd?: boolean;
}) {
  const label = teamLabel(team) ?? "—";
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${
        alignEnd ? "flex-row-reverse text-right" : ""
      }`}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] font-bold uppercase"
        style={{
          backgroundColor: team.primaryColor || "#3f3f46",
          color: team.textColor || "#ffffff",
        }}
        aria-hidden
      >
        {(team.abbreviation || label).slice(0, 3)}
      </span>
      <span className="truncate text-sm font-semibold text-white" title={label}>
        {label}
      </span>
    </div>
  );
}

function DataSetRow({
  tab,
  item,
  onOpen,
}: {
  tab: DataSetTab;
  item: DataSetItem;
  onOpen: (href: string) => void;
}) {
  const { id, status, teams, title, meta, when, facts, hidden, href } =
    rowProps(tab, item);
  const open = () => onOpen(href);
  return (
    <li>
      <article
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        className="group flex h-full cursor-pointer flex-col rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600/50"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide ${statusBadgeClass(
              status,
            )}`}
          >
            {status}
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            {hidden ? (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-md bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-300"
                title="Not visible to players"
              >
                <EyeOff className="h-3 w-3" aria-hidden />
                Hidden
              </span>
            ) : null}
            <span
              className="truncate font-mono text-[11px] text-zinc-500"
              title={id}
            >
              {id}
            </span>
          </span>
        </div>

        {teams ? (
          <div className="flex items-center gap-2">
            <TeamLine team={teams[0]} />
            <span className="shrink-0 text-[11px] font-medium uppercase text-zinc-500">
              v
            </span>
            <TeamLine team={teams[1]} alignEnd />
          </div>
        ) : (
          <h3
            className="line-clamp-2 text-sm font-semibold leading-snug text-white"
            title={title}
          >
            {title}
          </h3>
        )}

        <p className="mt-2 truncate text-xs text-zinc-400" title={meta}>
          {meta}
        </p>

        <div className="mt-3 flex items-center gap-1.5 rounded-md bg-zinc-800/60 px-2.5 py-1.5 text-xs">
          <Clock className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden />
          <span className="text-zinc-400">{when.label}</span>
          <span className="truncate text-zinc-100" title={when.value}>
            {when.value}
          </span>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-zinc-500">
                {fact.label}
              </dt>
              <dd className="truncate text-sm text-zinc-100" title={fact.value}>
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center justify-end gap-1 pt-3 text-xs text-zinc-500 transition-colors group-hover:text-cyan-300">
          Open
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </div>
      </article>
    </li>
  );
}
