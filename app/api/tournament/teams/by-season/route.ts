// GET /api/tournament/teams/by-season?tournament=F1&season=2026
//   -> backend GET /tournament/teams/:tournament/:season
//
// `tournament` is the code exactly as stored (case-sensitive). The season is
// taken as a query param so a split season (`2026/27`) needs no path juggling;
// it is encoded here. The backend answers an empty result with 404, which is
// returned as an empty list.

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractBackendErrorMessage,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import type { Team } from "../route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournament = searchParams.get("tournament")?.trim();
    const season = searchParams.get("season")?.trim();

    if (!tournament || !season) {
      return NextResponse.json(
        { success: false, message: "tournament and season are required" },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/tournament/teams/${encodeURIComponent(tournament)}/${encodeURIComponent(season)}`,
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse<Team[]>([], { status: 200 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      return NextResponse.json(
        {
          success: false,
          message: extractBackendErrorMessage(
            errorData,
            `Failed to fetch teams (Status: ${response.status})`,
          ),
        },
        { status: response.status },
      );
    }

    const body = await handleExternalApiResponse<{
      data?: { teams?: Team[] };
    }>(response);

    return successResponse(body?.data?.teams ?? [], { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching teams by season:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch teams",
      },
      { status: 500 },
    );
  }
}
