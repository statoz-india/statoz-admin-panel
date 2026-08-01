"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Team } from "../../api/tournament/teams/route";
import type { Tournament } from "@/app/models/tournament.model";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";
import EditTournamentSheet from "../tournaments/EditTournamentSheet";
import CreateTeamModal from "./CreateTeamModal";
import EditTeamModal from "./EditTeamModal";
import { Atom } from "react-loading-indicators";

const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";
const DEFAULT_TEAM_PRIMARY_COLOR = "#1f2937";
const DEFAULT_TEAM_SECONDARY_COLOR = "#64748b";
const DEFAULT_TEAM_TEXT_COLOR = "#f8fafc";

function TeamsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournament = searchParams.get("tournament") ?? "";

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [tournamentDetail, setTournamentDetail] = useState<Tournament | null>(
    null,
  );
  const [isEditTournamentOpen, setIsEditTournamentOpen] = useState(false);

  const fetchTournamentDetail = useCallback(async () => {
    if (!tournament) {
      setTournamentDetail(null);
      return;
    }

    try {
      const res = await fetch("/api/tournament/getAllTournamentAndDetails", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();
      const list: Tournament[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
      setTournamentDetail(
        list.find((t) => t.tournament === tournament) ?? null,
      );
    } catch {
      setTournamentDetail(null);
    }
  }, [tournament]);

  const fetchTeams = useCallback(async () => {
    if (!tournament) {
      setTeams([]);
      setTeamsLoading(false);
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
  }, [tournament]);

  useEffect(() => {
    fetchTeams();
    fetchTournamentDetail();
  }, [fetchTeams, fetchTournamentDetail]);

  // The main scroll container is shared across sections and keeps its scroll
  // position when only the inner content swaps, so reset it when opening a
  // tournament's teams page.
  useEffect(() => {
    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    (container ?? window).scrollTo({ top: 0, behavior: "auto" });
  }, [tournament]);

  const goToTournaments = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("section", Section.GAMES);
    sp.set("gamesTab", "all");
    stripAdminHomeQueryNoise(Section.GAMES, sp);
    sp.set("gamesTab", "all");
    router.push(`/?${sp.toString()}`, { scroll: false });
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };

  const getTeamAbbreviation = (team: Team) =>
    (team.abbreviation || team.name || "").slice(0, 4).toUpperCase();

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={goToTournaments}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tournaments
      </button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Teams</h2>
          {tournament && (
            <p className="mt-1 text-sm text-gray-400">
              Teams for {tournamentDetail?.tournamentName || tournament}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {tournamentDetail && (
            <button
              type="button"
              onClick={() => setIsEditTournamentOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-600 px-4 py-2 font-medium text-white hover:bg-zinc-800"
            >
              <Pencil className="h-4 w-4" />
              Update Tournament
            </button>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 font-medium"
          >
            Create New Team
          </button>
        </div>
      </div>

      {!tournament ? (
        <div className="p-4 bg-zinc-800 rounded-lg">
          <p className="text-gray-400">
            No tournament selected. Go back and pick a tournament.
          </p>
        </div>
      ) : teamsLoading ? (
        <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      ) : teamsError ? (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-400">{teamsError}</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="p-4 bg-zinc-800 rounded-lg">
          <p className="text-gray-400">No teams found for this tournament</p>
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
                  Display Name
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
                          team.secondaryColor || DEFAULT_TEAM_SECONDARY_COLOR,
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
                    {team.displayName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchTeams}
        tournaments={tournament ? [tournament] : []}
      />

      <EditTeamModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTeam(null);
        }}
        onSuccess={fetchTeams}
        team={selectedTeam}
      />

      <EditTournamentSheet
        isOpen={isEditTournamentOpen}
        tournament={tournamentDetail}
        onClose={() => setIsEditTournamentOpen(false)}
        onSuccess={fetchTournamentDetail}
      />
    </div>
  );
}

export default TeamsSection;
