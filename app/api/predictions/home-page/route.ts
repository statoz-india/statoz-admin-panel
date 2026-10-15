import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type {
  HomePageBackendResponse,
  HomePagePrediction,
} from "@/app/models/home-page.model";

/**
 * GET /api/predictions/home-page
 *
 * Proxies `GET /prediction/homePagePredictions` — visible predictions whose
 * linked match falls on "yesterday or later" (Asia/Kolkata). `totalCoins` /
 * `oddsTeamA` / `oddsTeamB` are computed live from the current coin pools.
 */
export async function GET() {
  try {
    const response = await authenticatedFetch("/prediction/homePagePredictions");

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse<HomePagePrediction[]>(
        [],
        { status: 200 },
        { message: "No predictions found" },
      );
    }

    const backendResponse = await handleExternalApiResponse<
      HomePageBackendResponse<HomePagePrediction>
    >(response);

    return successResponse<HomePagePrediction[]>(
      Array.isArray(backendResponse?.data) ? backendResponse.data : [],
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching home page predictions:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch home page predictions",
      },
      { status: 500 },
    );
  }
}
