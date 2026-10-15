// GET /api/bot-users/:botUserId/cards -> backend GET /bot-users/:botUserId/cards
// Returns the bot's full collection plus its decks.

import { NextResponse } from "next/server";
import type { BotCardsResponse } from "@/app/interface/bot-user.interface";
import { proxyBotUsers } from "../../proxy";

export async function GET(
  _request: Request,
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

    return await proxyBotUsers<BotCardsResponse>(
      `/bot-users/${encodeURIComponent(botUserId)}/cards`,
      { method: "GET" },
      "Failed to fetch bot cards",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching bot cards:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bot cards" },
      { status: 500 },
    );
  }
}
