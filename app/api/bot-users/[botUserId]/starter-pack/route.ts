// GET /api/bot-users/:botUserId/starter-pack
//   -> backend GET /bot-users/:botUserId/starter-pack
// One-time bootstrap: assigns a random starter pack + "Starter Squad" deck.
// NOTE: this GET mutates state; calling it twice returns 400 (already assigned).

import { NextResponse } from "next/server";
import type { StarterPackResponse } from "@/app/interface/bot-user.interface";
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

    return await proxyBotUsers<StarterPackResponse>(
      `/bot-users/${encodeURIComponent(botUserId)}/starter-pack`,
      { method: "GET" },
      "Failed to assign starter pack",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error assigning starter pack:", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign starter pack" },
      { status: 500 },
    );
  }
}
