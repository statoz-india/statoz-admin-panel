"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Atom } from "react-loading-indicators";
import { useAuthStore } from "@/app/store/authStore";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";
import { apiRequest } from "@/app/utils/apiRequest";
import { MatchIdWithCopy } from "@/app/components/matches/MatchCopyChips";
import {
  formatIst,
  quizStatusClass,
  STATUS_STYLES,
} from "@/app/components/motorsportMatches/motorsportHelpers";
import type { MotorsportQuiz } from "@/app/models/motorsport-quiz.model";

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-gray-400">{label}</p>
      <div className="break-words text-white">{children}</div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
      {children}
    </div>
  );
}

const yesNo = (value: boolean | undefined) =>
  value === undefined ? "—" : value ? "Yes" : "No";

/**
 * Everything `GET /quiz/motorsport/:id` returns for one quiz: its settings, its
 * race, every question, and the caller's own submission. Correct answers are
 * only included by the backend once the quiz is settled.
 */
export default function MotorsportQuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const hasHydrated = useAuthHydrated();

  const raceId = params?.id as string;
  const quizId = params?.quizId as string;

  const [quiz, setQuiz] = useState<MotorsportQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showJson, setShowJson] = useState(false);

  const fetchQuiz = useCallback(
    async (options?: { quiet?: boolean }) => {
      if (!quizId) return;
      if (options?.quiet) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        setQuiz(
          await apiRequest<MotorsportQuiz>(
            `/api/quiz/motorsport/${encodeURIComponent(quizId)}`,
            { method: "GET" },
            "Failed to load the quiz",
          ),
        );
      } catch (err) {
        setQuiz(null);
        setError(err instanceof Error ? err.message : "Failed to load the quiz");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [quizId],
  );

  useEffect(() => {
    if (hasHydrated && isAuthenticated) void fetchQuiz();
  }, [fetchQuiz, hasHydrated, isAuthenticated]);

  // Keep the race page's own `from`, so its Back still goes to the right list.
  const backHref = `/motorsport/${encodeURIComponent(raceId)}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  if (!hasHydrated || !isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error || "Quiz not found"}</p>
          <button
            onClick={() => router.push(backHref)}
            className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
          >
            Back to race
          </button>
        </div>
      </div>
    );
  }

  const race = quiz.match;
  const totalXp = quiz.questionsArray.reduce((sum, q) => sum + (q.xp || 0), 0);
  const answersByNumber = new Map(
    (quiz.userAnswers?.answers ?? []).map((a) => [a.questionNumber, a]),
  );
  const isSettled = quiz.quizStatus === "SETTLEMENT_DONE";

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.push(backHref)}
            className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => fetchQuiz({ quiet: true })}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Quiz info */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="mb-2 text-3xl font-bold text-white">
                {quiz.quizId}
              </h1>
              <p className="break-all text-gray-400">
                Quiz Mongo ID: {quiz._id}
              </p>
              <p className="break-all text-gray-400">
                Race Mongo ID: {quiz.matchId}
              </p>
              <p className="break-all text-gray-400">
                Tournament ID: {quiz.tournament}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${quizStatusClass(
                  quiz.quizStatus,
                )}`}
              >
                {quiz.quizStatus}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  quiz.isVisible
                    ? "bg-emerald-900 text-emerald-200"
                    : "bg-zinc-700 text-zinc-200"
                }`}
              >
                {quiz.isVisible ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <Detail label="Entry Start">{formatIst(quiz.entryStartTime)}</Detail>
            <Detail label="Entry Stop">{formatIst(quiz.entryStopTime)}</Detail>
            <Detail label="Questions">{quiz.questionsArray.length}</Detail>
            <Detail label="Total XP">{totalXp}</Detail>
          </div>

          <div className="mb-4 max-w-md">
            <MatchIdWithCopy id={quiz._id} />
          </div>

          <div className="border-t border-zinc-700 pt-4 text-sm">
            <p className="text-gray-400">
              Created at: {formatIst(quiz.createdAt)}
            </p>
            <p className="text-gray-400">
              Updated at: {formatIst(quiz.updatedAt)}
            </p>
          </div>
        </div>

        {/* Race */}
        {race && (
          <Card title="Race">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-white">
                  {race.matchId} · {race.name}
                </p>
                <p className="text-sm text-gray-400">
                  {race.tournament} · Season {race.seasonYear}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${
                  STATUS_STYLES[race.matchStatus] ?? STATUS_STYLES.Finished
                }`}
              >
                {race.matchStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <Detail label="Race Start Time">
                {formatIst(race.raceStartTime)}
              </Detail>
              <Detail label="Weekend Starts">
                {formatIst(race.raceEventStartDate)}
              </Detail>
              <Detail label="Weekend Ends">
                {formatIst(race.raceEventStopDate)}
              </Detail>
              <Detail label="Race Visible">{yesNo(race.isVisible)}</Detail>
            </div>
          </Card>
        )}

        {/* Questions */}
        <Card title={`Questions (${quiz.questionsArray.length})`}>
          {!isSettled && (
            <p className="mb-4 text-sm text-gray-500">
              Correct answers are hidden by the backend until the quiz is
              settled.
            </p>
          )}
          {quiz.questionsArray.length === 0 ? (
            <p className="text-gray-400">This quiz has no questions.</p>
          ) : (
            <ol className="grid gap-4">
              {quiz.questionsArray.map((q) => {
                const answer =
                  q.questionNumber !== undefined
                    ? answersByNumber.get(q.questionNumber)
                    : undefined;
                return (
                  <li
                    key={q._id ?? q.questionNumber}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="text-white">
                        <span className="text-gray-500">
                          Q{q.questionNumber}.
                        </span>{" "}
                        {q.questionText}
                      </p>
                      <span className="shrink-0 rounded-full bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-200">
                        {q.questionType}
                      </span>
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <Detail label="XP">{q.xp}</Detail>
                      <Detail label="Question Key">{q.questionKey || "—"}</Detail>
                      <Detail label="Correct Answer">
                        {q.correctAnswer || "—"}
                      </Detail>
                      <Detail label="Question ID">
                        <span className="break-all font-mono text-xs">
                          {q._id ?? "—"}
                        </span>
                      </Detail>
                    </div>

                    {q.options?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((option, i) => (
                          <span
                            key={`${option}-${i}`}
                            className={`rounded-md px-3 py-1 text-sm ${
                              q.correctAnswer === option
                                ? "bg-emerald-900 text-emerald-200 ring-1 ring-emerald-500"
                                : "bg-zinc-700 text-zinc-200"
                            }`}
                          >
                            <span className="mr-1.5 text-xs opacity-60">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {option}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {answer && (
                      <p className="mt-3 text-xs text-gray-400">
                        Your answer: {answer.selectedAnswer ?? "—"}
                        {answer.selectedAnswerOption
                          ? ` (${answer.selectedAnswerOption})`
                          : ""}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        {/* The logged-in account's own submission */}
        <Card title="Your submission">
          {quiz.hasUserAttemptedQuiz ? (
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <Detail label="Submitted">
                {formatIst(quiz.userAnswers?.submissionTime)}
              </Detail>
              <Detail label="Answers">
                {quiz.userAnswers?.answers.length ?? 0}
              </Detail>
              <Detail label="Obtained XP">
                {quiz.userAnswers?.obtainedXP ?? "—"}
              </Detail>
              <Detail label="Viewed Results">
                {yesNo(quiz.userAnswers?.hasViewedResults)}
              </Detail>
            </div>
          ) : (
            <p className="text-gray-400">
              This admin account hasn’t submitted answers to this quiz. The
              backend has no admin view of all users’ submissions yet.
            </p>
          )}
        </Card>

        {/* Raw JSON */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Quiz details JSON</h2>
            <button
              type="button"
              onClick={() => setShowJson((prev) => !prev)}
              className="rounded-md bg-zinc-600 px-3 py-1.5 text-sm text-white hover:bg-zinc-500"
            >
              {showJson ? "Hide" : "Show"}
            </button>
          </div>
          {showJson && (
            <pre className="mt-4 max-h-[32rem] overflow-auto rounded-lg border border-zinc-700 bg-zinc-950 p-4 font-mono text-xs text-gray-300">
              {JSON.stringify(quiz, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
