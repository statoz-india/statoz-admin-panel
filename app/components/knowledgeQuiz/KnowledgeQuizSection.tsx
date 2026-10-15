"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, ClipboardList, HelpCircle, RefreshCw } from "lucide-react";
import KqSportsPanel from "./KqSportsPanel";

export const QUERY_KQ_TAB = "kqTab";

export default function KnowledgeQuizSection() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <BrainCircuit className="h-6 w-6 text-cyan-400" />
          Knowledge Quiz
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/knowledge-quiz/all")}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-700 bg-cyan-950/30 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-950/50"
          >
            <HelpCircle className="h-4 w-4" />
            All questions
          </button>
          <button
            type="button"
            onClick={() => router.push("/knowledge-quiz/submissions")}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-700 bg-cyan-950/30 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-950/50"
          >
            <ClipboardList className="h-4 w-4" />
            Submissions
          </button>
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
      <div className="mt-5">
        <KqSportsPanel refreshKey={refreshKey} />
      </div>
    </div>
  );
}
