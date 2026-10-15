// GET /api/user-assets/profile-banners/:pbId

import { NextResponse } from "next/server";
import type { ProfileBanner } from "@/app/interface/user-asset.interface";
import { proxyUserAssetsRequest } from "../../proxy";

type Context = { params: Promise<{ pbId: string }> | { pbId: string } };

export async function GET(_request: Request, context: Context) {
  try {
    const params = await Promise.resolve(context.params);
    const pbId = params.pbId?.trim();
    if (!pbId) {
      return NextResponse.json(
        { success: false, message: "Profile banner id is required" },
        { status: 400 },
      );
    }

    return await proxyUserAssetsRequest<ProfileBanner>(
      `/profile-banners/${encodeURIComponent(pbId)}`,
      { method: "GET" },
      "Failed to fetch profile banner",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching profile banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile banner" },
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
    const pbId = params.pbId?.trim();
    if (!pbId) {
      return NextResponse.json(
        { success: false, message: "Profile banner id is required" },
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

    return await proxyUserAssetsRequest<ProfileBanner>(
      `/profile-banners/${encodeURIComponent(pbId)}`,
      { method: "PATCH", body: JSON.stringify(body) },
      "Failed to update profile banner",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating profile banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile banner" },
      { status: 500 },
    );
  }
}
