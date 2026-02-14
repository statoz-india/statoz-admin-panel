import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { MatchData } from "../route";

export async function GET(
  request: Request,
  context: { params: Promise<{ tournament: string }> | { tournament: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const tournament = params.tournament;

    if (!tournament) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(`/match/${encodeURIComponent(tournament)}`);

    if (response.status === 401) {
      return await errorResponse();
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to fetch matches" };
      }
      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : "Failed to fetch matches";
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      data: MatchData[];
      success: boolean;
      message?: string;
    }>(response);
    const data = backendResponse?.data;
    return successResponse(Array.isArray(data) ? data : [], { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch matches",
      },
      { status: 500 },
    );
  }
}
