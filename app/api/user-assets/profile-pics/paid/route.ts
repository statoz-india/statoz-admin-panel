// GET /api/user-assets/profile-pics/paid -> backend GET /profile-pics/paid

import { NextRequest, NextResponse } from "next/server";
import type { PaginatedProfilePics } from "@/app/interface/user-asset.interface";
import { proxyUserAssetsRequest } from "../../proxy";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const page = sp.get("page") ?? "1";
    const limit = sp.get("limit") ?? "50";

    return await proxyUserAssetsRequest<PaginatedProfilePics>(
      `/profile-pics/paid?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      { method: "GET" },
      "Failed to fetch paid profile pics",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching paid profile pics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch paid profile pics" },
      { status: 500 },
    );
  }
}
