import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractBackendErrorMessage,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

export interface Team {
  _id: string;
  name: string;
  abbreviation: string;
  tournament: string;
  displayName: string;
  description?: string;
  /**
   * Seasons the team plays in — `"2026"` or `"2026/27"` entries. Teams created
   * before this field existed don't have it at all (not `[]`); treat a missing
   * value as "not set".
   */
  season?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateTeamPayload {
  name: string;
  abbreviation: string;
  tournamentId: string;
  tournamentType: string;
  displayName: string;
  description?: string;
  /** Optional: omit for the server default `["2026"]`; `[]` means no seasons. */
  season?: string[];
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  secondaryTextColor: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournament = searchParams.get("tournament");

    if (!tournament) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament parameter is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/tournament/teams/${tournament}`,
    );

    if (response.status === 401) {
      return await errorResponse();
    }

    const backendResponse = await handleExternalApiResponse<{
      statusCode: number;
      data: {
        teams: Team[];
        count: number;
      };
      message: string;
      success: boolean;
    }>(response);

    const teams = backendResponse?.data?.teams || [];

    return successResponse(teams, { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch teams",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      abbreviation,
      tournamentId,
      tournamentType,
      description,
      primaryColor,
      secondaryColor,
      textColor,
      secondaryTextColor,
      displayName,
      season,
    } = body;

    // Use tournamentType or handle the typo variant
    const tournamentTypeValue = tournamentType;

    // Validate required fields
    if (!name || !abbreviation || !tournamentTypeValue || !tournamentId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, abbreviation, tournamentId, and tournamentType are required",
        },
        { status: 400 },
      );
    }

    const payload: Record<string, unknown> = {
      name,
      abbreviation,
      tournamentId,
      tournamentType: tournamentTypeValue,
      primaryColor,
      secondaryColor,
      textColor,
      secondaryTextColor,
      displayName,
    };

    // Only add optional fields if they have values
    if (description) {
      payload.description = description;
    }

    // Forwarded as-is when sent (the backend validates the format and rejects a
    // bare string); left out entirely so the server default applies.
    if (season !== undefined) {
      payload.season = season;
    }

    const response = await authenticatedFetch("/tournament/create-team", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      return await errorResponse();
    }

    // Handle non-OK responses before parsing
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to create team" };
      }

      const errorMessage = extractBackendErrorMessage(
        errorData,
        `Failed to create team (Status: ${response.status})`,
      );

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
      data: Team;
      message: string;
      success: boolean;
    }>(response);

    // Extract the team data from the nested structure
    const team = backendResponse?.data;

    return successResponse(team, { status: 201 });
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
          error instanceof Error ? error.message : "Failed to create team",
      },
      { status: 500 },
    );
  }
}
