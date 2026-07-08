// GET /api/payments/user-assets -> backend GET /user/admin/user-assets

import { NextRequest, NextResponse } from "next/server";
import type { PaginatedUserAssetsRecords } from "@/app/interface/payment.interface";
import { proxyPaymentsRequest } from "../proxy";

const ALLOWED_FILTERS = ["page", "userId"];

export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const sp = new URLSearchParams();
    for (const key of ALLOWED_FILTERS) {
      const value = incoming.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    return await proxyPaymentsRequest<PaginatedUserAssetsRecords>(
      `/user/admin/user-assets${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch user assets",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching user assets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user assets" },
      { status: 500 },
    );
  }
}
