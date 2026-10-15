import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "@/app/api/utils/api-helper";
import type { Tournament } from "@/app/models/tournament.model";

export async function GET() {
  try {
    const response = await authenticatedFetch("/games/tournaments/unassigned");

    if (response.status === 401) {
      return await errorResponse();
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = {
          message: errorText || "Failed to fetch unassigned tournaments",
        };
      }
      const message =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : "Failed to fetch unassigned tournaments";
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
        backendResponse?.message ??
        "Tournaments without gameType fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching unassigned tournaments:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch unassigned tournaments",
      },
      { status: 500 },
    );
  }
}
