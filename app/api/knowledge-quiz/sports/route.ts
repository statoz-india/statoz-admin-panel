import { NextResponse } from "next/server";
import type {
  CreateKqSportPayload,
  KqSportQuiz,
} from "@/app/interface/knowledge-quiz.interface";
import { validateKqSport } from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { backendErrorMessage } from "../proxy";

const LIST_ENDPOINT = "/knowledge-quiz/";
const CREATE_ENDPOINT = "/knowledge-quiz/create";

/**
 * List the per-sport home screen cards. Capped at five rows by the unique
 * constraint on `sportsType`, so there is no pagination and no filter here —
 * the panel always wants all of them.
 */
export async function GET() {
  try {
    const response = await authenticatedFetch(LIST_ENDPOINT);

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          message: backendErrorMessage(
            errorText,
            `Failed to load sports (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    // `data` is the array itself here — no items/total wrapper.
    const body = await handleExternalApiResponse<{ data: KqSportQuiz[] }>(
      response,
    );

    return successResponse(Array.isArray(body?.data) ? body.data : [], {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching knowledge quiz sports:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load sports",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const payload: Partial<CreateKqSportPayload> = {
      sportsType: body.sportsType as CreateKqSportPayload["sportsType"],
      sportsIcon:
        typeof body.sportsIcon === "string" ? body.sportsIcon.trim() : undefined,
      gameHeading:
        typeof body.gameHeading === "string"
          ? body.gameHeading.trim()
          : undefined,
      gameSubHeading:
        typeof body.gameSubHeading === "string"
          ? body.gameSubHeading.trim()
          : undefined,
    };

    const failures = validateKqSport(payload);
    if (failures.length > 0) {
      return NextResponse.json(
        { success: false, message: failures.join(", ") },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(CREATE_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      // A 409 here is a real conflict — this sport already has a row — not the
      // id-allocation race the question endpoint has. Never retry it; pass the
      // backend's message through, which names the sport.
      return NextResponse.json(
        {
          success: false,
          message: backendErrorMessage(
            errorText,
            `Failed to create sport (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const created = await handleExternalApiResponse<{ data: KqSportQuiz }>(
      response,
    );

    return successResponse(created?.data, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating knowledge quiz sport:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create sport",
      },
      { status: 500 },
    );
  }
}
