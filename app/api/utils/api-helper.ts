import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ACCESSTOKEN = "accesstoken";
export const REFRESH_TOKEN_COOKIE = "refreshtoken";
const API_BASE_URL = process.env.API_BASE_URL;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  // Try multiple possible cookie names (backend might use different casing)
  return (
    cookieStore.get(ACCESSTOKEN)?.value || // "accesstoken"
    cookieStore.get("accessToken")?.value || // "accessToken"
    cookieStore.get("accesstoken")?.value // lowercase variant
  );
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return (
    cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ||
    cookieStore.get("refreshToken")?.value
  );
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESSTOKEN);
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete(REFRESH_TOKEN_COOKIE);

  cookieStore.set("accessToken", "");
  cookieStore.set("refreshToken", "");
  cookieStore.set(REFRESH_TOKEN_COOKIE, "");
}

export interface RefreshResponse {
  success: boolean;
  data?: { accessToken: string; refreshToken?: string };
  message?: string;
}

export async function tryRefreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshTokenCookie();
  if (!refreshToken || !API_BASE_URL) return null;

  const res = await fetch(`${API_BASE_URL}/users/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  const data: RefreshResponse = await res.json();
  if (!data.success || !data.data?.accessToken) return null;

  const cookieStore = await cookies();
  cookieStore.set(ACCESSTOKEN, data.data.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24,
  });
  if (data.data.refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, data.data.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return data.data.accessToken;
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

  if (response.status === 401 || response.status === 498) {
    const newToken = await tryRefreshAccessToken();
    if (newToken) {
      const retryHeaders: Record<string, string> = {
        ...headers,
        Cookie: `accessToken=${newToken}`,
      };
      if (xsrfToken) {
        retryHeaders["X-XSRF-TOKEN"] = xsrfToken;
        retryHeaders["Cookie"] += ` ; XSRF-TOKEN=${xsrfToken}`;
      }
      const retryResponse = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
      if (retryResponse.status === 401) {
        try {
          await clearSessionCookies();
        } catch (e) {
          console.error("Error clearing session cookies:", e);
        }
      }
      return retryResponse;
    }
    try {
      await clearSessionCookies();
    } catch (error) {
      console.error("Error clearing session cookies:", error);
    }
  }

  if (response.status === 404) {
  }

  return response;
}

export async function noRecordFound() {
  return NextResponse.json(
    {
      success: false,
      message: "No record found",
    },
    { status: 404 }
  );
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
