import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { Team } from "../route";

export interface UpdateTeamPayload {
  name?: string;
  abbreviation?: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(context.params);
    const teamId = params.id;

    if (!teamId) {
      return NextResponse.json(
        {
          success: false,
          message: "Team ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, abbreviation, description, primaryColor, secondaryColor } =
      body;

    // Prepare payload with only provided fields
    const payload: Record<string, unknown> = {};

    if (name !== undefined) {
      payload.name = name;
    }
    if (abbreviation !== undefined) {
      payload.abbreviation = abbreviation;
    }
    if (description !== undefined) {
      payload.description = description;
    }
    if (primaryColor !== undefined) {
      payload.primaryColor = primaryColor;
    }
    if (secondaryColor !== undefined) {
      payload.secondaryColor = secondaryColor;
    }

    // Validate that at least one field is provided
    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one field must be provided for update",
        },
        { status: 400 }
      );
    }

    console.log("Updating team with ID:", teamId);
    console.log("Update payload:", payload);

    const response = await authenticatedFetch(
      `/tournament/update-team/${teamId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

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
        errorData = { message: errorText || "Failed to update team" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
          ? errorData.message
          : typeof errorData.msg === "string"
          ? errorData.msg
          : `Failed to update team (Status: ${response.status})`;

      console.error("Extracted error message:", errorMessage);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: response.status || 500 }
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

    return successResponse(team, { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating team:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update team",
      },
      { status: 500 }
    );
  }
}
