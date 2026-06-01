"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateQuizModal from "./CreateQuizModal";
import { Quiz } from "../../api/quiz/route";
import { resolveQuizTeam } from "@/app/utils/resolveQuizTeam";
import {
  QUIZ_STATUS_VALUES,
  type QuizStatus,
} from "../../constants/quiz-status";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Atom } from "react-loading-indicators";

const QUIZZES_SCROLL_POSITION_KEY = "admin_quizzes_scroll_top";
const QUIZZES_SHOULD_RESTORE_SCROLL_KEY = "admin_quizzes_should_restore_scroll";
const QUERY_QUIZ_TOURNAMENT = "quizTournament";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

type QuizStatusFilter =
  | "all"
  | "upcoming"
  | "finished"
  | "settlement_done"
  | "live";

const QUIZ_STATUS_FILTER_OPTIONS: {
  value: QuizStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "finished", label: "Finished" },
  { value: "settlement_done", label: "Settlement done" },
  { value: "live", label: "Live" },
];

function resolveTournamentQueryParam(
  raw: string | null,
  tournamentList: string[],
): string {
  if (raw === "LIVE") return "LIVE";
  if (raw && tournamentList.includes(raw)) return raw;
  return "LIVE";
}

const getQuizStatusBadgeClass = (status: string) => {
  switch (status.toUpperCase()) {
    case "UPCOMING":
      return "bg-violet-900 text-violet-200";
    case "LIVE":
      return "bg-emerald-900 text-emerald-200";
    case "FINISHED":
      return "bg-zinc-700 text-zinc-200";
    case "ENTRYNOTSTARTED":
      return "bg-slate-700 text-slate-200";
    case "ENTRYCLOSED":
      return "bg-amber-900 text-amber-200";
    case "SETTLEMENT_DONE":
      return "bg-purple-900 text-purple-200";
    case "NOT_VISIBLE":
      return "bg-rose-900 text-rose-200";
    case "ADMIN_VISIBLE":
      return "bg-cyan-900 text-cyan-200";
    // Backward-compatible handling if backend still sends this legacy value
    case "ENTRYSTARTED":
      return "bg-blue-900 text-blue-200";
    default:
      return "bg-zinc-800 text-zinc-200";
  }
};

