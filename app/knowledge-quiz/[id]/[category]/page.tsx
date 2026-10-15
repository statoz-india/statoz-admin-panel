"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import type {
  KqChapterName,
  KqChapterRange,
  KqSetCategory,
} from "@/app/interface/knowledge-quiz.interface";
import { isKqSetCategory } from "@/app/interface/knowledge-quiz.interface";
import { kqApi } from "@/app/components/knowledgeQuiz/kq-api";

export default function KnowledgeQuizChaptersPage() {
  const router = useRouter();
  const params = useParams<{ id: string; category: string }>();
  const searchParams = useSearchParams();
  const [chapters, setChapters] = useState<KqChapterRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sportName = searchParams.get("name") || "Sport";
  const sportIcon = searchParams.get("icon");
  const normalizedCategory = params.category.toLowerCase();
  const validCategory = isKqSetCategory(normalizedCategory);
  const displayError = validCategory
    ? error
    : "Invalid knowledge quiz category";

  useEffect(() => {
    if (!isKqSetCategory(normalizedCategory)) return;

    let active = true;
    kqApi
      .listChapterRanges(params.id, normalizedCategory as KqSetCategory)
      .then((data) => {
        if (active) setChapters(data.chapters);
      })
      .catch((cause) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : "Failed to load chapters",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [normalizedCategory, params.id]);

  const backQuery = new URLSearchParams({ name: sportName });
  if (sportIcon) backQuery.set("icon", sportIcon);

  const openSet = (
    chapterName: KqChapterName,
    setNumber: number,
    setId: string,
  ) => {
    const query = new URLSearchParams({
      quizId: params.id,
      category: normalizedCategory,
      chapterName,
      setNumber: String(setNumber),
      name: sportName,
    });
    if (sportIcon) query.set("icon", sportIcon);
    router.push(
      `/knowledge-quiz/sets/${encodeURIComponent(setId)}?${query.toString()}`,
    );
  };

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <button
        type="button"
        onClick={() =>
          router.push(
            `/knowledge-quiz/${encodeURIComponent(params.id)}?${backQuery.toString()}`,
          )
        }
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </button>

      <div className="flex items-center gap-3">
        {sportIcon && (
          <span className="material-icons text-4xl text-cyan-400" aria-hidden>
            {sportIcon}
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold">{sportName}</h1>
          <p className="mt-1 text-sm capitalize text-gray-500">
            {normalizedCategory} chapters
          </p>
        </div>
      </div>

      {loading && validCategory ? (
        <div className="flex items-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          Loading chapters…
        </div>
      ) : displayError ? (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {displayError}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {chapters.map((chapter) => (
            <article
              key={chapter.chapterName}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold capitalize">
                  {chapter.chapterName}
                </h2>
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-gray-300">
                  {chapter.setCount} {chapter.setCount === 1 ? "set" : "sets"}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-400">
                {chapter.setRange
                  ? `Sets ${chapter.setRange.from}–${chapter.setRange.to}`
                  : "No sets yet"}
              </p>
              {chapter.setNumbers.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {chapter.setNumbers.map((setNumber) => {
                    const setId = chapter.sets.find(
                      (item) => item.chapter === setNumber,
                    )?._id;

                    return (
                      <button
                        type="button"
                        key={setNumber}
                        disabled={!setId}
                        onClick={() =>
                          setId &&
                          openSet(chapter.chapterName, setNumber, setId)
                        }
                        className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-cyan-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {setNumber}
                      </button>
                    );
                  })}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
