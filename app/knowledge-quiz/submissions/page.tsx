"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import KqSubmissionsPanel from "@/app/components/knowledgeQuiz/KqSubmissionsPanel";
import { isObjectId } from "@/app/interface/knowledge-quiz.interface";

/** A malformed id in the URL would 400 the proxy, so ignore it instead. */
function idFromQuery(value: string | null): string | undefined {
  return value && isObjectId(value) ? value : undefined;
}

function KnowledgeQuizSubmissionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = idFromQuery(searchParams.get("userId"));
  const setId = idFromQuery(searchParams.get("setId"));

  const clearPinned = (kind: "userId" | "setId") => {
    const query = new URLSearchParams(searchParams.toString());
    query.delete(kind);
    const qs = query.toString();
    router.replace(`/knowledge-quiz/submissions${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };

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

      <div>
        <h1 className="text-2xl font-bold">Submissions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Every chapter played, across all sports and players.
        </p>
      </div>

      <div className="mt-6">
        <KqSubmissionsPanel
          userId={userId}
          setId={setId}
          onClearPinned={clearPinned}
        />
      </div>
    </main>
  );
}

export default function KnowledgeQuizSubmissionsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black p-6 text-white">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      }
    >
      <KnowledgeQuizSubmissionsContent />
    </Suspense>
  );
}
