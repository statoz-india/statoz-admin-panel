import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type {
  HomePageBackendResponse,
  HomePageMatch,
} from "@/app/models/home-page.model";

/**
 * GET /api/match/home-page
 *
 * Proxies `GET /match/homePageMatches` — visible matches whose `matchStartTime`
 * falls on "yesterday or later" (Asia/Kolkata), same set the app's home
 * screen shows.
 */
export async function GET() {
  try {
    const response = await authenticatedFetch("/match/homePageMatches");

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse<HomePageMatch[]>(
        [],
        { status: 200 },
        { message: "No matches found" },
      );
    }

    const backendResponse =
      await handleExternalApiResponse<HomePageBackendResponse<HomePageMatch>>(
        response,
      );

    return successResponse<HomePageMatch[]>(
      Array.isArray(backendResponse?.data) ? backendResponse.data : [],
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching home page matches:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch home page matches",
      },
      { status: 500 },
    );
  }
}
