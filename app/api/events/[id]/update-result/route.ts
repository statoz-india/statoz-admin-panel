import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";

const WINNING_OPTION_VALUES = ["Y", "N", "M"] as const;
type WinningOptionValue = (typeof WINNING_OPTION_VALUES)[number];

interface UpdateEventResultBody {
  winningOption: WinningOptionValue;
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
        { success: false, message: "Event ID is required" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as UpdateEventResultBody;
    const winningOption =
      typeof body.winningOption === "string"
        ? body.winningOption.trim().toUpperCase()
        : "";

    if (!WINNING_OPTION_VALUES.includes(winningOption as WinningOptionValue)) {
      return NextResponse.json(
        {
          success: false,
          message: `winningOption must be one of: ${WINNING_OPTION_VALUES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/events/updateEventResult/${encodeURIComponent(id)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winningOption: winningOption as WinningOptionValue,
        }),
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
        errorData = { message: errorText || "Failed to update winning option" };
      }
      const nestedError =
        errorData.data &&
        typeof errorData.data === "object" &&
        errorData.data !== null &&
        "error" in errorData.data &&
        typeof (errorData.data as { error?: unknown }).error === "string"
          ? (errorData.data as { error: string }).error
          : null;
      const errorMessage =
        nestedError ??
        (typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to update winning option (Status: ${response.status})`);

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      data?: unknown;
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
    console.error("Error updating event winning option:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update winning option",
      },
      { status: 500 },
    );
  }
}
