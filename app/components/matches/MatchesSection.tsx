"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";
import CreateMatchesModal from "./CreateMatchesModal";
import { MatchData } from "../../api/match/route";
import { Atom } from "react-loading-indicators";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";

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

function MatchIdWithCopy({
  id,
  onQuizClick,
}: {
  id: string;
  onQuizClick?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const idEl = onQuizClick ? (
    <button
      type="button"
      onClick={onQuizClick}
      className="cursor-pointer text-left font-mono text-xs break-all text-sky-300 hover:text-sky-200 hover:underline"
      title="Open quiz details"
    >
      {id}
    </button>
  ) : (
    <span className="font-mono text-xs text-gray-300 break-all">{id}</span>
  );

  return (
    <div className="flex flex-col gap-0.5">
      {idEl}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
          aria-label={`Copy id ${id}`}
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
          ) : (
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}

function MatchesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchTournamentParam =
    searchParams.get(QUERY_MATCH_TOURNAMENT) ??
    searchParams.get("tournament");
  const hasRestoredScrollRef = useRef(false);

  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [tournamentListReady, setTournamentListReady] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<string>("LIVE");
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [matchesError, setMatchesError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const navigateFromMatchesToQuiz = useCallback(
    (quizId: string) => {
      saveScrollPosition();
      if (typeof window !== "undefined") {
        sessionStorage.setItem(MATCHES_SHOULD_RESTORE_SCROLL_KEY, "1");
      }
      router.push(
        matchHrefWithListContext(`/quiz/${encodeURIComponent(quizId)}`),
        { scroll: false },
      );
    },
    [matchHrefWithListContext, router, saveScrollPosition],
  );

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

      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium text-gray-300">
          Select Tournament
        </label>
        <div className="flex flex-wrap gap-3">
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
          {tournaments.map((tournament) => (
            <button
              key={tournament}
              type="button"
              onClick={() => replaceMatchesTournamentInUrl(tournament)}
              className={`rounded-md px-4 py-2 font-medium transition-colors ${
                selectedTournament === tournament
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              {tournament}
            </button>
          ))}
        </div>
      </div>

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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-zinc-700">
                <thead>
                  <tr className="bg-zinc-800">
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Match ID
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Team A
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Team B
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Match start time
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Mongo ID
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Quizzes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr
                      key={match._id}
                      className="transition-colors hover:bg-zinc-800/50"
                    >
                      <td className="border border-zinc-700 px-4 py-3 font-mono text-sm text-gray-300">
                        {match.matchId}
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                        {match.teamA?.name}{" "}
                        <span className="text-zinc-500">
                          ({match.teamA?.abbreviation})
                        </span>
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                        {match.teamB?.name}{" "}
                        <span className="text-zinc-500">
                          ({match.teamB?.abbreviation})
                        </span>
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-400">
                        {formatDateIST(match.matchStartTime)}
                      </td>
                      <td className="break-all border border-zinc-700 px-4 py-3 text-gray-400">
                        {match._id}
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 align-top text-gray-400">
                        {match.quizIds && match.quizIds.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {match.quizIds.map((id) => (
                              <MatchIdWithCopy
                                key={id}
                                id={id}
                                onQuizClick={() => navigateFromMatchesToQuiz(id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
}

export default MatchesSection;
