// GET /api/statoz-games/tennis-rally/:id
//   -> backend GET /tennis-rally/admin/tennisRallyResults/:id (detail)

import { NextRequest, NextResponse } from "next/server";
import type { TennisRallyDetail } from "@/app/interface/game.interface";
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

    return await proxyGames<TennisRallyDetail>(
      `/tennis-rally/admin/tennisRallyResults/${encodeURIComponent(id)}`,
      { method: "GET" },
      "Failed to fetch tennis rally result",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching tennis rally result:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tennis rally result" },
      { status: 500 },
    );
  }
}
