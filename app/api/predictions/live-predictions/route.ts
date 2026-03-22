import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { Prediction } from "../route";

export async function GET() {
  try {
    const response = await authenticatedFetch("/prediction/livePredictions");
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
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
