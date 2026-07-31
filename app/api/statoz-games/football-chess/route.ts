// GET /api/games/football-chess
//   -> backend GET /football-chess/admin/footballChessResults (list, paginated)

import { NextRequest, NextResponse } from "next/server";
import type {
  FootballChessListItem,
  Paginated,
} from "@/app/interface/game.interface";
import { proxyGames } from "../proxy";

const ALLOWED_FILTERS = ["page", "limit", "submittedUserId", "opponentId"];

export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const sp = new URLSearchParams();
    for (const key of ALLOWED_FILTERS) {
      const value = incoming.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    return await proxyGames<Paginated<FootballChessListItem>>(
      `/football-chess/admin/footballChessResults${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch football chess results",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching football chess results:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch football chess results" },
      { status: 500 },
    );
  }
}
