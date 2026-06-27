import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import type { DashboardData } from "@/app/interface/dashboard.interface";

type BackendBody = DashboardData | { data: DashboardData };

function unwrap(body: BackendBody): DashboardData {
  return body && typeof body === "object" && "data" in body ? body.data : body;
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/admin-data/getDashboardData");
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    const body = await handleExternalApiResponse<BackendBody>(response);
    return successResponse(unwrap(body), { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
      },
      { status: 500 },
    );
  }
}
