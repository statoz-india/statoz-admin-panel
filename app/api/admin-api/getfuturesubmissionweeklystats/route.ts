// curl -X GET "http://localhost:8000/api/v1/admin-data/getFutureSubmissionWeeklyStats" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Total future submissions, submissions this week, and weekly counts (IST).

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { WeeklySubmissionStats } from "@/app/interface/dashboard.interface";

type BackendBody = WeeklySubmissionStats | { data: WeeklySubmissionStats };

function unwrap(body: BackendBody): WeeklySubmissionStats {
  return body && typeof body === "object" && "data" in body
    ? body.data
    : body;
}

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/admin-data/getFutureSubmissionWeeklyStats",
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
    console.error("Error fetching future submission weekly stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch future submission weekly stats",
      },
      { status: 500 },
    );
  }
}
