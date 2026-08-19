// curl -X GET "http://localhost:8000/api/v1/admin-data/getTodayKnowledgeQuizSubmissions" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Today's knowledge quiz attempts (IST), each with the user, the played set
// and every question that was answered.

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractArray,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { TodayKnowledgeQuizSubmission } from "@/app/interface/dashboard.interface";

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/admin-data/getTodayKnowledgeQuizSubmissions",
    );
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    const body = await handleExternalApiResponse<unknown>(response);
    return successResponse(extractArray<TodayKnowledgeQuizSubmission>(body), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching today's knowledge quiz submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch today's knowledge quiz submissions",
      },
      { status: 500 },
    );
  }
}
