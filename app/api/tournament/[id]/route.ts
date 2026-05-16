import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type {
  Tournament,
  UpdateTournamentPayload,
} from "@/app/models/tournament.model";

type UpdateTournamentBackendResponse = {
  statusCode: number;
  data: Tournament;
  message: string;
  success: boolean;
};

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const tournamentId = params.id;

    if (!tournamentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament ID is required",
        },
        { status: 400 },
      );
    }

    const body = (await request.json()) as UpdateTournamentPayload;
    const { tournamentName, primaryColor, secondaryColor, textColor } = body;

    const payload: Record<string, string> = {};

    if (tournamentName !== undefined) {
      payload.tournamentName = tournamentName;
    }
    if (primaryColor !== undefined) {
      payload.primaryColor = primaryColor;
    }
    if (secondaryColor !== undefined) {
      payload.secondaryColor = secondaryColor;
    }
    if (textColor !== undefined) {
      payload.textColor = textColor;
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one field must be provided: tournamentName, primaryColor, secondaryColor, textColor",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/tournament/update-tournament/${tournamentId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );

    if (response.status === 401) {
      return await errorResponse();
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to update tournament" };
      }

      const nestedError =
        errorData.data &&
        typeof errorData.data === "object" &&
        errorData.data !== null &&
        "error" in errorData.data &&
        typeof (errorData.data as { error?: unknown }).error === "string"
          ? (errorData.data as { error: string }).error
          : undefined;

      const errorMessage =
        nestedError ??
        (typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to update tournament (Status: ${response.status})`);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: response.status || 500 },
      );
    }

    const backendResponse =
      await handleExternalApiResponse<UpdateTournamentBackendResponse>(
        response,
      );

    const tournament =
      backendResponse && "data" in backendResponse && backendResponse.data
        ? backendResponse.data
        : (backendResponse as unknown as Tournament);

    return successResponse(tournament, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating tournament:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update tournament",
      },
      { status: 500 },
    );
  }
}
