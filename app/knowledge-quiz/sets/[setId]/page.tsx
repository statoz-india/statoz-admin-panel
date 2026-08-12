"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Coins, Loader2, Star } from "lucide-react";
import type {
  KqQuestion,
  KqSet,
} from "@/app/interface/knowledge-quiz.interface";
import { kqApi } from "@/app/components/knowledgeQuiz/kq-api";

export default function KnowledgeQuizSetPage() {
  const router = useRouter();
  const params = useParams<{ setId: string }>();
  const searchParams = useSearchParams();
  const [set, setSet] = useState<KqSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    kqApi
      .getSet(params.setId, { includeQuestions: true })
      .then((data) => {
        if (active) setSet(data);
      })
      .catch((cause) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Failed to load set");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.setId]);

  const quizId = searchParams.get("quizId");
  const category = searchParams.get("category");
  const sportName = searchParams.get("name") || "Knowledge Quiz";
  const sportIcon = searchParams.get("icon");
  const questions = (set?.knowledgeQuizQuestions ?? []).filter(
    (question): question is KqQuestion => typeof question !== "string",
  );

  const goBack = () => {
    if (!quizId || !category) {
      router.push("/?section=knowledgequiz");
      return;
    }
    const query = new URLSearchParams({ name: sportName });
    if (sportIcon) query.set("icon", sportIcon);
    router.push(
      `/knowledge-quiz/${encodeURIComponent(quizId)}/${encodeURIComponent(category)}?${query.toString()}`,
    );
  };

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <button
        type="button"
        onClick={goBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to chapters
      </button>

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          Loading set and questions…
        </div>
      ) : error || !set ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error ?? "Set not found"}
        </div>
      ) : (
        <>
          <header className="flex items-center gap-3">
            {sportIcon && (
              <span className="material-icons text-4xl text-cyan-400" aria-hidden>
                {sportIcon}
              </span>
            )}
            <div>
              <h1 className="text-2xl font-bold">
                <span className="capitalize">{set.chapterName}</span> — Set {set.chapter}
              </h1>
              <p className="mt-1 text-sm capitalize text-gray-500">
                {sportName} · {set.category}
              </p>
            </div>
          </header>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Stat label="Entry" value={set.entryCoins} icon="coins" />
            <Stat label="Reward" value={set.reward} icon="coins" />
            <Stat label="1 star" value={set.oneStarScore} icon="star" />
            <Stat label="2 stars" value={set.twoStarScore} icon="star" />
            <Stat label="3 stars" value={set.threeStarScore} icon="star" />
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              Questions ({questions.length})
            </h2>
            {questions.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                This set has no questions.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {questions.map((question, index) => (
                  <article
                    key={question._id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium">
                        {index + 1}. {question.questionText}
                      </h3>
                      <span className="shrink-0 text-xs text-cyan-400">
                        {question.xp} XP
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {question.answerOptions.map((option, optionIndex) => {
                        const correct =
                          question.correctAnswerIndex.includes(optionIndex);
                        return (
                          <div
                            key={`${question._id}-${optionIndex}`}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              correct
                                ? "border-emerald-700 bg-emerald-950/30 text-emerald-300"
                                : "border-zinc-800 text-gray-400"
                            }`}
                          >
                            {option}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: "coins" | "star";
}) {
  const Icon = icon === "coins" ? Coins : Star;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
      <div className="flex items-center gap-2 text-gray-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
