"use client";

import { useEffect, useMemo, useState } from "react";
import { Pin, PinOff, Search, X } from "lucide-react";
import {
  togglePinnedTournament,
  usePinnedTournaments,
} from "@/app/utils/pinnedTournaments";

interface AllTournamentsModalProps {
  tournaments: string[];
  selectedTournament: string;
  onSelect: (tournament: string) => void;
  onClose: () => void;
}

export default function AllTournamentsModal({
  tournaments,
  selectedTournament,
  onSelect,
  onClose,
}: AllTournamentsModalProps) {
  const pinned = usePinnedTournaments();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const visibleTournaments = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = query
      ? tournaments.filter((tournament) =>
          tournament.toLowerCase().includes(query),
        )
      : tournaments;

    // Pinned first, otherwise keep the order the API returned.
    return [
      ...matches.filter((tournament) => pinned.includes(tournament)),
      ...matches.filter((tournament) => !pinned.includes(tournament)),
    ];
  }, [pinned, search, tournaments]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              All tournaments
            </h3>
            <p className="text-xs text-zinc-400">
              Pin the tournaments you want to keep in the row.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-zinc-800 px-5 py-3">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={search}
              autoFocus
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tournaments"
              aria-label="Search tournaments"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {visibleTournaments.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-400">
              {tournaments.length === 0
                ? "No tournaments found."
                : "No tournaments match your search."}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {visibleTournaments.map((tournament) => {
                const isPinned = pinned.includes(tournament);
                const isSelected = selectedTournament === tournament;

                return (
                  <li
                    key={tournament}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 transition-colors ${
                      isSelected
                        ? "border-white bg-zinc-800"
                        : "border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(tournament);
                        onClose();
                      }}
                      className="flex-1 text-left font-medium text-white"
                    >
                      {tournament}
                    </button>
                    {isPinned ? (
                      <span className="text-xs text-zinc-400">Pinned</span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => togglePinnedTournament(tournament)}
                      aria-label={
                        isPinned
                          ? `Unpin ${tournament}`
                          : `Pin ${tournament} to the row`
                      }
                      title={isPinned ? "Unpin" : "Pin to the row"}
                      className={`rounded-md p-2 transition-colors ${
                        isPinned
                          ? "bg-white text-black hover:bg-zinc-200"
                          : "border border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      }`}
                    >
                      {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
