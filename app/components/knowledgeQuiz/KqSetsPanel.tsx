"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  Plus,
  RefreshCw,
  Star,
} from "lucide-react";
import type {
  KqChapterName,
  KqSet,
  KqSetCategory,
  KqSetList,
  KqSportQuiz,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_CHAPTER_NAMES,
  KQ_SET_CATEGORIES,
  KQ_SPORT_LABELS,
} from "@/app/interface/knowledge-quiz.interface";
import CreateKqSetModal from "./CreateKqSetModal";
import { kqApi } from "./kq-api";

const PAGE_SIZE = 50;

type CategoryFilter = KqSetCategory | "all";
type ChapterNameFilter = KqChapterName | "all";

const chipClass = (active: boolean) =>
  `rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors ${
    active
      ? "border-cyan-500 bg-cyan-950/40 text-white"
      : "border-zinc-700 text-gray-400 hover:bg-zinc-900"
  }`;

const CATEGORY_BADGE: Record<KqSetCategory, string> = {
  easy: "bg-emerald-950/60 text-emerald-400",
  medium: "bg-amber-950/60 text-amber-400",
  hard: "bg-rose-950/60 text-rose-400",
  global: "bg-violet-950/60 text-violet-400",
};

export default function KqSetsPanel() {
  const [list, setList] = useState<KqSetList | null>(null);
  const [sports, setSports] = useState<KqSportQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KqSet | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [quizFilter, setQuizFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [chapterNameFilter, setChapterNameFilter] =
    useState<ChapterNameFilter>("all");

  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      // `includeQuestions` stays off here — the expanded form carries every
      // correct answer and a list view has no use for it.
      const data = await kqApi.listSets({
        page,
        limit: PAGE_SIZE,
        knowledgeQuizId: quizFilter === "all" ? undefined : quizFilter,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        chapterName:
          chapterNameFilter === "all" ? undefined : chapterNameFilter,
      });
      if (requestId !== requestRef.current) return;
      setList(data);
    } catch (e) {
      if (requestId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Failed to load chapters");
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [page, quizFilter, categoryFilter, chapterNameFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const loadSports = useCallback(async () => {
    try {
      setSports(await kqApi.listSports());
    } catch {
      // The chapter list still works without sport names; the create form
      // surfaces its own message when there is nothing to attach a chapter to.
      setSports([]);
    }
  }, []);

  useEffect(() => {
    loadSports();
  }, [loadSports]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const sportById = useMemo(() => {
    const map = new Map<string, KqSportQuiz>();
    sports.forEach((s) => map.set(s._id, s));
    return map;
  }, [sports]);

  const handleSaved = (set: KqSet, mode: "created" | "updated") => {
    const sport = sportById.get(set.knowledgeQuizId);
    const label = sport
      ? (KQ_SPORT_LABELS[sport.sportsType] ?? sport.sportsType)
      : "quiz";
    setNotice(
      mode === "created"
        ? `Created chapter ${set.chapter} (${set.category}) for ${label} with ${
            set.knowledgeQuizQuestions.length
          } question${set.knowledgeQuizQuestions.length === 1 ? "" : "s"}`
        : `Updated chapter ${set.chapter} (${set.category}) for ${label}`,
    );
    setModalOpen(false);
    setEditing(null);
    if (mode === "created" && page !== 1) setPage(1);
    else load();
  };

  const openEdit = async (set: KqSet) => {
    if (openingId) return;
    setOpeningId(set._id);
    setError(null);
    try {
      const fresh = await kqApi.getSet(set._id, { includeQuestions: true });
      setEditing(fresh);
      setModalOpen(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load chapter details",
      );
    } finally {
      setOpeningId(null);
    }
  };

  const items = list?.items ?? [];
  const total = list?.total ?? 0;
  const totalPages = list?.totalPages ?? 1;
  const currentPage = list?.page ?? page;
  const hasFilters =
    quizFilter !== "all" ||
    categoryFilter !== "all" ||
    chapterNameFilter !== "all";

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = total === 0 ? 0 : rangeStart + items.length - 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-gray-500">
          Playable chapters, in chapter order. Click a row to edit scoring,
          rewards, and questions.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            <Plus className="h-4 w-4" />
            Create chapter
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/30">
        <div className="space-y-3 border-b border-zinc-800 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wide text-gray-600">
              Quiz
            </span>
            <select
              value={quizFilter}
              onChange={(e) => {
                setQuizFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All sports</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>
                  {KQ_SPORT_LABELS[sport.sportsType] ?? sport.sportsType}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wide text-gray-600">
              Difficulty
            </span>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter("all");
                setPage(1);
              }}
              className={chipClass(categoryFilter === "all")}
            >
              All
            </button>
            {KQ_SET_CATEGORIES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setCategoryFilter(value);
                  setPage(1);
                }}
                className={chipClass(categoryFilter === value)}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wide text-gray-600">
              Name
            </span>
            <button
              type="button"
              onClick={() => {
                setChapterNameFilter("all");
                setPage(1);
              }}
              className={chipClass(chapterNameFilter === "all")}
            >
              All
            </button>
            {KQ_CHAPTER_NAMES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setChapterNameFilter(value);
                  setPage(1);
                }}
                className={chipClass(chapterNameFilter === value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {loading && list === null ? (
          <div className="flex items-center justify-center gap-2 py-24 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            Loading chapters…
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-gray-400">
              {hasFilters
                ? "No chapters match these filters."
                : "No chapters yet."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuizFilter("all");
                  setCategoryFilter("all");
                  setChapterNameFilter("all");
                  setPage(1);
                }}
                className="mt-3 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-zinc-800"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className={`overflow-x-auto ${loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Chapter</th>
                  <th className="px-5 py-3 font-medium">Sport</th>
                  <th className="px-5 py-3 font-medium">Difficulty</th>
                  <th className="px-5 py-3 font-medium">Stars (3/2/1)</th>
                  <th className="px-5 py-3 font-medium">Entry</th>
                  <th className="px-5 py-3 font-medium">Reward</th>
                  <th className="px-5 py-3 font-medium">Questions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {items.map((set) => {
                  const sport = sportById.get(set.knowledgeQuizId);
                  return (
                    <tr
                      key={set._id}
                      onClick={() => openEdit(set)}
                      className={`cursor-pointer hover:bg-zinc-900/40 ${
                        openingId === set._id ? "opacity-60" : ""
                      }`}
                    >
                      <td className="whitespace-nowrap px-5 py-3">
                        <span className="text-gray-200">{set.chapter}</span>
                        <span className="ml-2 text-xs capitalize text-gray-500">
                          {set.chapterName}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-300">
                        {sport
                          ? (KQ_SPORT_LABELS[sport.sportsType] ??
                            sport.sportsType)
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${CATEGORY_BADGE[set.category]}`}
                        >
                          {set.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-300">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400" />
                          {set.threeStarScore} / {set.twoStarScore} /{" "}
                          {set.oneStarScore}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-400">
                        {set.entryCoins === 0 ? "Free" : set.entryCoins}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-300">
                        {set.reward}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-400">
                        {set.knowledgeQuizQuestions.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4">
            <p className="text-xs text-gray-500">
              Showing {rangeStart}–{rangeEnd} of {total} chapter
              {total === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!list?.hasMore || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-4 text-xs text-gray-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
        <p>
          Chapter number stays unique per sport quiz and difficulty. Updating a
          chapter replaces its question list and syncs each question&apos;s
          back-reference. There is still no delete endpoint.
        </p>
      </div>

      {modalOpen && (
        <CreateKqSetModal
          key={editing?._id ?? "new"}
          sports={sports}
          existing={editing}
          onSaved={handleSaved}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
