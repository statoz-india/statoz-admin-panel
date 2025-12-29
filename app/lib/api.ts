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
