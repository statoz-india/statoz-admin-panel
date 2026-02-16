import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { Quiz, CreateQuizPayload } from "../route";

export async function GET(
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

    const response = await authenticatedFetch(`/quiz/${id}`);
    if (response.status === 401) {
      return await errorResponse();
    }
    const data = await handleExternalApiResponse<Quiz>(response);

    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quizes",
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
    const { tournament, matchId, entryStartTime, questionsArray, tag } = body;

    const apiPayload: CreateQuizPayload = {
      tournament,
      matchId,
      entryStartTime,
      questionsArray,
      tag,
    };

    const response = await authenticatedFetch(`/quiz/updateQuiz/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiPayload),
    });

    if (response.status === 401) {
      return await errorResponse();
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to update quiz" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to update quiz (Status: ${response.status})`;

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
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update quiz",
      },
      { status: 500 },
    );
  }
}
