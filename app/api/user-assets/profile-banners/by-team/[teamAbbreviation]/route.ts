// GET /api/user-assets/profile-banners/by-team/:teamAbbreviation

import { NextResponse } from "next/server";
import type { ProfileBanner } from "@/app/interface/user-asset.interface";
import { proxyUserAssetsRequest } from "../../../proxy";

type Context = {
  params: Promise<{ teamAbbreviation: string }> | { teamAbbreviation: string };
};

export async function GET(_request: Request, context: Context) {
  try {
    const params = await Promise.resolve(context.params);
    const team = params.teamAbbreviation?.trim();
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team abbreviation is required" },
        { status: 400 },
      );
    }

    return await proxyUserAssetsRequest<ProfileBanner[]>(
      `/profile-banners/by-team/${encodeURIComponent(team)}`,
      { method: "GET" },
      "Failed to fetch profile banners by team",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching profile banners by team:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile banners by team" },
      { status: 500 },
    );
  }
}
