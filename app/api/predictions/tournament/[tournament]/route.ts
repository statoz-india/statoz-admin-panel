import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { Prediction } from "../../route";

export async function GET(
  _request: Request,
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

    const response = await authenticatedFetch(
      `/prediction/getPredictionsByTournaments/${encodeURIComponent(tournament)}`,
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse(
        { data: [] },
        { status: 404 },
        { message: "No Predictions found for this tournament" },
      );
    }

    const data = await handleExternalApiResponse<Prediction[]>(response);
    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching predictions by tournament:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tournament predictions",
      },
      { status: 500 },
    );
  }
}
