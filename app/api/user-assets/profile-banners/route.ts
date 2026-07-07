// GET  /api/user-assets/profile-banners -> backend GET  /profile-banners
// POST /api/user-assets/profile-banners -> backend POST /profile-banners/createProfileBanner

import { NextRequest, NextResponse } from "next/server";
import type {
  CreateProfileBannerInput,
  ProfileBanner,
} from "@/app/interface/user-asset.interface";
import { proxyUserAssetsRequest } from "../proxy";

export async function GET() {
  try {
    return await proxyUserAssetsRequest<ProfileBanner[]>(
      "/profile-banners/admin",
      { method: "GET" },
      "Failed to fetch profile banners",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching profile banners:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile banners" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProfileBannerInput;

    return await proxyUserAssetsRequest<ProfileBanner>(
      "/profile-banners/createProfileBanner",
      { method: "POST", body: JSON.stringify(body) },
      "Failed to create profile banner",
      201,
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error creating profile banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create profile banner" },
      { status: 500 },
    );
  }
}
