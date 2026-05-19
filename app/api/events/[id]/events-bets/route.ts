import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import type { EventBetsListSuccessResponse } from "../../../../models/events.model";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id?.trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Event ID is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/events/${encodeURIComponent(id)}/fetchAllEventBets`,
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const parsed =
      await handleExternalApiResponse<EventBetsListSuccessResponse>(response);
    const data = parsed.data ?? [];
    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching event bets:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch event bets",
      },
      { status: 500 },
    );
  }
}
