import type { MatchData } from "@/app/api/match/route";

/** Pre-fills team-sport create flows from a match detail page (uses match Mongo `_id`). */
export type LockedTeamMatch = {
  tournament: string;
  matchId: string;
  label: string;
  matchStartTime?: string;
};

export function lockedTeamMatchFromMatch(match: MatchData): LockedTeamMatch {
  const a = match.teamA?.abbreviation ?? "?";
  const b = match.teamB?.abbreviation ?? "?";
  return {
    tournament: match.tournament,
    matchId: match._id,
    label: `${match.matchId}: ${a} vs ${b}`,
    matchStartTime: match.matchStartTime,
  };
}
