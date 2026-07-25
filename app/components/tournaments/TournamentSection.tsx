"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Atom } from "react-loading-indicators";
import type { Tournament } from "@/app/models/tournament.model";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";
import CreateTournamentModal from "../teams/CreateTournamentModal";

const TOURNAMENTS_SCROLL_POSITION_KEY = "admin_tournaments_scroll_top";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";
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
      className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 border-b-4 p-5 text-center transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        backgroundColor: primaryColor,
        borderBottomColor: borderColor,
        color: textColor,
      }}
    >
      <span className="text-2xl font-bold tracking-wide">
        {tournament.tournament}
      </span>
      <span className="text-sm font-medium leading-snug opacity-95">
        {tournament.tournamentName}
      </span>
      <span className="text-xs opacity-80">{tournament.tournamentYear}</span>
    </button>
  );
}

export default function TournamentSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRestoredScrollRef = useRef(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] =
    useState(false);

  const saveScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    const scrollTop = container ? container.scrollTop : window.scrollY;
    sessionStorage.setItem(TOURNAMENTS_SCROLL_POSITION_KEY, String(scrollTop));
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem(TOURNAMENTS_SCROLL_POSITION_KEY);
    if (!raw) return;

    const parsedScrollTop = Number(raw);
    if (!Number.isFinite(parsedScrollTop)) return;

    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTo({ top: parsedScrollTop, behavior: "auto" });
      } else {
        window.scrollTo({ top: parsedScrollTop, behavior: "auto" });
      }
    });
  }, []);

  const openTeams = useCallback(
    (tournament: Tournament) => {
      saveScrollPosition();
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", Section.TEAMS);
      sp.set("tournament", tournament.tournament);
      stripAdminHomeQueryNoise(Section.TEAMS, sp);
      router.push(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams, saveScrollPosition],
  );

  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/tournament/getAllTournamentAndDetails", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const response = await res.json();

      const list = Array.isArray(response.data)
        ? response.data
        : response?.data && Array.isArray(response.data.data)
          ? response.data.data
          : [];

      if (response?.success === true) {
        setTournaments(list);
        setError("");
        return;
      }

      if (!res.ok) {
        throw new Error(
          (typeof response?.message === "string" && response.message) ||
            "Failed to fetch tournaments",
        );
      }

      setTournaments(list);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tournaments",
      );
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  // Restore the grid's scroll position once (after the first load) when
  // returning from a tournament's teams page.
  useEffect(() => {
    if (loading || hasRestoredScrollRef.current) return;
    restoreScrollPosition();
    hasRestoredScrollRef.current = true;
  }, [loading, restoreScrollPosition]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Tournaments</h1>
          <p className="mt-2 text-gray-400">
            {tournaments.length} tournament
            {tournaments.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateTournamentModalOpen(true)}
          className="rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200"
        >
          Create New Tournament
        </button>
      </div>

      {tournaments.length === 0 ? (
        <p className="text-gray-400">No tournaments found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tournaments.map((tournament) => (
            <TournamentCard
              key={tournament._id}
              tournament={tournament}
              onClick={() => openTeams(tournament)}
            />
          ))}
        </div>
      )}

      <CreateTournamentModal
        isOpen={isCreateTournamentModalOpen}
        onClose={() => setIsCreateTournamentModalOpen(false)}
        onSuccess={fetchTournaments}
      />
    </div>
  );
}
