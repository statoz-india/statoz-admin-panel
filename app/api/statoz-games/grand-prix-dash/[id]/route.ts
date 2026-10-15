// GET /api/statoz-games/grand-prix-dash/:id
//   -> backend GET /grand-prix-dash/admin/grandPrixDashResults/:id (detail)

import { NextRequest, NextResponse } from "next/server";
import type { GrandPrixDashDetail } from "@/app/interface/game.interface";
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

    return await proxyGames<GrandPrixDashDetail>(
      `/grand-prix-dash/admin/grandPrixDashResults/${encodeURIComponent(id)}`,
      { method: "GET" },
      "Failed to fetch grand prix dash result",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching grand prix dash result:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch grand prix dash result" },
      { status: 500 },
    );
  }
}
