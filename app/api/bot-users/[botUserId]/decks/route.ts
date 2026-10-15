// POST /api/bot-users/:botUserId/decks -> backend POST /bot-users/:botUserId/decks
// Builds a named deck from cards the bot already owns.

import { NextRequest, NextResponse } from "next/server";
import type {
  BotDeck,
  CreateDeckPayload,
} from "@/app/interface/bot-user.interface";
import { proxyBotUsers } from "../../proxy";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ botUserId: string }> | { botUserId: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const botUserId = params.botUserId?.trim();

    if (!botUserId) {
      return NextResponse.json(
        { success: false, message: "botUserId is required" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as CreateDeckPayload;
    const name = body.name?.trim();
    const playerCardIds = Array.isArray(body.playerCardIds)
      ? body.playerCardIds
      : [];
    const actionCardIds = Array.isArray(body.actionCardIds)
      ? body.actionCardIds
      : [];

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Deck name is required" },
        { status: 400 },
      );
    }
    if (playerCardIds.length === 0 && actionCardIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Select at least one player or action card",
        },
        { status: 400 },
      );
    }

    return await proxyBotUsers<BotDeck>(
      `/bot-users/${encodeURIComponent(botUserId)}/decks`,
      {
        method: "POST",
        body: JSON.stringify({ name, playerCardIds, actionCardIds }),
      },
      "Failed to create deck",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error creating deck:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create deck" },
      { status: 500 },
    );
  }
}
