// PUT /api/statoz-games/games/order -> backend PUT /games/game-order (super admins only)
//   Body: { gameType, gameIds } — every game of that type, in the new order.

import { NextResponse } from "next/server";
import { isGameType } from "@/app/constants/game-type";
import type { Game } from "@/app/interface/game-catalog.interface";
import { proxyGames } from "../../proxy";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const gameType: unknown = body?.gameType;
    const gameIds: unknown = body?.gameIds;

    if (!isGameType(gameType)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "gameType must be one of: football, cricket, basketball, racing or tennis",
        },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(gameIds) ||
      gameIds.length === 0 ||
      gameIds.some((id) => typeof id !== "string" || !id.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "gameIds must be a non-empty array of game ids",
        },
        { status: 400 },
      );
    }

    return await proxyGames<Game[]>(
      "/games/game-order",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameType,
          gameIds: gameIds.map((id: string) => id.trim()),
        }),
      },
      "Failed to set game order",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error setting game order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to set game order" },
      { status: 500 },
    );
  }
}
