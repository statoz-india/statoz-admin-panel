import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import type { EditFutureBody, Future } from "@/app/models/futures.model";

const EDITABLE_KEYS = [
  "eventName",
  "eventDescription",
  "eventImage",
  "eventDescriptionImage",
  "entryStartTime",
  "entryCloseTime",
] as const satisfies readonly (keyof EditFutureBody)[];

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
        : "Failed to update future")
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
        { success: false, message: "Future ID is required" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as EditFutureBody;
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Request body is required" },
        { status: 400 },
      );
    }

    const payload: EditFutureBody = {};
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

    if (
      "eventName" in payload &&
      typeof payload.eventName === "string" &&
      !payload.eventName.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "eventName cannot be empty" },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/futures/editFuture/${encodeURIComponent(id)}`,
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
        errorData = { message: errorText || "Failed to update future" };
      }

      return NextResponse.json(
        { success: false, message: parseBackendError(errorData) },
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
    console.error("Error updating future:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update future",
      },
      { status: 500 },
    );
  }
}
