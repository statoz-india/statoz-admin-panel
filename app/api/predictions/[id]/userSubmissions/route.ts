import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";

/** Single user bet submission from getBetSubmission API */
export interface UserSubmittedBets {
  _id: string;
  userId: string;
  predictionId: string;
  teamChosen: string;
  coinsBet: number;
  coinsWon: number;
  submissionTime: string;
  payoutStatus: string;
  createdAt: string;
  userData: {
    _id: string;
    userName: string;
    email: string;
    coins: number;
    xp: {
      totalXP: number;
    };
  };
}

/** Raw envelope from the external API (getBetSubmission) */
interface BetSubmissionsApiResponse {
  statusCode?: number;
  data: UserSubmittedBets[];
  message?: string;
  success?: boolean;
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
          message: "Prediction ID is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/prediction/getBetSubmission/${id}`,
    );
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const parsed =
      await handleExternalApiResponse<BetSubmissionsApiResponse>(response);
    const data = parsed.data ?? parsed;
    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching prediction submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch prediction submissions",
      },
      { status: 500 },
    );
  }
}
