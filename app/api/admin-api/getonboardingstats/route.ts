// curl -X GET "http://localhost:8000/api/v1/admin-data/getUserOnboardingStats" \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer <superadmin_access_token>"
//
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "User onboarding stats fetched successfully",
//   "data": {
//     "onboardedToday": 12,
//     "dailyOnboarding": [
//       { "date": "2025-06-25", "count": 8 },
//       { "date": "2025-06-26", "count": 15 },
//       { "date": "2025-06-27", "count": 12 }
//     ]
//   }
// }

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { OnboardingStats } from "@/app/interface/dashboard.interface";

type BackendBody = OnboardingStats | { data: OnboardingStats };

function unwrap(body: BackendBody): OnboardingStats {
  return body && typeof body === "object" && "data" in body
    ? body.data
    : body;
}

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/admin-data/getUserOnboardingStats",
    );
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
    console.error("Error fetching onboarding stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch onboarding stats",
      },
      { status: 500 },
    );
  }
}
