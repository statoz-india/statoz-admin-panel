// curl -X GET "http://localhost:8000/api/v1/admin-data/getUserOnboardingWeeklyStats" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Total onboarded users, onboarded this week, and weekly new-user counts (IST).

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { WeeklyOnboardingStats } from "@/app/interface/dashboard.interface";

type BackendBody = WeeklyOnboardingStats | { data: WeeklyOnboardingStats };

function unwrap(body: BackendBody): WeeklyOnboardingStats {
  return body && typeof body === "object" && "data" in body
    ? body.data
    : body;
}

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/admin-data/getUserOnboardingWeeklyStats",
    );
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    const body = await handleExternalApiResponse<BackendBody>(response);
    return successResponse(unwrap(body), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching user onboarding weekly stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user onboarding weekly stats",
      },
      { status: 500 },
    );
  }
}