export default function QuizzesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournamentParam =
    searchParams.get(QUERY_QUIZ_TOURNAMENT) ?? searchParams.get("tournament");
  const hasRestoredScrollRef = useRef(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const saveScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    const scrollTop = container ? container.scrollTop : window.scrollY;
    sessionStorage.setItem(QUIZZES_SCROLL_POSITION_KEY, String(scrollTop));
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem(QUIZZES_SCROLL_POSITION_KEY);
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

  const [tournaments, setTournaments] = useState<string[]>([]);
  const [tournamentListReady, setTournamentListReady] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState("LIVE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openStatusDropdownQuizId, setOpenStatusDropdownQuizId] = useState<
    string | null
  >(null);
  const [statusUpdateLoadingQuizId, setStatusUpdateLoadingQuizId] = useState<
    string | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<QuizStatusFilter>("all");

  const filteredQuizzes = useMemo(() => {
    if (statusFilter === "all") return quizzes;
    return quizzes.filter((q) => {
      const s = q.quizStatus.toUpperCase();
      if (statusFilter === "upcoming") return s === "UPCOMING";
      if (statusFilter === "finished") return s === "FINISHED";
      if (statusFilter === "settlement_done") return s === "SETTLEMENT_DONE";
      if (statusFilter === "live") return s === "LIVE";
      return true;
    });
  }, [quizzes, statusFilter]);

  const fetchTournamentsList = async (): Promise<string[]> => {
    try {
      const res = await fetch("/api/tournament", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        return [];
      }

      const response = await res.json();
      const tournamentData = response.success ? response.data.data : [];
      return Array.isArray(tournamentData) ? tournamentData : [];
    } catch {
      return [];
    }
  };

  const fetchQuizzes = useCallback(async (tournament: string) => {
    try {
      setLoading(true);
      setError("");
      const endpoint =
        tournament === "LIVE"
          ? "/api/quiz/live-quizzes"
          : `/api/quiz/tournament/${encodeURIComponent(tournament)}`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const response = await res.json();

      if (!res.ok) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load quizzes";
        setError(message);
        setQuizzes([]);
        return;
      }

      if (!response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to load quizzes",
        );
        setQuizzes([]);
        return;
      }

      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setQuizzes(list);
    } catch (err) {
      setQuizzes([]);
      setError(err instanceof Error ? err.message : "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const list = await fetchTournamentsList();
      if (cancelled) return;
      setTournaments(list);
      setTournamentListReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!tournamentListReady) return;

    let cancelled = false;

    (async () => {
      const resolved = resolveTournamentQueryParam(
        tournamentParam,
        tournaments,
      );
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "quizzes");
      const needsNormalize =
        searchParams.get("section") !== "quizzes" ||
        searchParams.get(QUERY_QUIZ_TOURNAMENT) !== resolved ||
        searchParams.get("tournament") != null ||
        searchParams.get("from") != null ||
        searchParams.get("predTournament") != null;
      if (needsNormalize) {
        sp.set(QUERY_QUIZ_TOURNAMENT, resolved);
        sp.delete("tournament");
        stripAdminHomeQueryNoise("quizzes", sp);
        router.replace(`/?${sp.toString()}`, { scroll: false });
      }
      if (cancelled) return;
      setSelectedTournament(resolved);
      await fetchQuizzes(resolved);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    tournamentListReady,
    tournamentParam,
    tournaments,
    fetchQuizzes,
    router,
    searchParams,
  ]);

  const replaceQuizzesTournamentInUrl = useCallback(
    (tournament: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "quizzes");
      sp.set(QUERY_QUIZ_TOURNAMENT, tournament);
      sp.delete("tournament");
      stripAdminHomeQueryNoise("quizzes", sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const quizHrefWithListContext = useCallback(
    (path: string) => {
      const sep = path.includes("?") ? "&" : "?";
      return `${path}${sep}from=quizzes&${QUERY_QUIZ_TOURNAMENT}=${encodeURIComponent(selectedTournament)}`;
    },
    [selectedTournament],
  );

  useEffect(() => {
    if (loading || hasRestoredScrollRef.current) return;
    const shouldRestore =
      typeof window !== "undefined" &&
      sessionStorage.getItem(QUIZZES_SHOULD_RESTORE_SCROLL_KEY) === "1";
    if (shouldRestore) {
      sessionStorage.removeItem(QUIZZES_SHOULD_RESTORE_SCROLL_KEY);
      restoreScrollPosition();
    }
    hasRestoredScrollRef.current = true;
  }, [loading, restoreScrollPosition]);

  const updateQuizStatus = async (quizId: string, quizStatus: QuizStatus) => {
    try {
      setStatusUpdateLoadingQuizId(quizId);
      const res = await fetch(`/api/quiz/${quizId}/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quizStatus }),
      });

      const response = await res.json();
      if (!res.ok || !response?.success) {
        throw new Error(response?.message || "Failed to update quiz status");
      }

      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz._id === quizId ? { ...quiz, quizStatus: quizStatus } : quiz,
        ),
      );
      setOpenStatusDropdownQuizId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update quiz status",
      );
    } finally {
      setStatusUpdateLoadingQuizId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  const navigateFromQuizzes = (href: string) => {
    saveScrollPosition();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(QUIZZES_SHOULD_RESTORE_SCROLL_KEY, "1");
    }
    router.push(href, { scroll: false });
  };

  const handleQuizClick = (quiz: Quiz) => {
    navigateFromQuizzes(quizHrefWithListContext(`/quiz/${quiz._id}`));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Quizzes</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200"
        >
          Create New Quiz
        </button>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Tournament
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => replaceQuizzesTournamentInUrl("LIVE")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedTournament === "LIVE"
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            Show Live Quizzes
          </button>
          {tournaments.map((tournament) => (
            <button
              key={tournament}
              onClick={() => replaceQuizzesTournamentInUrl(tournament)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedTournament === tournament
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
              }`}
            >
              {tournament}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Filter by status
        </label>
        <div className="flex flex-wrap gap-3">
          {QUIZ_STATUS_FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                statusFilter === value
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <CreateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchQuizzes(selectedTournament)}
      />
      {error && quizzes.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-400">{error}</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {quizzes.length === 0 ? (
            <p className="text-gray-400">No quizzes found.</p>
          ) : filteredQuizzes.length === 0 ? (
            <p className="text-gray-400">No quizzes match this filter.</p>
          ) : (
            filteredQuizzes.map((quiz) => {
            const teamA = resolveQuizTeam(quiz.teamA);
            const teamB = resolveQuizTeam(quiz.teamB);
            return (
            <div
              key={quiz._id}
              onClick={() => handleQuizClick(quiz)}
              className="borderborder-zinc-700 rounded-lg p-6 bg-zinc-800 hover:bg-indigo-500/10 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {quiz.quizId}
                  </h3>
                  <p className="text-gray-400">Tournament: {quiz.tournament}</p>
                  <p className="text-gray-400">Quiz Mongo ID: {quiz._id}</p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    disabled={statusUpdateLoadingQuizId === quiz._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (quiz.quizStatus.toUpperCase() === "SETTLEMENT_DONE") {
                        return;
                      }
                      setOpenStatusDropdownQuizId((prev) =>
                        prev === quiz._id ? null : quiz._id,
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getQuizStatusBadgeClass(
                      quiz.quizStatus,
                    )} ${
                      quiz.quizStatus.toUpperCase() === "SETTLEMENT_DONE"
                        ? "cursor-not-allowed opacity-80"
                        : "cursor-pointer"
                    } ${
                      statusUpdateLoadingQuizId === quiz._id
                        ? "opacity-60 cursor-wait"
                        : ""
                    }`}
                  >
                    {quiz.quizStatus}
                  </button>

                  {openStatusDropdownQuizId === quiz._id && (
                    <div
                      className="absolute right-0 mt-2 min-w-[220px] bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-20 p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {QUIZ_STATUS_VALUES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateQuizStatus(quiz._id, status)}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${
                            quiz.quizStatus.toUpperCase() === status
                              ? "bg-white text-black"
                              : "text-zinc-200 hover:bg-zinc-800"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Teams */}
              <div className="flex items-center gap-4 mb-4 p-4 bg-zinc-800 rounded-lg">
                <div className="flex-1 text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg"
                    style={{
                      backgroundColor: teamA.primaryColor,
                      color: teamA.textColor,
                    }}
                  >
                    {teamA.abbreviation}
                  </div>
                  <p className="font-semibold text-white">{teamA.name}</p>
                </div>
                <span className="text-gray-500 font-bold">VS</span>
                <div className="flex-1 text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg"
                    style={{
                      backgroundColor: teamB.primaryColor,
                      color: teamB.textColor,
                    }}
                  >
                    {teamB.abbreviation}
                  </div>
                  <p className="font-semibold text-white">{teamB.name}</p>
                </div>
              </div>

              {/* Quiz Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Entry Start</p>
                  <p className="text-white">
                    {new Date(quiz.entryStartTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Match Start Time</p>
                  <p className="text-white">
                    {new Date(quiz.matchStartTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Questions</p>
                  <p className="text-white">{quiz.totalQuestions || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Submissions</p>
                  <p className="text-white">{quiz.totalSubmission || 0}</p>
                </div>
              </div>
            </div>
            );
            })
          )}
        </div>
      )}
    </div>
  );
}
