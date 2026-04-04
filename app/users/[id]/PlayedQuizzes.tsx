"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import type {
  PlayedQuiz,
  PlayedQuizQuestion,
} from "@/app/interface/playedQuiz";
import { Atom } from "react-loading-indicators";

function formatUserSelection(q: PlayedQuizQuestion): string {
  const { option, value } = q.userAnswer;
  const parts = [option?.trim(), value?.trim()].filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0]!;
  if (parts[0] === parts[1]) return parts[0]!;
  return `${parts[0]} (${parts[1]})`;
}

function formatCorrectAnswer(q: PlayedQuizQuestion): string {
  if (q.correctAnswer === null || q.correctAnswer === undefined) {
    return "—";
  }
  return String(q.correctAnswer);
}

type PlayedQuizzesProps = {
  userId: string;
};

export default function PlayedQuizzes({ userId }: PlayedQuizzesProps) {
  const [items, setItems] = useState<PlayedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<
    string | null
  >(null);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/users/${userId}/playedQuizzesForAdmin`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();

      if (!res.ok) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            (typeof response?.error === "string" && response.error) ||
            "Failed to load played quizzes",
        );
        return;
      }

      if (!response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to load played quizzes",
        );
        return;
      }

      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load played quizzes",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h2 className="text-xl font-semibold text-white">Played quizzes</h2>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="px-3 py-1.5 text-sm border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Atom color="#5CDFFF" size="small" text="" textColor="" />
        </div>
      )}

      {!loading && error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-400 text-sm">No quiz submissions yet.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500">
                <th className="py-2 pr-4 font-medium">Submitted</th>
                <th className="py-2 pr-4 font-medium">Match</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">XP</th>
                <th className="py-2 pr-4 font-medium">Credited</th>
                <th className="py-2 pr-0 font-medium">Questions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const isOpen = expandedSubmissionId === row.submissionId;
                const questions = row.questions ?? [];
                return (
                  <Fragment key={row.submissionId}>
                    <tr
                      onClick={() =>
                        setExpandedSubmissionId((id) =>
                          id === row.submissionId ? null : row.submissionId,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setExpandedSubmissionId((id) =>
                            id === row.submissionId ? null : row.submissionId,
                          );
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Collapse" : "Expand"} quiz submission ${row.submissionId}`}
                      className={`border-b border-zinc-800 align-top cursor-pointer select-none hover:bg-zinc-800/40 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${
                        isOpen ? "bg-zinc-800/30" : ""
                      }`}
                    >
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className="inline-block w-4 text-gray-500 mr-1">
                          {isOpen ? "▼" : "▶"}
                        </span>
                        {formatDate(row.submissionTime)}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-white">
                          {row.quiz?.teamA?.displayName ??
                            row.quiz?.teamA?.name}{" "}
                          vs{" "}
                          {row.quiz?.teamB?.displayName ??
                            row.quiz?.teamB?.name}
                        </span>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {row.quiz?.tournament}
                          {row.quiz?.matchStartTime
                            ? ` · ${formatDate(row.quiz.matchStartTime)}`
                            : ""}
                        </div>
                      </td>
                      <td className="py-3 pr-4 capitalize">
                        {row.quiz?.quizStatus ?? "—"}
                      </td>
                      <td className="py-3 pr-4">{row.obtainedXP}</td>
                      <td className="py-3 pr-4">
                        {row.xpCredited ? "Yes" : "No"}
                      </td>
                      <td className="py-3 pr-0">{questions.length}</td>
                    </tr>
                    {isOpen && (
                      <tr
                        key={`${row.submissionId}-detail`}
                        className="border-b border-zinc-800 bg-zinc-950/60"
                      >
                        <td colSpan={6} className="py-4 px-3 sm:px-4">
                          {questions.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              No question breakdown for this submission.
                            </p>
                          ) : (
                            <ul className="space-y-3">
                              {questions.map((q) => (
                                <li
                                  key={`${row.submissionId}-q-${q.questionNumber}`}
                                  className="rounded-lg border border-zinc-700 bg-zinc-900/80 p-3 text-sm"
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                    <p className="text-white font-medium pr-2">
                                      <span className="text-gray-500 font-normal mr-2">
                                        Q{q.questionNumber}.
                                      </span>
                                      {q.questionText}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    {q.questionType}
                                  </p>
                                  <div className="grid gap-1.5 sm:grid-cols-2 text-xs sm:text-sm">
                                    <div>
                                      <span className="text-gray-500 block mb-0.5">
                                        User selected
                                      </span>
                                      <span className="text-gray-200">
                                        {formatUserSelection(q)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 block mb-0.5">
                                        Correct answer
                                      </span>
                                      <span className="text-gray-200">
                                        {formatCorrectAnswer(q)}
                                      </span>
                                    </div>
                                  </div>
                                  {q.options?.length > 0 && (
                                    <p className="text-xs text-gray-600 mt-2">
                                      Options: {q.options.join(" · ")}
                                    </p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
