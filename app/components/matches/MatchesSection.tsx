"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateMatchesModal from "./CreateMatchesModal";
import { MatchData } from "../../api/match/route";
import { Atom } from "react-loading-indicators";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import TournamentFilterRow from "../tournaments/TournamentFilterRow";
import { MatchBannerUrlWithCopy, MatchIdWithCopy } from "./MatchCopyChips";
import {
  UpdateMatchBannerDialog,
  UpdateMatchStartTimeDialog,
} from "./MatchUpdateDialogs";

const MATCHES_SCROLL_POSITION_KEY = "admin_matches_scroll_top";
const MATCHES_SHOULD_RESTORE_SCROLL_KEY = "admin_matches_should_restore_scroll";
const QUERY_MATCH_TOURNAMENT = "matchTournament";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

function resolveTournamentQueryParam(
  raw: string | null,
  tournamentList: string[],
): string {
  if (raw === "LIVE") return "LIVE";
  if (raw && tournamentList.includes(raw)) return raw;
  return "LIVE";
}

function MatchesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchTournamentParam =
    searchParams.get(QUERY_MATCH_TOURNAMENT) ?? searchParams.get("tournament");
  const hasRestoredScrollRef = useRef(false);

  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [tournamentListReady, setTournamentListReady] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<string>("LIVE");
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [matchesError, setMatchesError] = useState("");
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
      }
    },
    [],
  );

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
      await fetchMatches(resolved);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    tournamentListReady,
    matchTournamentParam,
    tournaments,
    fetchMatches,
    router,
    searchParams,
  ]);

  const replaceMatchesTournamentInUrl = useCallback(
    (tournament: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "matches");
      sp.set(QUERY_MATCH_TOURNAMENT, tournament);
      sp.delete("tournament");
      stripAdminHomeQueryNoise("matches", sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

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

  const openMatchDetails = useCallback(
    (match: MatchData) => {
      navigateFromMatches(
        matchHrefWithListContext(`/match/${encodeURIComponent(match._id)}`),
      );
    },
    [matchHrefWithListContext, navigateFromMatches],
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

  if (loading) {
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

      <TournamentFilterRow
        tournaments={tournaments}
        selectedTournament={selectedTournament}
        onSelect={replaceMatchesTournamentInUrl}
        leading={
          <button
            type="button"
            onClick={() => replaceMatchesTournamentInUrl("LIVE")}
            className={`rounded-md px-4 py-2 font-medium transition-colors ${
              selectedTournament === "LIVE"
                ? "bg-white text-black hover:bg-zinc-200"
                : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            Show Live Matches
          </button>
        }
      />

      {selectedTournament && (
        <div className="mt-6">
          <h3 className="mb-4 text-xl font-semibold text-white">
            {selectedTournament === "LIVE"
              ? "Live matches"
              : `Matches for ${selectedTournament}`}
          </h3>

          {matchesError ? (
            <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
              <p className="text-red-400">{matchesError}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="rounded-lg bg-zinc-800 p-4">
              <p className="text-gray-400">
                No matches for this tournament yet. Create a match using the
                button above.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {matches.map((match) => {
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

      {!selectedTournament && tournaments.length > 0 && (
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
            if (selectedTournament) {
              await fetchMatches(selectedTournament, { quiet: true });
            }
          })();
        }}
      />

      {matchToUpdate && (
        <UpdateMatchBannerDialog
          match={matchToUpdate}
          onClose={() => setMatchToUpdate(null)}
          onUpdated={async () => {
            if (selectedTournament) {
              await fetchMatches(selectedTournament, { quiet: true });
            }
          }}
        />
      )}

      {matchToUpdateStartTime && (
        <UpdateMatchStartTimeDialog
          match={matchToUpdateStartTime}
          onClose={() => setMatchToUpdateStartTime(null)}
          onUpdated={async () => {
            if (selectedTournament) {
              await fetchMatches(selectedTournament, { quiet: true });
            }
          }}
        />
      )}
    </div>
  );
}

export default MatchesSection;
