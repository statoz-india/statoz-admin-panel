import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

export type GameListItem = {
  gameType: string;
  icon: string;
};

export async function GET() {
  try {
    const response = await authenticatedFetch("/games");
    if (response.status === 401) {
      return await errorResponse();
    }

    const backendResponse = await handleExternalApiResponse<{
      statusCode: number;
      data: GameListItem[];
      message: string;
      success?: boolean;
    }>(response);

    const games = Array.isArray(backendResponse?.data)
      ? backendResponse.data
      : [];

    return successResponse(games, {
      status: 200,
      message: backendResponse?.message ?? "Games fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching games:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch games",
      },
      { status: 500 },
    );
  }
}
