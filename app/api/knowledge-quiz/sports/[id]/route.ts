import { NextResponse } from "next/server";
import type {
  KqSportQuiz,
  UpdateKqSportPayload,
} from "@/app/interface/knowledge-quiz.interface";
import {
  isObjectId,
  validateKqSportUpdate,
} from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { backendErrorMessage } from "../../proxy";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!isObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid knowledge quiz id" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Only the recognised fields are forwarded — a stray key would otherwise
    // count as "a field to update" without being one.
    const payload: UpdateKqSportPayload = {};
    if (body.sportsType !== undefined) {
      payload.sportsType = body.sportsType as UpdateKqSportPayload["sportsType"];
    }
    for (const field of ["sportsIcon", "gameHeading", "gameSubHeading"] as const) {
      if (body[field] !== undefined) {
        payload[field] =
          typeof body[field] === "string"
            ? (body[field] as string).trim()
            : (body[field] as string);
      }
    }

    const failures = validateKqSportUpdate(payload);
    if (failures.length > 0) {
      return NextResponse.json(
        { success: false, message: failures.join(", ") },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(`/knowledge-quiz/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      // A 409 means the target sport already has a row. Never retried — it is a
      // real conflict, not a race.
      return NextResponse.json(
        {
          success: false,
          message: backendErrorMessage(
            errorText,
            `Failed to update sport (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const updated = await handleExternalApiResponse<{ data: KqSportQuiz }>(
      response,
    );

    return successResponse(updated?.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating knowledge quiz sport:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update sport",
      },
      { status: 500 },
    );
  }
}
