"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import type { KqSetCategory } from "@/app/interface/knowledge-quiz.interface";
import { kqApi } from "@/app/components/knowledgeQuiz/kq-api";

export default function KnowledgeQuizSportPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<KqSetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sportName = searchParams.get("name") || "Sport";
  const sportIcon = searchParams.get("icon");

  useEffect(() => {
    let active = true;
    kqApi
      .listCategories()
      .then((data) => {
        if (active) setCategories(data.categories);
      })
      .catch((cause) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : "Failed to load categories",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <button
        type="button"
        onClick={() => router.push("/?section=knowledgequiz")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Knowledge Quiz
      </button>

      <div className="flex items-center gap-3">
        {sportIcon && (
          <span className="material-icons text-4xl text-cyan-400" aria-hidden>
            {sportIcon}
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold">{sportName}</h1>
          <p className="mt-1 text-sm text-gray-500">Quiz categories</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          Loading categories…
        </div>
      ) : error ? (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => {
                const query = new URLSearchParams({ name: sportName });
                if (sportIcon) query.set("icon", sportIcon);
                router.push(
                  `/knowledge-quiz/${encodeURIComponent(params.id)}/${encodeURIComponent(category)}?${query.toString()}`,
                );
              }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-6 text-left text-lg font-semibold capitalize transition-colors hover:border-cyan-700 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
