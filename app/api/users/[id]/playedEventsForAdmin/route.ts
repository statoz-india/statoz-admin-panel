import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import type { PlayedEvent } from "@/app/interface/playedEvent.interface";

type BackendPlayedEventsResponse = {
  statusCode: number;
  data: PlayedEvent[];
  message?: string;
  success?: boolean;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/user/playedEventsForAdmin/${id}`,
    );
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const data =
      await handleExternalApiResponse<BackendPlayedEventsResponse>(response);

    return successResponse(data.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching played events for admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch played events",
      },
      { status: 500 },
    );
  }
}
