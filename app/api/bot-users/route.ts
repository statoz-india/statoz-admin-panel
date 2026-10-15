// GET /api/bot-users -> backend GET /bot-users
// Lists all non-deleted bot users (newest first).

import { NextResponse } from "next/server";
import type { BotUser } from "@/app/interface/bot-user.interface";
import { proxyBotUsers } from "./proxy";

export async function GET() {
  try {
    return await proxyBotUsers<BotUser[]>(
      "/bot-users",
      { method: "GET" },
      "Failed to fetch bot users",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching bot users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bot users" },
      { status: 500 },
    );
  }
}
