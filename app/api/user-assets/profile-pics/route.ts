// GET  /api/user-assets/profile-pics -> backend GET  /profile-pics
// POST /api/user-assets/profile-pics -> backend POST /profile-pics/createProfilePic

import { NextRequest, NextResponse } from "next/server";
import type {
  CreateProfilePicInput,
  ProfilePic,
} from "@/app/interface/user-asset.interface";
import { proxyUserAssetsRequest } from "../proxy";

export async function GET() {
  try {
    return await proxyUserAssetsRequest<ProfilePic[]>(
      "/profile-pics/admin",
      { method: "GET" },
      "Failed to fetch profile pics",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching profile pics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile pics" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProfilePicInput;

    return await proxyUserAssetsRequest<ProfilePic>(
      "/profile-pics/createProfilePic",
      { method: "POST", body: JSON.stringify(body) },
      "Failed to create profile pic",
      201,
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error creating profile pic:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create profile pic" },
      { status: 500 },
    );
  }
}
