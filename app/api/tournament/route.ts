import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import { GAME_TYPE_OPTIONS, isGameType } from "@/app/constants/game-type";

export async function GET() {
  try {
    const response = await authenticatedFetch("/tournament/tournament-types");
    if (response.status === 401) {
      return await errorResponse();
    }
    const data = await handleExternalApiResponse<string[]>(response);

    return successResponse(data, { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quizes",
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
      tournamentName,
      tournamentYear,
      gameType,
      isIccTournament,
      primaryColor,
      secondaryColor,
      textColor,
    } = body;

    if (!tournament || !tournamentName || !tournamentYear) {
      return NextResponse.json(
        {
          success: false,
          message: "tournament, tournamentName and tournamentYear are required",
        },
        { status: 400 },
      );
    }

    if (gameType != null && gameType !== "" && !isGameType(gameType)) {
      return NextResponse.json(
        {
          success: false,
          message: `gameType must be one of: ${GAME_TYPE_OPTIONS.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const payload: Record<string, string | boolean> = {
      tournament,
      tournamentName,
      tournamentYear,
      isIccTournament: isIccTournament === true,
    };

    if (isGameType(gameType)) {
      payload.gameType = gameType;
    }

    if (typeof primaryColor === "string" && primaryColor.trim()) {
      payload.primaryColor = primaryColor.trim();
    }
    if (typeof secondaryColor === "string" && secondaryColor.trim()) {
      payload.secondaryColor = secondaryColor.trim();
    }
    if (typeof textColor === "string" && textColor.trim()) {
      payload.textColor = textColor.trim();
    }

    const response = await authenticatedFetch("/tournament/create-tournament", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      return await errorResponse();
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to create tournament" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to create tournament (Status: ${response.status})`;

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      statusCode: number;
      data: unknown;
      message: string;
      success: boolean;
    }>(response);

    return successResponse(backendResponse.data, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create tournament",
      },
      { status: 500 },
    );
  }
}
