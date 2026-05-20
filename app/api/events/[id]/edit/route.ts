import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import type { EditEventBody, Event } from "@/app/models/events.model";

const EDITABLE_KEYS = [
  "eventName",
  "eventDescription",
  "eventImage",
  "eventDescriptionImage",
  "entryStartTime",
  "entryCloseTime",
  "yesPlaceholder",
  "noPlaceholder",
  "maybePlaceholder",
  "yesPlaceholderColor",
  "noPlaceholderColor",
  "maybePlaceholderColor",
  "yesTextColor",
  "noTextColor",
  "maybeTextColor",
] as const satisfies readonly (keyof EditEventBody)[];

const NON_EMPTY_IF_SENT = [
  "eventName",
  "yesPlaceholder",
  "noPlaceholder",
  "maybePlaceholder",
] as const;

function parseBackendError(errorData: Record<string, unknown>): string {
  const nestedError =
    errorData.data &&
    typeof errorData.data === "object" &&
    errorData.data !== null &&
    "error" in errorData.data &&
    typeof (errorData.data as { error?: unknown }).error === "string"
      ? (errorData.data as { error: string }).error
      : null;
  return (
    nestedError ??
    (typeof errorData.error === "string"
      ? errorData.error
      : typeof errorData.message === "string"
        ? errorData.message
        : "Failed to update event")
  );
}

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

    const body = (await request.json()) as EditEventBody;
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Request body is required" },
        { status: 400 },
      );
    }

    const payload: EditEventBody = {};
    for (const key of EDITABLE_KEYS) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const value = body[key];
        if (typeof value === "string") {
          (payload as Record<string, string>)[key] = value;
        }
      }
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one field is required to update" },
        { status: 400 },
      );
    }

    for (const key of NON_EMPTY_IF_SENT) {
      if (
        key in payload &&
        typeof payload[key] === "string" &&
        !payload[key]!.trim()
      ) {
        return NextResponse.json(
          { success: false, message: `${key} cannot be empty` },
          { status: 400 },
        );
      }
    }

    const response = await authenticatedFetch(
      `/events/editEvent/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        errorData = { message: errorText || "Failed to update event" };
      }

      return NextResponse.json(
        { success: false, message: parseBackendError(errorData) },
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
    console.error("Error updating event:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update event",
      },
      { status: 500 },
    );
  }
}
