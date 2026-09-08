"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Atom } from "react-loading-indicators";
import type { GameListItem } from "@/app/api/games/route";
import type { Tournament } from "@/app/models/tournament.model";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";
import TeamsTournamentsNavTabs, {
  GAMES_TAB_ALL,
  GAMES_TAB_UNASSIGNED,
  GAMES_TAB_FOOTBALL_ORDER,
} from "./TeamsTournamentsNavTabs";
import TournamentSection from "../tournaments/TournamentSection";
import UnassignedTournamentsPanel from "./UnassignedTournamentsPanel";
import FootballOrderPanel from "../tournaments/FootballOrderPanel";

const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";
const DEFAULT_PRIMARY_COLOR = "#19398A";
const DEFAULT_SECONDARY_COLOR = "#ffffff";
const DEFAULT_TEXT_COLOR = "#ffffff";

function formatGameLabel(gameType: string): string {
  if (!gameType) return "—";
  return gameType.charAt(0).toUpperCase() + gameType.slice(1);
}

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

export default function TeamsTournamentsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGameType =
    searchParams.get("gameType")?.trim().toLowerCase() ?? "";
  const showAllTournaments = searchParams.get("gamesTab") === GAMES_TAB_ALL;
  const showUnassigned = searchParams.get("gamesTab") === GAMES_TAB_UNASSIGNED;
  const showFootballOrder =
    searchParams.get("gamesTab") === GAMES_TAB_FOOTBALL_ORDER;

  const [games, setGames] = useState<GameListItem[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState("");

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
  const [tournamentsError, setTournamentsError] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchGames = useCallback(async () => {
    try {
      setGamesLoading(true);
      setGamesError("");
      const res = await fetch("/api/games", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to fetch games");
      }

      setGames(Array.isArray(body.data) ? body.data : []);
    } catch (err) {
      setGamesError(
        err instanceof Error ? err.message : "Failed to load games",
      );
      setGames([]);
    } finally {
      setGamesLoading(false);
    }
  }, []);

  const fetchTournaments = useCallback(async (gameType: string) => {
    try {
      setTournamentsLoading(true);
      setTournamentsError("");
      const res = await fetch(
        `/api/games/${encodeURIComponent(gameType)}/tournaments`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || "Failed to fetch tournaments");
      }

      setTournaments(Array.isArray(body.data) ? body.data : []);
    } catch (err) {
      setTournamentsError(
        err instanceof Error ? err.message : "Failed to load tournaments",
      );
      setTournaments([]);
    } finally {
      setTournamentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    if (!selectedGameType) {
      setTournaments([]);
      setTournamentsError("");
      setSearchInput("");
      return;
    }
    setSearchInput("");
    fetchTournaments(selectedGameType);
  }, [selectedGameType, fetchTournaments]);

  useEffect(() => {
    if (!selectedGameType) return;
    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    (container ?? window).scrollTo({ top: 0, behavior: "auto" });
  }, [selectedGameType]);

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

  const openGameTournaments = (gameType: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("section", Section.TEAMSTOURNAMENTS);
    sp.set("gameType", gameType);
    sp.delete("gamesTab");
    stripAdminHomeQueryNoise(Section.TEAMSTOURNAMENTS, sp);
    sp.set("gameType", gameType);
    sp.delete("gamesTab");
    router.push(`/?${sp.toString()}`, { scroll: false });
  };

  const backToGames = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("section", Section.TEAMSTOURNAMENTS);
    sp.delete("gameType");
    sp.delete("gamesTab");
    stripAdminHomeQueryNoise(Section.TEAMSTOURNAMENTS, sp);
    router.push(`/?${sp.toString()}`, { scroll: false });
  };

  const openTeams = (tournament: Tournament) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("section", Section.TEAMS);
    sp.set("tournament", tournament.tournament);
    stripAdminHomeQueryNoise(Section.TEAMS, sp);
    router.push(`/?${sp.toString()}`, { scroll: false });
  };

  const selectedGame = games.find(
    (g) => g.gameType.toLowerCase() === selectedGameType,
  );

  // Tab: All tournaments (same Games section URL)
  if (showAllTournaments) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Games</h2>
          <p className="mt-1 text-sm text-gray-400">
            Supported sports available for tournaments and matches.
          </p>
        </div>
        <TeamsTournamentsNavTabs active="allTournaments" />
        <TournamentSection embedded />
      </div>
    );
  }

  // Tab: Unassigned tournaments (no gameType)
  if (showUnassigned) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Games</h2>
          <p className="mt-1 text-sm text-gray-400">
            Supported sports available for tournaments and matches.
          </p>
        </div>
        <TeamsTournamentsNavTabs active="unassigned" />
        <UnassignedTournamentsPanel />
      </div>
    );
  }

  // Tab: Football tournament order
  if (showFootballOrder) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Games</h2>
          <p className="mt-1 text-sm text-gray-400">
            Supported sports available for tournaments and matches.
          </p>
        </div>
        <TeamsTournamentsNavTabs active="footballOrder" />
        <FootballOrderPanel />
      </div>
    );
  }

  // L1 — tournaments for selected game
  if (selectedGameType) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={backToGames}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to teams & tournaments
        </button>

        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
            {selectedGame?.icon ? (
              <span className="material-icons text-4xl" aria-hidden>
                {selectedGame.icon}
              </span>
            ) : null}
            {formatGameLabel(selectedGameType)} tournaments
          </h1>
          <p className="mt-2 text-gray-400">
            {tournamentsLoading
              ? "Loading…"
              : `${filteredTournaments.length} tournament${filteredTournaments.length === 1 ? "" : "s"}${searchQuery ? " matched" : ""}`}
          </p>
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
              aria-label="Search tournaments by name, code or year"
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

        {tournamentsLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Atom color="#5CDFFF" size="medium" text="" textColor="" />
          </div>
        ) : tournamentsError ? (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {tournamentsError}
            <button
              type="button"
              onClick={() => fetchTournaments(selectedGameType)}
              className="ml-3 underline hover:text-red-200"
            >
              Retry
            </button>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <p className="text-gray-400">
            {searchQuery
              ? "No tournaments match your search."
              : "No tournaments found for this game."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament._id}
                tournament={tournament}
                onClick={() => openTeams(tournament)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // L0 — games list
  if (gamesLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Atom color="#ffffff" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Games</h2>
        <p className="mt-1 text-sm text-gray-400">
          Supported sports available for tournaments and matches.
        </p>
      </div>

      <TeamsTournamentsNavTabs active="games" />

      {gamesError ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {gamesError}
          <button
            type="button"
            onClick={fetchGames}
            className="ml-3 underline hover:text-red-200"
          >
            Retry
          </button>
        </div>
      ) : games.length === 0 ? (
        <p className="text-sm text-gray-400">No games found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.gameType}
              type="button"
              onClick={() => openGameTournaments(game.gameType)}
              className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-5 text-left transition-colors hover:border-zinc-600 hover:bg-zinc-900"
            >
              <span className="material-icons text-4xl text-white" aria-hidden>
                {game.icon}
              </span>
              <p className="text-lg font-semibold text-white">
                {formatGameLabel(game.gameType)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
