// curl -X GET "http://localhost:8000/api/v1/admin-data/getTodayEventSubmissions" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Today's event submissions (IST), each with the user and event.

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { TodayEventSubmission } from "@/app/interface/dashboard.interface";

type BackendBody = TodayEventSubmission[] | { data: TodayEventSubmission[] };

function unwrap(body: BackendBody): TodayEventSubmission[] {
  return Array.isArray(body) ? body : (body?.data ?? []);
}

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/admin-data/getTodayEventSubmissions",
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
    console.error("Error fetching today's event submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch today's event submissions",
      },
      { status: 500 },
    );
  }
}
