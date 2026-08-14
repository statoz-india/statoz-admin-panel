"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, HelpCircle } from "lucide-react";
import { Suspense } from "react";
import KqQuestionsPanel from "@/app/components/knowledgeQuiz/KqQuestionsPanel";
import KqSetsPanel from "@/app/components/knowledgeQuiz/KqSetsPanel";

type LibraryTab = "chapters" | "questions";

function tabFromQuery(value: string | null): LibraryTab {
  return value === "questions" ? "questions" : "chapters";
}

function KnowledgeQuizLibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = tabFromQuery(searchParams.get("tab"));

  const setTab = (next: LibraryTab) => {
    const query = new URLSearchParams(searchParams.toString());
    if (next === "chapters") query.delete("tab");
    else query.set("tab", next);
    const qs = query.toString();
    router.replace(`/knowledge-quiz/all${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
      active
        ? "border-cyan-500 bg-cyan-950/40 text-white"
        : "border-zinc-700 text-gray-400 hover:bg-zinc-900"
    }`;

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

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All questions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Every chapter and question across all sports.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("chapters")}
            className={tabClass(tab === "chapters")}
          >
            <BookOpen className="h-4 w-4" />
            Chapters
          </button>
          <button
            type="button"
            onClick={() => setTab("questions")}
            className={tabClass(tab === "questions")}
          >
            <HelpCircle className="h-4 w-4" />
            Questions
          </button>
        </div>
      </div>

      <div className="mt-6">
        {tab === "chapters" ? <KqSetsPanel /> : <KqQuestionsPanel />}
      </div>
    </main>
  );
}

export default function KnowledgeQuizLibraryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black p-6 text-white">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      }
    >
      <KnowledgeQuizLibraryContent />
    </Suspense>
  );
}
