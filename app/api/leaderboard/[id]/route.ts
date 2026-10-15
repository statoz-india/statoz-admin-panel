import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

export interface LeaderboardUser {
  _id: string;
  userName: string;
  email: string;
  userType: string;
  coins: number;
  createdAt: string;
  updatedAt: string;
  tournamentXP: number;
  totalXP: number;
  rank: number;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament name is required",
        },
        { status: 400 },
      );
    }
    const response = await authenticatedFetch(`/leaderboard/${id}`);

    if (response.status === 401) {
      return await errorResponse();
    }
    const data = await handleExternalApiResponse<LeaderboardUser[]>(response);

    return successResponse(data, { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quizes",
      },
      { status: 500 },
    );
  }
}
