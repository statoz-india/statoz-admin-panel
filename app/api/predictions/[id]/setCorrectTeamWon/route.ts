import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";

interface SubmitTeamWonBody {
  winningTeam: string;
  winningTeamId: string;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Prediction ID is required",
        },
        { status: 400 },
      );
    }

    const body = (await request.json()) as SubmitTeamWonBody;
    const { winningTeam, winningTeamId } = body;

    if (!winningTeam || !winningTeamId) {
      return NextResponse.json(
        {
          success: false,
          message: "winningTeam and winningTeamId are required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/prediction/submitTeamWon/${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winningTeam, winningTeamId }),
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
        errorData = { message: errorText || "Failed to submit team won" };
      }
      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to submit team won (Status: ${response.status})`;
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
    console.error("Error submitting team won:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit team won",
      },
      { status: 500 },
    );
  }
}
