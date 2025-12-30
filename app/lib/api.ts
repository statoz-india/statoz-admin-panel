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
    response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch {
    // Handle network errors (CORS, connection refused, etc.)
    throw new Error(
      "Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly."
    );
  }

  let data: LoginResponse;
  try {
    data = await response.json();
  } catch {
    // If response is not JSON, it might be a CORS or server error
    throw new Error(
      `Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`
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
    response = await fetch(`${API_BASE_URL}/users`, {
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
  quizId: string;
  teamA: string;
  teamAlogo?: string;
  teamAcolorPrimary?: string;
  teamAcolorSecondary?: string;
  teamB: string;
  teamBlogo?: string;
  teamBcolorPrimary?: string;
  teamBcolorSecondary?: string;
  quizStatus: string;
  tournament: string;
  entryStartTime: string;
  entryStopTime: string;
  questionsArray: Omit<QuizQuestion, "_id">[];
  isVisible: boolean;
}

// Create Quiz
export async function createQuiz(
  payload: CreateQuizPayload
): Promise<ApiResponse<Quiz>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/quiz`, {
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

// Create Prediction Payload
export interface CreatePredictionPayload {
  predictionId: string;
  teamA: string;
  teamAlogo?: string;
  teamAcolorPrimary?: string;
  teamAcolorSecondary?: string;
  teamB: string;
  teamBlogo?: string;
  teamBcolorPrimary?: string;
  teamBcolorSecondary?: string;
  tournament: string;
  isVisible: boolean;
}

// Create Prediction
export async function createPrediction(
  payload: CreatePredictionPayload
): Promise<ApiResponse<Prediction>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/prediction`, {
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
