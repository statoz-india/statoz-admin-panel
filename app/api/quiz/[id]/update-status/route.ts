import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { Quiz } from "../../route";
import {
  QUIZ_STATUS_VALUES,
  type QuizStatus,
} from "../../../../constants/quiz-status";

type UpdateQuizStatusPayload = {
  quizStatus: QuizStatus;
};

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz ID is required",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const hasOnlyQuizStatusKey =
      body &&
      typeof body === "object" &&
      Object.keys(body).length === 1 &&
      Object.prototype.hasOwnProperty.call(body, "quizStatus");

    if (!hasOnlyQuizStatusKey || typeof body.quizStatus !== "string") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only quizStatus is allowed in request body and it must be a string",
        },
        { status: 400 },
      );
    }

    const quizStatus = body.quizStatus.trim().toUpperCase();
    if (!QUIZ_STATUS_VALUES.includes(quizStatus as QuizStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid quizStatus. Allowed values: ${QUIZ_STATUS_VALUES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const apiPayload: UpdateQuizStatusPayload = {
      quizStatus,
    };

    const response = await authenticatedFetch(`/quiz/updateQuizStatus/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiPayload),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to update quiz status" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to update quiz status (Status: ${response.status})`;

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      statusCode: number;
      data: Quiz;
      message: string;
      success: boolean;
    }>(response);

    const quiz = backendResponse?.data;

    return successResponse(quiz, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update quiz status",
      },
      { status: 500 },
    );
  }
}
