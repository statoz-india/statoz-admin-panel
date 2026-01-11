import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

export async function GET() {
  try {
    const response = await authenticatedFetch("/tournament/tournament-types");
    if (response.status === 401) {
      return await errorResponse();
    }
    const data = await handleExternalApiResponse<string[]>(response);

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
      { status: 500 }
    );
  }
}
