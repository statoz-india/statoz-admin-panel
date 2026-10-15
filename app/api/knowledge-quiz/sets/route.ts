import { NextResponse } from "next/server";
import type {
  CreateKqSetPayload,
  KqSet,
  KqSetList,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_CHAPTER_NAMES,
  KQ_LIST_DEFAULT_LIMIT,
  KQ_LIST_MAX_LIMIT,
  KQ_SET_CATEGORIES,
  isKqChapterName,
  isKqSetCategory,
  isObjectId,
  validateKqSet,
} from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { backendErrorMessage } from "../proxy";

const LIST_ENDPOINT = "/knowledge-quiz/sets";
const CREATE_ENDPOINT = "/knowledge-quiz/createSet";

function parsePageNumber(raw: string | null, fallback: number, max?: number) {
  const parsed = Number(raw);
  if (raw === null || raw === "" || !Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  const floored = Math.floor(parsed);
  return max === undefined ? floored : Math.min(floored, max);
}

function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = new URLSearchParams({
      page: String(parsePageNumber(searchParams.get("page"), 1)),
      limit: String(
        parsePageNumber(
          searchParams.get("limit"),
          KQ_LIST_DEFAULT_LIMIT,
          KQ_LIST_MAX_LIMIT,
        ),
      ),
    });

    // The backend ignores an unrecognised or malformed filter and returns the
    // full unfiltered list, which reads as a filtered result in the panel.
    // Reject loudly instead — the UI builds its inputs from the enums and the
    // sports list, so this can only fire on a client bug.
    const knowledgeQuizId = searchParams.get("knowledgeQuizId");
    if (knowledgeQuizId) {
      if (!isObjectId(knowledgeQuizId)) {
        return badRequest("knowledgeQuizId must be a valid id");
      }
      query.set("knowledgeQuizId", knowledgeQuizId);
    }

    const category = searchParams.get("category");
    if (category) {
      if (!isKqSetCategory(category)) {
        return badRequest(
          `category must be one of: ${KQ_SET_CATEGORIES.join(", ")}`,
        );
      }
      query.set("category", category);
    }

    const chapterName = searchParams.get("chapterName");
    if (chapterName) {
      if (!isKqChapterName(chapterName)) {
        return badRequest(
          `chapterName must be one of: ${KQ_CHAPTER_NAMES.join(", ")}`,
        );
      }
      query.set("chapterName", chapterName);
    }

    // Only ever "true" — the expanded form carries answers, so it is opt-in.
    if (searchParams.get("includeQuestions") === "true") {
      query.set("includeQuestions", "true");
    }

    const response = await authenticatedFetch(
      `${LIST_ENDPOINT}?${query.toString()}`,
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

    const body = await handleExternalApiResponse<{ data: KqSetList }>(response);

    return successResponse(body?.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching knowledge quiz sets:", error);
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const payload: Partial<CreateKqSetPayload> = {
      knowledgeQuizId: body.knowledgeQuizId as string,
      category: body.category as CreateKqSetPayload["category"],
      chapter: body.chapter as number,
      chapterName: body.chapterName as CreateKqSetPayload["chapterName"],
      threeStarScore: body.threeStarScore as number,
      twoStarScore: body.twoStarScore as number,
      oneStarScore: body.oneStarScore as number,
      reward: body.reward as number,
    };
    if (body.entryCoins !== undefined) {
      payload.entryCoins = body.entryCoins as number;
    }
    if (body.knowledgeQuizQuestions !== undefined) {
      payload.knowledgeQuizQuestions = body.knowledgeQuizQuestions as string[];
    }

    const failures = validateKqSet(payload);
    if (failures.length > 0) {
      return badRequest(failures.join(", "));
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
      // A 409 means this chapter number is taken for the quiz + category. Never
      // retried — it is a real conflict, not a race, and the backend's message
      // names the chapter and difficulty.
      return NextResponse.json(
        {
          success: false,
          message: backendErrorMessage(
            errorText,
            `Failed to create chapter (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const created = await handleExternalApiResponse<{ data: KqSet }>(response);

    return successResponse(created?.data, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating knowledge quiz set:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create chapter",
      },
      { status: 500 },
    );
  }
}
