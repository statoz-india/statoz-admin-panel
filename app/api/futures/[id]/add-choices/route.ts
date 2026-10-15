import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import type {
  CreateFutureChoicePayload,
  Future,
} from "@/app/models/futures.model";

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
        : "Failed to add future choices")
  );
}

function isValidChoiceBody(item: unknown): item is CreateFutureChoicePayload {
  return (
    !!item &&
    typeof item === "object" &&
    typeof (item as CreateFutureChoicePayload).choiceName === "string" &&
    (item as CreateFutureChoicePayload).choiceName.trim().length > 0
  );
}

export async function POST(
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

    const body = (await request.json()) as {
      choices?: CreateFutureChoicePayload[];
    };
    const choices = body?.choices;

    if (!Array.isArray(choices) || choices.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "choices array is required and must not be empty",
        },
        { status: 400 },
      );
    }

    if (!choices.every(isValidChoiceBody)) {
      return NextResponse.json(
        { success: false, message: "Each choice must include a choiceName" },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/futures/addFutureChoices/${encodeURIComponent(id)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choices }),
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
        errorData = { message: errorText || "Failed to add future choices" };
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
    console.error("Error adding future choices:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to add future choices",
      },
      { status: 500 },
    );
  }
}
