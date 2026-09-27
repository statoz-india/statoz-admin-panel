"use client";

import { useState, type FormEvent } from "react";
import { Car, Plus, Trash2, Users, X } from "lucide-react";
import type { Team } from "@/app/api/tournament/teams/route";
import type { PlayersBySeason } from "@/app/api/player-dictionary/by-season/route";
import type { MotorsportMatch } from "@/app/models/motorsport-match.model";
import {
  MOTORSPORT_QUESTION_TYPES,
  type CreateMotorsportQuizPayload,
  type MotorsportQuestionType,
  type MotorsportQuiz,
} from "@/app/models/motorsport-quiz.model";
import { ApiRequestError, apiRequest } from "@/app/utils/apiRequest";
import { stopWheelFromChangingFocusedNumberInput } from "@/app/utils/numberInput";
import { isoToIstInput, istInputToIso } from "./motorsportHelpers";

interface DraftQuestion {
  /** Stable React key; indexes shift when a question is removed. */
  key: number;
  questionText: string;
  questionType: MotorsportQuestionType;
  /** Only used for MCQ. */
  options: string[];
  /** Kept as text so the field can be cleared while typing. */
  xp: string;
}

interface CreateMotorsportQuizModalProps {
  race: MotorsportMatch;
  onClose: () => void;
  onCreated: (quiz: MotorsportQuiz) => void;
}

const INPUT_CLASS =
  "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white";
const LABEL_CLASS = "block text-sm font-medium text-gray-300 mb-2";

const TYPE_LABELS: Record<MotorsportQuestionType, string> = {
  MCQ: "MCQ",
  BOOLEAN: "Boolean (Yes/No)",
  NUMERIC: "Numeric",
  ALPHABETICAL: "Alphabetical",
};

let nextQuestionKey = 0;

const blankQuestion = (): DraftQuestion => ({
  key: nextQuestionKey++,
  questionText: "",
  questionType: "MCQ",
  options: ["", ""],
  xp: "10",
});

type OptionSource = "teams" | "drivers";

/** Per-question state of a "fetch teams / drivers" click. */
interface FillState {
  loading?: OptionSource;
  message?: string;
  isError?: boolean;
}

/** Teams of the race's tournament in its season, A to Z. */
async function fetchTeamNames(race: MotorsportMatch): Promise<string[]> {
  const params = new URLSearchParams({
    tournament: race.tournament,
    season: race.seasonYear,
  });
  const teams = await apiRequest<Team[]>(
    `/api/tournament/teams/by-season?${params.toString()}`,
    { method: "GET" },
    "Failed to fetch teams",
  );
  return uniqueSorted(teams.map((t) => t.displayName || t.name));
}

/** Drivers (players) of the race's tournament in its season, A to Z. */
async function fetchDriverNames(race: MotorsportMatch): Promise<string[]> {
  const params = new URLSearchParams({
    tournament: race.tournamentId || race.tournament,
    season: race.seasonYear,
  });
  const result = await apiRequest<PlayersBySeason>(
    `/api/player-dictionary/by-season?${params.toString()}`,
    { method: "GET" },
    "Failed to fetch drivers",
  );
  return uniqueSorted((result?.items ?? []).map((p) => p.playerName));
}

function uniqueSorted(names: (string | undefined)[]): string[] {
  return [
    ...new Set(names.map((n) => n?.trim()).filter((n): n is string => !!n)),
  ].sort((a, b) => a.localeCompare(b));
}

/** Now, as an IST `datetime-local` value. */
const nowIstInput = () => isoToIstInput(new Date().toISOString());

