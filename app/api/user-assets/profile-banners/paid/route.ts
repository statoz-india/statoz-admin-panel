// GET /api/user-assets/profile-banners/paid -> backend GET /profile-banners/paid

import { NextRequest, NextResponse } from "next/server";
import type { PaginatedProfileBanners } from "@/app/interface/user-asset.interface";
import { proxyUserAssetsRequest } from "../../proxy";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const page = sp.get("page") ?? "1";
    const limit = sp.get("limit") ?? "50";

    return await proxyUserAssetsRequest<PaginatedProfileBanners>(
      `/profile-banners/paid?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      { method: "GET" },
      "Failed to fetch paid profile banners",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching paid profile banners:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch paid profile banners" },
      { status: 500 },
    );
  }
}
