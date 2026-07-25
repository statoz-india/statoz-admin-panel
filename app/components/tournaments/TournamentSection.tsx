"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Atom } from "react-loading-indicators";
import type { Tournament } from "@/app/models/tournament.model";
import { TOURNAMENTS_PAGE_SIZE } from "@/app/interface/pagination.interface";
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
  // Distinguishes the very first load (full-screen spinner) from later refetches
  // triggered by paging/search (which keep the search box + grid mounted).
  const initialLoadRef = useRef(true);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] =
    useState(false);
  // `searchInput` is what the user types; `searchQuery` is the committed value
  // actually sent to the server (on Enter / search-icon click).
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    totalPages: 0,
    hasMore: false,
    limit: TOURNAMENTS_PAGE_SIZE,
  });

  const submitSearch = useCallback(() => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  }, [searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setPage(1);
    setSearchQuery("");
  }, []);

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

      // Search returns { items, total, ... }; the plain list returns a bare
      // array — so the endpoint switches on whether a query is committed.
      const url = searchQuery
        ? `/api/tournament/searchTournament?searchQuery=${encodeURIComponent(
            searchQuery,
          )}&page=${page}`
        : `/api/tournament/getAllTournamentAndDetails`;

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();

      if (!res.ok || response?.success !== true) {
        throw new Error(
          (typeof response?.message === "string" && response.message) ||
            "Failed to fetch tournaments",
        );
      }

      const data = response.data ?? {};
      const list: Tournament[] = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : [];

      setTournaments(list);
      setPageInfo({
        total: Number(data.total) || list.length,
        totalPages: Number(data.totalPages) || (list.length ? 1 : 0),
        hasMore: Boolean(data.hasMore),
        limit: Number(data.limit) || TOURNAMENTS_PAGE_SIZE,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tournaments",
      );
      setTournaments([]);
    } finally {
      setLoading(false);
      initialLoadRef.current = false;
    }
  }, [page, searchQuery]);

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

  if (loading && initialLoadRef.current) {
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
            {pageInfo.total} tournament{pageInfo.total === 1 ? "" : "s"}
            {searchQuery ? " matched" : ""}
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

      <div className="mb-6">
        <div className="relative w-full sm:max-w-xs">
          <button
            type="button"
            onClick={submitSearch}
            aria-label="Search"
            className="absolute left-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:text-cyan-400"
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
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            placeholder="Search by name, code or year"
            aria-label="Search tournaments by name, code or year"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-9 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className={loading ? "pointer-events-none opacity-50" : "opacity-100"}>
        {tournaments.length === 0 ? (
          <p className="text-gray-400">
            {searchQuery
              ? "No tournaments match your search."
              : "No tournaments found."}
          </p>
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
      </div>

      {pageInfo.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-gray-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {page} of {Math.max(pageInfo.totalPages, 1)}
          </span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={!pageInfo.hasMore && page >= pageInfo.totalPages}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-gray-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
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
