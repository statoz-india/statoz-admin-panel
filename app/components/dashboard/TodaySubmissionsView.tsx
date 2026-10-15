"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BrainCircuit,
  CalendarClock,
  ChevronDown,
  HelpCircle,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import type {
  TodayEventSubmission,
  TodayFutureSubmission,
  TodayKnowledgeQuizSubmission,
  TodayPredictionSubmission,
  TodayQuizSubmission,
} from "@/app/interface/dashboard.interface";
import { fetchAdmin } from "@/app/components/dashboard/dashboard-ui";

type TabKey = "quiz" | "knowledgeQuiz" | "prediction" | "event" | "future";

const TABS: {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "quiz", label: "Quiz", icon: HelpCircle },
  { key: "knowledgeQuiz", label: "Knowledge Quiz", icon: BrainCircuit },
  { key: "prediction", label: "Prediction", icon: Target },
  { key: "event", label: "Event", icon: CalendarClock },
  { key: "future", label: "Future", icon: TrendingUp },
];

const TAB_KEYS = TABS.map((t) => t.key);

function isTabKey(value: string | null): value is TabKey {
  return value !== null && (TAB_KEYS as string[]).includes(value);
}

/** "Team Name (ABBR)", or just the name / abbreviation when one is missing. */
function teamLabel(
  team: { name?: string; abbreviation?: string } | null | undefined,
): string {
  if (!team) return "";
  if (team.name && team.abbreviation) {
    return `${team.name} (${team.abbreviation})`;
  }
  return team.name || team.abbreviation || "";
}

/** Localised integer, tolerant of null/undefined/non-numeric input. */
function num(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n.toLocaleString("en-IN") : "0";
}

function formatTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return null;
  const s = status.toUpperCase();
  const tone =
    s === "PAID" || s === "WON"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : s === "LOST"
        ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
        : s === "ONGOING" || s === "OPEN" || s === "PENDING"
          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
          : "bg-zinc-700/40 text-gray-300 border-zinc-600/40";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      {status}
    </span>
  );
}

/** Net coins, coloured green/red, or em-dash when not yet settled. */
function NetCoins({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return <span className="text-gray-500">—</span>;
  }
  const tone =
    value > 0
      ? "text-emerald-400"
      : value < 0
        ? "text-rose-400"
        : "text-gray-300";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={`font-semibold ${tone}`}>
      {sign}
      {value.toLocaleString("en-IN")}
    </span>
  );
}

function UserCell({
  user,
}: {
  user: { userName?: string; email?: string } | null | undefined;
}) {
  return (
    <div className="min-w-0">
      <div className="truncate font-medium text-white">
        {user?.userName || "—"}
      </div>
      <div className="truncate text-xs text-gray-500">{user?.email || "—"}</div>
    </div>
  );
}

function SectionWrap({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-3 text-sm text-gray-400">
        {count.toLocaleString("en-IN")}{" "}
        {count === 1 ? "submission" : "submissions"} today
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-10 text-center text-sm text-gray-500">
      {children}
    </div>
  );
}

