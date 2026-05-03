import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { MatchData } from "../../route";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Match ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const matchStartTime =
      typeof body?.matchStartTime === "string"
        ? body.matchStartTime.trim()
        : "";

    if (!matchStartTime) {
      return NextResponse.json(
        { success: false, message: "matchStartTime is required" },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(`/match/${id}/matchStartTime`, {
      method: "PATCH",
      body: JSON.stringify({ matchStartTime }),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to update match start time" };
      }
      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to update match start time (Status: ${response.status})`;

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      data: MatchData;
      success: boolean;
      message?: string;
    }>(response);

    return successResponse(backendResponse.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating match start time:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update match start time",
      },
      { status: 500 },
    );
  }
}
