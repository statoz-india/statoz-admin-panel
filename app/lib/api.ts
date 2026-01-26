import { CreateQuizPayload } from "../api/quiz/route";

const API_BASE_URL = process.env.API_BASE_URL;

// Generic API response type
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

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

// Team interface (matches backend response)
export interface Team {
  _id: string;
  name: string;
  abbreviation: string;
  tournament: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
}

// User Prediction interface
export interface UserPrediction {
  _id: string;
  userId: string;
  predictionId: string;
  teamChosen: string;
  coinsBet: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Prediction interface
export interface Prediction {
  _id: string;
  predictionId: string;
  teamA: string;
  teamAlogo?: string;
  teamAcolorPrimary?: string;
  teamAcolorSecondary?: string;
  teamB: string;
  teamBlogo?: string;
  teamBcolorPrimary?: string;
  teamBcolorSecondary?: string;
  coinsOnTeamA: number;
  coinsOnTeamB: number;
  tournament: string;
  winningTeamCoin?: number;
  responseSubmittedByUsers: string[];
  isVisible: boolean;
  createdByUserData: {
    email?: string;
    userType?: string;
  };
  totalCoins: number;
  oddsTeamA: number;
  oddsTeamB: number;
  userPrediction: UserPrediction | null;
}

// Update Quiz
export async function updateQuiz(
  quizId: string,
  payload: CreateQuizPayload,
): Promise<ApiResponse<Quiz>> {
  // Convert datetime-local strings to Unix timestamps
  const convertToUnixTimestamp = (dateTimeString: string): number => {
    if (!dateTimeString) return 0;
    const date = new Date(dateTimeString);
    return Math.floor(date.getTime() / 1000); // Convert to seconds (Unix timestamp)
  };

  // Transform payload to match API format
  const apiPayload: CreateQuizPayload = {
    tournament: payload.tournament,
    tag: payload.tag,
    teamA: payload.teamA,
    teamB: payload.teamB,
    entryStartTime: payload.entryStartTime,
    entryStopTime: payload.entryStopTime,
    questionsArray: payload.questionsArray,
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/quiz/updateQuiz/${quizId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(apiPayload),
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly.",
    );
  }

  let data: ApiResponse<Quiz>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`,
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update quiz");
  }

  return data;
}

// Create Prediction Payload
export interface CreatePredictionPayload {
  tournament: string;
  teamA: string;
  teamB: string;
}

// Update Prediction Payload
export interface UpdatePredictionPayload {
  winningTeam: "A" | "B";
}

// Update Prediction
export async function updatePrediction(
  predictionId: string,
  payload: UpdatePredictionPayload,
): Promise<ApiResponse<Prediction>> {
  let response: Response;
  try {
    response = await fetch(
      `${API_BASE_URL}/prediction/updatePrediction/${predictionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly.",
    );
  }

  let data: ApiResponse<Prediction>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`,
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update prediction");
  }

  return data;
}
