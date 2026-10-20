"use client";

import type { CuratedTrendingTournament } from "@/app/models/trending-curated.model";
import TrendingListEditor, { SportBadge, TournamentChip } from "./TrendingListEditor";
import {
  AddTournamentPicker,
  type TournamentItem,
  tournamentName,
} from "./TrendingPickers";

/** Rows whose tournament was deleted are dropped; the next save removes them. */
function toItems(rows: CuratedTrendingTournament[]): TournamentItem[] {
  return rows.flatMap((row) =>
    row.tournament
      ? [
          {
            id: row.tournament._id,
            name: tournamentName(row.tournament),
            tournament: row.tournament,
            sportsType: row.sportsType,
          },
        ]
      : [],
  );
}

/** The trending tournaments shown in the app (not the signup list). */
export default function TrendingTournamentListTab() {
  return (
    <TrendingListEditor<CuratedTrendingTournament, TournamentItem>
      url="/api/trending/tournaments"
      listKey="trendingTournaments"
      idKey="tournament"
      noun="tournament"
      description="Tournaments the app shows as trending, in this order across all sports. Drag a row or use the arrows to reorder, then save. Saving replaces the whole list."
      toItems={toItems}
      renderItem={(item) => (
        <>
          <TournamentChip tournament={item.tournament} />
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">
            {item.name}
            {item.tournament.tournamentYear && (
              <span className="ml-2 text-gray-500">
                {item.tournament.tournamentYear}
              </span>
            )}
          </p>
          <SportBadge sport={item.sportsType} />
        </>
      )}
      renderPicker={(props) => <AddTournamentPicker {...props} />}
    />
  );
}
