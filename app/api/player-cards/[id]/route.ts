// PUT    /api/player-cards/:id  -> backend PUT    /player-cards/updatePlayerCard/:id
// DELETE /api/player-cards/:id  -> backend DELETE /player-cards/deletePlayerCard/:id

import { NextRequest, NextResponse } from "next/server";
import type {
  PlayerCard,
  UpdatePlayerCardInput,
} from "@/app/interface/player-card.interface";
import { proxyPlayerCards } from "../proxy";

type Context = { params: Promise<{ id: string }> | { id: string } };

async function getId(context: Context): Promise<string | null> {
  const params = await Promise.resolve(context.params);
  return params.id?.trim() || null;
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Player card id is required" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as UpdatePlayerCardInput;

    return await proxyPlayerCards<PlayerCard>(
      `/player-cards/updatePlayerCard/${encodeURIComponent(id)}`,
      { method: "PUT", body: JSON.stringify(body) },
      "Failed to update player card",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating player card:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update player card" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Player card id is required" },
        { status: 400 },
      );
    }

    return await proxyPlayerCards<{ _id: string }>(
      `/player-cards/deletePlayerCard/${encodeURIComponent(id)}`,
      { method: "DELETE" },
      "Failed to delete player card",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error deleting player card:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete player card" },
      { status: 500 },
    );
  }
}
