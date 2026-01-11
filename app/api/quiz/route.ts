import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

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
  teamA: string;
  teamAlogo: string;
  teamAcolorPrimary: string;
  teamAcolorSecondary: string;
  teamB: string;
  teamBlogo: string;
  teamBcolorPrimary: string;
  teamBcolorSecondary: string;
  quizStatus: string;
  tournament: string;
  entryStartTime: string;
  entryStopTime: string;
  questionsArray: QuizQuestion[];
  responseSubmittedByUsers: unknown[];
  isVisible: boolean;
  createdByUserData: {
    email: string;
    userType: string;
  };
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/quiz");
    if (response.status === 401) {
      return await errorResponse();
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
      { status: 500 }
    );
  }
}
