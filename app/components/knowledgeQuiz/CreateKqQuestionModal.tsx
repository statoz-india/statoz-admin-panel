"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2, Plus, X } from "lucide-react";
import type {
  CreateKqQuestionPayload,
  KqAnswerType,
  KqQuestion,
  KqSport,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_ANSWER_TYPES,
  KQ_ANSWER_TYPE_LABELS,
  KQ_SPORTS,
  KQ_SPORT_CODE,
  KQ_SPORT_LABELS,
  validateKqQuestion,
} from "@/app/interface/knowledge-quiz.interface";
import { stopWheelFromChangingFocusedNumberInput } from "@/app/utils/numberInput";
import { kqApi } from "./kq-api";

interface CreateKqQuestionModalProps {
  /** Prefilled from the active list filters so batches of one sport stay fast. */
  defaultSport: KqSport | "";
  defaultAnswerType: KqAnswerType;
  onCreated: (question: KqQuestion) => void;
  onClose: () => void;
}

/** Advisory duplicate lookup — never blocks the submit. */
type DuplicateCheck =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "clear" }
  | { state: "duplicate"; existingId: string };

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none disabled:opacity-60";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400";

export default function CreateKqQuestionModal({
  defaultSport,
  defaultAnswerType,
  onCreated,
  onClose,
}: CreateKqQuestionModalProps) {
  const [sportsType, setSportsType] = useState<KqSport | "">(defaultSport);
  const [answerType, setAnswerType] =
    useState<KqAnswerType>(defaultAnswerType);
  const [questionText, setQuestionText] = useState("");
  const [xp, setXp] = useState<number | "">(1);
  const [options, setOptions] = useState<string[]>(["", ""]);
  /**
   * Correct answers are tracked as indexes into `options`, never as strings.
   * Renaming an option therefore can't orphan the selection, and the payload's
   * `correctAnswer` is built from the same trimmed array as `answerOptions`, so
   * the two can never disagree on whitespace.
   */
  const [correctIndexes, setCorrectIndexes] = useState<number[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<DuplicateCheck>({ state: "idle" });

  const duplicateIndexes = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<number>();
    options.forEach((option, index) => {
      const trimmed = option.trim();
      if (!trimmed) return;
      if (seen.has(trimmed)) dupes.add(index);
      else seen.add(trimmed);
    });
    return dupes;
  }, [options]);

  /**
   * The server enforces uniqueness only on the generated id, never on question
   * text, so a duplicate would otherwise go in silently. Run on blur rather than
   * per keystroke: one request per visit to the field, no debounce machinery.
   */
  const checkForDuplicate = async () => {
    const text = questionText.trim();
    if (!text) {
      setDuplicate({ state: "idle" });
      return;
    }
    setDuplicate({ state: "checking" });
    try {
      const result = await kqApi.listQuestions({ search: text, limit: 5 });
      const match = result.items.find(
        (q) => q.questionText.trim().toLowerCase() === text.toLowerCase(),
      );
      setDuplicate(
        match
          ? { state: "duplicate", existingId: match.kqQuestionId }
          : { state: "clear" },
      );
    } catch {
      // Advisory only — a failed lookup must never stand between an editor and
      // a valid submit.
      setDuplicate({ state: "idle" });
    }
  };

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  const addOption = () => setOptions((prev) => [...prev, ""]);

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
    // Drop the removed index and shift every later one down so the remaining
    // selections still point at the options the editor marked.
    setCorrectIndexes((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const toggleCorrect = (index: number) => {
    if (answerType === "single") {
      setCorrectIndexes([index]);
      return;
    }
    setCorrectIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index].sort((a, b) => a - b),
    );
  };

  const changeAnswerType = (next: KqAnswerType) => {
    if (next === answerType) return;
    setAnswerType(next);
    // A leftover 3-selection under `single` fails server validation, so the
    // selection is cleared rather than silently truncated.
    setCorrectIndexes([]);
  };

  const buildPayload = (): Partial<CreateKqQuestionPayload> => {
    const answerOptions = options.map((o) => o.trim());
    return {
      sportsType: (sportsType || undefined) as KqSport | undefined,
      answerType,
      questionText: questionText.trim(),
      answerOptions,
      correctAnswer: correctIndexes.map((i) => answerOptions[i] ?? ""),
      correctAnswerIndex: correctIndexes,
      xp: xp === "" ? undefined : Number(xp),
    };
  };

  const submit = async () => {
    if (saving) return;
    setError(null);

    const payload = buildPayload();
    const failures = validateKqQuestion(payload);
    if (failures.length > 0) {
      setError(failures.join(", "));
      return;
    }

    setSaving(true);
    try {
      const question = await kqApi.createQuestion(
        payload as CreateKqQuestionPayload,
      );
      onCreated(question);
    } catch (e) {
      // The draft is left untouched — losing a typed-out question to a 400 is
      // the worst outcome on this screen.
      setError(e instanceof Error ? e.message : "Failed to create question");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div className="w-full max-w-3xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              New knowledge quiz question
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              The question id is generated by the server — one sequence per
              sport — and shown once the question is created.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-500 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="kq-sport" className={labelClass}>
                Sport
              </label>
              <select
                id="kq-sport"
                value={sportsType}
                disabled={saving}
                onChange={(e) => setSportsType(e.target.value as KqSport | "")}
                className={inputClass}
              >
                <option value="">-- Select a sport --</option>
                {KQ_SPORTS.map((sport) => (
                  <option key={sport} value={sport}>
                    {KQ_SPORT_LABELS[sport]} (KQ-{KQ_SPORT_CODE[sport]}-…)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="kq-xp" className={labelClass}>
                XP
              </label>
              <input
                id="kq-xp"
                type="number"
                min={0}
                step={1}
                value={xp}
                disabled={saving}
                onChange={(e) =>
                  setXp(e.target.value === "" ? "" : Number(e.target.value))
                }
                onWheel={stopWheelFromChangingFocusedNumberInput}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <span className={labelClass}>Answer type</span>
            <div className="flex gap-2">
              {KQ_ANSWER_TYPES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeAnswerType(value)}
                  disabled={saving}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-60 ${
                    answerType === value
                      ? "border-cyan-500 bg-cyan-950/40 text-white"
                      : "border-zinc-700 text-gray-400 hover:bg-zinc-900"
                  }`}
                >
                  {KQ_ANSWER_TYPE_LABELS[value]}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-600">
              {answerType === "single"
                ? "Exactly one option must be marked correct."
                : "At least two options must be marked correct — the backend rejects a multiple-answer question with one."}
            </p>
          </div>

          <div>
            <label htmlFor="kq-question" className={labelClass}>
              Question
            </label>
            <textarea
              id="kq-question"
              rows={3}
              value={questionText}
              disabled={saving}
              onChange={(e) => {
                setQuestionText(e.target.value);
                setDuplicate({ state: "idle" });
              }}
              onBlur={checkForDuplicate}
              placeholder="Which club has won the most UEFA Champions League titles?"
              className={`${inputClass} resize-y`}
            />
            {duplicate.state === "checking" && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Checking for an existing question with this text…
              </p>
            )}
            {duplicate.state === "clear" && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-600">
                <Check className="h-3.5 w-3.5" />
                No existing question with this exact text.
              </p>
            )}
            {duplicate.state === "duplicate" && (
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-400">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="font-mono">{duplicate.existingId}</span> already
                has this exact question text. The server only enforces
                uniqueness on the generated id, so creating this would make a
                second copy.
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Options
              </span>
              <span className="text-xs text-gray-600">
                {correctIndexes.length} of {options.length} marked correct
              </span>
            </div>

            <div className="space-y-2">
              {options.map((option, index) => {
                const isCorrect = correctIndexes.includes(index);
                const isDuplicate = duplicateIndexes.has(index);
                const emptyButCorrect = isCorrect && option.trim().length === 0;
                return (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <label
                        className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                          isCorrect
                            ? "border-emerald-600 bg-emerald-950/40 text-emerald-300"
                            : "border-zinc-700 text-gray-500 hover:bg-zinc-900"
                        }`}
                      >
                        <input
                          type={answerType === "single" ? "radio" : "checkbox"}
                          name="kq-correct"
                          checked={isCorrect}
                          disabled={saving}
                          onChange={() => toggleCorrect(index)}
                          className="accent-emerald-500"
                        />
                        Correct
                      </label>
                      <input
                        type="text"
                        value={option}
                        disabled={saving}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className={`${inputClass} ${
                          isDuplicate || emptyButCorrect
                            ? "border-red-600 focus:border-red-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        disabled={saving || options.length <= 2}
                        aria-label={`Remove option ${index + 1}`}
                        className="shrink-0 rounded-lg border border-zinc-700 p-2 text-gray-500 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {isDuplicate && (
                      <p className="mt-1 pl-1 text-xs text-red-400">
                        Duplicate option — the server compares options after
                        trimming, so trailing spaces don&apos;t make it unique.
                      </p>
                    )}
                    {emptyButCorrect && (
                      <p className="mt-1 pl-1 text-xs text-red-400">
                        Marked correct but empty.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addOption}
              disabled={saving}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add option
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Creating…" : "Create question"}
          </button>
        </div>
      </div>
    </div>
  );
}
