import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import type { FutureBetsListSuccessResponse } from "../../../../models/futures.model";

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
          message: "Future ID is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/futures/${encodeURIComponent(id)}/fetchAllBets`,
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const parsed =
      await handleExternalApiResponse<FutureBetsListSuccessResponse>(response);
    const data = parsed.data ?? [];
    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching future bets:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch future bets",
      },
      { status: 500 },
    );
  }
}
