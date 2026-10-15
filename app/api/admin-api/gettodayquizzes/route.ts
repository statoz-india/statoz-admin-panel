// curl -X GET "http://localhost:8000/api/v1/admin-data/getTodayQuizzes" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Returns quizzes whose linked match start time falls on today (IST).

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { TodayListResponse } from "@/app/interface/dashboard.interface";

type BackendBody = TodayListResponse | { data: TodayListResponse };

function unwrap(body: BackendBody): TodayListResponse {
  return body && typeof body === "object" && "data" in body
    ? body.data
    : body;
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/admin-data/getTodayQuizzes");
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    const body = await handleExternalApiResponse<BackendBody>(response);
    return successResponse(unwrap(body), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching today's quizzes:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch today's quizzes",
      },
      { status: 500 },
    );
  }
}
