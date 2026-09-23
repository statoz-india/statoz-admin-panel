import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type {
  HomePageBackendResponse,
  HomePageFuture,
} from "@/app/models/home-page.model";

/**
 * GET /api/futures/home-page
 *
 * Proxies `GET /futures/homePageFutures` — futures not DELETED/CANCELLED
 * whose `entryCloseTime` falls on "yesterday or later" (Asia/Kolkata).
 * `choices` is sorted by `odds` descending; odds are computed live.
 */
export async function GET() {
  try {
    const response = await authenticatedFetch("/futures/homePageFutures");

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse<HomePageFuture[]>(
        [],
        { status: 200 },
        { message: "No futures found" },
      );
    }

    const backendResponse = await handleExternalApiResponse<
      HomePageBackendResponse<HomePageFuture>
    >(response);

    return successResponse<HomePageFuture[]>(
      Array.isArray(backendResponse?.data) ? backendResponse.data : [],
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching home page futures:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch home page futures",
      },
      { status: 500 },
    );
  }
}
