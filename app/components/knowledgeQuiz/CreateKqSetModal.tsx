"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2, Search, X } from "lucide-react";
import type {
  CreateKqSetPayload,
  KqChapterName,
  KqQuestion,
  KqSet,
  KqSetCategory,
  KqSportQuiz,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_CHAPTER_NAMES,
  KQ_SET_CATEGORIES,
  KQ_SPORT_LABELS,
  KQ_STAR_MINIMUMS,
  validateKqSet,
} from "@/app/interface/knowledge-quiz.interface";
import { stopWheelFromChangingFocusedNumberInput } from "@/app/utils/numberInput";
import { kqApi } from "./kq-api";

interface CreateKqSetModalProps {
  /** Sports with a quiz row — a chapter must belong to one. */
  sports: KqSportQuiz[];
  /** When set, the modal edits this chapter instead of creating one. */
  existing?: KqSet | null;
  onSaved: (set: KqSet, mode: "created" | "updated") => void;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none disabled:opacity-60";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400";

const chipClass = (active: boolean) =>
  `rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors ${
    active
      ? "border-cyan-500 bg-cyan-950/40 text-white"
      : "border-zinc-700 text-gray-400 hover:bg-zinc-900"
  }`;

function populatedQuestions(set: KqSet): KqQuestion[] {
  return set.knowledgeQuizQuestions.filter(
    (q): q is KqQuestion =>
      typeof q === "object" && q !== null && "_id" in q,
  );
}

export default function CreateKqSetModal({
  sports,
  existing = null,
  onSaved,
  onClose,
}: CreateKqSetModalProps) {
  const isEdit = existing !== null;

  const [knowledgeQuizId, setKnowledgeQuizId] = useState(
    existing?.knowledgeQuizId ?? "",
  );
  const [category, setCategory] = useState<KqSetCategory>(
    existing?.category ?? "easy",
  );
  const [chapterName, setChapterName] = useState<KqChapterName>(
    existing?.chapterName ?? "foundation",
  );
  const [chapter, setChapter] = useState<number | "">(existing?.chapter ?? 1);

  const [threeStarScore, setThreeStarScore] = useState<number | "">(
    existing?.threeStarScore ?? KQ_STAR_MINIMUMS.threeStarScore,
  );
  const [twoStarScore, setTwoStarScore] = useState<number | "">(
    existing?.twoStarScore ?? KQ_STAR_MINIMUMS.twoStarScore,
  );
  const [oneStarScore, setOneStarScore] = useState<number | "">(
    existing?.oneStarScore ?? KQ_STAR_MINIMUMS.oneStarScore,
  );
  const [reward, setReward] = useState<number | "">(existing?.reward ?? 100);
  const [entryCoins, setEntryCoins] = useState<number | "">(
    existing?.entryCoins ?? 0,
  );

  const [selected, setSelected] = useState<KqQuestion[]>(() =>
    existing ? populatedQuestions(existing) : [],
  );
  const [questionSearch, setQuestionSearch] = useState("");
  const [results, setResults] = useState<KqQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [takenChapters, setTakenChapters] = useState<number[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSport = useMemo(
    () => sports.find((s) => s._id === knowledgeQuizId) ?? null,
    [sports, knowledgeQuizId],
  );

  /**
   * `chapter` is unique per quiz + category, so the existing chapters for that
   * pair are fetched. On create, the next free number is offered; on edit the
   * current chapter is kept and excluded from the clash list.
   */
  const loadTakenChapters = useCallback(async () => {
    if (!knowledgeQuizId) {
      setTakenChapters(null);
      return;
    }
    try {
      const list = await kqApi.listSets({
        knowledgeQuizId,
        category,
        limit: 100,
      });
      const taken = list.items
        .filter((s) => s._id !== existing?._id)
        .map((s) => s.chapter);
      setTakenChapters(taken);
      if (!isEdit) {
        setChapter(taken.length === 0 ? 1 : Math.max(...taken) + 1);
      }
    } catch {
      // Advisory only — a failed lookup must not block authoring.
      setTakenChapters(null);
    }
  }, [knowledgeQuizId, category, existing?._id, isEdit]);

  useEffect(() => {
    loadTakenChapters();
  }, [loadTakenChapters]);

  /**
   * Questions default to the selected quiz's sport. Nothing enforces the match
   * server-side, but a football chapter asking cricket questions is almost
   * always a mistake.
   */
  const loadQuestions = useCallback(async () => {
    if (!selectedSport) {
      setResults([]);
      return;
    }
    setQuestionsLoading(true);
    try {
      const list = await kqApi.listQuestions({
        sportsType: selectedSport.sportsType,
        search: questionSearch.trim() || undefined,
        limit: 25,
      });
      setResults(list.items);
    } catch {
      setResults([]);
    } finally {
      setQuestionsLoading(false);
    }
  }, [selectedSport, questionSearch]);

  useEffect(() => {
    const timer = setTimeout(loadQuestions, 300);
    return () => clearTimeout(timer);
  }, [loadQuestions]);

  const selectedIds = useMemo(
    () => new Set(selected.map((q) => q._id)),
    [selected],
  );

  const toggleQuestion = (question: KqQuestion) => {
    setSelected((prev) =>
      prev.some((q) => q._id === question._id)
        ? prev.filter((q) => q._id !== question._id)
        : [...prev, question],
    );
  };

  const chapterTaken =
    takenChapters !== null &&
    typeof chapter === "number" &&
    takenChapters.includes(chapter);

  const numeric = (value: number | "") =>
    value === "" ? undefined : Number(value);

  const starsOutOfOrder =
    typeof threeStarScore === "number" &&
    typeof twoStarScore === "number" &&
    typeof oneStarScore === "number" &&
    !(threeStarScore > twoStarScore && twoStarScore > oneStarScore);

  const submit = async () => {
    if (saving) return;
    setError(null);

    const payload: Partial<CreateKqSetPayload> = {
      knowledgeQuizId,
      category,
      chapter: numeric(chapter),
      chapterName,
      threeStarScore: numeric(threeStarScore),
      twoStarScore: numeric(twoStarScore),
      oneStarScore: numeric(oneStarScore),
      reward: numeric(reward),
      entryCoins: numeric(entryCoins) ?? 0,
      knowledgeQuizQuestions: selected.map((q) => q._id),
    };

    const failures = validateKqSet(payload);
    if (failures.length > 0) {
      setError(failures.join(", "));
      return;
    }

    setSaving(true);
    try {
      if (isEdit && existing) {
        const set = await kqApi.updateSet(existing._id, {
          knowledgeQuizId: payload.knowledgeQuizId,
          category: payload.category,
          chapter: payload.chapter,
          chapterName: payload.chapterName,
          threeStarScore: payload.threeStarScore,
          twoStarScore: payload.twoStarScore,
          oneStarScore: payload.oneStarScore,
          reward: payload.reward,
          entryCoins: payload.entryCoins,
          knowledgeQuizQuestions: payload.knowledgeQuizQuestions,
        });
        onSaved(set, "updated");
      } else {
        onSaved(
          await kqApi.createSet(payload as CreateKqSetPayload),
          "created",
        );
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : `Failed to ${isEdit ? "update" : "create"} chapter`,
      );
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div className="w-full max-w-3xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isEdit ? "Edit chapter" : "New chapter"}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              A playable set: its scoring thresholds, its economy, and the
              questions it asks.
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
          {!isEdit && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-800 bg-amber-950/40 px-4 py-3 text-xs text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Chapter number is unique per sport quiz and difficulty. You can
                edit thresholds, rewards, and questions after creating.
              </span>
            </div>
          )}

          <div>
            <label htmlFor="kq-set-quiz" className={labelClass}>
              Sport quiz
            </label>
            <select
              id="kq-set-quiz"
              value={knowledgeQuizId}
              disabled={saving}
              onChange={(e) => {
                setKnowledgeQuizId(e.target.value);
                setSelected([]);
              }}
              className={inputClass}
            >
              <option value="">-- Select a sport quiz --</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>
                  {KQ_SPORT_LABELS[sport.sportsType] ?? sport.sportsType} —{" "}
                  {sport.gameHeading}
                </option>
              ))}
            </select>
            {sports.length === 0 && (
              <p className="mt-1.5 text-xs text-amber-400">
                No sport quizzes exist yet. Create one under Home screen sports
                first.
              </p>
            )}
          </div>

