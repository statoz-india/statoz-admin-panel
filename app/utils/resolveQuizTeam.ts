import { Team } from "@/app/api/tournament/teams/route";

export type QuizTeamField = Team | string | undefined;

export function resolveQuizTeam(team: QuizTeamField) {
  if (!team || typeof team === "string") {
    return {
      name: typeof team === "string" && team ? team : "—",
      abbreviation: "?",
      primaryColor: "#3f3f46",
      textColor: "#ffffff",
    };
  }
  return {
    name: team.name ?? "—",
    abbreviation: team.abbreviation ?? "?",
    primaryColor: team.primaryColor ?? "#3f3f46",
    textColor: team.textColor ?? "#ffffff",
  };
}
