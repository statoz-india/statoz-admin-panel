import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type {
  Event,
  EventSuccessResponse,
} from "../../models/events.model";

function unwrapEvent(body: Event | EventSuccessResponse): Event {
  if (
    typeof body === "object" &&
    body !== null &&
    "data" in body &&
    typeof (body as EventSuccessResponse).data === "object" &&
    (body as EventSuccessResponse).data !== null
  ) {
    return (body as EventSuccessResponse).data;
  }
  return body as Event;
}

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
      `/events/${encodeURIComponent(id)}`,
    );

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
        errorData = { message: errorText || "Failed to fetch event" };
      }
      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to fetch event (Status: ${response.status})`;

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const raw = await handleExternalApiResponse<Event | EventSuccessResponse>(
      response,
    );
    const event = unwrapEvent(raw);

    return successResponse(event, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching event:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch event",
      },
      { status: 500 },
    );
  }
}
