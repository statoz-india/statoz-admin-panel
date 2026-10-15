// POST /api/bot-users/create-bots -> backend POST /bot-users/create-bots
// Creates a bot user. `email` is required; coins defaults to 1000 on the backend.

import { NextRequest, NextResponse } from "next/server";
import type {
  BotUser,
  CreateBotPayload,
} from "@/app/interface/bot-user.interface";
import { proxyBotUsers } from "../proxy";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateBotPayload;
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "email is required" },
        { status: 400 },
      );
    }

    const payload: CreateBotPayload = { email };
    if (body.userName?.trim()) payload.userName = body.userName.trim();
    if (body.avatarUrl?.trim()) payload.avatarUrl = body.avatarUrl.trim();
    if (body.bannerUrl?.trim()) payload.bannerUrl = body.bannerUrl.trim();
    if (typeof body.coins === "number") payload.coins = body.coins;
    if (body.profilePic?.trim()) payload.profilePic = body.profilePic.trim();
    if (body.profileBanner?.trim())
      payload.profileBanner = body.profileBanner.trim();

    return await proxyBotUsers<BotUser>(
      "/bot-users/create-bots",
      { method: "POST", body: JSON.stringify(payload) },
      "Failed to create bot user",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error creating bot user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create bot user" },
      { status: 500 },
    );
  }
}