/** Collects every problem at once, like the backend does. */
function validate(
  entryStartTime: string,
  entryStopTime: string,
  questions: DraftQuestion[],
): string[] {
  const errors: string[] = [];
  if (!entryStartTime) errors.push("Entry start time is required");
  if (
    entryStartTime &&
    entryStopTime &&
    new Date(istInputToIso(entryStopTime)) <=
      new Date(istInputToIso(entryStartTime))
  ) {
    errors.push("Entry stop time must be after entry start time");
  }
  if (questions.length === 0) errors.push("Add at least one question");

  questions.forEach((q, i) => {
    const n = i + 1;
    if (!q.questionText.trim()) errors.push(`Question ${n}: text is required`);
    const xp = Number(q.xp);
    if (q.xp.trim() === "" || !Number.isFinite(xp) || xp <= 0) {
      errors.push(`Question ${n}: XP must be a positive number`);
    }
    if (q.questionType === "MCQ") {
      const filled = q.options.filter((o) => o.trim());
      if (filled.length < 2) {
        errors.push(`Question ${n}: MCQ needs at least 2 options`);
      }
    }
  });
  return errors;
}

/**
 * Creates a quiz on one race via `POST /quiz/createMotorsportQuiz`. The race is
 * fixed (this opens from its detail page) and the tournament comes from it
 * server-side. Question numbers are left to the server, which assigns them in
 * order.
 */
