// curl -X GET "http://localhost:8000/api/v1/admin-data/getTodayPredictionSubmissions" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Today's prediction submissions (IST), each with the user and prediction.

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { TodayPredictionSubmission } from "@/app/interface/dashboard.interface";

type BackendBody =
  | TodayPredictionSubmission[]
  | { data: TodayPredictionSubmission[] };

function unwrap(body: BackendBody): TodayPredictionSubmission[] {
  return Array.isArray(body) ? body : (body?.data ?? []);
}

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/admin-data/getTodayPredictionSubmissions",
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
    console.error("Error fetching today's prediction submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch today's prediction submissions",
      },
      { status: 500 },
    );
  }
}