          <div>
            <span className={labelClass}>Difficulty</span>
            <div className="flex flex-wrap gap-2">
              {KQ_SET_CATEGORIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={saving}
                  onClick={() => setCategory(value)}
                  className={chipClass(category === value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-600">
              Chapters are numbered per difficulty track, so chapter 1 can exist
              once for each.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="kq-set-chapter" className={labelClass}>
                Chapter number
              </label>
              <input
                id="kq-set-chapter"
                type="number"
                min={1}
                step={1}
                value={chapter}
                disabled={saving}
                onChange={(e) =>
                  setChapter(e.target.value === "" ? "" : Number(e.target.value))
                }
                onWheel={stopWheelFromChangingFocusedNumberInput}
                className={`${inputClass} ${
                  chapterTaken ? "border-red-600 focus:border-red-500" : ""
                }`}
              />
              {chapterTaken ? (
                <p className="mt-1.5 text-xs text-red-400">
                  Chapter {chapter} already exists for this quiz at {category}{" "}
                  difficulty.
                </p>
              ) : (
                takenChapters !== null && (
                  <p className="mt-1.5 text-xs text-gray-600">
                    {takenChapters.length === 0
                      ? "No chapters yet for this quiz and difficulty."
                      : `Existing: ${[...takenChapters].sort((a, b) => a - b).join(", ")}`}
                  </p>
                )
              )}
            </div>

            <div>
              <label htmlFor="kq-set-chapter-name" className={labelClass}>
                Chapter name
              </label>
              <select
                id="kq-set-chapter-name"
                value={chapterName}
                disabled={saving}
                onChange={(e) =>
                  setChapterName(e.target.value as KqChapterName)
                }
                className={`${inputClass} capitalize`}
              >
                {KQ_CHAPTER_NAMES.map((name) => (
                  <option key={name} value={name} className="capitalize">
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className={labelClass}>Star thresholds</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["threeStarScore", "3 stars", threeStarScore, setThreeStarScore],
                  ["twoStarScore", "2 stars", twoStarScore, setTwoStarScore],
                  ["oneStarScore", "1 star", oneStarScore, setOneStarScore],
                ] as const
              ).map(([field, label, value, setValue]) => (
                <div key={field}>
                  <label
                    htmlFor={`kq-${field}`}
                    className="mb-1 block text-xs text-gray-500"
                  >
                    {label} (min {KQ_STAR_MINIMUMS[field]})
                  </label>
                  <input
                    id={`kq-${field}`}
                    type="number"
                    min={KQ_STAR_MINIMUMS[field]}
                    step={1}
                    value={value}
                    disabled={saving}
                    onChange={(e) =>
                      setValue(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    onWheel={stopWheelFromChangingFocusedNumberInput}
                    className={`${inputClass} ${
                      starsOutOfOrder
                        ? "border-red-600 focus:border-red-500"
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>
            {starsOutOfOrder && (
              <p className="mt-1.5 text-xs text-red-400">
                Thresholds must descend strictly: 3 stars &gt; 2 stars &gt; 1
                star. Equal values are rejected too, or one score would qualify
                for two tiers.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="kq-set-reward" className={labelClass}>
                Reward
              </label>
              <input
                id="kq-set-reward"
                type="number"
                min={0}
                step={1}
                value={reward}
                disabled={saving}
                onChange={(e) =>
                  setReward(e.target.value === "" ? "" : Number(e.target.value))
                }
                onWheel={stopWheelFromChangingFocusedNumberInput}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="kq-set-entry" className={labelClass}>
                Entry coins
              </label>
              <input
                id="kq-set-entry"
                type="number"
                min={0}
                step={1}
                value={entryCoins}
                disabled={saving}
                onChange={(e) =>
                  setEntryCoins(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                onWheel={stopWheelFromChangingFocusedNumberInput}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-gray-600">
                Defaults to 0 — free to enter.
              </p>
            </div>
          </div>

          {/* ---------------- Question picker ---------------- */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Questions
              </span>
              <span className="text-xs text-gray-600">
                {selected.length} selected
              </span>
            </div>

            {!selectedSport ? (
              <p className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-6 text-center text-xs text-gray-600">
                Select a sport quiz to browse its questions.
              </p>
            ) : (
              <>
                {selected.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {selected.map((question) => (
                      <button
                        key={question._id}
                        type="button"
                        disabled={saving}
                        onClick={() => toggleQuestion(question)}
                        title={question.questionText}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-700 bg-emerald-950/40 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:border-red-600 hover:text-red-300"
                      >
                        {question.kqQuestionId}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                  <input
                    type="search"
                    value={questionSearch}
                    disabled={saving}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    placeholder={`Search ${KQ_SPORT_LABELS[selectedSport.sportsType] ?? ""} questions`}
                    className={`${inputClass} pl-9`}
                  />
                </div>

                <div className="max-h-64 overflow-y-auto rounded-lg border border-zinc-800">
                  {questionsLoading ? (
                    <p className="flex items-center justify-center gap-2 py-8 text-xs text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading questions…
                    </p>
                  ) : results.length === 0 ? (
                    <p className="py-8 text-center text-xs text-gray-600">
                      No questions found for this sport.
                    </p>
                  ) : (
                    <ul className="divide-y divide-zinc-800/70">
                      {results.map((question) => {
                        const checked = selectedIds.has(question._id);
                        return (
                          <li key={question._id}>
                            <label className="flex cursor-pointer items-start gap-3 px-3 py-2.5 hover:bg-zinc-900/60">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={saving}
                                onChange={() => toggleQuestion(question)}
                                className="mt-0.5 accent-cyan-500"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="font-mono text-xs text-cyan-300">
                                  {question.kqQuestionId}
                                </span>
                                <span className="ml-2 text-xs text-gray-600">
                                  {question.xp} XP · {question.answerType}
                                </span>
                                <span className="mt-0.5 block truncate text-sm text-gray-300">
                                  {question.questionText}
                                </span>
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-gray-600">
                  Attaching a question also records this chapter on the question
                  itself.
                </p>
              </>
            )}
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
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {saving
              ? isEdit
                ? "Saving…"
                : "Creating…"
              : isEdit
                ? "Save changes"
                : "Create chapter"}
          </button>
        </div>
      </div>
    </div>
  );
}
