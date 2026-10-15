// GET /api/games/penalty-shootouts
//   -> backend GET /penalty-shootout/admin/penaltyShootoutResults (list, paginated)

import { NextRequest, NextResponse } from "next/server";
import type {
  Paginated,
  PenaltyShootoutListItem,
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

    return await proxyGames<Paginated<PenaltyShootoutListItem>>(
      `/penalty-shootout/admin/penaltyShootoutResults${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch penalty shootouts",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching penalty shootouts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch penalty shootouts" },
      { status: 500 },
    );
  }
}
