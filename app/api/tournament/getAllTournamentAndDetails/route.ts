import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { Tournament } from "@/app/models/tournament.model";

type GetAllTournamentsBackendResponse = {
  statusCode: number;
  data: Tournament[];
  message: string;
  success: boolean;
};

function unwrapTournaments(
  body: Tournament[] | GetAllTournamentsBackendResponse,
): Tournament[] {
  return Array.isArray(body) ? body : body.data;
}

export async function GET() {
  try {
    const response = await authenticatedFetch(
      "/tournament/getAllTournamentAndDetails",
    );

    if (response.status === 401) {
      return await errorResponse();
    }

    const data = await handleExternalApiResponse<
      Tournament[] | GetAllTournamentsBackendResponse
    >(response);

    return successResponse(unwrapTournaments(data), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tournaments",
      },
      { status: 500 },
    );
  }
}
