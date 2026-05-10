import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import type {
  CreateEventPayload,
  Event,
  EventSuccessResponse,
  EventsListSuccessResponse,
} from "../models/events.model";

function unwrapEventsList(
  body: Event[] | EventsListSuccessResponse,
): Event[] {
  return Array.isArray(body) ? body : body.data;
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/events");
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse(
        { data: [] },
        { status: 404 },
        { message: "No events found" },
      );
    }

    const data = await handleExternalApiResponse<
      Event[] | EventsListSuccessResponse
    >(response);

    return successResponse(unwrapEventsList(data), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
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
      haveThreeOptions,
      yesPlaceholder,
      noPlaceholder,
      maybePlaceholder,
      entryStartTime,
      entryCloseTime,
    } = body;

    const apiPayload: CreateEventPayload = {
      tournament,
      eventName,
      eventDescription,
      eventImage,
      haveThreeOptions,
      yesPlaceholder,
      noPlaceholder,
      maybePlaceholder,
      entryStartTime,
      entryCloseTime,
    };

    const response = await authenticatedFetch("/events/createEvent", {
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
        errorData = { message: errorText || "Failed to create event" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to create event (Status: ${response.status})`;

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: response.status || 500 },
      );
    }

    const backendResponse =
      await handleExternalApiResponse<EventSuccessResponse>(response);

    return successResponse(backendResponse.data, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create event",
      },
      { status: 500 },
    );
  }
}
