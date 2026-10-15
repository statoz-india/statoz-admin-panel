// PUT /api/statoz-games/games/:id -> backend PUT /games/update-game/:id (super admins only)
//   Body: any of title, subtitle, key, gameType, isQuickPlay, isLive, message.

import { NextRequest, NextResponse } from "next/server";
import type { Game } from "@/app/interface/game-catalog.interface";
import { proxyGames } from "../../proxy";

type Context = { params: Promise<{ id: string }> | { id: string } };

const UPDATABLE_FIELDS = [
  "title",
  "subtitle",
  "key",
  "gameType",
  "isQuickPlay",
  "isLive",
  "message",
] as const;

export async function PUT(request: NextRequest, context: Context) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id?.trim();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Game id is required" },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    // Forward only the fields the backend updates; it validates their values
    // and reports every problem at once.
    const payload: Record<string, unknown> = {};
    for (const field of UPDATABLE_FIELDS) {
      if (body && body[field] !== undefined) payload[field] = body[field];
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `At least one field is required: ${UPDATABLE_FIELDS.join(", ")}`,
        },
        { status: 400 },
      );
    }

    return await proxyGames<Game>(
      `/games/update-game/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      "Failed to update game",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating game:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update game" },
      { status: 500 },
    );
  }
}
