import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { Prediction } from "../../route";
import {
  PREDICTION_STATUS_VALUES,
  PredictionStatus,
} from "@/app/constants/prediction-status";

type UpdatePredictionStatusPayload = {
  predictionStatus: PredictionStatus;
};

export async function PUT(
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

    const body = await request.json();
    const hasOnlyPredictionStatusKey =
      body &&
      typeof body === "object" &&
      Object.keys(body).length === 1 &&
      Object.prototype.hasOwnProperty.call(body, "predictionStatus");

    if (
      !hasOnlyPredictionStatusKey ||
      typeof body.predictionStatus !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only predictionStatus is allowed in request body and it must be a string",
        },
        { status: 400 },
      );
    }

    const predictionStatus = body.predictionStatus.trim().toUpperCase();
    if (
      !PREDICTION_STATUS_VALUES.includes(predictionStatus as PredictionStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid predictionStatus. Allowed values: ${PREDICTION_STATUS_VALUES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const apiPayload: UpdatePredictionStatusPayload = {
      predictionStatus: predictionStatus as PredictionStatus,
    };

    const response = await authenticatedFetch(
      `/prediction/updatePredictionStatus/${id}`,
      {
        method: "PUT",
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
        errorData = {
          message: errorText || "Failed to update prediction status",
        };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to update prediction status (Status: ${response.status})`;

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

    const prediction = backendResponse?.data;

    return successResponse(prediction, { status: 200 });
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
            : "Failed to update prediction status",
      },
      { status: 500 },
    );
  }
}
