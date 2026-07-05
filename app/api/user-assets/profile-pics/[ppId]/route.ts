// GET /api/user-assets/profile-pics/:ppId

import { NextResponse } from "next/server";
import type { ProfilePic } from "@/app/interface/user-asset.interface";
import { proxyUserAssetsRequest } from "../../proxy";

type Context = { params: Promise<{ ppId: string }> | { ppId: string } };

export async function GET(_request: Request, context: Context) {
  try {
    const params = await Promise.resolve(context.params);
    const ppId = params.ppId?.trim();
    if (!ppId) {
      return NextResponse.json(
        { success: false, message: "Profile pic id is required" },
        { status: 400 },
      );
    }

    return await proxyUserAssetsRequest<ProfilePic>(
      `/profile-pics/${encodeURIComponent(ppId)}`,
      { method: "GET" },
      "Failed to fetch profile pic",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching profile pic:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile pic" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: Context,
) {
  try {
    const params = await Promise.resolve(context.params);
    const ppId = params.ppId?.trim();
    if (!ppId) {
      return NextResponse.json(
        { success: false, message: "Profile pic id is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one field is required" },
        { status: 400 },
      );
    }

    return await proxyUserAssetsRequest<ProfilePic>(
      `/profile-pics/${encodeURIComponent(ppId)}`,
      { method: "PATCH", body: JSON.stringify(body) },
      "Failed to update profile pic",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating profile pic:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile pic" },
      { status: 500 },
    );
  }
}
