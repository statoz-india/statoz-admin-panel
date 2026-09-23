"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";
import TrendingMatchesTab from "./TrendingMatchesTab";
import TrendingGamesTab from "./TrendingGamesTab";

type TrendingTab = "matches" | "games";

const TRENDING_TABS: readonly TrendingTab[] = ["matches", "games"];

function isTrendingTab(value: string | null): value is TrendingTab {
  return TRENDING_TABS.includes(value as TrendingTab);
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-cyan-500 text-white"
          : "border-transparent text-gray-400 hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function TrendingSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Derived straight from the URL — no local mirror to fall out of sync.
  const rawTab = searchParams.get("trendingTab");
  const tab: TrendingTab = isTrendingTab(rawTab) ? rawTab : "matches";

  const setTrendingTab = useCallback(
    (next: TrendingTab) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", Section.TRENDING);
      sp.set("trendingTab", next);
      stripAdminHomeQueryNoise(Section.TRENDING, sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Trending</h2>
        <p className="mt-1 text-sm text-gray-400">
          Curate what shows up as trending on the home screen.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-800">
        <TabButton
          active={tab === "matches"}
          onClick={() => setTrendingTab("matches")}
        >
          Matches
        </TabButton>
        <TabButton
          active={tab === "games"}
          onClick={() => setTrendingTab("games")}
        >
          Games
        </TabButton>
      </div>

      {tab === "matches" && <TrendingMatchesTab />}
      {tab === "games" && <TrendingGamesTab />}
    </div>
  );
}
