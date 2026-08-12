import { NextResponse } from "next/server";
import type { KqChapterRangeList } from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_SET_CATEGORIES,
  isKqSetCategory,
  isObjectId,
} from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../../utils/api-helper";
import { backendErrorMessage } from "../../../proxy";

type RouteParams = { knowledgeQuizId: string; category: string };

export async function GET(
  _request: Request,
  context: { params: Promise<RouteParams> | RouteParams },
) {
  try {
    const params = await Promise.resolve(context.params);
    const category = params.category.toLowerCase();

    if (!isObjectId(params.knowledgeQuizId)) {
      return NextResponse.json(
        { success: false, message: "Invalid knowledge quiz id" },
        { status: 400 },
      );
    }
    if (!isKqSetCategory(category)) {
      return NextResponse.json(
        {
          success: false,
          message: `category must be one of: ${KQ_SET_CATEGORIES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/knowledge-quiz/${encodeURIComponent(params.knowledgeQuizId)}/${encodeURIComponent(category)}/chapters`,
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
            `Failed to load chapters (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<{
      data: KqChapterRangeList;
    }>(response);
    return successResponse(body.data, {
      status: 200,
      message: "Knowledge quiz chapter ranges fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching knowledge quiz chapter ranges:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to load chapters",
      },
      { status: 500 },
    );
  }
}
