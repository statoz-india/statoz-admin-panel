// curl -X GET "http://localhost:8000/api/v1/admin-data/getTodayQuizSubmissions" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Today's quiz submissions (IST), each with the user and merged Q&A.

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { TodayQuizSubmission } from "@/app/interface/dashboard.interface";

type BackendBody = TodayQuizSubmission[] | { data: TodayQuizSubmission[] };

function unwrap(body: BackendBody): TodayQuizSubmission[] {
  return Array.isArray(body) ? body : (body?.data ?? []);
}

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/admin-data/getTodayQuizSubmissions",
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
    console.error("Error fetching today's quiz submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch today's quiz submissions",
      },
      { status: 500 },
    );
  }
}
