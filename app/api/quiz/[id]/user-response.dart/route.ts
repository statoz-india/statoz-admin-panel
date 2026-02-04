import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";

/** Single answer in a quiz submission */
export interface QuizSubmissionAnswer {
  _id: string;
  questionNumber: number;
  selctedAnswerOption: string;
  selctedAnswer: string;
}

/** User info embedded in a submission */
export interface QuizSubmissionUserData {
  _id: string;
  userName: string;
  email: string;
  password: string;
  userType: string;
  coins?: number;
  xp?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken?: string;
}

/** One quiz submission (one item in the list) */
export interface QuizSubmission {
  _id: string;
  quizId: string;
  submissionTime: string;
  answers: QuizSubmissionAnswer[];
  createdAt: string;
  updatedAt: string;
  userData: QuizSubmissionUserData;
}

/** Raw envelope from the external API (statusCode, data, message, success) */
export interface QuizSubmissionsApiResponse {
  statusCode: number;
  data: QuizSubmission[];
  message: string;
  success: boolean;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
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
        { status: 400 }
      );
    }

    const response = await authenticatedFetch(`/quiz/getSubmission/${id}`);
    if (response.status === 401) {
      return await errorResponse();
    }

    const parsed = await handleExternalApiResponse<QuizSubmissionsApiResponse>(
      response
    );
    return successResponse(parsed.data, { status: 200 });
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
      { status: 500 }
    );
  }
}
