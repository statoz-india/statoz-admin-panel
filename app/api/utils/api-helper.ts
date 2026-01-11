import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ACCESSTOKEN = "accesstoken";
const API_BASE_URL = "https://api.statoz.in/api/v1";

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  // Try multiple possible cookie names (backend might use different casing)
  return (
    cookieStore.get(ACCESSTOKEN)?.value || // "accesstoken"
    cookieStore.get("accessToken")?.value || // "accessToken"
    cookieStore.get("accesstoken")?.value // lowercase variant
  );
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESSTOKEN);
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  cookieStore.set("accessToken", "");
  cookieStore.set("refreshToken", "");
}

export async function requireAuth(): Promise<string> {
  const sessionCookie = await getSessionCookie();
  if (!sessionCookie) {
    throw NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  return sessionCookie;
}

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const sessionCookie = await getSessionCookie();
  const cookieStore = await cookies();
  const xsrfToken = cookieStore.get("XSRF-TOKEN")?.value;

  if (!sessionCookie) {
    throw await errorResponse();
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "private,no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    Cookie: `accessToken=${sessionCookie}`,
    ...(options.headers as Record<string, string>),
  };

  if (xsrfToken) {
    headers["X-XSRF-TOKEN"] = xsrfToken;
    headers["Cookie"] += ` ; XSRF-TOKEN=${xsrfToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status == 401) {
    try {
      await clearSessionCookies();
    } catch (error) {
      console.error("Error clearing session cookies:", error);
    }
  }

  return response;
}

export async function errorResponse() {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    { status: 401 }
  );
}

export async function handleExternalApiResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorData: Record<string, unknown>;

    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText || "External API error" };
    }

    throw new Error(
      typeof errorData.error === "string"
        ? errorData.error
        : typeof errorData.message === "string"
        ? errorData.message
        : "External API request failed"
    );
  }

  const text = await response.text();
  if (!text) {
    throw new Error("Empty response from external API");
  }

  return JSON.parse(text) as T;
}

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
  metadata?: Record<string, unknown>;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
};

type SuccessOptions = ResponseInit & { message?: string };

export function successResponse<T>(
  data: T,
  options: SuccessOptions = {},
  metadata?: Record<string, unknown>
): NextResponse<ApiSuccess<T>> {
  const { message, ...init } = options;
  return NextResponse.json<ApiSuccess<T>>(
    {
      success: true,
      data,
      metadata: metadata,
      ...(message ? { message } : {}),
    },
    init
  );
}
