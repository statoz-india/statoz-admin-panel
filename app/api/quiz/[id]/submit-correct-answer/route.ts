import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const quizId = params.id;

    if (!quizId) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz ID is required",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        {
          success: false,
          message: "Answers array is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/quiz/submitCorrectAnswer/${quizId}`,
      {
        method: "POST",
        body: JSON.stringify({ answers }),
      },
    );

    if (response.status === 401) {
      return await errorResponse();
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to submit correct answers" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to submit correct answers (Status: ${response.status})`;

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
      data: unknown;
      message: string;
      success: boolean;
    }>(response);

    return successResponse(backendResponse.data, { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error submitting correct answers:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to submit correct answers",
      },
      { status: 500 },
    );
  }
}
