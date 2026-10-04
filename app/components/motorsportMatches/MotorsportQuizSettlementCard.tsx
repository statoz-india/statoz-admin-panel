"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type {
  MotorsportCorrectAnswer,
  MotorsportQuestionType,
  MotorsportQuiz,
  MotorsportQuizQuestion,
  MotorsportQuizSettlementResult,
} from "@/app/models/motorsport-quiz.model";
import { ApiRequestError, apiRequest } from "@/app/utils/apiRequest";
import { stopWheelFromChangingFocusedNumberInput } from "@/app/utils/numberInput";
import { formatIst } from "./motorsportHelpers";

/** Statuses in which the backend already refuses new or edited entries. */
const ENTRY_CLOSED_STATUSES = new Set([
  "ENTRYCLOSED",
  "FINISHED",
  "ANSWER_UPDATED",
  "SETTLEMENT_DONE",
  "NO_RESULT",
  "NOT_ENOUGH_DATA",
  "POSTPONED",
  "UNRESOLVED",
  "CANCELLED",
]);

const INPUT_CLASS =
  "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white";

type NumberedQuestion = MotorsportQuizQuestion & { questionNumber: number };

/** Saved answers by question number. */
type AnswerMap = Record<number, string>;

const answerText = (value: MotorsportQuizQuestion["correctAnswer"]) =>
  value === undefined || value === null ? "" : String(value);

function savedAnswersOf(questions: MotorsportQuizQuestion[]): AnswerMap {
  const out: AnswerMap = {};
  for (const q of questions) {
    const text = answerText(q.correctAnswer);
    if (q.questionNumber !== undefined && text !== "") {
      out[q.questionNumber] = text;
    }
  }
  return out;
}

/**
 * What players pick from: the question's options, or "true"/"false" for a
 * BOOLEAN without any. The app does the same, so these are the exact strings
 * its players send.
 */
function choicesFor(q: MotorsportQuizQuestion): string[] | null {
  if (q.options?.length) return q.options;
  if (q.questionType === "BOOLEAN") return ["true", "false"];
  return null;
}

