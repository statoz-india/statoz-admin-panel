// curl -X GET "http://localhost:8000/api/v1/admin-data/getTodayFutureSubmissions" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Today's future submissions (IST), each with the user, choice and future.

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { TodayFutureSubmission } from "@/app/interface/dashboard.interface";

type BackendBody = TodayFutureSubmission[] | { data: TodayFutureSubmission[] };

function unwrap(body: BackendBody): TodayFutureSubmission[] {
  return Array.isArray(body) ? body : (body?.data ?? []);
}

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/admin-data/getTodayFutureSubmissions",
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
    console.error("Error fetching today's future submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch today's future submissions",
      },
      { status: 500 },
    );
  }
}
