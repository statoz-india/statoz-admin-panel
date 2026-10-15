import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import type {
  CreateFuturePayload,
  Future,
  FutureSuccessResponse,
  FuturesListSuccessResponse,
} from "../../models/futures.model";

function unwrapFuturesList(
  body: Future[] | FuturesListSuccessResponse,
): Future[] {
  return Array.isArray(body) ? body : body.data;
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/futures");
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse(
        [],
        { status: 200 },
        { message: "No futures found" },
      );
    }

    const data = await handleExternalApiResponse<
      Future[] | FuturesListSuccessResponse
    >(response);

    return successResponse(unwrapFuturesList(data), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching futures:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch futures",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      tournament,
      eventName,
      eventDescription,
      eventImage,
      eventDescriptionImage,
      entryStartTime,
      entryCloseTime,
      futureStatus,
      choices,
    } = body;

    const apiPayload: CreateFuturePayload = {
      tournament,
      eventName,
      eventDescription,
      eventImage,
      eventDescriptionImage,
      entryStartTime,
      entryCloseTime,
      futureStatus,
      choices,
    };

    const response = await authenticatedFetch("/futures/createFuture", {
      method: "POST",
      body: JSON.stringify(apiPayload),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to create future" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to create future (Status: ${response.status})`;

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: response.status || 500 },
      );
    }

    const backendResponse =
      await handleExternalApiResponse<FutureSuccessResponse>(response);

    return successResponse(backendResponse.data, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating future:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create future",
      },
      { status: 500 },
    );
  }
}
