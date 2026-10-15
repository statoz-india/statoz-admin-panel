import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { Quiz } from "../../route";

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
      `/quiz/getTournamentBasedQuizForAdmin/${encodeURIComponent(tournament)}`,
    );
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse(
        { data: [] },
        { status: 404 },
        { message: "No Quiz found for this tournament" },
      );
    }

    const data = await handleExternalApiResponse<Quiz[]>(response);

    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching tournament based quizzes:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tournament based quizzes",
      },
      { status: 500 },
    );
  }
}
