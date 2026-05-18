import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import {
  FUTURE_STATUS_VALUES,
  type FutureStatusValue,
} from "@/app/constants/future-status";
import type { Future } from "@/app/models/futures.model";

type UpdateFutureStatusPayload = {
  futureStatus: FutureStatusValue;
};

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id?.trim();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Future ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const hasOnlyFutureStatusKey =
      body &&
      typeof body === "object" &&
      Object.keys(body).length === 1 &&
      Object.prototype.hasOwnProperty.call(body, "futureStatus");

    if (!hasOnlyFutureStatusKey || typeof body.futureStatus !== "string") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only futureStatus is allowed in request body and it must be a string",
        },
        { status: 400 },
      );
    }

    const futureStatus = body.futureStatus.trim().toUpperCase();
    if (!FUTURE_STATUS_VALUES.includes(futureStatus as FutureStatusValue)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid futureStatus. Allowed values: ${FUTURE_STATUS_VALUES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const apiPayload: UpdateFutureStatusPayload = {
      futureStatus: futureStatus as FutureStatusValue,
    };

    const response = await authenticatedFetch(
      `/futures/updateFuturePredictionStatus/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      },
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to update future status" };
      }
      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to update future status (Status: ${response.status})`;

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      data?: Future;
      message?: string;
      success?: boolean;
    }>(response);

    return successResponse(backendResponse.data ?? backendResponse, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update future status",
      },
      { status: 500 },
    );
  }
}
