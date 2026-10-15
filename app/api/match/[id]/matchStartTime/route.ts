import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { MatchData } from "../../route";
import {
  MATCH_STATUS_VALUES,
  type MatchStatus,
} from "@/app/constants/match-status";

/**
 * Updates a match's start time and/or status — the backend's
 * `PATCH /match/:id/matchStartTime` takes either or both.
 */
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
    const matchStatus =
      typeof body?.matchStatus === "string"
        ? body.matchStatus.trim().toLowerCase()
        : "";

    if (!matchStartTime && !matchStatus) {
      return NextResponse.json(
        { success: false, message: "matchStartTime or matchStatus is required" },
        { status: 400 },
      );
    }
    if (
      matchStatus &&
      !MATCH_STATUS_VALUES.includes(matchStatus as MatchStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid matchStatus. Allowed values: ${MATCH_STATUS_VALUES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(`/match/${id}/matchStartTime`, {
      method: "PATCH",
      body: JSON.stringify({
        ...(matchStartTime ? { matchStartTime } : {}),
        ...(matchStatus ? { matchStatus } : {}),
      }),
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
        errorData = { message: errorText || "Failed to update match" };
      }
      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to update match (Status: ${response.status})`;

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
    console.error("Error updating match:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update match",
      },
      { status: 500 },
    );
  }
}
