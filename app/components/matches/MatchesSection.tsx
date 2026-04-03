"use client";

import { useCallback, useEffect, useState } from "react";
import CreateMatchesModal from "./CreateMatchesModal";
import { MatchData } from "../../api/match/route";
import { Atom } from "react-loading-indicators";

function MatchesSection() {
  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>("LIVE");
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const formatDateIST = (isoString: string | undefined): string => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "—";
    }
  };

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

  const fetchMatches = useCallback(async (tournament: string) => {
    if (!tournament) {
      setMatches([]);
      setMatchesError("");
      return;
    }
    try {
      setMatchesLoading(true);
      setMatchesError("");
      const endpoint =
        tournament === "LIVE"
          ? "/api/match/live-matches"
          : `/api/match/${encodeURIComponent(tournament)}`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch matches");
      }
      const response = await res.json();
      const list = response.success && response.data ? response.data : [];
      setMatches(Array.isArray(list) ? list : []);
    } catch (err) {
      setMatchesError(
        err instanceof Error ? err.message : "Failed to load matches",
      );
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
    fetchMatches("LIVE");
  }, [fetchMatches]);

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
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Matches</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 font-medium"
        >
          Create New Match
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Tournament
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedTournament("LIVE");
              fetchMatches("LIVE");
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedTournament === "LIVE"
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            Show Live Matches
          </button>
          {tournaments.map((tournament) => (
            <button
              key={tournament}
              onClick={() => {
                setSelectedTournament(tournament);
                fetchMatches(tournament);
              }}
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
            {selectedTournament === "LIVE"
              ? "Live matches"
              : `Matches for ${selectedTournament}`}
          </h3>

          {matchesLoading ? (
            <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
              <Atom color="#5CDFFF" size="medium" text="" textColor="" />
            </div>
          ) : matchesError ? (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400">{matchesError}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="p-4 bg-zinc-800 rounded-lg">
              <p className="text-gray-400">
                No matches for this tournament yet. Create a match using the
                button above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-zinc-700">
                <thead>
                  <tr className="bg-zinc-800">
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Match ID
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Team A
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Team B
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Match start time
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Mongo ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr
                      key={match._id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="border border-zinc-700 px-4 py-3 text-gray-300 font-mono text-sm">
                        {match.matchId}
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                        {match.teamA?.name}{" "}
                        <span className="text-zinc-500">
                          ({match.teamA?.abbreviation})
                        </span>
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                        {match.teamB?.name}{" "}
                        <span className="text-zinc-500">
                          ({match.teamB?.abbreviation})
                        </span>
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-400">
                        {formatDateIST(match.matchStartTime)}
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-400">
                        {match._id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!selectedTournament && tournaments.length > 0 && (
        <div className="p-4 bg-zinc-800 rounded-lg mt-6">
          <p className="text-gray-400">
            Select a tournament to view its matches.
          </p>
        </div>
      )}

      <CreateMatchesModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchTournaments();
          if (selectedTournament) fetchMatches(selectedTournament);
        }}
      />
    </div>
  );
}

export default MatchesSection;
