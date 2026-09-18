// GET /api/statoz-games/final-over/:id
//   -> backend GET /final-over/admin/finalOverResults/:id (detail)

import { NextRequest, NextResponse } from "next/server";
import type { FinalOverDetail } from "@/app/interface/game.interface";
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

    return await proxyGames<FinalOverDetail>(
      `/final-over/admin/finalOverResults/${encodeURIComponent(id)}`,
      { method: "GET" },
      "Failed to fetch final over result",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching final over result:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch final over result" },
      { status: 500 },
    );
  }
}
