// GET  /api/player-cards            -> backend GET  /player-cards (list, filtered)
// POST /api/player-cards            -> backend POST /player-cards/createPlayerCard

import { NextRequest, NextResponse } from "next/server";
import type {
  CreatePlayerCardInput,
  Paginated,
  PlayerCard,
} from "@/app/interface/player-card.interface";
import { proxyPlayerCards } from "./proxy";

const ALLOWED_FILTERS = ["page", "limit", "sport", "cardType", "position", "team"];

export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const sp = new URLSearchParams();
    for (const key of ALLOWED_FILTERS) {
      const value = incoming.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    return await proxyPlayerCards<Paginated<PlayerCard>>(
      `/player-cards${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch player cards",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching player cards:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch player cards" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePlayerCardInput;

    return await proxyPlayerCards<PlayerCard>(
      "/player-cards/createPlayerCard",
      { method: "POST", body: JSON.stringify(body) },
      "Failed to create player card",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error creating player card:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create player card" },
      { status: 500 },
    );
  }
}
