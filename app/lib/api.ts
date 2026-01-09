import { User } from "@/app/store/authStore";

const API_BASE_URL = "http://localhost:8000/api/v1";

export interface LoginResponse {
  statusCode: number;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  let response: Response;
  try {
    // Use Next.js API route proxy to avoid CORS issues
    response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    console.error("Login error:", error);
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running."
    );
  }

  let data: LoginResponse;
  try {
    data = await response.json();
  } catch (error) {
    // If response is not JSON, it might be a server error
    console.error("JSON parse error:", error);
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check if the backend server is running.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

// Generic API response type
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Fetch users
export async function getUsers(): Promise<ApiResponse<User[]>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/getAllUsers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<User[]>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
}

// Fetch leaderboard
export async function getLeaderboard(): Promise<ApiResponse<User[]>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/leaderboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<User[]>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch leaderboard");
  }

  return data;
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

// Fetch quizzes
export async function getQuizzes(): Promise<ApiResponse<Quiz[]>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/quiz`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<Quiz[]>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch quizzes");
  }

  return data;
}

// Fetch single quiz by ID
export async function getQuizById(id: string): Promise<ApiResponse<Quiz>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/quiz/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<Quiz>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch quiz");
  }

  return data;
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

// Fetch predictions
export async function getPredictions(): Promise<ApiResponse<Prediction[]>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/prediction`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<Prediction[]>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch predictions");
  }

  return data;
}

// Fetch single prediction by ID
export async function getPredictionById(
  id: string
): Promise<ApiResponse<Prediction>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/prediction/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<Prediction>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch prediction");
  }

  return data;
}

// Create Quiz Payload
export interface CreateQuizPayload {
  teamA: string;
  teamAlogo?: string;
  teamAcolorPrimary?: string;
  teamAcolorSecondary?: string;
  teamB: string;
  teamBlogo?: string;
  teamBcolorPrimary?: string;
  teamBcolorSecondary?: string;
  entryStartTime: string;
  entryStopTime: string;
  questionsArray: Omit<QuizQuestion, "_id">[];
}

// Create Quiz Payload (for API request - with Unix timestamps)
export interface CreateQuizApiPayload {
  teamA: string;
  teamAlogo?: string;
  teamAcolorPrimary?: string;
  teamAcolorSecondary?: string;
  teamB: string;
  teamBlogo?: string;
  teamBcolorPrimary?: string;
  teamBcolorSecondary?: string;
  entryStartTime: number; // Unix timestamp
  entryStopTime: number; // Unix timestamp
  questionsArray: Omit<QuizQuestion, "_id">[];
}

// Create Quiz
export async function createQuiz(
  payload: CreateQuizPayload
): Promise<ApiResponse<Quiz>> {
  // Convert datetime-local strings to Unix timestamps
  const convertToUnixTimestamp = (dateTimeString: string): number => {
    if (!dateTimeString) return 0;
    const date = new Date(dateTimeString);
    return Math.floor(date.getTime() / 1000); // Convert to seconds (Unix timestamp)
  };

  // Transform payload to match API format
  const apiPayload: CreateQuizApiPayload = {
    teamA: payload.teamA,
    teamAlogo: payload.teamAlogo || undefined,
    teamAcolorPrimary: payload.teamAcolorPrimary || undefined,
    teamAcolorSecondary: payload.teamAcolorSecondary || undefined,
    teamB: payload.teamB,
    teamBlogo: payload.teamBlogo || undefined,
    teamBcolorPrimary: payload.teamBcolorPrimary || undefined,
    teamBcolorSecondary: payload.teamBcolorSecondary || undefined,
    entryStartTime: convertToUnixTimestamp(payload.entryStartTime),
    entryStopTime: convertToUnixTimestamp(payload.entryStopTime),
    questionsArray: payload.questionsArray,
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/quiz/createQuiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(apiPayload),
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<Quiz>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to create quiz");
  }

  return data;
}

// Update Quiz Payload (for API request - with Unix timestamps)
export interface UpdateQuizApiPayload {
  teamA: string;
  teamAlogo?: string;
  teamAcolorPrimary?: string;
  teamAcolorSecondary?: string;
  teamB: string;
  teamBlogo?: string;
  teamBcolorPrimary?: string;
  teamBcolorSecondary?: string;
  entryStartTime: number; // Unix timestamp
  entryStopTime: number; // Unix timestamp
  questionsArray: Omit<QuizQuestion, "_id">[];
}

// Update Quiz
export async function updateQuiz(
  quizId: string,
  payload: CreateQuizPayload
): Promise<ApiResponse<Quiz>> {
  // Convert datetime-local strings to Unix timestamps
  const convertToUnixTimestamp = (dateTimeString: string): number => {
    if (!dateTimeString) return 0;
    const date = new Date(dateTimeString);
    return Math.floor(date.getTime() / 1000); // Convert to seconds (Unix timestamp)
  };

  // Transform payload to match API format
  const apiPayload: UpdateQuizApiPayload = {
    teamA: payload.teamA,
    teamAlogo: payload.teamAlogo || undefined,
    teamAcolorPrimary: payload.teamAcolorPrimary || undefined,
    teamAcolorSecondary: payload.teamAcolorSecondary || undefined,
    teamB: payload.teamB,
    teamBlogo: payload.teamBlogo || undefined,
    teamBcolorPrimary: payload.teamBcolorPrimary || undefined,
    teamBcolorSecondary: payload.teamBcolorSecondary || undefined,
    entryStartTime: convertToUnixTimestamp(payload.entryStartTime),
    entryStopTime: convertToUnixTimestamp(payload.entryStopTime),
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
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<Quiz>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update quiz");
  }

  return data;
}

// Create Prediction Payload
export interface CreatePredictionPayload {
  teamA: string;
  teamAlogo?: string;
  teamAcolorPrimary?: string;
  teamAcolorSecondary?: string;
  teamB: string;
  teamBlogo?: string;
  teamBcolorPrimary?: string;
  teamBcolorSecondary?: string;
}

// Create Prediction
export async function createPrediction(
  payload: CreatePredictionPayload
): Promise<ApiResponse<Prediction>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/prediction/createPrediction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<Prediction>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to create prediction");
  }

  return data;
}

// Update Prediction Payload
export interface UpdatePredictionPayload {
  winningTeam: "A" | "B";
}

// Update Prediction
export async function updatePrediction(
  predictionId: string,
  payload: UpdatePredictionPayload
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
      }
    );
  } catch {
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: ApiResponse<Prediction>;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update prediction");
  }

  return data;
}
