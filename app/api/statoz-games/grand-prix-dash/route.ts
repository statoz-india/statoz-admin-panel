// GET /api/statoz-games/grand-prix-dash
//   -> backend GET /grand-prix-dash/admin/grandPrixDashResults (list, paginated)

import { NextRequest, NextResponse } from "next/server";
import type {
  GrandPrixDashListItem,
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

    return await proxyGames<Paginated<GrandPrixDashListItem>>(
      `/grand-prix-dash/admin/grandPrixDashResults${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch grand prix dash results",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching grand prix dash results:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch grand prix dash results" },
      { status: 500 },
    );
  }
}
