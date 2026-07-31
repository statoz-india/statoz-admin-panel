// GET /api/games/pitch-duels
//   -> backend GET /pitch-duel/admin/pitchDuelResults (list, paginated)

import { NextRequest, NextResponse } from "next/server";
import type {
  Paginated,
  PitchDuelListItem,
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

    return await proxyGames<Paginated<PitchDuelListItem>>(
      `/pitch-duel/admin/pitchDuelResults${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch pitch duels",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching pitch duels:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pitch duels" },
      { status: 500 },
    );
  }
}
