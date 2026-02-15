import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./const-helpers";

const API_BASE_URL = process.env.API_BASE_URL;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN)?.value;
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN)?.value;
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.set(ACCESS_TOKEN, "");
}

export async function clearRefreshTokeCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_TOKEN);
  cookieStore.set(REFRESH_TOKEN, "");
}

export interface RefreshResponse {
  success: boolean;
  data?: { accessToken: string; refreshToken?: string };
  message?: string;
}

export async function tryRefreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken || !API_BASE_URL) {
    if (!API_BASE_URL) {
      console.error("[auth] Refresh skipped: API_BASE_URL is not set");
    } else {
      console.error("[auth] Refresh skipped: no refresh token in request cookies");
    }
    try {
      await clearSessionCookies();
      await clearRefreshTokeCookies();
    } catch (e) {
      console.error("Error clearing cookies:", e);
    }
    return null;
  }

  const res = await fetch(`${API_BASE_URL}/users/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(
      `[auth] Refresh failed: backend returned ${res.status}`,
      errText ? errText.slice(0, 200) : "",
    );
    return null;
  }

  let data: RefreshResponse;
  try {
    data = await res.json();
  } catch (e) {
    console.error("[auth] Refresh failed: invalid JSON response");
    return null;
  }

  if (!data.success || !data.data?.accessToken) {
    console.error("[auth] Refresh failed: success=false or no accessToken in response");
    return null;
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN, data.data.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24,
  });
  if (data.data.refreshToken) {
    cookieStore.set(REFRESH_TOKEN, data.data.refreshToken, {
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
      { status: 401 },
    );
  }
  return sessionCookie;
}

async function buildAuthHeaders(sessionCookie: string | undefined): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const xsrfToken = cookieStore.get("XSRF-TOKEN")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "private,no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    Cookie: `accessToken=${sessionCookie ?? ""}`,
  };

  if (xsrfToken) {
    headers["X-XSRF-TOKEN"] = xsrfToken;
    headers["Cookie"] += ` ; XSRF-TOKEN=${xsrfToken}`;
  }

  return headers;
}

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const sessionCookie = await getSessionCookie();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    ...(await buildAuthHeaders(sessionCookie)),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // On token expired / unauthorized, try refresh and retry once with new token
  if (response.status === 401 || response.status === 498) {
    const newToken = await tryRefreshAccessToken();
    if (newToken) {
      const retryHeaders: Record<string, string> = {
        ...(await buildAuthHeaders(newToken)),
        ...(options.headers as Record<string, string>),
      };
      const retryResponse = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
      if (!retryResponse.ok) {
        console.error(
          `[auth] Retry after refresh still failed: ${retryResponse.status} for ${endpoint}`,
        );
      }
      return retryResponse;
    }
    console.error(
      `[auth] Token refresh failed for ${endpoint}; returning original ${response.status}`,
    );
  }

  return response;
}

export async function noRecordFound() {
  return NextResponse.json(
    {
      success: false,
      message: "No record found",
    },
    { status: 404 },
  );
}

export async function errorResponse(message?: string) {
  return NextResponse.json(
    {
      success: false,
      message: message ?? "Unauthorized",
    },
    { status: 401 },
  );
}

export async function handleExternalApiResponse<T>(
  response: Response,
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
          : "External API request failed",
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
  metadata?: Record<string, unknown>,
): NextResponse<ApiSuccess<T>> {
  const { message, ...init } = options;
  return NextResponse.json<ApiSuccess<T>>(
    {
      success: true,
      data,
      metadata: metadata,
      ...(message ? { message } : {}),
    },
    init,
  );
}
