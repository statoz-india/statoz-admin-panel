// GET /api/player-cards/filter -> backend GET /player-cards/filter

import { NextRequest, NextResponse } from "next/server";
import type { PlayerCard } from "@/app/interface/player-card.interface";
import { proxyPlayerCards } from "../proxy";

const ALLOWED_FILTERS = ["playerType", "cardType"];

export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const sp = new URLSearchParams();
    for (const key of ALLOWED_FILTERS) {
      const value = incoming.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one filter (playerType or cardType) is required",
        },
        { status: 400 },
      );
    }

    return await proxyPlayerCards<PlayerCard[]>(
      `/player-cards/filter?${query}`,
      { method: "GET" },
      "Failed to filter player cards",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error filtering player cards:", error);
    return NextResponse.json(
      { success: false, message: "Failed to filter player cards" },
      { status: 500 },
    );
  }
}
