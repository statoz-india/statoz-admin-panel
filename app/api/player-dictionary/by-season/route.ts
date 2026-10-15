// GET /api/player-dictionary/by-season?tournament=F1&season=2026
//   -> backend GET /player-dictionary/tournament/:tournament/season/:season
//
// `tournament` may be the id, code or name. Every player comes back in one
// response (no paging), sorted by name; an empty season is `items: []`, not an
// error.

import type { Player } from "@/app/models/player.model";
import { badRequest, proxyPlayers, serverError } from "../proxy";

export interface PlayersBySeason {
  tournament: string;
  tournamentId: string;
  season: string;
  total: number;
  items: Player[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournament = searchParams.get("tournament")?.trim();
    const season = searchParams.get("season")?.trim();
    if (!tournament || !season) {
      return badRequest("tournament and season are required");
    }

    return await proxyPlayers<PlayersBySeason>(
      `/player-dictionary/tournament/${encodeURIComponent(tournament)}/season/${encodeURIComponent(season)}`,
      { method: "GET" },
      "Failed to fetch players",
    );
  } catch (error) {
    return serverError(error, "Failed to fetch players");
  }
}
