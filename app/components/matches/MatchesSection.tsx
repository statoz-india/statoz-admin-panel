"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateMatchesModal from "./CreateMatchesModal";
import { MatchData } from "../../api/match/route";
import type { MatchForDate } from "../../api/match/for-date/[date]/route";
import { Atom } from "react-loading-indicators";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { formatMatchDayLabel, isRealMatchDay } from "@/app/utils/matchDay";
import TournamentFilterRow from "../tournaments/TournamentFilterRow";
import MatchDayFilter from "./MatchDayFilter";
import { MatchBannerUrlWithCopy, MatchIdWithCopy } from "./MatchCopyChips";
import {
  UpdateMatchBannerDialog,
  UpdateMatchStartTimeDialog,
} from "./MatchUpdateDialogs";
import CurrentlyLiveMatches from "./CurrentlyLiveMatches";

const MATCHES_SCROLL_POSITION_KEY = "admin_matches_scroll_top";
const MATCHES_SHOULD_RESTORE_SCROLL_KEY = "admin_matches_should_restore_scroll";
const QUERY_MATCH_TOURNAMENT = "matchTournament";
const QUERY_MATCH_DATE = "matchDate";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";
/** Client-side "all tournaments" sentinel for the day view. */
const ALL_TOURNAMENTS = "__ALL__";
/**
 * Tournament sentinel for the live-statistics tab. Not a tournament and not
 * `LIVE` either: `LIVE` lists matches flagged live in the database, this one
 * shows the stats poller's own registry with its socket payloads.
 */
const CURRENTLY_LIVE = "CURRENTLY_LIVE";

function resolveTournamentQueryParam(
  raw: string | null,
  tournamentList: string[],
): string {
  if (raw === "LIVE" || raw === CURRENTLY_LIVE) return raw;
  if (raw && tournamentList.includes(raw)) return raw;
  return "LIVE";
}

