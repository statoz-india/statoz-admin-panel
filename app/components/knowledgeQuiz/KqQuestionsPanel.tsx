"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import type {
  KqAnswerType,
  KqQuestion,
  KqQuestionList,
  KqSport,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_ANSWER_TYPES,
  KQ_ANSWER_TYPE_LABELS,
  KQ_SPORTS,
  KQ_SPORT_LABELS,
  isKqSport,
} from "@/app/interface/knowledge-quiz.interface";
import CreateKqQuestionModal from "./CreateKqQuestionModal";
import { kqApi } from "./kq-api";

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 350;

type SportFilter = KqSport | "all";
type TypeFilter = KqAnswerType | "all";

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const chipClass = (active: boolean) =>
  `rounded-lg border px-3 py-1.5 text-xs transition-colors ${
    active
      ? "border-cyan-500 bg-cyan-950/40 text-white"
      : "border-zinc-700 text-gray-400 hover:bg-zinc-900"
  }`;

export default function KqQuestionsPanel() {
  const [list, setList] = useState<KqQuestionList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KqQuestion | null>(null);

  const [page, setPage] = useState(1);
  const [sportFilter, setSportFilter] = useState<SportFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  /** Ids created in this session, badged in the table so a create is visibly confirmed. */
  const [createdIds, setCreatedIds] = useState<string[]>([]);

  /** Guards against a slow earlier response overwriting a newer one. */
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await kqApi.listQuestions({
        page,
        limit: PAGE_SIZE,
        sportsType: sportFilter === "all" ? undefined : sportFilter,
        answerType: typeFilter === "all" ? undefined : typeFilter,
        search: search || undefined,
      });
      if (requestId !== requestRef.current) return;
      setList(data);
    } catch (e) {
      if (requestId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Failed to load questions");
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [page, sportFilter, typeFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const changeSport = (value: SportFilter) => {
    setSportFilter(value);
    setPage(1);
  };

  const changeType = (value: TypeFilter) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleSaved = (question: KqQuestion, mode: "created" | "updated") => {
    setModalOpen(false);
    setEditing(null);

    if (mode === "updated") {
      setNotice(`Updated ${question.kqQuestionId}`);
      load();
      return;
    }

    setCreatedIds((prev) => [question.kqQuestionId, ...prev]);
    setNotice(
      `Created ${question.kqQuestionId} — "${question.questionText}"${
        sportFilter !== "all" && sportFilter !== question.sportsType
          ? ` (hidden by the ${KQ_SPORT_LABELS[sportFilter]} filter)`
          : ""
      }`,
    );
    // Newest-first ordering puts it at the top of page 1.
    if (page === 1) load();
    else setPage(1);
  };

  const openEdit = (question: KqQuestion) => {
    setEditing(question);
    setModalOpen(true);
  };

  const createdIdSet = useMemo(() => new Set(createdIds), [createdIds]);

  const items = list?.items ?? [];
  const total = list?.total ?? 0;
  const totalPages = list?.totalPages ?? 1;
  const currentPage = list?.page ?? page;
  const hasFilters =
    sportFilter !== "all" || typeFilter !== "all" || search.length > 0;

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = total === 0 ? 0 : rangeStart + items.length - 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          The content bank, newest first. Editing and deleting are not available
          yet.
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
            Create question
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
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search question text or id (e.g. KQ-F-12)"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wide text-gray-600">
              Sport
            </span>
            <button
              type="button"
              onClick={() => changeSport("all")}
              className={chipClass(sportFilter === "all")}
            >
              All
            </button>
            {KQ_SPORTS.map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() => changeSport(sport)}
                className={chipClass(sportFilter === sport)}
              >
                {KQ_SPORT_LABELS[sport]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wide text-gray-600">
              Type
            </span>
            <button
              type="button"
              onClick={() => changeType("all")}
              className={chipClass(typeFilter === "all")}
            >
              All
            </button>
            {KQ_ANSWER_TYPES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => changeType(value)}
                className={chipClass(typeFilter === value)}
              >
                {KQ_ANSWER_TYPE_LABELS[value]}
              </button>
            ))}
          </div>
        </div>

        {loading && list === null ? (
          <div className="flex items-center justify-center gap-2 py-24 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            Loading questions…
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-gray-400">
              {hasFilters
                ? "No questions match these filters."
                : "No knowledge quiz questions yet."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSportFilter("all");
                  setTypeFilter("all");
                  setSearchInput("");
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
                  <th className="px-5 py-3 font-medium">Question id</th>
                  <th className="px-5 py-3 font-medium">Sport</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">XP</th>
                  <th className="px-5 py-3 font-medium">Question</th>
                  <th className="px-5 py-3 font-medium">Correct answer</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {items.map((question) => (
                  <tr key={question._id} className="hover:bg-zinc-900/40">
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="font-mono text-cyan-300">
                        {question.kqQuestionId}
                      </span>
                      {createdIdSet.has(question.kqQuestionId) && (
                        <span className="ml-2 rounded bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                          New
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-300">
                      {isKqSport(question.sportsType)
                        ? KQ_SPORT_LABELS[question.sportsType]
                        : question.sportsType}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-400">
                      {question.answerType}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-300">
                      {question.xp}
                    </td>
                    <td className="max-w-md px-5 py-3 text-gray-300">
                      <span className="line-clamp-2">
                        {question.questionText}
                      </span>
                    </td>
                    <td className="max-w-xs px-5 py-3 text-gray-400">
                      <span className="line-clamp-2">
                        {question.correctAnswer.join(", ")}
                      </span>
                      <span className="text-xs text-gray-600">
                        {question.correctAnswer.length} of{" "}
                        {question.answerOptions.length} options
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                      {formatTime(question.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(question)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-zinc-800"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4">
            <p className="text-xs text-gray-500">
              Showing {rangeStart}–{rangeEnd} of {total} question
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

      {modalOpen && (
        <CreateKqQuestionModal
          key={editing?._id ?? "new"}
          defaultSport={sportFilter === "all" ? "" : sportFilter}
          defaultAnswerType={typeFilter === "all" ? "single" : typeFilter}
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
