"use client";

import { useState, FormEvent, useEffect } from "react";

import { CreatePredictionPayload } from "../../api/predictions/route";
import { MatchData } from "../../api/match/route";

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePredictionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePredictionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePredictionPayload>({
    tournament: "",
    matchId: "",
    matchStartTime: "",
  });

  // Fetch tournaments
  const fetchTournaments = async () => {
    try {
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
      const tournamentData = response.success ? response.data.data : [];
      setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load tournaments",
      );
    }
  };

  // Fetch matches for selected tournament
  const fetchMatches = async (tournament: string) => {
    if (!tournament) {
      setMatches([]);
      return;
    }

    try {
      setMatchesLoading(true);
      const res = await fetch(`/api/match/${encodeURIComponent(tournament)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("Error fetching matches:", err);
      setError(err instanceof Error ? err.message : "Failed to load matches");
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  // Handle tournament selection
  const handleTournamentChange = (tournament: string) => {
    setSelectedTournament(tournament);
    setFormData({
      ...formData,
      tournament: tournament,
      matchId: "",
    });
    fetchMatches(tournament);
  };

  // Format match label: matchId: teamA.abbreviation vs teamB.abbreviation
  const getMatchLabel = (match: MatchData) => {
    const a = match.teamA?.abbreviation ?? "?";
    const b = match.teamB?.abbreviation ?? "?";
    return `${match.matchId}: ${a} vs ${b}`;
  };

  const handleEntryStopTimeChange = (value: string) => {
    setFormData({
      ...formData,
      matchStartTime: value || undefined,
    });
  };

  // Fetch tournaments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTournaments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.tournament) {
      setError("Please select a tournament");
      setLoading(false);
      return;
    }

    if (!formData.matchId) {
      setError("Please select a match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.error === "string"
              ? errorData.error
              : "Failed to create prediction";
        throw new Error(errorMessage);
      }

      const response = await res.json();
      if (!response.success) {
        throw new Error(response.message || "Failed to create prediction");
      }

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        tournament: "",
        matchId: "",
        matchStartTime: "",
      });
      setSelectedTournament("");
      setMatches([]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create prediction";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Create New Prediction
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tournament *
              </label>
              <select
                required
                value={selectedTournament}
                onChange={(e) => handleTournamentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              >
                <option value="">-- Select a tournament --</option>
                {tournaments.map((tournament) => (
                  <option key={tournament} value={tournament}>
                    {tournament}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Match *
              </label>
              <select
                required
                value={formData.matchId}
                onChange={(e) =>
                  setFormData({ ...formData, matchId: e.target.value })
                }
                disabled={!selectedTournament || matchesLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {matchesLoading
                    ? "Loading matches..."
                    : !selectedTournament
                      ? "Select tournament first"
                      : matches.length === 0
                        ? "No matches for this tournament"
                        : "-- Select a match --"}
                </option>
                {matches.map((match) => (
                  <option key={match._id} value={match._id}>
                    {getMatchLabel(match)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Match Start time
              </label>
              <input
                type="datetime-local"
                value={formData.matchStartTime ?? ""}
                onChange={(e) => handleEntryStopTimeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                After this time users cannot place entries on this prediction.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Prediction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
