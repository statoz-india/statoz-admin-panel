import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import { Team } from "../tournament/teams/route";

export type GameType = "cricket" | "football" | "basketball";

export interface CreateMatchAPIPayload {
  tournament: string;
  teamA: string;
  teamB: string;
  tag: string;
  /** Season the match belongs to (e.g. `2026`); required by the backend. */
  seasonYear: string;
  matchStartTime?: string;
  gameType: GameType;
  /** ESPN league slug used by live-score / match-stats services (e.g. `EPL`). */
  espnLeagueName?: string;
}

/**
 * Cached live-score snapshot copied from the score provider (ESPN), written by
 * the sync service. Every field arrives as a string, scores included, and both
 * `endTime` and `summary` are `""` until the match finishes.
 */
export interface MatchEventData {
  /** The provider's match id, shown in the admin UI as "ESPN Match ID". */
  id: string;
  uid: string;
  name: string;
  away: string;
  home: string;
  shortName: string;
  /** Formatted as "1 - 4" (away - home). */
  score: string;
  status: string;
  startTime: string;
  endTime: string;
  awayTeamScore: string;
  homeTeamScore: string;
  summary: string;
  _id: string;
}

export interface MatchData {
  _id: string;
  matchId: string;
  teamA: Team;
  teamB: Team;
  tournament: string;
  /** ESPN league slug used by live-score / match-stats services (e.g. `EPL`). */
  espnLeagueName?: string;
  tag?: string;
  matchBanner?: string;
  matchStartTime?: string;
  quizIds?: string[];
  predictionIds?: string[];
  createdAt?: string;
  createdByUserData?: {
    email?: string;
    userType?: string;
  };
  matchEvent?: MatchEventData | null;
  gameType?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      tournament,
      teamA,
      teamB,
      tag,
      seasonYear,
      matchStartTime,
      gameType,
      espnLeagueName,
    } = body;

    if (typeof seasonYear !== "string" || seasonYear.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter a season year" },
        { status: 400 },
      );
    }

    if (
      gameType !== "cricket" &&
      gameType !== "football" &&
      gameType !== "basketball"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please select a valid game type (cricket or football or basketball)",
        },
        { status: 400 },
      );
    }

    const apiPayload: CreateMatchAPIPayload = {
      tournament: tournament,
      teamA: teamA,
      teamB: teamB,
      tag: tag ?? "",
      seasonYear: seasonYear.trim(),
      gameType: gameType,
      ...(matchStartTime != null &&
        matchStartTime !== "" && { matchStartTime }),
      ...(typeof espnLeagueName === "string" &&
        espnLeagueName.trim() !== "" && {
          espnLeagueName: espnLeagueName.trim(),
        }),
    };

    const response = await authenticatedFetch("/match/createMatch", {
      method: "POST",
      body: JSON.stringify(apiPayload),
    });

    if (response.status === 401) {
      return await errorResponse();
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to create team" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to create team (Status: ${response.status})`;

      console.error("Extracted error message:", errorMessage);

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
      data: MatchData;
      message: string;
      success: boolean;
    }>(response);

    const quiz = backendResponse?.data;

    return successResponse(quiz, { status: 201 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating team:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create match",
      },
      { status: 500 },
    );
  }
}
