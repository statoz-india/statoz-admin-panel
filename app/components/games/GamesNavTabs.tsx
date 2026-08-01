"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";

export type GamesNavTab = "games" | "allTournaments" | "unassigned";

export const GAMES_TAB_ALL = "all";
export const GAMES_TAB_UNASSIGNED = "unassigned";

export default function GamesNavTabs({ active }: { active: GamesNavTab }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const go = (tab: GamesNavTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("section", Section.GAMES);
    sp.delete("gameType");
    if (tab === "allTournaments") {
      sp.set("gamesTab", GAMES_TAB_ALL);
    } else if (tab === "unassigned") {
      sp.set("gamesTab", GAMES_TAB_UNASSIGNED);
    } else {
      sp.delete("gamesTab");
    }
    stripAdminHomeQueryNoise(Section.GAMES, sp);
    if (tab === "allTournaments") {
      sp.set("gamesTab", GAMES_TAB_ALL);
    } else if (tab === "unassigned") {
      sp.set("gamesTab", GAMES_TAB_UNASSIGNED);
    } else {
      sp.delete("gamesTab");
    }
    router.push(`/?${sp.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex gap-2 border-b border-zinc-800">
      <button
        type="button"
        onClick={() => go("games")}
        className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
          active === "games"
            ? "border-cyan-500 text-white"
            : "border-transparent text-gray-400 hover:text-gray-200"
        }`}
      >
        Games
      </button>
      <button
        type="button"
        onClick={() => go("allTournaments")}
        className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
          active === "allTournaments"
            ? "border-cyan-500 text-white"
            : "border-transparent text-gray-400 hover:text-gray-200"
        }`}
      >
        All tournaments
      </button>
      <button
        type="button"
        onClick={() => go("unassigned")}
        className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
          active === "unassigned"
            ? "border-cyan-500 text-white"
            : "border-transparent text-gray-400 hover:text-gray-200"
        }`}
      >
        Unassigned
      </button>
    </div>
  );
}
