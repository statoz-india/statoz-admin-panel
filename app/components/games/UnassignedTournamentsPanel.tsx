"use client";

import { useCallback, useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import type { Tournament } from "@/app/models/tournament.model";
import EditTournamentSheet from "../tournaments/EditTournamentSheet";

const DEFAULT_PRIMARY_COLOR = "#19398A";
const DEFAULT_SECONDARY_COLOR = "#ffffff";
const DEFAULT_TEXT_COLOR = "#ffffff";

function resolveTournamentColors(tournament: Tournament) {
  const primaryColor = tournament.primaryColor?.trim() || DEFAULT_PRIMARY_COLOR;
  const secondaryColor =
    tournament.secondaryColor?.trim() || DEFAULT_SECONDARY_COLOR;
  const textColor = tournament.textColor?.trim() || DEFAULT_TEXT_COLOR;

  return {
    primaryColor,
    secondaryColor,
    textColor,
    borderColor: secondaryColor,
  };
}

function TournamentCard({
  tournament,
  onClick,
}: {
  tournament: Tournament;
  onClick: () => void;
}) {
  const { primaryColor, borderColor, textColor } =
    resolveTournamentColors(tournament);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-0 w-full cursor-pointer flex-col items-center justify-center gap-0.5 border-b-2 px-2 py-2.5 text-center transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        backgroundColor: primaryColor,
        borderBottomColor: borderColor,
        color: textColor,
      }}
    >
      <span className="text-sm font-bold tracking-wide">
        {tournament.tournament}
      </span>
      <span className="line-clamp-2 w-full text-[11px] font-medium leading-tight opacity-95">
        {tournament.tournamentName}
      </span>
      <span className="text-[10px] opacity-80">
        {tournament.tournamentYear}
      </span>
    </button>
  );
}

export default function UnassignedTournamentsPanel() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUnassigned = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/games/tournaments/unassigned", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(
          body?.message || "Failed to fetch unassigned tournaments",
        );
      }
      setTournaments(Array.isArray(body.data) ? body.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load unassigned tournaments",
      );
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnassigned();
  }, [fetchUnassigned]);

  const searchQuery = searchInput.trim().toLowerCase();
  const filteredTournaments = !searchQuery
    ? tournaments
    : tournaments.filter((t) => {
        const code = (t.tournament ?? "").toLowerCase();
        const name = (t.tournamentName ?? "").toLowerCase();
        const year = (t.tournamentYear ?? "").toLowerCase();
        return (
          code.includes(searchQuery) ||
          name.includes(searchQuery) ||
          year.includes(searchQuery)
        );
      });

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
        <button
          type="button"
          onClick={fetchUnassigned}
          className="ml-3 underline hover:text-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Unassigned</h1>
          <p className="mt-2 text-gray-400">
            {filteredTournaments.length} tournament
            {filteredTournaments.length === 1 ? "" : "s"}
            {searchQuery ? " matched" : ""} without a game type. Click one to
            assign.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-full sm:max-w-xs">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, code or year"
            aria-label="Search unassigned tournaments"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-9 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredTournaments.length === 0 ? (
        <p className="text-gray-400">
          {searchQuery
            ? "No tournaments match your search."
            : "No unassigned tournaments."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {filteredTournaments.map((tournament) => (
            <TournamentCard
              key={tournament._id}
              tournament={tournament}
              onClick={() => {
                setSelectedTournament(tournament);
                setIsEditOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <EditTournamentSheet
        isOpen={isEditOpen}
        tournament={selectedTournament}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTournament(null);
        }}
        onSuccess={fetchUnassigned}
      />
    </>
  );
}
