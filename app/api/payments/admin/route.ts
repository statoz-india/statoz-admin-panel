// GET /api/payments/admin -> backend GET /payments/admin

import { NextRequest, NextResponse } from "next/server";
import type { PaginatedPayments } from "@/app/interface/payment.interface";
import { proxyPaymentsRequest } from "../proxy";

const ALLOWED_FILTERS = ["page", "status", "productId", "userId"];

export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const sp = new URLSearchParams();
    for (const key of ALLOWED_FILTERS) {
      const value = incoming.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    return await proxyPaymentsRequest<PaginatedPayments>(
      `/payments/admin${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch payments",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
