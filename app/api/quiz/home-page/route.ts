import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type {
  HomePageBackendResponse,
  HomePageQuiz,
} from "@/app/models/home-page.model";

/**
 * GET /api/quiz/home-page
 *
 * Proxies `GET /quiz/homePageQuizzes` — visible quizzes with at least one
 * question, whose linked match falls on "yesterday or later" (Asia/Kolkata).
 * `questionsArray` is intentionally left out of this list response.
 */
export async function GET() {
  try {
    const response = await authenticatedFetch("/quiz/homePageQuizzes");

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse<HomePageQuiz[]>(
        [],
        { status: 200 },
        { message: "No quizzes found" },
      );
    }

    const backendResponse =
      await handleExternalApiResponse<HomePageBackendResponse<HomePageQuiz>>(
        response,
      );

    return successResponse<HomePageQuiz[]>(
      Array.isArray(backendResponse?.data) ? backendResponse.data : [],
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching home page quizzes:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch home page quizzes",
      },
      { status: 500 },
    );
  }
}
