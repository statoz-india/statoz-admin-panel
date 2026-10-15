// GET /api/user-assets/profile-banners/team-abbreviations

import { NextResponse } from "next/server";
import { proxyUserAssetsRequest } from "../../proxy";

export async function GET() {
  try {
    return await proxyUserAssetsRequest<string[]>(
      "/profile-banners/team-abbreviations",
      { method: "GET" },
      "Failed to fetch profile banner team abbreviations",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching profile banner team abbreviations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile banner team abbreviations",
      },
      { status: 500 },
    );
  }
}