/** Whether two answers count as equal, the same way settlement compares them. */
function sameAnswer(type: MotorsportQuestionType, a: string, b: string) {
  if (type === "BOOLEAN") return a === b;
  if (type === "NUMERIC") {
    return a.trim() !== "" && b.trim() !== "" && Number(a) === Number(b);
  }
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** A saved answer as the choice it matches, so the right one shows selected. */
function draftFor(q: NumberedQuestion, saved: string): string {
  const choices = choicesFor(q);
  return choices?.find((c) => sameAnswer(q.questionType, c, saved)) ?? saved;
}

const entries = (n: number) => `${n} ${n === 1 ? "entry" : "entries"}`;

/**
 * A settle request that came back with a 4xx was refused before anything ran.
 * Anything else (no response, a 5xx, a gateway timeout) may still be running.
 */
const settleMayStillRun = (err: unknown) =>
  !(err instanceof ApiRequestError) || err.status === 0 || err.status >= 500;

function ConfirmDialog({
  title,
  confirmLabel,
  onCancel,
  onConfirm,
  children,
}: {
  title: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="mt-3 space-y-2 text-sm text-gray-300">{children}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-600 px-3 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface MotorsportQuizSettlementCardProps {
  quiz: MotorsportQuiz;
  /** Re-fetches the quiz quietly, so its status updates without a reload. */
  onChanged: () => Promise<void>;
}

/**
 * Step 1 saves correct answers (`POST /quiz/motorsport/submitCorrectAnswer/:id`).
 * Step 2 settles the quiz (`POST /quiz/motorsport/settle/:id`).
 *
 * `GET /quiz/motorsport/:id` hides saved answers until settlement, so after a
 * reload this card can't tell which answers are saved. The save response
 * returns all of them, so the card learns the full set after any save.
 */
export default function MotorsportQuizSettlementCard({
  quiz,
  onChanged,
}: MotorsportQuizSettlementCardProps) {
  const questions = quiz.questionsArray.filter(
    (q): q is NumberedQuestion => typeof q.questionNumber === "number",
  );
  const status = quiz.quizStatus.toUpperCase();

  // null: the backend hasn't told us what's saved yet.
  const [saved, setSaved] = useState<AnswerMap | null>(() => {
    const initial = savedAnswersOf(quiz.questionsArray);
    return Object.keys(initial).length > 0 ? initial : null;
  });
  const [draft, setDraft] = useState<AnswerMap>(() => {
    const initial = savedAnswersOf(quiz.questionsArray);
    const out: AnswerMap = {};
    for (const q of questions) {
      if (initial[q.questionNumber] !== undefined) {
        out[q.questionNumber] = draftFor(q, initial[q.questionNumber]);
      }
    }
    return out;
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<"save" | "settle" | null>(null);
  const [confirming, setConfirming] = useState<
    { kind: "save"; answers: MotorsportCorrectAnswer[] } | { kind: "settle" } | null
  >(null);
  const [settleResult, setSettleResult] =
    useState<MotorsportQuizSettlementResult | null>(null);
  // Message of a settle request that didn't come back, which may still be running.
  const [unfinishedSettle, setUnfinishedSettle] = useState("");
  const [checking, setChecking] = useState(false);

  const setAnswer = (questionNumber: number, value: string) =>
    setDraft((current) => ({ ...current, [questionNumber]: value }));

  const draftValue = (q: NumberedQuestion) => draft[q.questionNumber] ?? "";

  /** Filled-in answers that aren't saved (all filled ones while `saved` is unknown). */
  const unsaved = questions.filter((q) => {
    const value = draftValue(q).trim();
    if (value === "") return false;
    const stored = saved?.[q.questionNumber];
    return stored === undefined || !sameAnswer(q.questionType, value, stored);
  });
  const missing = saved
    ? questions.filter((q) => saved[q.questionNumber] === undefined)
    : [];

  const buildAnswers = (): {
    answers: MotorsportCorrectAnswer[];
    problems: string[];
  } => {
    const answers: MotorsportCorrectAnswer[] = [];
    const problems: string[] = [];
    for (const q of questions) {
      const value = draftValue(q).trim();
      if (value === "") continue;
      if (q.questionType === "NUMERIC" && !choicesFor(q)) {
        const n = Number(value);
        if (!Number.isFinite(n)) {
          problems.push(`Q${q.questionNumber}: enter a number`);
          continue;
        }
        answers.push({ questionNumber: q.questionNumber, selectedAnswer: n });
      } else {
        answers.push({ questionNumber: q.questionNumber, selectedAnswer: value });
      }
    }
    if (answers.length === 0 && problems.length === 0) {
      problems.push("Fill in at least one answer");
    }
    return { answers, problems };
  };

  const handleSaveClick = () => {
    setNotice("");
    const { answers, problems } = buildAnswers();
    setErrors(problems);
    if (problems.length > 0) return;

    // Saving closes entries at once, so check before doing it early.
    const entriesOpen =
      !ENTRY_CLOSED_STATUSES.has(status) &&
      (!quiz.entryStopTime ||
        new Date(quiz.entryStopTime).getTime() > Date.now());
    if (entriesOpen) setConfirming({ kind: "save", answers });
    else void save(answers);
  };

  const save = async (answers: MotorsportCorrectAnswer[]) => {
    setConfirming(null);
    setBusy("save");
    setErrors([]);
    setNotice("");
    try {
      const updated = await apiRequest<MotorsportQuiz>(
        `/api/quiz/motorsport/${encodeURIComponent(quiz._id)}/submit-correct-answer`,
        { method: "POST", body: JSON.stringify({ answers }) },
        "Failed to save the correct answers",
      );
      const stored = savedAnswersOf(updated.questionsArray ?? []);
      setSaved(stored);
      setDraft(() => {
        const next: AnswerMap = {};
        for (const q of questions) {
          if (stored[q.questionNumber] !== undefined) {
            next[q.questionNumber] = draftFor(q, stored[q.questionNumber]);
          }
        }
        return next;
      });
      setNotice(
        `Saved ${answers.length} answer${answers.length === 1 ? "" : "s"}. Entries are now closed.`,
      );
      await onChanged();
    } catch (err) {
      setErrors(
        err instanceof ApiRequestError && err.errors.length > 0
          ? err.errors
          : [err instanceof Error ? err.message : "Failed to save the correct answers"],
      );
    } finally {
      setBusy(null);
    }
  };

  const settle = async () => {
    setConfirming(null);
    setBusy("settle");
    setErrors([]);
    setNotice("");
    setUnfinishedSettle("");
    try {
      const result = await apiRequest<MotorsportQuizSettlementResult>(
        `/api/quiz/motorsport/${encodeURIComponent(quiz._id)}/settle`,
        { method: "POST" },
        "Failed to settle the quiz",
      );
      setSettleResult(result);
      await onChanged();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to settle the quiz";
      if (settleMayStillRun(err)) setUnfinishedSettle(message);
      else setErrors([message]);
    } finally {
      setBusy(null);
    }
  };

  const checkStatus = async () => {
    setChecking(true);
    try {
      await onChanged();
    } finally {
      setChecking(false);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">
        Correct answers & settlement
      </h2>
      {children}
    </div>
  );

  if (status === "SETTLEMENT_DONE") {
    return shell(
      <div className="rounded-lg border border-purple-800 bg-purple-900/20 p-4 text-sm">
        <p className="font-semibold text-purple-200">This quiz is settled.</p>
        <p className="mt-1 text-purple-200/80">
          XP has been credited and players notified. The correct answers are
          listed under Questions and can no longer change.
        </p>
        {settleResult && (
          <p className="mt-2 text-purple-100">
            {entries(settleResult.submissionsProcessed)} credited in this run.
          </p>
        )}
      </div>,
    );
  }

  if (status === "CANCELLED") {
    return shell(
      <p className="text-gray-400">
        This quiz is cancelled, so it can’t take correct answers or be settled.
      </p>,
    );
  }

  const settleBlocker =
    unsaved.length > 0
      ? "Save your answers first. Settlement uses the saved ones."
      : missing.length > 0
        ? `${missing.map((q) => `Q${q.questionNumber}`).join(", ")} still ${
            missing.length === 1 ? "needs" : "need"
          } a saved answer.`
        : !saved && status !== "ANSWER_UPDATED"
          ? "Save the correct answers first."
          : "";

  return shell(
    <>
      <p className="mb-4 text-sm text-gray-400">
        Save the correct answers once entries have closed, then settle. You can
        save some now and the rest later, and fix an answer until the quiz is
        settled.
      </p>

      {!saved && status === "ANSWER_UPDATED" && (
        <p className="mb-4 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-gray-300">
          Answers have been saved for this quiz, but the backend hides them
          until settlement, so they can’t be shown here. Saving any answer
          brings back the full saved set.
        </p>
      )}

      {errors.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 p-4">
          {errors.length === 1 ? (
            <p className="text-sm text-red-400">{errors[0]}</p>
          ) : (
            <ul className="list-inside list-disc space-y-1 text-sm text-red-400">
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {notice && (
        <p className="mb-4 rounded-lg border border-green-800 bg-green-900/20 p-4 text-sm text-green-200">
          {notice}
        </p>
      )}

      {unfinishedSettle && (
        <div className="mb-4 rounded-lg border border-amber-700 bg-amber-900/20 p-4 text-sm text-amber-100">
          <p className="font-semibold">
            The settle request didn’t finish: {unfinishedSettle}
          </p>
          <p className="mt-2 text-amber-100/80">
            The server may still be settling, or it may have stopped partway.
            Wait until the status reads SETTLEMENT_DONE, or until you’re sure
            it has stopped, before settling again. Two runs at once can credit
            XP twice. A later run only credits the entries that are left.
          </p>
          <button
            type="button"
            onClick={checkStatus}
            disabled={checking}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-amber-600 px-3 py-1.5 text-sm hover:bg-amber-900/40 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
            Check status
          </button>
        </div>
      )}

      {questions.length === 0 ? (
        <p className="text-gray-400">This quiz has no questions.</p>
      ) : (
        <ol className="grid gap-4">
          {questions.map((q) => {
            const choices = choicesFor(q);
            const value = draftValue(q);
            const stored = saved?.[q.questionNumber];
            const isUnsaved = unsaved.includes(q);
            return (
              <li
                key={q._id ?? q.questionNumber}
                className="rounded-lg border border-zinc-700 bg-zinc-800 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <p className="text-white">
                    <span className="text-gray-500">Q{q.questionNumber}.</span>{" "}
                    {q.questionText}
                  </p>
                  <span className="shrink-0 rounded-full bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-200">
                    {q.questionType} · {q.xp} XP
                  </span>
                </div>

                {choices ? (
                  <div className="flex flex-wrap gap-2">
                    {choices.map((choice, i) => {
                      const selected = value === choice;
                      return (
                        <button
                          key={`${choice}-${i}`}
                          type="button"
                          aria-pressed={selected}
                          disabled={busy !== null}
                          // Clicking the selected choice again leaves the question out.
                          onClick={() =>
                            setAnswer(q.questionNumber, selected ? "" : choice)
                          }
                          className={`rounded-md px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed ${
                            selected
                              ? "bg-emerald-900 text-emerald-200 ring-1 ring-emerald-500"
                              : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type={q.questionType === "NUMERIC" ? "number" : "text"}
                    inputMode={q.questionType === "NUMERIC" ? "decimal" : undefined}
                    value={value}
                    disabled={busy !== null}
                    onChange={(e) => setAnswer(q.questionNumber, e.target.value)}
                    onWheel={
                      q.questionType === "NUMERIC"
                        ? stopWheelFromChangingFocusedNumberInput
                        : undefined
                    }
                    placeholder={
                      q.questionType === "NUMERIC"
                        ? "Correct number"
                        : "Correct answer"
                    }
                    className={`${INPUT_CLASS} max-w-sm`}
                  />
                )}

                <p className="mt-2 text-xs">
                  {stored !== undefined ? (
                    <span className="text-emerald-300">Saved: {stored}</span>
                  ) : saved ? (
                    <span className="text-amber-300">No answer saved</span>
                  ) : null}
                  {isUnsaved && (
                    <span className="text-amber-300">
                      {stored !== undefined ? " · " : ""}Not saved yet
                    </span>
                  )}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-zinc-700 pt-4 sm:flex-row sm:items-center sm:justify-end">
        {settleBlocker && (
          <p className="text-sm text-gray-400 sm:mr-auto">{settleBlocker}</p>
        )}
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={busy !== null || questions.length === 0}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "save" ? "Saving..." : "Save correct answers"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming({ kind: "settle" })}
          disabled={busy !== null || Boolean(settleBlocker)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "settle" ? "Settling… this can take minutes" : "Settle quiz"}
        </button>
      </div>

      {confirming?.kind === "save" && (
        <ConfirmDialog
          title="Close entries now?"
          confirmLabel="Save and close entries"
          onCancel={() => setConfirming(null)}
          onConfirm={() => void save(confirming.answers)}
        >
          <p>
            Entries for this quiz are still open
            {quiz.entryStopTime
              ? ` until ${formatIst(quiz.entryStopTime)} IST`
              : ""}
            .
          </p>
          <p>
            Saving answers moves the quiz to ANSWER_UPDATED straight away.
            Players can’t submit or edit entries after that.
          </p>
        </ConfirmDialog>
      )}

      {confirming?.kind === "settle" && (
        <ConfirmDialog
          title={`Settle ${quiz.quizId}?`}
          confirmLabel="Settle quiz"
          onCancel={() => setConfirming(null)}
          onConfirm={() => void settle()}
        >
          <p>
            Every entry is graded against the saved answers, XP is credited and
            each player is notified. This can’t be undone, and the answers
            can’t change afterwards.
          </p>
          <p className="text-gray-400">
            With many entries this can take several minutes. Keep this tab open
            and don’t start another settlement while it runs.
          </p>
          {unfinishedSettle && (
            <p className="text-amber-300">
              The last settle request didn’t finish. If it may still be
              running, cancel and wait: two runs at once can credit XP twice.
            </p>
          )}
        </ConfirmDialog>
      )}
    </>,
  );
}
