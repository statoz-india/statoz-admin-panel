"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Atom } from "react-loading-indicators";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Quiz, QuizQuestion } from "@/app/api/quiz/route";
import { QuizSubmission } from "@/app/api/quiz/[id]/user-response/route";

type QuizGraphPanelProps = {
  quiz: Quiz;
  embedded?: boolean;
};

function normalizeOptionValue(val: string): string {
  if (val.toLowerCase() === "true") return "Yes";
  if (val.toLowerCase() === "false") return "No";
  return val;
}

function getEffectiveOptions(question: QuizQuestion): string[] {
  const type = question.questionType?.toUpperCase();
  if (question.options && question.options.length > 0) {
    return question.options.map(normalizeOptionValue);
  }
  if (type === "BOOLEAN") {
    return ["Yes", "No"];
  }
  return [];
}

function getCorrectAnswerLabel(question: QuizQuestion): string | null {
  const raw = question.correctAnswer;
  if (raw === undefined || raw === null || raw === "") return null;
  return normalizeOptionValue(String(raw));
}

function answersMatch(userAnswer: string, correctAnswer: string): boolean {
  return normalizeOptionValue(userAnswer.trim()) === correctAnswer;
}

const BAR_COLORS = [
  "#5CDFFF",
  "#A78BFA",
  "#F472B6",
  "#FBBF24",
  "#34D399",
  "#FB923C",
  "#60A5FA",
];

const PIE_COLORS = {
  correct: "#22C55E",
  incorrect: "#EF4444",
  unanswered: "#71717A",
};

function countCorrectAnswersForUser(
  submission: QuizSubmission,
  questions: QuizQuestion[],
): number {
  let correct = 0;
  for (const question of questions) {
    const correctLabel = getCorrectAnswerLabel(question);
    if (correctLabel === null) continue;

    const answer = submission.answers?.find(
      (a) => a.questionNumber === question.questionNumber,
    );
    if (!answer) continue;

    const selected =
      answer.selectedAnswer?.trim() ||
      answer.selectedAnswerOption?.trim() ||
      "";

    if (selected && answersMatch(selected, correctLabel)) {
      correct += 1;
    }
  }
  return correct;
}

function getScoreBucketColor(correctCount: number, total: number): string {
  if (total === 0) return PIE_COLORS.unanswered;
  const ratio = correctCount / total;
  if (ratio >= 1) return "#22C55E";
  if (ratio >= 0.75) return "#84CC16";
  if (ratio >= 0.5) return "#EAB308";
  if (ratio >= 0.25) return "#F97316";
  return "#EF4444";
}

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#18181b",
    border: "1px solid #3f3f46",
    borderRadius: "6px",
    color: "#fff",
  },
  labelStyle: { color: "#fff" },
  itemStyle: { color: "#fff" },
} as const;

