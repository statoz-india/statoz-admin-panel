import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import { Team } from "../tournament/teams/route";

// Quiz Question interface
export interface QuizQuestion {
  questionText: string;
  questionType: string;
  options: string[];
  questionNumber: number;
  xp: number;
  correctAnswer: string;
  _id: string;
}

// Quiz interface
export interface Quiz {
  _id: string;
  quizId: string;
  teamA: Team;
  teamB: Team;
  matchId: string;
  quizStatus: string;
  tournament: string;
  entryStartTime: string;
  matchStartTime: string;
  questionsArray: QuizQuestion[];
  responseSubmittedByUsers: unknown[];
  isVisible: boolean;
  createdAt: string;
  createdByUserData: {
    email: string;
    userType: string;
  };
  tag: string;
  totalQuestions?: number;
  totalSubmission?: number;
}

// Create Quiz Payload (matchId references a match; backend resolves teamA/teamB from it)
export interface CreateQuizPayload {
  tournament: string;
  matchId: string;
  entryStartTime: string;
  questionsArray: Omit<QuizQuestion, "_id">[];
  tag: string;
}

// Create Quiz Payload
export interface CreateQuizAPIPayload {
  tournament: string;
  matchId: string;
  entryStartTime: string;
  questionsArray: Omit<QuizQuestion, "_id">[];
  tag: string;
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/quiz/allQuizesForAdmin");
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse(
        { data: [] },
        { status: 404 },
        { message: "No Quiz found" },
      );
    }

    console.log("response", response);

    const data = await handleExternalApiResponse<Quiz[]>(response);

    return successResponse(data, { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { tournament, matchId, entryStartTime, questionsArray, tag } = body;

    const apiPayload: CreateQuizPayload = {
      tournament: tournament,
      matchId: matchId,
      entryStartTime: entryStartTime,
      questionsArray: questionsArray,
      tag: tag,
    };

    const response = await authenticatedFetch("/quiz/createQuiz", {
      method: "POST",
      body: JSON.stringify(apiPayload),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to create team" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to create team (Status: ${response.status})`;

      console.error("Extracted error message:", errorMessage);

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

    return successResponse(quiz, { status: 201 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating team:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create quiz",
      },
      { status: 500 },
    );
  }
}
