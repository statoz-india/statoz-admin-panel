import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import {
  EVENT_STATUS_VALUES,
  type EventStatusValue,
} from "@/app/constants/event-status";
import type { Event } from "@/app/models/events.model";

type UpdateEventStatusPayload = {
  eventStatus: EventStatusValue;
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
        { success: false, message: "Event ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const hasOnlyEventStatusKey =
      body &&
      typeof body === "object" &&
      Object.keys(body).length === 1 &&
      Object.prototype.hasOwnProperty.call(body, "eventStatus");

    if (!hasOnlyEventStatusKey || typeof body.eventStatus !== "string") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only eventStatus is allowed in request body and it must be a string",
        },
        { status: 400 },
      );
    }

    const eventStatus = body.eventStatus.trim().toUpperCase();
    if (!EVENT_STATUS_VALUES.includes(eventStatus as EventStatusValue)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid eventStatus. Allowed values: ${EVENT_STATUS_VALUES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const apiPayload: UpdateEventStatusPayload = {
      eventStatus: eventStatus as EventStatusValue,
    };

    const response = await authenticatedFetch(
      `/events/updateEventPredictionStatus/${encodeURIComponent(id)}`,
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
        errorData = { message: errorText || "Failed to update event status" };
      }
      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to update event status (Status: ${response.status})`;

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      data?: Event;
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
            : "Failed to update event status",
      },
      { status: 500 },
    );
  }
}