export default function QuizGraphPanel({
  quiz,
  embedded,
}: QuizGraphPanelProps) {
  const params = useParams();
  const quizId = params?.id as string;
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`/api/quiz/${quizId}/user-response`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const json = await res.json();
        if (!cancelled) {
          if (!res.ok || !json.success) {
            setSubmissions([]);
            setFetchError(json.message || `HTTP ${res.status}`);
          } else {
            setSubmissions(
              Array.isArray(json.data) ? (json.data as QuizSubmission[]) : [],
            );
          }
        }
      } catch (e) {
        if (!cancelled) {
          setSubmissions([]);
          setFetchError(e instanceof Error ? e.message : "Request failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const questions = quiz.questionsArray ?? [];
  const isSettled = quiz.quizStatus?.toUpperCase() === "SETTLEMENT_DONE";

  const questionCharts = useMemo(() => {
    return questions.map((question) => {
      const options = getEffectiveOptions(question);
      const correctLabel = getCorrectAnswerLabel(question);
      const counts = new Map<string, number>();

      for (const opt of options) {
        counts.set(opt, 0);
      }

      for (const submission of submissions) {
        const answer = submission.answers?.find(
          (a) => a.questionNumber === question.questionNumber,
        );
        if (!answer) continue;

        const selected = normalizeOptionValue(
          answer.selectedAnswer?.trim() || answer.selectedAnswerOption?.trim() || "",
        );
        if (!selected) continue;

        const matchedOption =
          options.find((opt) => opt === selected) ??
          options.find(
            (opt) => opt.toLowerCase() === selected.toLowerCase(),
          );

        if (matchedOption) {
          counts.set(matchedOption, (counts.get(matchedOption) ?? 0) + 1);
        } else {
          counts.set(selected, (counts.get(selected) ?? 0) + 1);
        }
      }

      const chartData = Array.from(counts.entries()).map(
        ([option, count], idx) => ({
          option,
          count,
          isCorrect: correctLabel !== null && option === correctLabel,
          fill:
            correctLabel !== null && option === correctLabel
              ? PIE_COLORS.correct
              : BAR_COLORS[idx % BAR_COLORS.length],
        }),
      );

      const totalResponses = chartData.reduce((sum, d) => sum + d.count, 0);

      return {
        question,
        chartData,
        correctLabel,
        totalResponses,
      };
    });
  }, [questions, submissions]);

  const overallStats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    for (const submission of submissions) {
      for (const question of questions) {
        const correctLabel = getCorrectAnswerLabel(question);
        const answer = submission.answers?.find(
          (a) => a.questionNumber === question.questionNumber,
        );

        if (!answer) {
          unanswered += 1;
          continue;
        }

        if (!isSettled || correctLabel === null) {
          continue;
        }

        const selected =
          answer.selectedAnswer?.trim() ||
          answer.selectedAnswerOption?.trim() ||
          "";

        if (answersMatch(selected, correctLabel)) {
          correct += 1;
        } else {
          incorrect += 1;
        }
      }
    }

    return { correct, incorrect, unanswered };
  }, [submissions, questions, isSettled]);

  const pieData = useMemo(() => {
    const items = [
      { name: "Correct", value: overallStats.correct, color: PIE_COLORS.correct },
      {
        name: "Incorrect",
        value: overallStats.incorrect,
        color: PIE_COLORS.incorrect,
      },
      {
        name: "Unanswered",
        value: overallStats.unanswered,
        color: PIE_COLORS.unanswered,
      },
    ];
    return items.filter((item) => item.value > 0);
  }, [overallStats]);

  const userScorePieData = useMemo(() => {
    const total = questions.length;
    if (!isSettled || total === 0) return [];

    const buckets = new Map<number, number>();
    for (let i = 0; i <= total; i += 1) {
      buckets.set(i, 0);
    }

    for (const submission of submissions) {
      const correctCount = countCorrectAnswersForUser(submission, questions);
      buckets.set(correctCount, (buckets.get(correctCount) ?? 0) + 1);
    }

    return Array.from(buckets.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([correctCount, userCount]) => ({
        name:
          correctCount === total
            ? `All correct (${correctCount}/${total})`
            : correctCount === 0
              ? `All wrong (0/${total})`
              : `${correctCount}/${total} correct`,
        value: userCount,
        color: getScoreBucketColor(correctCount, total),
        correctCount,
      }))
      .filter((item) => item.value > 0);
  }, [submissions, questions, isSettled]);

  const totalAnswerSlots = submissions.length * questions.length;

  return (
    <div
      className={
        embedded
          ? "bg-zinc-900 rounded-lg border border-zinc-700 p-6"
          : "bg-zinc-900 p-6"
      }
    >
      <h2 className="text-2xl font-bold text-white mb-2">Quiz analytics</h2>
      <p className="text-sm text-gray-400 mb-6">
        Option distribution per question
        {isSettled ? " with settled correct answers" : " (correct answers shown after settlement)"}.
        {" "}
        {submissions.length} submission{submissions.length !== 1 ? "s" : ""}.
      </p>

      {fetchError && (
        <p className="text-amber-400 text-sm mb-4">Warning: {fetchError}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      ) : questions.length === 0 ? (
        <p className="text-gray-400">No questions on this quiz yet.</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-400">No submissions to chart yet.</p>
      ) : (
        <div className="space-y-10">
          {questionCharts.map(
            ({ question, chartData, correctLabel, totalResponses }, idx) => (
              <div
                key={question._id || idx}
                className="p-5 border border-zinc-700 rounded-lg bg-zinc-800/40"
              >
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-400">
                      Question {question.questionNumber || idx + 1}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-zinc-700 text-gray-300 rounded">
                      {question.questionType}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-blue-900/50 text-blue-300 rounded">
                      {question.xp} XP
                    </span>
                  </div>
                  <p className="text-white text-lg mb-2">{question.questionText}</p>
                  {isSettled && correctLabel ? (
                    <p className="text-sm text-green-400">
                      Correct answer: <span className="font-semibold">{correctLabel}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-amber-400">
                      Correct answer pending settlement
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {totalResponses} response{totalResponses !== 1 ? "s" : ""} for this question
                  </p>
                </div>

                {chartData.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                        <XAxis
                          dataKey="option"
                          tick={{ fill: "#a1a1aa", fontSize: 12 }}
                          interval={0}
                          angle={chartData.length > 3 ? -20 : 0}
                          textAnchor={chartData.length > 3 ? "end" : "middle"}
                          height={chartData.length > 3 ? 60 : 30}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: "#a1a1aa", fontSize: 12 }}
                        />
                        <Tooltip
                          {...TOOLTIP_STYLE}
                          formatter={(value, _name, props) => {
                            const count = Number(value ?? 0);
                            const isCorrect = Boolean(
                              props &&
                                typeof props === "object" &&
                                "payload" in props &&
                                props.payload &&
                                typeof props.payload === "object" &&
                                "isCorrect" in props.payload &&
                                props.payload.isCorrect,
                            );
                            return [
                              `${count} user${count !== 1 ? "s" : ""}${isCorrect ? " (correct)" : ""}`,
                              "Responses",
                            ];
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, barIdx) => (
                            <Cell key={barIdx} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No responses for this question.</p>
                )}

                <div className="mt-3 flex flex-wrap gap-3">
                  {chartData.map((entry) => (
                    <div
                      key={entry.option}
                      className="flex items-center gap-2 text-xs text-gray-400"
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: entry.fill }}
                      />
                      <span>
                        {entry.option}: {entry.count}
                        {entry.isCorrect ? " ✓" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}

          <div className="p-5 border border-zinc-700 rounded-lg bg-zinc-800/40">
            <h3 className="text-xl font-semibold text-white mb-2">
              Overall answer accuracy
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Across {submissions.length} user{submissions.length !== 1 ? "s" : ""} and{" "}
              {questions.length} question{questions.length !== 1 ? "s" : ""} (
              {totalAnswerSlots} total slots).
              {!isSettled && " Accuracy breakdown is available after settlement."}
            </p>

            {isSettled && pieData.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="h-72 w-full max-w-md">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={{ stroke: "#a1a1aa" }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        {...TOOLTIP_STYLE}
                        formatter={(value) => {
                          const count = Number(value ?? 0);
                          return [`${count} answer${count !== 1 ? "s" : ""}`];
                        }}
                      />
                      <Legend
                        wrapperStyle={{ color: "#a1a1aa", fontSize: "13px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
                  <div className="p-4 rounded-lg bg-green-900/20 border border-green-800">
                    <p className="text-green-400 text-sm mb-1">Correct</p>
                    <p className="text-2xl font-bold text-white">
                      {overallStats.correct}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-900/20 border border-red-800">
                    <p className="text-red-400 text-sm mb-1">Incorrect</p>
                    <p className="text-2xl font-bold text-white">
                      {overallStats.incorrect}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-800 border border-zinc-600">
                    <p className="text-gray-400 text-sm mb-1">Unanswered</p>
                    <p className="text-2xl font-bold text-white">
                      {overallStats.unanswered}
                    </p>
                  </div>
                </div>
              </div>
            ) : isSettled ? (
              <p className="text-gray-500 text-sm">No accuracy data to display.</p>
            ) : (
              <p className="text-amber-400 text-sm">
                Settle the quiz to see how many users answered correctly vs incorrectly.
              </p>
            )}
          </div>

          <div className="p-5 border border-zinc-700 rounded-lg bg-zinc-800/40">
            <h3 className="text-xl font-semibold text-white mb-2">
              User score distribution
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              How many users got each number of questions correct — from all
              correct down to all wrong.
              {!isSettled && " Available after settlement."}
            </p>

            {isSettled && userScorePieData.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="h-80 w-full max-w-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userScorePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label={({ name, percent }) =>
                          `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={{ stroke: "#a1a1aa" }}
                      >
                        {userScorePieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        {...TOOLTIP_STYLE}
                        formatter={(value) => {
                          const count = Number(value ?? 0);
                          return [
                            `${count} user${count !== 1 ? "s" : ""}`,
                          ];
                        }}
                      />
                      <Legend
                        wrapperStyle={{ color: "#a1a1aa", fontSize: "13px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-2 flex-1 w-full">
                  {userScorePieData.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-700"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-300">{entry.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {entry.value} user{entry.value !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : isSettled ? (
              <p className="text-gray-500 text-sm">No user score data to display.</p>
            ) : (
              <p className="text-amber-400 text-sm">
                Settle the quiz to see how users scored across all questions.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
