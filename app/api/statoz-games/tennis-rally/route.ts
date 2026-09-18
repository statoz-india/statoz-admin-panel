// GET /api/statoz-games/tennis-rally
//   -> backend GET /tennis-rally/admin/tennisRallyResults (list, paginated)

import { NextRequest, NextResponse } from "next/server";
import type {
  TennisRallyListItem,
  Paginated,
} from "@/app/interface/game.interface";
import { proxyGames } from "../proxy";

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

    return await proxyGames<Paginated<TennisRallyListItem>>(
      `/tennis-rally/admin/tennisRallyResults${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch tennis rally results",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching tennis rally results:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tennis rally results" },
      { status: 500 },
    );
  }
}