/** Everything about a match an admin is likely to type: league, teams, id, tag. */
function matchSearchHaystack(match: MatchForDate): string {
  return [
    match.matchId,
    match.tournament,
    match.gameType,
    match.tag,
    match.teamA?.name,
    match.teamA?.abbreviation,
    match.teamB?.name,
    match.teamB?.abbreviation,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function MatchesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchTournamentParam =
    searchParams.get(QUERY_MATCH_TOURNAMENT) ?? searchParams.get("tournament");
  const matchDateParam = searchParams.get(QUERY_MATCH_DATE);
  /** A valid `matchDate` in the URL switches the section into day view. */
  const activeDate =
    matchDateParam && isRealMatchDay(matchDateParam) ? matchDateParam : null;
  const hasRestoredScrollRef = useRef(false);

  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [tournamentListReady, setTournamentListReady] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<string>("LIVE");
  const [matches, setMatches] = useState<MatchForDate[]>([]);
  const [matchesError, setMatchesError] = useState("");
  /** Narrows a day's results client-side — the endpoint takes no filters. */
  const [dayTournament, setDayTournament] = useState<string>(ALL_TOURNAMENTS);
  /** Free-text narrowing over whatever list is currently rendered. */
  const [searchInput, setSearchInput] = useState("");
  // Only the section's very first load gets the full-screen spinner; switching
  // day or tournament after that swaps the list in place.
  const initialLoadRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [matchToUpdate, setMatchToUpdate] = useState<MatchData | null>(null);
  const [matchToUpdateStartTime, setMatchToUpdateStartTime] =
    useState<MatchData | null>(null);

  const saveScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    const scrollTop = container ? container.scrollTop : window.scrollY;
    sessionStorage.setItem(MATCHES_SCROLL_POSITION_KEY, String(scrollTop));
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem(MATCHES_SCROLL_POSITION_KEY);
    if (!raw) return;

    const parsedScrollTop = Number(raw);
    if (!Number.isFinite(parsedScrollTop)) return;

    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTo({ top: parsedScrollTop, behavior: "auto" });
      } else {
        window.scrollTo({ top: parsedScrollTop, behavior: "auto" });
      }
    });
  }, []);

  const formatDateIST = (isoString: string | undefined): string => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "—";
    }
  };

  const fetchTournamentsList = useCallback(async (): Promise<string[]> => {
    const res = await fetch("/api/tournament", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch tournaments");
    }

    const response = await res.json();
    const tournamentData = response.success ? response.data.data : [];
    return Array.isArray(tournamentData) ? tournamentData : [];
  }, []);

  const fetchMatches = useCallback(
    async (tournament: string, options?: { quiet?: boolean }) => {
      if (!tournament) {
        setMatches([]);
        setMatchesError("");
        return;
      }
      // The live tab fetches its own registry and streams the rest over the
      // socket, so there is no tournament list to load for it.
      if (tournament === CURRENTLY_LIVE) {
        setMatches([]);
        setMatchesError("");
        setLoading(false);
        initialLoadRef.current = false;
        return;
      }
      const quiet = options?.quiet === true;
      try {
        if (!quiet) setLoading(true);
        setMatchesError("");
        const endpoint =
          tournament === "LIVE"
            ? "/api/match/live-matches"
            : `/api/match/${encodeURIComponent(tournament)}`;
        const res = await fetch(endpoint, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch matches");
        }
        const response = await res.json();
        const list = response.success && response.data ? response.data : [];
        setMatches(Array.isArray(list) ? list : []);
      } catch (err) {
        setMatchesError(
          err instanceof Error ? err.message : "Failed to load matches",
        );
        setMatches([]);
      } finally {
        if (!quiet) setLoading(false);
        initialLoadRef.current = false;
      }
    },
    [],
  );

  /** One IST calendar day, every tournament and team sport in one array. */
  const fetchMatchesForDate = useCallback(
    async (day: string, options?: { quiet?: boolean }) => {
      const quiet = options?.quiet === true;
      try {
        if (!quiet) setLoading(true);
        setMatchesError("");
        const res = await fetch(
          `/api/match/for-date/${encodeURIComponent(day)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch matches");
        }
        const response = await res.json();
        const list = response.success && response.data ? response.data : [];
        setMatches(Array.isArray(list) ? list : []);
      } catch (err) {
        setMatchesError(
          err instanceof Error ? err.message : "Failed to load matches",
        );
        setMatches([]);
      } finally {
        if (!quiet) setLoading(false);
        initialLoadRef.current = false;
      }
    },
    [],
  );

  const refreshCurrentView = useCallback(async () => {
    if (activeDate) {
      await fetchMatchesForDate(activeDate, { quiet: true });
    } else if (selectedTournament) {
      await fetchMatches(selectedTournament, { quiet: true });
    }
  }, [activeDate, fetchMatchesForDate, fetchMatches, selectedTournament]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const list = await fetchTournamentsList();
        if (cancelled) return;
        setTournaments(list);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load tournaments",
        );
      } finally {
        if (!cancelled) setTournamentListReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchTournamentsList]);

  useEffect(() => {
    if (!tournamentListReady) return;

    let cancelled = false;

    (async () => {
      const resolved = resolveTournamentQueryParam(
        matchTournamentParam,
        tournaments,
      );
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "matches");
      const needsNormalize =
        searchParams.get("section") !== "matches" ||
        searchParams.get(QUERY_MATCH_TOURNAMENT) !== resolved ||
        searchParams.get("tournament") != null ||
        searchParams.get("from") != null ||
        searchParams.get("quizTournament") != null ||
        searchParams.get("predTournament") != null;
      if (needsNormalize) {
        sp.set(QUERY_MATCH_TOURNAMENT, resolved);
        sp.delete("tournament");
        stripAdminHomeQueryNoise("matches", sp);
        router.replace(`/?${sp.toString()}`, { scroll: false });
      }
      if (cancelled) return;
      setSelectedTournament(resolved);
      // In day view the date drives the list; keep the resolved tournament
      // around so clearing the date returns to where the admin left off.
      if (!activeDate) await fetchMatches(resolved);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    tournamentListReady,
    matchTournamentParam,
    tournaments,
    fetchMatches,
    activeDate,
    router,
    searchParams,
  ]);

  useEffect(() => {
    if (!activeDate) return;
    setDayTournament(ALL_TOURNAMENTS);
    void fetchMatchesForDate(activeDate);
  }, [activeDate, fetchMatchesForDate]);

  // A new day or tournament is a new list; a leftover query would hide it.
  useEffect(() => {
    setSearchInput("");
  }, [activeDate, selectedTournament]);

  const replaceMatchesTournamentInUrl = useCallback(
    (tournament: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "matches");
      sp.set(QUERY_MATCH_TOURNAMENT, tournament);
      sp.delete("tournament");
      // Picking a tournament leaves the day view.
      sp.delete(QUERY_MATCH_DATE);
      stripAdminHomeQueryNoise("matches", sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  /** `null` leaves day view and falls back to the remembered tournament. */
  const replaceMatchDateInUrl = useCallback(
    (day: string | null) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "matches");
      if (day) sp.set(QUERY_MATCH_DATE, day);
      else sp.delete(QUERY_MATCH_DATE);
      sp.delete("tournament");
      stripAdminHomeQueryNoise("matches", sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  /** Tournaments actually present in the day's results, for the narrowing chips. */
  const dayTournaments = useMemo(() => {
    if (!activeDate) return [];
    return Array.from(
      new Set(matches.map((match) => match.tournament).filter(Boolean)),
    ).sort();
  }, [activeDate, matches]);

  /** The live-statistics tab replaces the list entirely; a day view wins over it. */
  const isCurrentlyLiveTab =
    !activeDate && selectedTournament === CURRENTLY_LIVE;

  const searchQuery = searchInput.trim().toLowerCase();
  /** Every token has to land, so "mumbai chennai" finds the one fixture. */
  const searchTokens = useMemo(
    () => searchQuery.split(/\s+/).filter(Boolean),
    [searchQuery],
  );

  const searchedMatches = useMemo(() => {
    if (searchTokens.length === 0) return matches;
    return matches.filter((match) => {
      const haystack = matchSearchHaystack(match);
      return searchTokens.every((token) => haystack.includes(token));
    });
  }, [matches, searchTokens]);

  const visibleMatches = useMemo(() => {
    if (!activeDate || dayTournament === ALL_TOURNAMENTS)
      return searchedMatches;
    return searchedMatches.filter(
      (match) => match.tournament === dayTournament,
    );
  }, [activeDate, dayTournament, searchedMatches]);

  const matchHrefWithListContext = useCallback(
    (path: string) => {
      const sep = path.includes("?") ? "&" : "?";
      return `${path}${sep}from=matches&${QUERY_MATCH_TOURNAMENT}=${encodeURIComponent(selectedTournament)}`;
    },
    [selectedTournament],
  );

  useEffect(() => {
    if (loading || hasRestoredScrollRef.current) return;
    const shouldRestore =
      typeof window !== "undefined" &&
      sessionStorage.getItem(MATCHES_SHOULD_RESTORE_SCROLL_KEY) === "1";
    if (shouldRestore) {
      sessionStorage.removeItem(MATCHES_SHOULD_RESTORE_SCROLL_KEY);
      restoreScrollPosition();
    }
    hasRestoredScrollRef.current = true;
  }, [loading, restoreScrollPosition]);

  const navigateFromMatches = useCallback(
    (href: string) => {
      saveScrollPosition();
      if (typeof window !== "undefined") {
        sessionStorage.setItem(MATCHES_SHOULD_RESTORE_SCROLL_KEY, "1");
      }
      router.push(href, { scroll: false });
    },
    [router, saveScrollPosition],
  );

  const navigateFromMatchesToQuiz = useCallback(
    (quizId: string) => {
      navigateFromMatches(
        matchHrefWithListContext(`/quiz/${encodeURIComponent(quizId)}`),
      );
    },
    [matchHrefWithListContext, navigateFromMatches],
  );

  const openMatchDetailsById = useCallback(
    (matchId: string) => {
      navigateFromMatches(
        matchHrefWithListContext(`/match/${encodeURIComponent(matchId)}`),
      );
    },
    [matchHrefWithListContext, navigateFromMatches],
  );

  const openMatchDetails = useCallback(
    (match: MatchData) => {
      openMatchDetailsById(match._id);
    },
    [openMatchDetailsById],
  );

  const openUpdateMatchDialog = (match: MatchData, e: React.MouseEvent) => {
    e.stopPropagation();
    setMatchToUpdate(match);
  };

  const openStartTimeDialog = (match: MatchData, e: React.MouseEvent) => {
    e.stopPropagation();
    setMatchToUpdateStartTime(match);
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (loading && initialLoadRef.current) {
    return (
      <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Matches</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200"
        >
          Create New Match
        </button>
      </div>

      {/* The date picker sits in the same row as the tournaments: picking a
          day or a tournament swaps the list in place, never a page change. */}
      <TournamentFilterRow
        tournaments={tournaments}
        selectedTournament={activeDate ? "" : selectedTournament}
        onSelect={replaceMatchesTournamentInUrl}
        leading={
          <>
            <button
              type="button"
              onClick={() => replaceMatchesTournamentInUrl("LIVE")}
              className={`rounded-md px-4 py-2 font-medium transition-colors ${
                !activeDate && selectedTournament === "LIVE"
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              Show Live Matches
            </button>
            <button
              type="button"
              onClick={() => replaceMatchesTournamentInUrl(CURRENTLY_LIVE)}
              title="Matches the stats poller is working on right now, with live statistics over the socket"
              className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
                isCurrentlyLiveTab
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Currently Live
            </button>
            <MatchDayFilter
              value={activeDate}
              onChange={replaceMatchDateInUrl}
              onClear={() => replaceMatchDateInUrl(null)}
            />
          </>
        }
      />

      {!isCurrentlyLiveTab && (activeDate || selectedTournament) && matches.length > 0 && (
        <div className="mb-6">
          <div className="relative w-full sm:max-w-sm">
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by league, team, match ID or tag"
              aria-label="Search matches by league, team, match ID or tag"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-9 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {activeDate && dayTournaments.length > 1 && (
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-gray-300">
            Filter this day
          </label>
          <div className="flex flex-wrap gap-3">
            {[ALL_TOURNAMENTS, ...dayTournaments].map((tournament) => {
              const count =
                tournament === ALL_TOURNAMENTS
                  ? searchedMatches.length
                  : searchedMatches.filter((m) => m.tournament === tournament)
                      .length;
              return (
                <button
                  key={tournament}
                  type="button"
                  onClick={() => setDayTournament(tournament)}
                  className={`rounded-md px-4 py-2 font-medium transition-colors ${
                    dayTournament === tournament
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
                  }`}
                >
                  {tournament === ALL_TOURNAMENTS
                    ? "All tournaments"
                    : tournament}
                  <span className="ml-2 text-xs opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isCurrentlyLiveTab && (
        <CurrentlyLiveMatches onOpenMatch={openMatchDetailsById} />
      )}

      {!isCurrentlyLiveTab && (activeDate || selectedTournament) && (
        <div
          className={`mt-6 transition-opacity ${
            loading ? "pointer-events-none opacity-50" : "opacity-100"
          }`}
        >
          <h3 className="mb-4 text-xl font-semibold text-white">
            {activeDate
              ? `Matches on ${formatMatchDayLabel(activeDate)}`
              : selectedTournament === "LIVE"
                ? "Live matches"
                : `Matches for ${selectedTournament}`}
            {searchQuery && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                {visibleMatches.length} matched
              </span>
            )}
          </h3>

          {matchesError ? (
            <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
              <p className="text-red-400">{matchesError}</p>
            </div>
          ) : visibleMatches.length === 0 ? (
            <div className="rounded-lg bg-zinc-800 p-4">
              <p className="text-gray-400">
                {searchQuery
                  ? `No matches for "${searchInput.trim()}". Try a league or team name.`
                  : activeDate
                    ? "No matches on this date. Races and matches with no start time never appear in a day view."
                    : "No matches for this tournament yet. Create a match using the button above."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {visibleMatches.map((match) => {
                const quizCount = match.quizIds?.length ?? 0;
                return (
                  <div
                    key={match._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openMatchDetails(match)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openMatchDetails(match);
                      }
                    }}
                    className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-6 transition-colors hover:bg-indigo-500/10"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="mb-1 text-xl font-bold text-white">
                          {match.matchId}
                        </h3>
                        <p className="text-gray-400">
                          Tournament: {match.tournament}
                        </p>
                        <p className="break-all text-gray-400">
                          Match Mongo ID: {match._id}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {/* A day mixes sports, so name the one this match is. */}
                        {activeDate && match.gameType ? (
                          <span className="rounded-full bg-sky-900 px-3 py-1 text-sm font-medium text-sky-200 capitalize">
                            {match.gameType}
                          </span>
                        ) : null}
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            quizCount > 0
                              ? "bg-emerald-900 text-emerald-200"
                              : "bg-zinc-700 text-zinc-200"
                          }`}
                        >
                          {quizCount} {quizCount === 1 ? "quiz" : "quizzes"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => openUpdateMatchDialog(match, e)}
                          className="rounded-md border border-zinc-600 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
                        >
                          Edit banner
                        </button>
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="mb-4 flex items-center gap-4 rounded-lg bg-zinc-800 p-4">
                      <div className="flex-1 text-center">
                        <div
                          className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold"
                          style={{
                            backgroundColor:
                              match.teamA?.primaryColor ?? "#3f3f46",
                            color: match.teamA?.textColor ?? "#ffffff",
                          }}
                        >
                          {match.teamA?.abbreviation}
                        </div>
                        <p className="font-semibold text-white">
                          {match.teamA?.name}
                        </p>
                      </div>
                      <span className="font-bold text-gray-500">VS</span>
                      <div className="flex-1 text-center">
                        <div
                          className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold"
                          style={{
                            backgroundColor:
                              match.teamB?.primaryColor ?? "#3f3f46",
                            color: match.teamB?.textColor ?? "#ffffff",
                          }}
                        >
                          {match.teamB?.abbreviation}
                        </div>
                        <p className="font-semibold text-white">
                          {match.teamB?.name}
                        </p>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="mb-1 text-gray-400">Match Start Time</p>
                        <button
                          type="button"
                          onClick={(e) => openStartTimeDialog(match, e)}
                          title="Click to edit start time"
                          className="cursor-pointer text-left text-white hover:text-sky-300 hover:underline"
                        >
                          {formatDateIST(match.matchStartTime)}
                        </button>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-400">Tag</p>
                        <p className="text-white">{match.tag?.trim() || "—"}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-400">Quizzes</p>
                        <p className="text-white">{quizCount}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-400">Predictions</p>
                        <p className="text-white">
                          {match.predictionIds?.length ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 text-sm md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-gray-400">Quiz IDs</p>
                        {quizCount > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {match.quizIds?.map((id) => (
                              <MatchIdWithCopy
                                key={id}
                                id={id}
                                onQuizClick={() =>
                                  navigateFromMatchesToQuiz(id)
                                }
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </div>
                      <div>
                        <p className="mb-2 text-gray-400">Match banner</p>
                        <MatchBannerUrlWithCopy url={match.matchBanner} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!activeDate && !selectedTournament && tournaments.length > 0 && (
        <div className="mt-6 rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">
            Select a tournament to view its matches.
          </p>
        </div>
      )}

      <CreateMatchesModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          void (async () => {
            try {
              const list = await fetchTournamentsList();
              setTournaments(list);
            } catch {
              /* keep existing list */
            }
            await refreshCurrentView();
          })();
        }}
      />

      {matchToUpdate && (
        <UpdateMatchBannerDialog
          match={matchToUpdate}
          onClose={() => setMatchToUpdate(null)}
          onUpdated={refreshCurrentView}
        />
      )}

      {matchToUpdateStartTime && (
        <UpdateMatchStartTimeDialog
          match={matchToUpdateStartTime}
          onClose={() => setMatchToUpdateStartTime(null)}
          onUpdated={refreshCurrentView}
        />
      )}
    </div>
  );
}

export default MatchesSection;
