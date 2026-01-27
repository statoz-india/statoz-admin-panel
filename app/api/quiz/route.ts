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
  points: number;
  correctAnswer: string;
  _id: string;
}

// Quiz interface
export interface Quiz {
  _id: string;
  quizId: string;
  teamA: Team;
  teamB: Team;
  quizStatus: string;
  tournament: string;
  entryStartTime: string;
  entryStopTime: string;
  questionsArray: QuizQuestion[];
  responseSubmittedByUsers: unknown[];
  isVisible: boolean;
  createdAt: string;
  createdByUserData: {
    email: string;
    userType: string;
  };
  tag: string;
}

// Create Quiz Payload
export interface CreateQuizPayload {
  tournament: string;
  teamA: string;
  teamB: string;
  entryStartTime: number;
  entryStopTime: number;
  questionsArray: Omit<QuizQuestion, "_id">[];
  tag: string;
}

// Create Quiz Payload
export interface CreateQuizAPIPayload {
  tournament: string;
  teamA: string;
  teamB: string;
  entryStartTime: string;
  entryStopTime: string;
  questionsArray: Omit<QuizQuestion, "_id">[];
  tag: string;
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/quiz");
    if (response.status === 401) {
      return await errorResponse();
    }

    if (response.status === 404) {
      return successResponse(
        { data: [] },
        { status: 404 },
        { message: "No Quiz found" },
      );
    }

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

    const {
      tournament,
      teamA,
      teamB,
      entryStartTime,
      entryStopTime,
      questionsArray,
      tag,
    } = body;

    const convertToUnixTimestamp = (dateTimeString: string): number => {
      if (!dateTimeString) return 0;
      const date = new Date(dateTimeString);
      return Math.floor(date.getTime() / 1000); // Convert to seconds (Unix timestamp)
    };

    const apiPayload: CreateQuizPayload = {
      tournament: tournament,
      teamA: teamA,
      teamB: teamB,
      entryStartTime: convertToUnixTimestamp(entryStartTime),
      entryStopTime: convertToUnixTimestamp(entryStopTime),
      questionsArray: questionsArray,
      tag: tag,
    };

    const response = await authenticatedFetch("/quiz/createQuiz", {
      method: "POST",
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
