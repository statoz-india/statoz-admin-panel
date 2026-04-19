"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LeaderboardUser } from "../../api/leaderboard/[id]/route";
import CoinsLeaderboardSection from "@/app/components/coinsLeaderboard/CoinsLeaderboardSection";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Atom } from "react-loading-indicators";

type LeaderboardView = "tournament" | "coins";

export default function LeaderboardSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<LeaderboardView>(() => {
    const t = searchParams.get("leaderboardTab");
    return t === "coins" || t === "tournament" ? t : "tournament";
  });
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [error, setError] = useState("");
  const [leaderboardError, setLeaderboardError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>("");

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tournament", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch tournaments");
      }

      const response = await res.json();

      // Handle the response structure from successResponse helper
      const tournamentData = response.success ? response.data.data : [];
      setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tournaments",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (tournament: string) => {
    if (!tournament) {
      setUsers([]);
      return;
    }

    try {
      setLeaderboardLoading(true);
      setLeaderboardError("");
      const res = await fetch(
        `/api/leaderboard/${encodeURIComponent(tournament)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch leaderboard");
      }

      const response = await res.json();
      const data = response?.data?.data?.leaderboard ?? response?.data ?? [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setLeaderboardError(
        err instanceof Error ? err.message : "Failed to load leaderboard",
      );
      setUsers([]);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("leaderboardTab");
    if (tab === "coins" || tab === "tournament") {
      setView(tab);
    }
  }, [searchParams]);

  const setLeaderboardView = useCallback(
    (next: LeaderboardView) => {
      setView(next);
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "leaderboard");
      sp.set("leaderboardTab", next);
      stripAdminHomeQueryNoise("leaderboard", sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (selectedTournament) {
      fetchLeaderboard(selectedTournament);
    } else {
      setUsers([]);
      setLeaderboardError("");
    }
  }, [selectedTournament]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Leaderboard
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setLeaderboardView("tournament")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            view === "tournament"
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
          }`}
        >
          Tournament XP
        </button>
        <button
          type="button"
          onClick={() => setLeaderboardView("coins")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            view === "coins"
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
          }`}
        >
          Coins
        </button>
      </div>

      {view === "coins" ? <CoinsLeaderboardSection /> : null}

      {view === "tournament" ? (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Tournament
            </label>
            <div className="flex flex-wrap gap-3">
              {tournaments.map((tournament) => (
                <button
                  key={tournament}
                  onClick={() => setSelectedTournament(tournament)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedTournament === tournament
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
                  }`}
                >
                  {tournament}
                </button>
              ))}
            </div>
          </div>

          {selectedTournament && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Leaderboard for {selectedTournament}
              </h3>

              {leaderboardLoading ? (
                <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
                  <Atom color="#5CDFFF" size="medium" text="" textColor="" />
                </div>
              ) : leaderboardError ? (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-red-400">{leaderboardError}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                    <thead className="bg-gray-50 dark:bg-zinc-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Sl. no.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tournament XP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total XP
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
                      {Array.isArray(users) && users.length > 0 ? (
                        users.map((user, index) => (
                          <tr
                            key={user._id}
                            className={`hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                              index === 0
                                ? "bg-yellow-50 dark:bg-yellow-900/20"
                                : index === 1
                                  ? "bg-gray-50 dark:bg-gray-800/50"
                                  : index === 2
                                    ? "bg-orange-50 dark:bg-orange-900/20"
                                    : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                  index === 0
                                    ? "bg-yellow-400 text-yellow-900"
                                    : index === 1
                                      ? "bg-gray-300 text-gray-700"
                                      : index === 2
                                        ? "bg-orange-400 text-orange-900"
                                        : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {user.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {user.userName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                              {user.tournamentXP?.toLocaleString() || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                              {user.totalXP?.toLocaleString() || 0}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                          >
                            No leaderboard data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
