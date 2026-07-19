// GET /api/games/football-chess/:id
//   -> backend GET /football-chess/admin/footballChessResults/:id (detail)

import { NextRequest, NextResponse } from "next/server";
import type { FootballChessDetail } from "@/app/interface/game.interface";
import { proxyGames } from "../../proxy";

type Context = { params: Promise<{ id: string }> | { id: string } };

export async function GET(_request: NextRequest, context: Context) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id?.trim();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Result id is required" },
        { status: 400 },
      );
    }

    return await proxyGames<FootballChessDetail>(
      `/football-chess/admin/footballChessResults/${encodeURIComponent(id)}`,
      { method: "GET" },
      "Failed to fetch football chess result",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching football chess result:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch football chess result" },
      { status: 500 },
    );
  }
}
