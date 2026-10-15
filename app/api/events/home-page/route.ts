import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type {
  HomePageBackendResponse,
  HomePageEvent,
} from "@/app/models/home-page.model";

/**
 * GET /api/events/home-page
 *
 * Proxies `GET /events/homePageEvents` — events not DELETED/CANCELLED whose
 * `entryCloseTime` (or linked match) falls on "yesterday or later"
 * (Asia/Kolkata). `maybe*` fields are `null` unless `haveThreeOptions` is true.
 */
export async function GET() {
  try {
    const response = await authenticatedFetch("/events/homePageEvents");

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse<HomePageEvent[]>(
        [],
        { status: 200 },
        { message: "No events found" },
      );
    }

    const backendResponse =
      await handleExternalApiResponse<HomePageBackendResponse<HomePageEvent>>(
        response,
      );

    return successResponse<HomePageEvent[]>(
      Array.isArray(backendResponse?.data) ? backendResponse.data : [],
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching home page events:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch home page events",
      },
      { status: 500 },
    );
  }
}
