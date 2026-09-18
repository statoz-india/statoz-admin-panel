// GET /api/statoz-games/final-over
//   -> backend GET /final-over/admin/finalOverResults (list, paginated)

import { NextRequest, NextResponse } from "next/server";
import type {
  FinalOverListItem,
  Paginated,
} from "@/app/interface/game.interface";
import { proxyGames } from "../proxy";

// Final over is single-player, so there is no `opponentId` filter.
const ALLOWED_FILTERS = ["page", "limit", "submittedUserId"];

export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const sp = new URLSearchParams();
    for (const key of ALLOWED_FILTERS) {
      const value = incoming.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    return await proxyGames<Paginated<FinalOverListItem>>(
      `/final-over/admin/finalOverResults${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch final over results",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching final over results:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch final over results" },
      { status: 500 },
    );
  }
}
