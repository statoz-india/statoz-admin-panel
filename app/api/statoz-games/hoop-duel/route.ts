// GET /api/statoz-games/hoop-duel
//   -> backend GET /hoop-duel/admin/hoopDuelResults (list, paginated)

import { NextRequest, NextResponse } from "next/server";
import type {
  HoopDuelListItem,
  Paginated,
} from "@/app/interface/game.interface";
import { proxyGames } from "../proxy";

const ALLOWED_FILTERS = ["page", "limit", "submittedUserId", "difficulty"];

export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const sp = new URLSearchParams();
    for (const key of ALLOWED_FILTERS) {
      const value = incoming.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    return await proxyGames<Paginated<HoopDuelListItem>>(
      `/hoop-duel/admin/hoopDuelResults${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch hoop duel results",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching hoop duel results:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hoop duel results" },
      { status: 500 },
    );
  }
}
