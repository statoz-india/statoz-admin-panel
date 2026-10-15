// GET /api/games/pitch-duels/:id
//   -> backend GET /pitch-duel/admin/pitchDuelResults/:id (detail)

import { NextRequest, NextResponse } from "next/server";
import type { PitchDuelDetail } from "@/app/interface/game.interface";
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

    return await proxyGames<PitchDuelDetail>(
      `/pitch-duel/admin/pitchDuelResults/${encodeURIComponent(id)}`,
      { method: "GET" },
      "Failed to fetch pitch duel",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching pitch duel:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pitch duel" },
      { status: 500 },
    );
  }
}
