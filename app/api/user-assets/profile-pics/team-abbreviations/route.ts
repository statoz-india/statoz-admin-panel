// GET /api/user-assets/profile-pics/team-abbreviations

import { NextResponse } from "next/server";
import { proxyUserAssetsRequest } from "../../proxy";

export async function GET() {
  try {
    return await proxyUserAssetsRequest<string[]>(
      "/profile-pics/team-abbreviations",
      { method: "GET" },
      "Failed to fetch profile pic team abbreviations",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching profile pic team abbreviations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile pic team abbreviations",
      },
      { status: 500 },
    );
  }
}
