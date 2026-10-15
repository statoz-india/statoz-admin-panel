import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

/**
 * Proxies `GET /api/v1/leaderboard/coinsLeaderboard` (same as curl: no body, Cookie auth).
 */
export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/leaderboard/adminCoinsLeaderboard",
      {
        method: "GET",
      },
    );

    if (response.status === 401) {
      return await errorResponse();
    }

    const data = await handleExternalApiResponse<unknown>(response);

    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching coins leaderboard:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch coins leaderboard",
      },
      { status: 500 },
    );
  }
}
