// GET  /api/player-cards/action-cards -> backend GET  /player-cards/action-cards (list)
// POST /api/player-cards/action-cards -> backend POST /player-cards/createPlayerActionCard

import { NextRequest, NextResponse } from "next/server";
import type {
  ActionCard,
  CreateActionCardInput,
  Paginated,
} from "@/app/interface/player-card.interface";
import { proxyPlayerCards } from "../proxy";

const ALLOWED_FILTERS = ["page", "limit", "category", "risky", "isVisible"];

export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const sp = new URLSearchParams();
    for (const key of ALLOWED_FILTERS) {
      const value = incoming.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    return await proxyPlayerCards<Paginated<ActionCard>>(
      `/player-cards/action-cards${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch action cards",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching action cards:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch action cards" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateActionCardInput;

    return await proxyPlayerCards<ActionCard>(
      "/player-cards/createPlayerActionCard",
      { method: "POST", body: JSON.stringify(body) },
      "Failed to create action card",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error creating action card:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create action card" },
      { status: 500 },
    );
  }
}
