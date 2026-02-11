import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import { NextResponse } from "next/server";

export interface Waitlist {
  _id: string;
  email: string;
  type: string;
  submissionTime: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/waitlist/getAllWaitlist");
    if (response.status === 401) {
      return await errorResponse();
    }
    const data = await handleExternalApiResponse<Waitlist[]>(response);
    return successResponse(data, { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching waitlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch waitlist users",
      },
      { status: 500 },
    );
  }
}
