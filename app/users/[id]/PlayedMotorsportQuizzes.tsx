"use client";

import { Fragment, useState } from "react";
import type {
  MotorsportQuizQuestion,
  MotorsportQuizSubmission,
} from "@/app/interface/userActivity.interface";
import ActivitySection from "@/app/users/[id]/ActivitySection";
import { formatDate, useUserActivity } from "@/app/users/[id]/useUserActivity";

function formatUserSelection(q: MotorsportQuizQuestion): string {
  const { option, value } = q.userAnswer ?? { option: "", value: "" };
  const parts = [option?.trim(), value?.trim()].filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1 || parts[0] === parts[1]) return parts[0]!;
  return `${parts[0]} (${parts[1]})`;
}

/** true / false when the answer is known, null while it isn't set yet. */
function isCorrect(q: MotorsportQuizQuestion): boolean | null {
  if (q.correctAnswer === null || q.correctAnswer === undefined) return null;
  const picked = [q.userAnswer?.option, q.userAnswer?.value].map((v) =>
    v?.trim().toLowerCase(),
  );
  const correct = [q.correctAnswer, q.correctAnswerOption].map((v) =>
    v?.trim().toLowerCase(),
  );
  return picked.some((p) => !!p && correct.includes(p));
}

type Props = { userId: string };

export default function PlayedMotorsportQuizzes({ userId }: Props) {
  const { data, loading, error, load } = useUserActivity<
    MotorsportQuizSubmission[]
  >(userId, "playedMotorsportQuizzesForAdmin", "Failed to load motorsport quizzes");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const items = Array.isArray(data) ? data : [];

  const toggle = (id: string) =>
    setExpandedId((current) => (current === id ? null : id));

  return (
    <ActivitySection
      title="Motorsport quizzes"
      loading={loading}
      error={error}
      isEmpty={items.length === 0}
      emptyText="No motorsport quiz submissions yet."
      onRefresh={() => void load()}
    >
      <div className="overflow-x-auto -mx-2">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead>
            <tr className="border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500">
              <th className="py-2 pr-4 font-medium">Submitted</th>
              <th className="py-2 pr-4 font-medium">Race</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">XP</th>
              <th className="py-2 pr-4 font-medium">Credited</th>
              <th className="py-2 pr-0 font-medium">Questions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const isOpen = expandedId === row.submissionId;
              const questions = row.questions ?? [];
              return (
                <Fragment key={row.submissionId}>
                  <tr
                    onClick={() => toggle(row.submissionId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle(row.submissionId);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Collapse" : "Expand"} motorsport quiz submission ${row.submissionId}`}
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
                        {row.match?.name ?? "Deleted race"}
                      </span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {[
                          row.match?.matchId,
                          row.match?.seasonYear,
                          row.match?.matchStatus,
                          row.match?.raceStartTime
                            ? formatDate(row.match.raceStartTime)
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      {row.quiz?.quizStatus ?? (
                        <span className="text-gray-500">Quiz deleted</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">{row.obtainedXP ?? "—"}</td>
                    <td className="py-3 pr-4">
                      {row.xpCredited ? "Yes" : "No"}
                    </td>
                    <td className="py-3 pr-0">{questions.length}</td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-zinc-800 bg-zinc-950/60">
                      <td colSpan={6} className="py-4 px-3 sm:px-4">
                        {questions.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No question breakdown for this submission.
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {questions.map((q) => {
                              const correct = isCorrect(q);
                              return (
                                <li
                                  key={`${row.submissionId}-q-${q.questionNumber}`}
                                  className={`rounded-lg border bg-zinc-900/80 p-3 text-sm ${
                                    correct === true
                                      ? "border-green-700"
                                      : correct === false
                                        ? "border-red-800"
                                        : "border-zinc-700"
                                  }`}
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                    <p className="text-white font-medium pr-2">
                                      <span className="text-gray-500 font-normal mr-2">
                                        Q{q.questionNumber}.
                                      </span>
                                      {q.questionText ?? "—"}
                                    </p>
                                    {correct !== null && (
                                      <span
                                        className={`text-xs font-medium ${
                                          correct
                                            ? "text-green-400"
                                            : "text-red-400"
                                        }`}
                                      >
                                        {correct ? "Correct" : "Wrong"}
                                      </span>
                                    )}
                                  </div>
                                  {q.questionType && (
                                    <p className="text-xs text-gray-500 mb-1">
                                      {q.questionType}
                                    </p>
                                  )}
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
                                        {q.correctAnswer ?? "—"}
                                      </span>
                                    </div>
                                  </div>
                                  {(q.options?.length ?? 0) > 0 && (
                                    <p className="text-xs text-gray-600 mt-2">
                                      Options: {q.options!.join(" · ")}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
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
    </ActivitySection>
  );
}
