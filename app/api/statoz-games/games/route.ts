// GET  /api/statoz-games/games -> backend GET  /games/get-games   (one section per sport, games in display order)
// POST /api/statoz-games/games -> backend POST /games/create-game (super admins only)

import { NextResponse } from "next/server";
import type {
  CreateGamePayload,
  Game,
  GameSection,
} from "@/app/interface/game-catalog.interface";
import { proxyGames } from "../proxy";

export async function GET() {
  try {
    return await proxyGames<GameSection[]>(
      "/games/get-games",
      { method: "GET" },
      "Failed to fetch games",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch games" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, subtitle, key, gameType, isQuickPlay, isLive, message } =
      await request.json();

    // Forward only the fields the backend knows; it validates them and
    // reports every problem at once.
    const payload: CreateGamePayload = {
      title,
      subtitle,
      key,
      gameType,
      ...(isQuickPlay !== undefined && { isQuickPlay }),
      ...(isLive !== undefined && { isLive }),
      ...(message !== undefined && { message }),
    };

    return await proxyGames<Game>(
      "/games/create-game",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      "Failed to create game",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error creating game:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create game" },
      { status: 500 },
    );
  }
}
