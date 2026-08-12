import { NextResponse } from "next/server";
import type { KqChapterSets } from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_CHAPTER_NAMES,
  KQ_SET_CATEGORIES,
  isKqChapterName,
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

type RouteParams = {
  knowledgeQuizId: string;
  category: string;
  chapterName: string;
};

function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export async function GET(
  _request: Request,
  context: { params: Promise<RouteParams> | RouteParams },
) {
  try {
    const params = await Promise.resolve(context.params);
    const knowledgeQuizId = params.knowledgeQuizId;
    const category = params.category.toLowerCase();
    const chapterName = params.chapterName.toLowerCase();

    if (!isObjectId(knowledgeQuizId)) {
      return badRequest("Invalid knowledge quiz id");
    }
    if (!isKqSetCategory(category)) {
      return badRequest(
        `category must be one of: ${KQ_SET_CATEGORIES.join(", ")}`,
      );
    }
    if (!isKqChapterName(chapterName)) {
      return badRequest(
        `chapterName must be one of: ${KQ_CHAPTER_NAMES.join(", ")}`,
      );
    }

    const endpoint = [
      "/knowledge-quiz",
      encodeURIComponent(knowledgeQuizId),
      encodeURIComponent(category),
      encodeURIComponent(chapterName),
    ].join("/");
    const response = await authenticatedFetch(endpoint);

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
            `Failed to fetch chapter sets (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<{ data: KqChapterSets }>(
      response,
    );
    return successResponse(body.data, {
      status: 200,
      message: "Knowledge quiz sets fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching knowledge quiz chapter sets:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch chapter sets",
      },
      { status: 500 },
    );
  }
}
