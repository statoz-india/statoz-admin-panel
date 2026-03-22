"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateQuizModal from "./CreateQuizModal";
import { Quiz } from "../../api/quiz/route";
import {
  QUIZ_STATUS_VALUES,
  type QuizStatus,
} from "../../constants/quiz-status";

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
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [tournaments, setTournaments] = useState<string[]>([]);
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

  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournament", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        return;
      }

      const response = await res.json();
      const tournamentData = response.success ? response.data.data : [];
      setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
    } catch {
      setTournaments([]);
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
    fetchTournaments();
    fetchQuizzes("LIVE");
  }, [fetchQuizzes]);

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
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading quizzes...</p>
      </div>
    );
  }

  const handleQuizClick = (quiz: Quiz) => {
    router.push(`/quiz/${quiz._id}?from=quizzes`);
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
            onClick={() => {
              setSelectedTournament("LIVE");
              fetchQuizzes("LIVE");
            }}
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
              onClick={() => {
                setSelectedTournament(tournament);
                fetchQuizzes(tournament);
              }}
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
          {quizzes.map((quiz) => (
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
                      backgroundColor: quiz.teamA.primaryColor,
                      color: quiz.teamA.textColor,
                    }}
                  >
                    {quiz.teamA.abbreviation}
                  </div>
                  <p className="font-semibold text-white">{quiz.teamA.name}</p>
                </div>
                <span className="text-gray-500 font-bold">VS</span>
                <div className="flex-1 text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg"
                    style={{
                      backgroundColor: quiz.teamB.primaryColor,
                      color: quiz.teamB.textColor,
                    }}
                  >
                    {quiz.teamB.abbreviation}
                  </div>
                  <p className="font-semibold text-white">{quiz.teamB.name}</p>
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
                  <p className="text-white">
                    {quiz.questionsArray?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Submissions</p>
                  <p className="text-white">
                    {quiz.responseSubmittedByUsers?.length || 0}
                  </p>
                </div>
              </div>

              {/* Created By */}
              <div className="mt-4 pt-4 border-t border-zinc-700 text-sm">
                <p className="text-gray-400">
                  Created by: {quiz.createdByUserData?.email} (
                  {quiz.createdByUserData?.userType})
                </p>
                <p className="text-gray-400">
                  Visibility: {quiz.isVisible ? "Visible" : "Hidden"}
                </p>
              </div>

              <div
                className="flex flex-wrap gap-2 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleQuizClick(quiz)}
                  className="px-3 py-1.5 rounded-md bg-zinc-600 text-white text-sm hover:bg-zinc-500"
                >
                  Quiz details
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/quiz/${quiz._id}/userSubmissions?from=quizzes`,
                    )
                  }
                  className="px-3 py-1.5 rounded-md bg-zinc-600 text-white text-sm hover:bg-zinc-500"
                >
                  Users answered
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/quiz/${quiz._id}/editQuiz?from=quizzes`)
                  }
                  className="px-3 py-1.5 rounded-md bg-zinc-600 text-white text-sm hover:bg-zinc-500"
                >
                  Edit quiz
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/quiz/${quiz._id}/settleQuiz?from=quizzes`)
                  }
                  className="px-3 py-1.5 rounded-md bg-zinc-600 text-white text-sm hover:bg-zinc-500"
                >
                  Settle quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
