import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

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
  teamA: string;
  teamAlogo?: string;
  teamAcolorPrimary?: string;
  teamAcolorSecondary?: string;
  teamB: string;
  teamBlogo?: string;
  teamBcolorPrimary?: string;
  teamBcolorSecondary?: string;
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

export async function GET() {
  try {
    const response = await authenticatedFetch("/prediction");
    if (response.status === 401) {
      return await errorResponse();
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
      { status: 500 }
    );
  }
}
