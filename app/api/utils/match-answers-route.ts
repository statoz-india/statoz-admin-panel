import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "./api-helper";
import type { Quiz } from "../quiz/route";
import type {
  MatchAnswerSourceUrl,
  MatchAnswersResult,
} from "@/app/interface/match-answers.interface";

/** A 4xx the source-specific handler wants shown to the admin as-is. */
export class MatchAnswersError extends Error {
  readonly status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Shared body of the quiz auto-answer routes: load the quiz, check it's the
 * right sport, run the source-specific lookup, and report errors along with
 * every page that was fetched before things went wrong.
 *
 * `answer` pushes each page it reads onto `sourceUrls` before fetching it.
 */
export async function handleMatchAnswersRequest(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
  gameType: "cricket" | "football",
  answer: (
    quiz: Quiz,
    matchUrl: string,
    sourceUrls: MatchAnswerSourceUrl[],
  ) => Promise<MatchAnswersResult>,
) {
  const sourceUrls: MatchAnswerSourceUrl[] = [];
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Quiz ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const matchUrl = typeof body?.matchUrl === "string" ? body.matchUrl.trim() : "";

    const quizResponse = await authenticatedFetch(
      `/quiz/getAdminQuizDetails/${id}`,
    );
    if (quizResponse.status === 401 || quizResponse.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    const quizBody = await handleExternalApiResponse<{ data?: Quiz }>(
      quizResponse,
    );
    const quiz = (quizBody?.data ?? quizBody) as Quiz;

    if (!quiz?.questionsArray?.length) {
      throw new MatchAnswersError("This quiz has no questions to answer.");
    }
    if (quiz.gameType && quiz.gameType !== gameType) {
      throw new MatchAnswersError(
        `This lookup is for ${gameType} quizzes (this one is ${quiz.gameType}).`,
      );
    }

    return successResponse(await answer(quiz, matchUrl, sourceUrls), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    if (error instanceof MatchAnswersError) {
      return NextResponse.json(
        { success: false, message: error.message, sourceUrls },
        { status: error.status },
      );
    }
    console.error(`Error fetching ${gameType} quiz answers:`, error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch answers",
        sourceUrls,
      },
      { status: 502 },
    );
  }
}