function QuizTable({
  rows,
  loading,
}: {
  rows: TodayQuizSubmission[];
  loading: boolean;
}) {
  if (loading) return <EmptyRow>Loading…</EmptyRow>;
  if (rows.length === 0) return <EmptyRow>No quiz submissions today.</EmptyRow>;
  return (
    <SectionWrap count={rows.length}>
      <div className="divide-y divide-zinc-800/60">
        {rows.map((r) => (
          <details key={r.submissionId} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-3 transition-colors hover:bg-zinc-800/40">
              <div className="w-48 shrink-0">
                <UserCell user={r.user} />
              </div>
              <div className="min-w-0 flex-1 text-sm text-gray-300">
                <div className="truncate">
                  {r.quiz?.tournament || "—"}
                  {r.quiz?.quizId && (
                    <span className="ml-2 text-xs text-gray-500">
                      {r.quiz.quizId}
                    </span>
                  )}
                </div>
                {(r.quiz?.teamA || r.quiz?.teamB) && (
                  <div className="truncate text-xs text-gray-500">
                    {teamLabel(r.quiz?.teamA)} vs {teamLabel(r.quiz?.teamB)}
                  </div>
                )}
              </div>
              <div className="hidden w-32 shrink-0 sm:block">
                <StatusBadge status={r.quiz?.quizStatus} />
              </div>
              <div className="w-24 shrink-0 text-right text-sm">
                <span className="font-semibold text-cyan-400">
                  {num(r.obtainedXP)}
                </span>{" "}
                <span className="text-xs text-gray-500">XP</span>
              </div>
              <div className="hidden w-32 shrink-0 text-right text-xs text-gray-500 md:block">
                {formatTime(r.submissionTime)}
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-2 bg-zinc-950/40 px-5 py-4">
              {!r.questions || r.questions.length === 0 ? (
                <p className="text-sm text-gray-500">No questions recorded.</p>
              ) : (
                r.questions.map((q) => {
                  const correct =
                    q.correctAnswer !== null &&
                    q.userAnswer?.value != null &&
                    q.userAnswer.value === q.correctAnswer;
                  return (
                    <div
                      key={q.questionNumber}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
                    >
                      <p className="text-sm font-medium text-gray-200">
                        {q.questionNumber}. {q.questionText}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                        <span className="text-gray-400">
                          Answer:{" "}
                          <span
                            className={
                              q.correctAnswer === null
                                ? "text-gray-200"
                                : correct
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                            }
                          >
                            {q.userAnswer?.value ?? "—"}
                          </span>
                        </span>
                        {q.correctAnswer !== null && (
                          <span className="text-gray-400">
                            Correct:{" "}
                            <span className="text-emerald-400">
                              {q.correctAnswer}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </details>
        ))}
      </div>
    </SectionWrap>
  );
}

/** Three stars, filled up to `count`. */
function StarRow({ count }: { count: number }) {
  const filled = Number.isFinite(count) ? count : 0;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < filled ? "fill-amber-400 text-amber-400" : "text-zinc-700"
          }`}
        />
      ))}
    </span>
  );
}

/** "Cricket · Easy · Foundation 3", skipping whatever the set is missing. */
function setLabel(set: TodayKnowledgeQuizSubmission["knowledgeQuiz"]): string {
  if (!set) return "—";
  const parts: string[] = [];
  if (set.sportsType) parts.push(set.sportsType);
  if (set.category) parts.push(set.category);
  if (set.chapterName || set.chapter !== undefined) {
    parts.push(`${set.chapterName ?? "chapter"} ${set.chapter ?? ""}`.trim());
  }
  return parts.length > 0 ? parts.join(" · ") : "—";
}

function KnowledgeQuizTable({
  rows,
  loading,
}: {
  rows: TodayKnowledgeQuizSubmission[];
  loading: boolean;
}) {
  if (loading) return <EmptyRow>Loading…</EmptyRow>;
  if (rows.length === 0)
    return <EmptyRow>No knowledge quiz submissions today.</EmptyRow>;
  return (
    <SectionWrap count={rows.length}>
      <div className="divide-y divide-zinc-800/60">
        {rows.map((r) => (
          <details key={r.submissionId} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-3 transition-colors hover:bg-zinc-800/40">
              <div className="w-48 shrink-0">
                <UserCell user={r.user} />
              </div>
              <div className="min-w-0 flex-1 text-sm text-gray-300">
                <div className="truncate capitalize">
                  {setLabel(r.knowledgeQuiz)}
                </div>
                <div className="truncate text-xs text-gray-500">
                  {r.knowledgeQuiz?.gameHeading || r.knowledgeQuizId}
                  {r.isReplay && (
                    <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                      Replay
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden w-24 shrink-0 sm:block">
                <StarRow count={r.obtainedStars} />
              </div>
              <div className="w-24 shrink-0 text-right text-sm text-gray-300">
                <span className="font-semibold text-white">
                  {num(r.correctAnswers)}
                </span>
                <span className="text-xs text-gray-500">
                  /{num(r.totalQuestion)}
                </span>
              </div>
              <div className="w-20 shrink-0 text-right text-sm">
                <span className="font-semibold text-cyan-400">
                  {num(r.totalXp)}
                </span>{" "}
                <span className="text-xs text-gray-500">XP</span>
              </div>
              <div className="hidden w-32 shrink-0 text-right text-xs text-gray-500 md:block">
                {formatTime(r.submissionTime)}
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-3 bg-zinc-950/40 px-5 py-4">
              {r.knowledgeQuiz && (
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                  <span>
                    Stars at {r.knowledgeQuiz.oneStarScore ?? "—"} /{" "}
                    {r.knowledgeQuiz.twoStarScore ?? "—"} /{" "}
                    {r.knowledgeQuiz.threeStarScore ?? "—"} XP
                  </span>
                  <span>Entry {num(r.knowledgeQuiz.entryCoins)} coins</span>
                  <span>Reward {num(r.knowledgeQuiz.reward)} coins</span>
                  {r.submissionEditedTime && (
                    <span>Edited {formatTime(r.submissionEditedTime)}</span>
                  )}
                </div>
              )}
              {!r.questions || r.questions.length === 0 ? (
                <p className="text-sm text-gray-500">No questions recorded.</p>
              ) : (
                <div className="space-y-2">
                  {r.questions.map((q, i) => (
                    <div
                      key={`${q.questionId}-${i}`}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-medium text-gray-200">
                          {i + 1}. {q.questionText ?? "Question deleted"}
                        </p>
                        <span className="shrink-0 text-xs text-gray-500">
                          {q.kqQuestionId ?? ""}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                        <span className="text-gray-400">
                          Answer:{" "}
                          <span
                            className={
                              q.isCorrect ? "text-emerald-400" : "text-rose-400"
                            }
                          >
                            {q.userAnswer.length > 0
                              ? q.userAnswer.join(", ")
                              : "—"}
                          </span>
                        </span>
                        {!q.isCorrect && q.correctAnswer && (
                          <span className="text-gray-400">
                            Correct:{" "}
                            <span className="text-emerald-400">
                              {q.correctAnswer.join(", ")}
                            </span>
                          </span>
                        )}
                        <span className="text-gray-400">
                          XP:{" "}
                          <span className="text-cyan-400">
                            {num(q.xpCredited)}
                          </span>
                          {q.questionXp !== null && (
                            <span className="text-gray-600">
                              {" "}
                              / {num(q.questionXp)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </SectionWrap>
  );
}

function PredictionTable({
  rows,
  loading,
}: {
  rows: TodayPredictionSubmission[];
  loading: boolean;
}) {
  if (loading) return <EmptyRow>Loading…</EmptyRow>;
  if (rows.length === 0)
    return <EmptyRow>No prediction submissions today.</EmptyRow>;
  return (
    <SectionWrap count={rows.length}>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-5 py-3 font-medium">User</th>
            <th className="px-5 py-3 font-medium">Match</th>
            <th className="px-5 py-3 font-medium">Chosen</th>
            <th className="px-5 py-3 text-right font-medium">Bet</th>
            <th className="px-5 py-3 text-right font-medium">Net</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {rows.map((r) => (
            <tr key={r.submissionId} className="hover:bg-zinc-800/30">
              <td className="px-5 py-3">
                <UserCell user={r.user} />
              </td>
              <td className="px-5 py-3 text-gray-300">
                {r.prediction?.tournament || "—"}
                <span className="block text-xs text-gray-500">
                  {r.prediction?.gameType}
                </span>
              </td>
              <td className="px-5 py-3 text-gray-200">{r.teamChosen ?? "—"}</td>
              <td className="px-5 py-3 text-right text-gray-200">
                {num(r.coinsBet)}
              </td>
              <td className="px-5 py-3 text-right">
                <NetCoins value={r.netCoins} />
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={r.payoutStatus} />
              </td>
              <td className="hidden px-5 py-3 text-xs text-gray-500 md:table-cell">
                {formatTime(r.submissionTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionWrap>
  );
}

function EventTable({
  rows,
  loading,
}: {
  rows: TodayEventSubmission[];
  loading: boolean;
}) {
  if (loading) return <EmptyRow>Loading…</EmptyRow>;
  if (rows.length === 0)
    return <EmptyRow>No event submissions today.</EmptyRow>;
  return (
    <SectionWrap count={rows.length}>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-5 py-3 font-medium">User</th>
            <th className="px-5 py-3 font-medium">Event</th>
            <th className="px-5 py-3 font-medium">Choice</th>
            <th className="px-5 py-3 text-right font-medium">Bet</th>
            <th className="px-5 py-3 text-right font-medium">Net</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {rows.map((r) => (
            <tr key={r.submissionId} className="hover:bg-zinc-800/30">
              <td className="px-5 py-3">
                <UserCell user={r.user} />
              </td>
              <td className="px-5 py-3 text-gray-300">
                <span className="block max-w-xs truncate">
                  {r.event?.eventName || "—"}
                </span>
                <span className="text-xs text-gray-500">
                  {r.event?.tournament}
                </span>
              </td>
              <td className="px-5 py-3 text-gray-200">
                {r.chosenOption ?? "—"}
                <span className="block text-xs text-gray-500">
                  @ {r.oddsChoice ?? "—"}
                </span>
              </td>
              <td className="px-5 py-3 text-right text-gray-200">
                {num(r.coinsBet)}
              </td>
              <td className="px-5 py-3 text-right">
                <NetCoins value={r.netCoins} />
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={r.payoutStatus} />
              </td>
              <td className="hidden px-5 py-3 text-xs text-gray-500 md:table-cell">
                {formatTime(r.submissionTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionWrap>
  );
}

function FutureTable({
  rows,
  loading,
}: {
  rows: TodayFutureSubmission[];
  loading: boolean;
}) {
  if (loading) return <EmptyRow>Loading…</EmptyRow>;
  if (rows.length === 0)
    return <EmptyRow>No future submissions today.</EmptyRow>;
  return (
    <SectionWrap count={rows.length}>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-5 py-3 font-medium">User</th>
            <th className="px-5 py-3 font-medium">Future</th>
            <th className="px-5 py-3 font-medium">Choice</th>
            <th className="px-5 py-3 text-right font-medium">Bet</th>
            <th className="px-5 py-3 text-right font-medium">Net</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {rows.map((r) => (
            <tr key={r.submissionId} className="hover:bg-zinc-800/30">
              <td className="px-5 py-3">
                <UserCell user={r.user} />
              </td>
              <td className="px-5 py-3 text-gray-300">
                <span className="block max-w-xs truncate">
                  {r.future?.eventName || "—"}
                </span>
                <span className="text-xs text-gray-500">
                  {r.future?.tournament}
                </span>
              </td>
              <td className="px-5 py-3 text-gray-200">
                {r.futureChoice?.choiceName ?? "—"}
                <span className="block text-xs text-gray-500">
                  @ {r.oddsChoice ?? "—"}
                </span>
              </td>
              <td className="px-5 py-3 text-right text-gray-200">
                {num(r.coinsBet)}
              </td>
              <td className="px-5 py-3 text-right">
                <NetCoins value={r.netCoins} />
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={r.payoutStatus} />
              </td>
              <td className="hidden px-5 py-3 text-xs text-gray-500 md:table-cell">
                {formatTime(r.submissionTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionWrap>
  );
}

export default function TodaySubmissionsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const active: TabKey = isTabKey(tabParam) ? tabParam : "quiz";
  const [quiz, setQuiz] = useState<TodayQuizSubmission[]>([]);
  const [knowledgeQuiz, setKnowledgeQuiz] = useState<
    TodayKnowledgeQuizSubmission[]
  >([]);
  const [prediction, setPrediction] = useState<TodayPredictionSubmission[]>([]);
  const [event, setEvent] = useState<TodayEventSubmission[]>([]);
  const [future, setFuture] = useState<TodayFutureSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [
        quizRows,
        knowledgeQuizRows,
        predictionRows,
        eventRows,
        futureRows,
      ] = await Promise.all([
        fetchAdmin<TodayQuizSubmission[]>(
          "/api/admin-api/gettodayquizsubmissions",
        ),
        fetchAdmin<TodayKnowledgeQuizSubmission[]>(
          "/api/admin-api/gettodayknowledgequizsubmissions",
        ),
        fetchAdmin<TodayPredictionSubmission[]>(
          "/api/admin-api/gettodaypredictionsubmissions",
        ),
        fetchAdmin<TodayEventSubmission[]>(
          "/api/admin-api/gettodayeventsubmissions",
        ),
        fetchAdmin<TodayFutureSubmission[]>(
          "/api/admin-api/gettodayfuturesubmissions",
        ),
      ]);
      if (cancelled) return;
      setQuiz(quizRows ?? []);
      setKnowledgeQuiz(knowledgeQuizRows ?? []);
      setPrediction(predictionRows ?? []);
      setEvent(eventRows ?? []);
      setFuture(futureRows ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      quiz: quiz.length,
      knowledgeQuiz: knowledgeQuiz.length,
      prediction: prediction.length,
      event: event.length,
      future: future.length,
    }),
    [quiz, knowledgeQuiz, prediction, event, future],
  );

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={() => router.push("/?section=dashboard")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Today&apos;s submissions
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Detailed quiz, knowledge quiz, prediction, event and future
          submissions for today (Asia/Kolkata).
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() =>
                router.replace(`/today-submissions?tab=${tab.key}`, {
                  scroll: false,
                })
              }
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-300"
                  : "border-zinc-700 bg-zinc-900 text-gray-300 hover:border-cyan-500/40 hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {!loading && (
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-gray-400">
                  {counts[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active === "quiz" && <QuizTable rows={quiz} loading={loading} />}
      {active === "knowledgeQuiz" && (
        <KnowledgeQuizTable rows={knowledgeQuiz} loading={loading} />
      )}
      {active === "prediction" && (
        <PredictionTable rows={prediction} loading={loading} />
      )}
      {active === "event" && <EventTable rows={event} loading={loading} />}
      {active === "future" && <FutureTable rows={future} loading={loading} />}
    </div>
  );
}
