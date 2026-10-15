// GET /api/games/penalty-shootouts/:id
//   -> backend GET /penalty-shootout/admin/penaltyShootoutResults/:id (detail)

import { NextRequest, NextResponse } from "next/server";
import type { PenaltyShootoutDetail } from "@/app/interface/game.interface";
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

    return await proxyGames<PenaltyShootoutDetail>(
      `/penalty-shootout/admin/penaltyShootoutResults/${encodeURIComponent(id)}`,
      { method: "GET" },
      "Failed to fetch penalty shootout",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching penalty shootout:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch penalty shootout" },
      { status: 500 },
    );
  }
}
