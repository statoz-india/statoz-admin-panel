"use client";

import { useMemo, useState, type ReactNode } from "react";
import { LayoutGrid } from "lucide-react";
import { usePinnedTournaments } from "@/app/utils/pinnedTournaments";
import AllTournamentsModal from "./AllTournamentsModal";

interface TournamentFilterRowProps {
  /** All tournament types returned by `/api/tournament`. */
  tournaments: string[];
  selectedTournament: string;
  onSelect: (tournament: string) => void;
  /** Buttons rendered before the tournaments, e.g. "Show Live Quizzes". */
  leading?: ReactNode;
  label?: string;
}

export default function TournamentFilterRow({
  tournaments,
  selectedTournament,
  onSelect,
  leading,
  label = "Select Tournament",
}: TournamentFilterRowProps) {
  const pinned = usePinnedTournaments();
  const [isAllTournamentsOpen, setIsAllTournamentsOpen] = useState(false);

  const rowTournaments = useMemo(() => {
    const visible = pinned.filter((tournament) =>
      tournaments.includes(tournament),
    );

    // Keep an unpinned selection visible so the row always shows what is active.
    if (
      selectedTournament &&
      tournaments.includes(selectedTournament) &&
      !visible.includes(selectedTournament)
    ) {
      visible.push(selectedTournament);
    }

    return visible;
  }, [pinned, selectedTournament, tournaments]);

  return (
    <div className="mb-6">
      <label className="mb-3 block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {leading}
        {rowTournaments.map((tournament) => (
          <button
            key={tournament}
            type="button"
            onClick={() => onSelect(tournament)}
            className={`rounded-md px-4 py-2 font-medium transition-colors ${
              selectedTournament === tournament
                ? "bg-white text-black hover:bg-zinc-200"
                : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {tournament}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsAllTournamentsOpen(true)}
          className="flex items-center gap-2 rounded-md border border-dashed border-zinc-600 bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800"
        >
          <LayoutGrid size={16} />
          All tournaments
          {tournaments.length > 0 ? (
            <span className="text-xs text-zinc-400">
              ({tournaments.length})
            </span>
          ) : null}
        </button>
      </div>

      {isAllTournamentsOpen ? (
        <AllTournamentsModal
          tournaments={tournaments}
          selectedTournament={selectedTournament}
          onSelect={onSelect}
          onClose={() => setIsAllTournamentsOpen(false)}
        />
      ) : null}
    </div>
  );
}
