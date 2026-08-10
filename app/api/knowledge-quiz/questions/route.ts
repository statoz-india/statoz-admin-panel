import { NextResponse } from "next/server";
import type {
  CreateKqQuestionPayload,
  KqQuestion,
  KqQuestionList,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_ANSWER_TYPES,
  KQ_LIST_DEFAULT_LIMIT,
  KQ_LIST_MAX_LIMIT,
  KQ_SPORTS,
  isKqAnswerType,
  isKqSport,
  validateKqQuestion,
} from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

const ENDPOINT = "/knowledge-quiz/createQuestion";
const LIST_ENDPOINT = "/knowledge-quiz/questions";

/** Trim the string fields the same way the backend does before it compares them. */
function normalize(body: Record<string, unknown>): Partial<CreateKqQuestionPayload> {
  const trimList = (value: unknown) =>
    Array.isArray(value)
      ? value.map((entry) => (typeof entry === "string" ? entry.trim() : entry))
      : value;

  return {
    sportsType: body.sportsType,
    answerType: body.answerType ?? "single",
    questionText:
      typeof body.questionText === "string"
        ? body.questionText.trim()
        : body.questionText,
    answerOptions: trimList(body.answerOptions),
    correctAnswer: trimList(body.correctAnswer),
    correctAnswerIndex: body.correctAnswerIndex,
    xp: body.xp,
  } as Partial<CreateKqQuestionPayload>;
}

function backendErrorMessage(raw: string, fallback: string): string {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Non-JSON bodies are error pages (an HTML 404 from the proxy, a gateway
    // error), not messages worth showing an editor.
    const text = raw.trim();
    return text && !text.startsWith("<") && text.length <= 200 ? text : fallback;
  }
  if (typeof parsed.message === "string") return parsed.message;
  if (typeof parsed.error === "string") return parsed.error;
  return fallback;
}

/** Mirror the backend's fallbacks: bad, zero, negative → default; fractions floored. */
function parsePageNumber(raw: string | null, fallback: number, max?: number) {
  const parsed = Number(raw);
  if (raw === null || raw === "" || !Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  const floored = Math.floor(parsed);
  return max === undefined ? floored : Math.min(floored, max);
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

    // The backend *ignores* an unrecognised filter value and returns the full
    // unfiltered list, which would look like a filtered result in the panel.
    // Fail loudly instead — the UI builds its chips from the enums, so this can
    // only ever fire on a client bug.
    const sportsType = searchParams.get("sportsType");
    if (sportsType) {
      if (!isKqSport(sportsType)) {
        return NextResponse.json(
          {
            success: false,
            message: `sportsType must be one of: ${KQ_SPORTS.join(", ")}`,
          },
          { status: 400 },
        );
      }
      query.set("sportsType", sportsType);
    }

    const answerType = searchParams.get("answerType");
    if (answerType) {
      if (!isKqAnswerType(answerType)) {
        return NextResponse.json(
          {
            success: false,
            message: `answerType must be one of: ${KQ_ANSWER_TYPES.join(", ")}`,
          },
          { status: 400 },
        );
      }
      query.set("answerType", answerType);
    }

    const search = searchParams.get("search")?.trim();
    if (search) {
      query.set("search", search);
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
            `Failed to load questions (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<{ data: KqQuestionList }>(
      response,
    );

    return successResponse(body?.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching knowledge quiz questions:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to load questions",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // The server allocates kqQuestionId per sport; never forward a client value.
    delete body.kqQuestionId;

    const payload = normalize(body);

    const failures = validateKqQuestion(payload);
    if (failures.length > 0) {
      // Same flat, comma-joined shape the backend uses, so the client renders
      // one banner regardless of which side caught it.
      return NextResponse.json(
        { success: false, message: failures.join(", ") },
        { status: 400 },
      );
    }

    // Built once so the 409 replay is byte-identical to the first attempt.
    const init: RequestInit = {
      method: "POST",
      body: JSON.stringify(payload),
    };

    let response = await authenticatedFetch(ENDPOINT, init);

    // Ids are allocated by reading the highest existing id for the sport and
    // adding 1, so two superadmins submitting for the same sport at the same
    // moment can collide. Nothing partial is written and the backend does not
    // retry, so replaying the identical payload once is safe.
    if (response.status === 409) {
      response = await authenticatedFetch(ENDPOINT, init);
      if (response.status === 409) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another superadmin created a question for this sport at the same moment. Please submit again.",
          },
          { status: 409 },
        );
      }
    }

    // authenticatedFetch already refreshes and retries once on 498; reaching
    // here means the refresh itself failed.
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      const message = backendErrorMessage(
        errorText,
        `Failed to create question (Status: ${response.status})`,
      );
      return NextResponse.json(
        { success: false, message },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      data: KqQuestion;
      message?: string;
    }>(response);

    return successResponse(backendResponse?.data, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating knowledge quiz question:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create knowledge quiz question",
      },
      { status: 500 },
    );
  }
}
