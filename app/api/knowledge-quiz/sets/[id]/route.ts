import { NextResponse } from "next/server";
import type { KqSet } from "@/app/interface/knowledge-quiz.interface";
import {
  isObjectId,
  validateKqSetUpdate,
  type UpdateKqSetPayload,
} from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { backendErrorMessage } from "../../proxy";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!isObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid set id" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const query = new URLSearchParams();
    if (searchParams.get("includeQuestions") === "true") {
      query.set("includeQuestions", "true");
    }
    const qs = query.toString();

    const response = await authenticatedFetch(
      `/knowledge-quiz/sets/${encodeURIComponent(id)}${qs ? `?${qs}` : ""}`,
    );

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
            `Failed to fetch set (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<{ data: KqSet }>(response);

    return successResponse(body?.data, {
      status: 200,
      message: "Knowledge quiz set fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching knowledge quiz set:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch set",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!isObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid set id" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    const payload: UpdateKqSetPayload = {};

    if (body.knowledgeQuizId !== undefined) {
      payload.knowledgeQuizId = body.knowledgeQuizId as string;
    }
    if (body.category !== undefined) {
      payload.category = body.category as UpdateKqSetPayload["category"];
    }
    if (body.chapter !== undefined) {
      payload.chapter = body.chapter as number;
    }
    if (body.chapterName !== undefined) {
      payload.chapterName = body.chapterName as UpdateKqSetPayload["chapterName"];
    }
    if (body.threeStarScore !== undefined) {
      payload.threeStarScore = body.threeStarScore as number;
    }
    if (body.twoStarScore !== undefined) {
      payload.twoStarScore = body.twoStarScore as number;
    }
    if (body.oneStarScore !== undefined) {
      payload.oneStarScore = body.oneStarScore as number;
    }
    if (body.reward !== undefined) {
      payload.reward = body.reward as number;
    }
    if (body.entryCoins !== undefined) {
      payload.entryCoins = body.entryCoins as number;
    }
    if (body.knowledgeQuizQuestions !== undefined) {
      payload.knowledgeQuizQuestions =
        body.knowledgeQuizQuestions as string[];
    }

    const failures = validateKqSetUpdate(payload);
    if (failures.length > 0) {
      return NextResponse.json(
        { success: false, message: failures.join(", ") },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/knowledge-quiz/updateSet/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );

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
            `Failed to update set (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const updated = await handleExternalApiResponse<{ data: KqSet }>(response);

    return successResponse(updated?.data, {
      status: 200,
      message: "Knowledge quiz set updated successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating knowledge quiz set:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update set",
      },
      { status: 500 },
    );
  }
}
