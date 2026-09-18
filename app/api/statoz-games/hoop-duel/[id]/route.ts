// GET /api/statoz-games/hoop-duel/:id
//   -> backend GET /hoop-duel/admin/hoopDuelResults/:id (detail)

import { NextRequest, NextResponse } from "next/server";
import type { HoopDuelDetail } from "@/app/interface/game.interface";
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

    return await proxyGames<HoopDuelDetail>(
      `/hoop-duel/admin/hoopDuelResults/${encodeURIComponent(id)}`,
      { method: "GET" },
      "Failed to fetch hoop duel result",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching hoop duel result:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hoop duel result" },
      { status: 500 },
    );
  }
}
