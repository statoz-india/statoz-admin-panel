"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  RefreshCw,
  Search,
  Star,
  X,
} from "lucide-react";
import type {
  KqChapterName,
  KqObtainedStars,
  KqSetCategory,
  KqSport,
  KqSubmission,
  KqSubmissionList,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_CHAPTER_NAMES,
  KQ_OBTAINED_STARS,
  KQ_SET_CATEGORIES,
  KQ_SPORTS,
  KQ_SPORT_LABELS,
  starsForXp,
} from "@/app/interface/knowledge-quiz.interface";
import { kqApi } from "./kq-api";

const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 350;

type SportFilter = KqSport | "all";
type CategoryFilter = KqSetCategory | "all";
type ChapterNameFilter = KqChapterName | "all";
type StarsFilter = KqObtainedStars | "all";
type ReplayFilter = "all" | "first" | "replay";

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

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * A `type="date"` value is a calendar day, but the filter compares against an
 * instant. Widen each bound to the edge of that local day so a range typed as
 * `1 Aug → 15 Aug` includes everything played on the 15th.
 */
function dayStartIso(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function dayEndIso(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function starRow(count: number) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2].map((index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < count ? "fill-amber-400 text-amber-400" : "text-zinc-700"
          }`}
        />
      ))}
    </span>
  );
}

export type KqSubmissionsPanelProps = {
  /** Pinned from the URL — the panel shows a removable chip rather than a picker. */
  userId?: string;
  setId?: string;
  onClearPinned?: (kind: "userId" | "setId") => void;
};

export default function KqSubmissionsPanel({
  userId,
  setId,
  onClearPinned,
}: KqSubmissionsPanelProps) {
  const [list, setList] = useState<KqSubmissionList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sportFilter, setSportFilter] = useState<SportFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [chapterNameFilter, setChapterNameFilter] =
    useState<ChapterNameFilter>("all");
  const [starsFilter, setStarsFilter] = useState<StarsFilter>("all");
  const [replayFilter, setReplayFilter] = useState<ReplayFilter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  /** Guards against a slow earlier response overwriting a newer one. */
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await kqApi.listSubmissions({
        page,
        limit: PAGE_SIZE,
        userId: userId || undefined,
        setId: setId || undefined,
        sportsType: sportFilter === "all" ? undefined : sportFilter,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        chapterName:
          chapterNameFilter === "all" ? undefined : chapterNameFilter,
        obtainedStars: starsFilter === "all" ? undefined : starsFilter,
        isReplay:
          replayFilter === "all" ? undefined : replayFilter === "replay",
        from: dayStartIso(fromDate),
        to: dayEndIso(toDate),
        search: search || undefined,
      });
      if (requestId !== requestRef.current) return;
      setList(data);
    } catch (e) {
      if (requestId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Failed to load submissions");
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [
    page,
    userId,
    setId,
    sportFilter,
    categoryFilter,
    chapterNameFilter,
    starsFilter,
    replayFilter,
    fromDate,
    toDate,
    search,
  ]);

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

  // Every filter change resets paging: page 3 of the previous result set means
  // nothing once the filters move.
  const changeSport = (value: SportFilter) => {
    setSportFilter(value);
    setPage(1);
  };

  const changeCategory = (value: CategoryFilter) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const changeChapterName = (value: ChapterNameFilter) => {
    setChapterNameFilter(value);
    setPage(1);
  };

  const changeStars = (value: StarsFilter) => {
    setStarsFilter(value);
    setPage(1);
  };

  const changeReplay = (value: ReplayFilter) => {
    setReplayFilter(value);
    setPage(1);
  };

  const changeFrom = (value: string) => {
    setFromDate(value);
    setPage(1);
  };

  const changeTo = (value: string) => {
    setToDate(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSportFilter("all");
    setCategoryFilter("all");
    setChapterNameFilter("all");
    setStarsFilter("all");
    setReplayFilter("all");
    setFromDate("");
    setToDate("");
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const items = list?.items ?? [];
  const total = list?.total ?? 0;
  const totalPages = list?.totalPages ?? 1;
  const currentPage = list?.page ?? page;
  const hasFilters =
    sportFilter !== "all" ||
    categoryFilter !== "all" ||
    chapterNameFilter !== "all" ||
    starsFilter !== "all" ||
    replayFilter !== "all" ||
    fromDate !== "" ||
    toDate !== "" ||
    search.length > 0;

  const invertedRange =
    fromDate !== "" && toDate !== "" && fromDate > toDate;

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = total === 0 ? 0 : rangeStart + items.length - 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-gray-500">
          Every knowledge quiz play, newest first. Click a row to see the
          per-question breakdown.
        </p>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {(userId || setId) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-cyan-800 bg-cyan-950/20 px-4 py-3 text-xs text-cyan-200">
          <span className="uppercase tracking-wide text-cyan-500">Pinned</span>
          {userId && (
            <span className="inline-flex items-center gap-1.5 rounded border border-cyan-800 px-2 py-1 font-mono">
              user {userId}
              {onClearPinned && (
                <button
                  type="button"
                  onClick={() => onClearPinned("userId")}
                  aria-label="Remove user filter"
                  className="text-cyan-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          )}
          {setId && (
            <span className="inline-flex items-center gap-1.5 rounded border border-cyan-800 px-2 py-1 font-mono">
              chapter {setId}
              {onClearPinned && (
                <button
                  type="button"
                  onClick={() => onClearPinned("setId")}
                  aria-label="Remove chapter filter"
                  className="text-cyan-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          )}
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
              placeholder="Search player by username or email"
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
              Difficulty
            </span>
            <button
              type="button"
              onClick={() => changeCategory("all")}
              className={chipClass(categoryFilter === "all")}
            >
              All
            </button>
            {KQ_SET_CATEGORIES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => changeCategory(value)}
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
              onClick={() => changeChapterName("all")}
              className={chipClass(chapterNameFilter === "all")}
            >
              All
            </button>
            {KQ_CHAPTER_NAMES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => changeChapterName(value)}
                className={chipClass(chapterNameFilter === value)}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wide text-gray-600">
              Stars
            </span>
            <button
              type="button"
              onClick={() => changeStars("all")}
              className={chipClass(starsFilter === "all")}
            >
              Any
            </button>
            {KQ_OBTAINED_STARS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => changeStars(value)}
                className={chipClass(starsFilter === value)}
              >
                {value}★
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wide text-gray-600">
              Play
            </span>
            {(
              [
                ["all", "Any"],
                ["first", "First play"],
                ["replay", "Replay"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => changeReplay(value)}
                className={chipClass(replayFilter === value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wide text-gray-600">
              Played
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => changeFrom(e.target.value)}
              aria-label="From date"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-xs text-gray-600">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => changeTo(e.target.value)}
              aria-label="To date"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setPage(1);
                }}
                className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-gray-400 hover:bg-zinc-900"
              >
                Clear dates
              </button>
            )}
            {invertedRange && (
              <span className="text-xs text-amber-400">
                From is after To — no submissions can match.
              </span>
            )}
          </div>
        </div>

        {loading && list === null ? (
          <div className="flex items-center justify-center gap-2 py-24 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            Loading submissions…
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-gray-400">
              {hasFilters || userId || setId
                ? "No submissions match these filters."
                : "No knowledge quiz submissions yet."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-zinc-800"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className={`overflow-x-auto ${loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Player</th>
                  <th className="px-5 py-3 font-medium">Sport</th>
                  <th className="px-5 py-3 font-medium">Chapter</th>
                  <th className="px-5 py-3 font-medium">Difficulty</th>
                  <th className="px-5 py-3 font-medium">Stars</th>
                  <th className="px-5 py-3 font-medium">XP</th>
                  <th className="px-5 py-3 font-medium">Correct</th>
                  <th className="px-5 py-3 font-medium">Play</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {items.map((submission) => (
                  <SubmissionRows
                    key={submission._id}
                    submission={submission}
                    expanded={expandedId === submission._id}
                    onToggle={() =>
                      setExpandedId((current) =>
                        current === submission._id ? null : submission._id,
                      )
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4">
            <p className="text-xs text-gray-500">
              Showing {rangeStart}–{rangeEnd} of {total} submission
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
          Submissions are read-only — there is no edit or delete endpoint. A
          replay is a re-play of a chapter the player had already finished; only
          the first play credits the chapter reward. Filters combine, so a
          difficulty that disagrees with a pinned chapter returns an empty page.
        </p>
      </div>
    </div>
  );
}

function SubmissionRows({
  submission,
  expanded,
  onToggle,
}: {
  submission: KqSubmission;
  expanded: boolean;
  onToggle: () => void;
}) {
  const set = submission.knowledgeQuizId;
  const sport = set?.knowledgeQuizId ?? null;
  const user = submission.userId;
  const correct = submission.kqAnswers.filter((a) => a.isCorrect).length;

  // Stars are stored on the submission; recompute from the thresholds so a
  // disagreement (a set re-scored after the play) is visible rather than hidden.
  const derivedStars = set ? starsForXp(submission.totalXp, set) : null;
  const starsDisagree =
    derivedStars !== null && derivedStars !== submission.obtainedStars;

  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer hover:bg-zinc-900/40"
      >
        <td className="px-5 py-3">
          <p className="text-gray-200">{user?.userName ?? "—"}</p>
          <p className="text-xs text-gray-600">{user?.email ?? "Deleted user"}</p>
        </td>
        <td className="whitespace-nowrap px-5 py-3 text-gray-300">
          {sport
            ? (KQ_SPORT_LABELS[sport.sportsType] ?? sport.sportsType)
            : "—"}
        </td>
        <td className="whitespace-nowrap px-5 py-3">
          <span className="text-gray-200">{set ? set.chapter : "—"}</span>
          {set && (
            <span className="ml-2 text-xs capitalize text-gray-500">
              {set.chapterName}
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-5 py-3">
          {set ? (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${CATEGORY_BADGE[set.category]}`}
            >
              {set.category}
            </span>
          ) : (
            <span className="text-gray-600">—</span>
          )}
        </td>
        <td className="whitespace-nowrap px-5 py-3">
          {starRow(submission.obtainedStars)}
        </td>
        <td className="whitespace-nowrap px-5 py-3">
          <span className="text-gray-200">{submission.totalXp}</span>
          {set && (
            <span className="ml-2 text-xs text-gray-600">
              of {set.threeStarScore}
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-5 py-3 text-gray-300">
          {correct} / {submission.totalQuestion}
        </td>
        <td className="whitespace-nowrap px-5 py-3">
          {submission.isReplay ? (
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Replay
            </span>
          ) : (
            <span className="rounded bg-cyan-950/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-400">
              First
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-5 py-3 text-gray-500">
          {formatTime(submission.submissionTime)}
        </td>
        <td className="whitespace-nowrap px-5 py-3 text-right">
          <ChevronDown
            className={`inline h-4 w-4 text-gray-500 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </td>
      </tr>

      {expanded && (
        <tr className="bg-zinc-950/60">
          <td colSpan={10} className="px-5 py-4">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-gray-400">
              {set && (
                <>
                  <span>
                    Star cut-offs:{" "}
                    <span className="text-gray-200">
                      3★ ≥ {set.threeStarScore} · 2★ ≥ {set.twoStarScore} · 1★ ≥{" "}
                      {set.oneStarScore}
                    </span>
                  </span>
                  <span>
                    Entry:{" "}
                    <span className="text-gray-200">
                      {set.entryCoins === 0 ? "Free" : `${set.entryCoins} coins`}
                    </span>
                  </span>
                  <span>
                    Reward: <span className="text-gray-200">{set.reward}</span>
                  </span>
                </>
              )}
              <span className="font-mono text-gray-600">
                submission {submission._id}
              </span>
            </div>

            {starsDisagree && (
              <p className="mt-3 flex items-start gap-2 rounded-lg border border-amber-800 bg-amber-950/30 px-3 py-2 text-xs text-amber-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Stored stars ({submission.obtainedStars}) disagree with the
                chapter&apos;s current cut-offs ({derivedStars}) — the thresholds
                were most likely edited after this play.
              </p>
            )}

            {submission.kqAnswers.length === 0 ? (
              <p className="mt-3 text-xs text-gray-500">
                No answers recorded on this submission.
              </p>
            ) : (
              <table className="mt-3 w-full text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wide text-gray-600">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Question id</th>
                    <th className="py-2 pr-4 font-medium">Answer given</th>
                    <th className="py-2 pr-4 font-medium">Result</th>
                    <th className="py-2 pr-4 font-medium">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {submission.kqAnswers.map((answer, index) => (
                    <tr key={`${answer.questionId}-${index}`}>
                      <td className="py-2 pr-4 font-mono text-cyan-300">
                        {answer.kqQuestionId}
                      </td>
                      <td className="py-2 pr-4 text-gray-300">
                        {answer.userSelectedAnswer.length > 0
                          ? answer.userSelectedAnswer.join(", ")
                          : "—"}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={
                            answer.isCorrect
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }
                        >
                          {answer.isCorrect ? "Correct" : "Wrong"}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-gray-400">
                        {answer.xpCredited}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
