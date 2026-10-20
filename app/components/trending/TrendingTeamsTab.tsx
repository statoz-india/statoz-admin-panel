"use client";

import type { CuratedTrendingTeam } from "@/app/models/trending-curated.model";
import TrendingListEditor, { SportBadge } from "./TrendingListEditor";
import {
  AddTeamPicker,
  TeamBadge,
  type TeamItem,
  teamName,
  tournamentName,
} from "./TrendingPickers";

/** Rows whose team was deleted are dropped; the next save removes them. */
function toItems(rows: CuratedTrendingTeam[]): TeamItem[] {
  return rows.flatMap((row) =>
    row.team
      ? [
          {
            id: row.team._id,
            name: teamName(row.team),
            team: row.team,
            tournament: row.tournament,
            sportsType: row.sportsType,
          },
        ]
      : [],
  );
}

/** The trending teams shown in the app. */
export default function TrendingTeamsTab() {
  return (
    <TrendingListEditor<CuratedTrendingTeam, TeamItem>
      url="/api/trending/teams"
      listKey="trendingTeams"
      idKey="team"
      noun="team"
      description="Teams the app shows as trending, in this order across all sports. Pick a tournament to find a team. Drag a row or use the arrows to reorder, then save. Saving replaces the whole list."
      toItems={toItems}
      renderItem={(item) => (
        <>
          <TeamBadge team={item.team} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {item.name}
            </p>
            <p className="truncate text-xs text-gray-500">
              {item.tournament
                ? `${tournamentName(item.tournament)} ${item.tournament.tournamentYear ?? ""}`
                : item.team.tournament}
            </p>
          </div>
          <SportBadge sport={item.sportsType} />
        </>
      )}
      renderPicker={(props) => <AddTeamPicker {...props} />}
    />
  );
}
