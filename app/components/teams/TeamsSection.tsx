"use client";

import { useEffect, useState } from "react";
import { Team } from "../../api/tournament/teams/route";
import CreateTeamModal from "./CreateTeamModal";
import CreateTournamentModal from "./CreateTournamentModal";
import EditTeamModal from "./EditTeamModal";

const DEFAULT_TEAM_PRIMARY_COLOR = "#1f2937";
const DEFAULT_TEAM_SECONDARY_COLOR = "#64748b";
const DEFAULT_TEAM_TEXT_COLOR = "#f8fafc";

function TeamsSection() {
  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

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

  const fetchTeams = async (tournament: string) => {
    if (!tournament) {
      setTeams([]);
      return;
    }

    try {
      setTeamsLoading(true);
      setTeamsError("");
      const res = await fetch(
        `/api/tournament/teams?tournament=${encodeURIComponent(tournament)}`,
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
        throw new Error(errorData.message || "Failed to fetch teams");
      }

      const response = await res.json();

      const teamsData = response.success && response.data ? response.data : [];
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setTeamsError("");
    } catch (err) {
      setTeamsError(
        err instanceof Error ? err.message : "Failed to load teams",
      );
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchTeams(selectedTournament);
    } else {
      setTeams([]);
      setTeamsError("");
    }
  }, [selectedTournament]);

  const handleTeamCreated = () => {
    // Refresh teams list if a tournament is selected
    if (selectedTournament) {
      fetchTeams(selectedTournament);
    }
  };

  const handleTeamUpdated = () => {
    // Refresh teams list if a tournament is selected
    if (selectedTournament) {
      fetchTeams(selectedTournament);
    }
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };

  const getTeamAbbreviation = (team: Team) =>
    (team.abbreviation || team.name || "").slice(0, 4).toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading tournaments...</p>
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
        <h2 className="text-2xl font-bold text-white">Teams</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateTournamentModalOpen(true)}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 font-medium"
          >
            Create New Tournament
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 font-medium"
          >
            Create New Team
          </button>
        </div>
      </div>

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
            Teams for {selectedTournament}
          </h3>

          {teamsLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">Loading teams...</p>
            </div>
          ) : teamsError ? (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400">{teamsError}</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="p-4 bg-zinc-800 rounded-lg">
              <p className="text-gray-400">
                No teams found for this tournament
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-zinc-700">
                <thead>
                  <tr className="bg-zinc-800">
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Logo
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Name
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Abbreviation
                    </th>
                    <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                      Tournament
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr
                      key={team._id}
                      onClick={() => handleTeamClick(team)}
                      className="hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    >
                      <td className="border border-zinc-700 px-4 py-3">
                        <div
                          className="w-12 h-12 flex items-center justify-center rounded-sm border-b-4 font-semibold text-sm"
                          style={{
                            backgroundColor:
                              team.primaryColor || DEFAULT_TEAM_PRIMARY_COLOR,
                            borderBottomColor:
                              team.secondaryColor ||
                              DEFAULT_TEAM_SECONDARY_COLOR,
                            color: team.textColor || DEFAULT_TEAM_TEXT_COLOR,
                          }}
                        >
                          {getTeamAbbreviation(team)}
                        </div>
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                        {team.name}
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-300 uppercase">
                        {team.abbreviation}
                      </td>
                      <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                        {team.tournament}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleTeamCreated}
        tournaments={tournaments}
      />

      <CreateTournamentModal
        isOpen={isCreateTournamentModalOpen}
        onClose={() => setIsCreateTournamentModalOpen(false)}
        onSuccess={fetchTournaments}
      />

      <EditTeamModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTeam(null);
        }}
        onSuccess={handleTeamUpdated}
        team={selectedTeam}
      />
    </div>
  );
}

export default TeamsSection;
