import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

export interface Team {
  _id: string;
  name: string;
  abbreviation: string;
  tournament: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateTeamPayload {
  name: string;
  abbreviation: string;
  tournamentType: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
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
        message: "Failed to fetch teams",
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
      tournamentType,
      description,
      primaryColor,
      secondaryColor,
      textColor,
    } = body;

    // Use tournamentType or handle the typo variant
    const tournamentTypeValue = tournamentType;

    // Validate required fields
    if (!name || !abbreviation || !tournamentTypeValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, abbreviation, and tournamentType are required",
        },
        { status: 400 },
      );
    }

    const payload: Record<string, unknown> = {
      name,
      abbreviation,
      tournamentType: tournamentTypeValue,
      primaryColor,
      secondaryColor,
      textColor,
    };

    // Only add optional fields if they have values
    if (description) {
      payload.description = description;
    }

    console.log("Creating team with payload:", payload);

    const response = await authenticatedFetch("/tournament/create-team", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("Backend response status:", response.status);

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
