import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "@/app/api/utils/api-helper";
import type { Tournament } from "@/app/models/tournament.model";

export async function GET(
  _request: Request,
  context: { params: Promise<{ gameType: string }> | { gameType: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const gameType = params.gameType?.trim().toLowerCase();

    if (!gameType) {
      return NextResponse.json(
        { success: false, message: "gameType is required" },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/games/${encodeURIComponent(gameType)}/tournaments`,
    );

    if (response.status === 401) {
      return await errorResponse();
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to fetch tournaments" };
      }
      const message =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : "Failed to fetch tournaments";
      return NextResponse.json(
        { success: false, message },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      statusCode: number;
      data: Tournament[];
      message: string;
      success?: boolean;
    }>(response);

    const tournaments = Array.isArray(backendResponse?.data)
      ? backendResponse.data
      : [];

    return successResponse(tournaments, {
      status: 200,
      message:
        backendResponse?.message ?? "Tournaments fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching tournaments by game:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch tournaments",
      },
      { status: 500 },
    );
  }
}
