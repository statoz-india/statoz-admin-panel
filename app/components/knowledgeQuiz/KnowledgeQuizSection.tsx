"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import KqQuestionsPanel from "./KqQuestionsPanel";
import KqSetsPanel from "./KqSetsPanel";
import KqSportsPanel from "./KqSportsPanel";

const KQ_TABS = [
  { id: "questions", label: "Questions" },
  { id: "sets", label: "Chapters" },
  { id: "sports", label: "Home screen sports" },
] as const;

type KqTab = (typeof KQ_TABS)[number]["id"];

function isKqTab(value: string | null): value is KqTab {
  return KQ_TABS.some((tab) => tab.id === value);
}

export const QUERY_KQ_TAB = "kqTab";

export default function KnowledgeQuizSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derived from the URL rather than mirrored into state, so there is no
  // hydration-time sync to get wrong.
  const tabParam = searchParams.get(QUERY_KQ_TAB);
  const tab: KqTab = isKqTab(tabParam) ? tabParam : "questions";

  const changeTab = (next: KqTab) => {
    if (next === tab) return;
    const sp = new URLSearchParams(searchParams.toString());
    sp.set(QUERY_KQ_TAB, next);
    router.push(`/?${sp.toString()}`, { scroll: false });
  };

  return (
    <div className="p-6">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <BrainCircuit className="h-6 w-6 text-cyan-400" />
          Knowledge Quiz
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-gray-400">
          Sport cards drive the home screen, chapters are the playable sets
          beneath them, and questions are the content bank. A question is only
          attached to anything once a chapter is created around it.
        </p>
      </div>

      <div className="mb-5 flex gap-2 border-b border-zinc-800">
        {KQ_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeTab(item.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm transition-colors ${
              tab === item.id
                ? "border-cyan-500 text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "sports" ? (
        <KqSportsPanel />
      ) : tab === "sets" ? (
        <KqSetsPanel />
      ) : (
        <KqQuestionsPanel />
      )}
    </div>
  );
}