export default function CreateMotorsportQuizModal({
  race,
  onClose,
  onCreated,
}: CreateMotorsportQuizModalProps) {
  const [entryStartTime, setEntryStartTime] = useState(nowIstInput);
  // Default the cut-off to the race start so nobody answers mid-race.
  const [entryStopTime, setEntryStopTime] = useState(() =>
    isoToIstInput(race.raceStartTime),
  );
  const [questions, setQuestions] = useState<DraftQuestion[]>(() => [
    blankQuestion(),
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fill, setFill] = useState<Record<number, FillState>>({});

  /**
   * Replaces a question's options with the season's teams or drivers and
   * makes it an MCQ, since that is the only type that takes options.
   */
  const fillOptions = async (key: number, source: OptionSource) => {
    setFill((current) => ({ ...current, [key]: { loading: source } }));
    const label = source === "teams" ? "teams" : "drivers";
    try {
      const names =
        source === "teams"
          ? await fetchTeamNames(race)
          : await fetchDriverNames(race);
      if (names.length === 0) {
        setFill((current) => ({
          ...current,
          [key]: {
            message: `No ${label} found for ${race.tournament} ${race.seasonYear}.`,
            isError: true,
          },
        }));
        return;
      }
      setQuestions((current) =>
        current.map((q) =>
          q.key === key ? { ...q, questionType: "MCQ", options: names } : q,
        ),
      );
      setFill((current) => ({
        ...current,
        [key]: { message: `Added ${names.length} ${label} as options.` },
      }));
    } catch (err) {
      setFill((current) => ({
        ...current,
        [key]: {
          message:
            err instanceof Error ? err.message : `Failed to fetch ${label}`,
          isError: true,
        },
      }));
    }
  };

  const updateQuestion = (index: number, patch: Partial<DraftQuestion>) =>
    setQuestions((current) =>
      current.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    );

  const updateOption = (qIndex: number, oIndex: number, value: string) =>
    setQuestions((current) =>
      current.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) }
          : q,
      ),
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const problems = validate(entryStartTime, entryStopTime, questions);
    setErrors(problems);
    if (problems.length > 0) return;

    const payload: CreateMotorsportQuizPayload = {
      matchId: race._id,
      entryStartTime: istInputToIso(entryStartTime),
      ...(entryStopTime ? { entryStopTime: istInputToIso(entryStopTime) } : {}),
      questionsArray: questions.map((q) => ({
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        xp: Number(q.xp),
        ...(q.questionType === "MCQ"
          ? { options: q.options.map((o) => o.trim()).filter(Boolean) }
          : {}),
      })),
    };

    setLoading(true);
    try {
      const quiz = await apiRequest<MotorsportQuiz>(
        "/api/quiz/motorsport",
        { method: "POST", body: JSON.stringify(payload) },
        "Failed to create the quiz",
      );
      onCreated(quiz);
    } catch (err) {
      if (err instanceof ApiRequestError && err.errors.length > 0) {
        setErrors(err.errors);
      } else {
        setErrors([
          err instanceof Error ? err.message : "Failed to create the quiz",
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-zinc-900">
        <div className="border-b border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white">Create quiz</h2>
          <p className="mt-1 text-sm text-gray-400">
            For {race.matchId} · {race.name}. The quiz id (e.g.{" "}
            {race.matchId}-Q1) and question numbers are assigned by the server.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Entry start (IST) *</label>
              <input
                type="datetime-local"
                value={entryStartTime}
                onChange={(e) => setEntryStartTime(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Entry stop (IST)</label>
              <input
                type="datetime-local"
                value={entryStopTime}
                onChange={(e) => setEntryStopTime(e.target.value)}
                className={INPUT_CLASS}
              />
              <p className="mt-1 text-xs text-gray-500">
                Users can’t submit or edit answers after this. Defaults to the
                race start; clear it for no cut-off.
              </p>
            </div>
          </div>

          <div className="mb-6 border-t border-zinc-800 pt-4">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Questions ({questions.length})
            </h3>

            <div className="space-y-4">
              {questions.map((question, qIndex) => (
                <div
                  key={question.key}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4"
                >
                  <div className="mb-3 flex items-start gap-2">
                    <div className="flex-1">
                      <label className={LABEL_CLASS}>
                        Question {qIndex + 1} *
                      </label>
                      <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(qIndex, {
                            questionText: e.target.value,
                          })
                        }
                        placeholder="e.g., Who will win the race?"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions((current) =>
                          current.filter((_, i) => i !== qIndex),
                        )
                      }
                      aria-label={`Remove question ${qIndex + 1}`}
                      className="mt-7 rounded-md border border-zinc-600 p-2 text-zinc-300 hover:border-red-800 hover:bg-red-900/40 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLASS}>Type *</label>
                      <select
                        value={question.questionType}
                        onChange={(e) =>
                          updateQuestion(qIndex, {
                            questionType: e.target
                              .value as MotorsportQuestionType,
                          })
                        }
                        className={INPUT_CLASS}
                      >
                        {MOTORSPORT_QUESTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>XP *</label>
                      <input
                        type="number"
                        min={1}
                        value={question.xp}
                        onChange={(e) =>
                          updateQuestion(qIndex, { xp: e.target.value })
                        }
                        onWheel={stopWheelFromChangingFocusedNumberInput}
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["teams", "Fetch all teams", Users],
                          ["drivers", "Fetch all drivers", Car],
                        ] as const
                      ).map(([source, text, Icon]) => (
                        <button
                          key={source}
                          type="button"
                          disabled={Boolean(fill[question.key]?.loading)}
                          onClick={() => fillOptions(question.key, source)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-cyan-700/60 bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-200 hover:bg-cyan-900/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {fill[question.key]?.loading === source
                            ? "Fetching..."
                            : text}
                        </button>
                      ))}
                    </div>
                    {fill[question.key]?.message && (
                      <p
                        className={`mt-1 text-xs ${
                          fill[question.key]?.isError
                            ? "text-red-400"
                            : "text-gray-500"
                        }`}
                      >
                        {fill[question.key]?.message}
                      </p>
                    )}
                  </div>

                  {question.questionType === "MCQ" && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">
                          Options *
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuestion(qIndex, {
                              options: [...question.options, ""],
                            })
                          }
                          className="inline-flex items-center gap-1 rounded-md border border-zinc-600 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-700"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateOption(qIndex, oIndex, e.target.value)
                              }
                              placeholder={`Option ${oIndex + 1}`}
                              className={INPUT_CLASS}
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuestion(qIndex, {
                                    options: question.options.filter(
                                      (_, j) => j !== oIndex,
                                    ),
                                  })
                                }
                                aria-label={`Remove option ${oIndex + 1}`}
                                className="rounded-md border border-zinc-600 p-2 text-zinc-300 hover:bg-zinc-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setQuestions((current) => [...current, blankQuestion()])
              }
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-zinc-600 px-4 py-2 text-sm text-white hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              Add question
            </button>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
