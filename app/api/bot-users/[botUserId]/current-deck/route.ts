// PATCH /api/bot-users/:botUserId/current-deck
//   -> backend PATCH /bot-users/:botUserId/current-deck
// Sets one of the bot's existing decks as its active deck.

import { NextRequest, NextResponse } from "next/server";
import type { CurrentDeckResponse } from "@/app/interface/bot-user.interface";
import { proxyBotUsers } from "../../proxy";

export async function PATCH(
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

    const body = (await request.json()) as { deckId?: string };
    const deckId = body.deckId?.trim();

    if (!deckId) {
      return NextResponse.json(
        { success: false, message: "deckId is required" },
        { status: 400 },
      );
    }

    return await proxyBotUsers<CurrentDeckResponse>(
      `/bot-users/${encodeURIComponent(botUserId)}/current-deck`,
      { method: "PATCH", body: JSON.stringify({ deckId }) },
      "Failed to set current deck",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error setting current deck:", error);
    return NextResponse.json(
      { success: false, message: "Failed to set current deck" },
      { status: 500 },
    );
  }
}
