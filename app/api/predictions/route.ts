import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import { Team } from "../tournament/teams/route";

// User Prediction interface
export interface UserPrediction {
  _id: string;
  userId: string;
  predictionId: string;
  teamChosen: string;
  coinsBet: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Prediction interface
export interface Prediction {
  _id: string;
  predictionId: string;
  teamA: Team;
  teamB: Team;
  matchId: string;
  coinsOnTeamA: number;
  coinsOnTeamB: number;
  tournament: string;
  winningTeamCoin?: number;
  responseSubmittedByUsers: string[];
  isVisible: boolean;
  createdByUserData: {
    email?: string;
    userType?: string;
  };
  totalCoins: number;
  oddsTeamA: number;
  oddsTeamB: number;
  userPrediction: UserPrediction | null;
}

export interface CreatePredictionPayload {
  tournament: string;
  matchId: string;
  matchStartTime?: string;
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/prediction");
    if (response.status === 401) {
      return await errorResponse();
    }

    if (response.status === 404) {
      return successResponse(
        { data: [] },
        { status: 404 },
        { message: "No Predictions found" },
      );
    }
    const data = await handleExternalApiResponse<Prediction[]>(response);

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
        message: "Failed to fetch predictions",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { tournament, matchId, matchStartTime } = body;

    const apiPayload: CreatePredictionPayload = {
      tournament: tournament,
      matchId: matchId,
      ...(matchStartTime && { matchStartTime }),
    };

    const response = await authenticatedFetch("/prediction/createPrediction", {
      method: "POST",
      body: JSON.stringify(apiPayload),
    });

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
        errorData = { message: errorText || "Failed to create team" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to create team (Status: ${response.status})`;

      console.error("Extracted error message:", errorMessage);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      statusCode: number;
      data: Prediction;
      message: string;
      success: boolean;
    }>(response);

    const quiz = backendResponse?.data;

    return successResponse(quiz, { status: 201 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating team:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create predictions",
      },
      { status: 500 },
    );
  }
}
