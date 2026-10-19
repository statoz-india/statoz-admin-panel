import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./const-helpers";

const API_BASE_URL = process.env.API_BASE_URL;

/**
 * The access token itself expires after ~15 minutes. Its cookie lives longer
 * so an expired token still reaches the backend, gets a 498, and is renewed.
 */
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24;
export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** Options for the panel's session cookies. `maxAge: 0` deletes one. */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN)?.value;
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN)?.value;
}

async function storeSessionCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(
    ACCESS_TOKEN,
    accessToken,
    sessionCookieOptions(ACCESS_COOKIE_MAX_AGE),
  );
  cookieStore.set(
    REFRESH_TOKEN,
    refreshToken,
    sessionCookieOptions(REFRESH_COOKIE_MAX_AGE),
  );
}

/** Forget this browser's session: the admin has to log in again. */
export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN, "", sessionCookieOptions(0));
  cookieStore.set(REFRESH_TOKEN, "", sessionCookieOptions(0));
}

/**
 * Clear the session cookies on a response a route builds itself. Both ways:
 * Next.js adds cookies set through `cookies()` (by a renewal earlier in the
 * request) after the response's own, so those would otherwise win.
 */
export async function withSessionCleared(
  response: NextResponse,
): Promise<NextResponse> {
  await clearSessionCookies();
  response.cookies.set(ACCESS_TOKEN, "", sessionCookieOptions(0));
  response.cookies.set(REFRESH_TOKEN, "", sessionCookieOptions(0));
  return response;
}

export interface RefreshResponse {
  success: boolean;
  data?: { accessToken: string; refreshToken?: string };
  message?: string;
}

/** How an attempt to renew the session went. */
type Renewal =
  | { kind: "renewed"; accessToken: string; refreshToken: string }
  /** The backend ended the session (signed out, expired, token reused): log in again. */
  | { kind: "ended" }
  /** The backend is down or answered oddly: keep the cookies, try again later. */
  | { kind: "unavailable" };

/**
 * Renewals in flight, by refresh token: one browser's parallel requests that
 * all hit 498 share one, and no admin ever waits on another admin's.
 */
const renewalsInFlight = new Map<string, Promise<Renewal>>();

/**
 * Renewals that just finished, by the refresh token they spent. Requests the
 * browser sent before it got the new cookies still carry the old refresh
 * token. Spending it again looks like a stolen token to a backend that rotates
 * refresh tokens, and it signs the browser out, so they get this result.
 */
const recentRenewals = new Map<string, { renewal: Renewal; until: number }>();
const RECENT_RENEWAL_MS = 30_000;

/** Tests start each case without the previous case's renewals. */
export function forgetRenewals() {
  renewalsInFlight.clear();
  recentRenewals.clear();
}

/**
 * 401 is the backend's "this session is over". Other 4xx won't go better on a
 * retry either, except a timeout or the refresh rate limit.
 */
function refreshRefusalEndsSession(status: number): boolean {
  return status >= 400 && status < 500 && status !== 408 && status !== 429;
}

async function requestRenewal(refreshToken: string): Promise<Renewal> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/authorization/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (error) {
    console.error("[auth] Refresh failed: backend unreachable", error);
    return { kind: "unavailable" };
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(
      `[auth] Refresh failed: backend returned ${res.status}`,
      errText.slice(0, 200),
    );
    return refreshRefusalEndsSession(res.status)
      ? { kind: "ended" }
      : { kind: "unavailable" };
  }

  let data: RefreshResponse;
  try {
    data = await res.json();
  } catch {
    console.error("[auth] Refresh failed: invalid JSON response");
    return { kind: "unavailable" };
  }

  if (!data.success || !data.data?.accessToken) {
    console.error(
      "[auth] Refresh failed: success=false or no accessToken in response",
    );
    return { kind: "unavailable" };
  }

  return {
    kind: "renewed",
    accessToken: data.data.accessToken,
    // Without rotation the backend may hand back the same token, or none.
    refreshToken: data.data.refreshToken || refreshToken,
  };
}

function shareRenewal(refreshToken: string): Promise<Renewal> {
  const now = Date.now();
  for (const [token, { until }] of recentRenewals) {
    if (until <= now) recentRenewals.delete(token);
  }
  const recent = recentRenewals.get(refreshToken);
  if (recent) return Promise.resolve(recent.renewal);

  let pending = renewalsInFlight.get(refreshToken);
  if (!pending) {
    pending = requestRenewal(refreshToken)
      .then((renewal) => {
        if (renewal.kind === "renewed") {
          recentRenewals.set(refreshToken, {
            renewal,
            until: Date.now() + RECENT_RENEWAL_MS,
          });
        }
        return renewal;
      })
      .finally(() => renewalsInFlight.delete(refreshToken));
    renewalsInFlight.set(refreshToken, pending);
  }
  return pending;
}

async function renewSession(): Promise<Renewal> {
  if (!API_BASE_URL) {
    console.error("[auth] Refresh skipped: API_BASE_URL is not set");
    return { kind: "unavailable" };
  }

  const refreshToken = await getRefreshTokenCookie();
  if (!refreshToken) {
    console.error("[auth] Refresh skipped: no refresh token in request cookies");
    await clearSessionCookies();
    return { kind: "ended" };
  }

  const renewal = await shareRenewal(refreshToken);

  // Every request that waited on the renewal sets it on its own response.
  if (renewal.kind === "renewed") {
    await storeSessionCookies(renewal.accessToken, renewal.refreshToken);
  } else if (renewal.kind === "ended") {
    await clearSessionCookies();
  }
  return renewal;
}

/** Renew the session: the new access token, or null when it wasn't renewed. */
export async function tryRefreshAccessToken(): Promise<string | null> {
  const renewal = await renewSession();
  return renewal.kind === "renewed" ? renewal.accessToken : null;
}

export async function requireAuth(): Promise<string> {
  let sessionCookie = await getSessionCookie();
  // The access cookie can lapse before the refresh cookie does.
  if (!sessionCookie && (await getRefreshTokenCookie())) {
    sessionCookie = (await tryRefreshAccessToken()) ?? undefined;
  }
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

async function buildAuthHeaders(
  sessionCookie: string | undefined,
): Promise<Record<string, string>> {
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

/** What a route gets when the session couldn't be renewed right now. Not a sign-out. */
function renewalUnavailable(): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message: "Couldn't renew your session just now. Try again in a moment.",
    }),
    { status: 503, headers: { "Content-Type": "application/json" } },
  );
}

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const send = async (sessionCookie: string | undefined) =>
    fetch(url, {
      ...options,
      headers: {
        ...(await buildAuthHeaders(sessionCookie)),
        ...(options.headers as Record<string, string>),
      },
      credentials: "include",
    });

  let sessionCookie = await getSessionCookie();

  // The access cookie lapsed but the refresh cookie hasn't (a reload a day
  // later): renew before the first call instead of collecting a 401.
  if (!sessionCookie && (await getRefreshTokenCookie())) {
    const renewal = await renewSession();
    if (renewal.kind === "unavailable") return renewalUnavailable();
    if (renewal.kind === "renewed") sessionCookie = renewal.accessToken;
  }

  let response = await send(sessionCookie);

  // 498: the access token expired. Renew, then retry once.
  if (response.status === 498) {
    const renewal = await renewSession();
    if (renewal.kind === "unavailable") {
      console.error(`[auth] Token refresh unavailable for ${endpoint}`);
      return renewalUnavailable();
    }
    if (renewal.kind === "ended") {
      console.error(
        `[auth] Session ended for ${endpoint}; returning the original ${response.status}`,
      );
      return response;
    }
    response = await send(renewal.accessToken);
    if (!response.ok) {
      console.error(
        `[auth] Retry after refresh still failed: ${response.status} for ${endpoint}`,
      );
    }
  }

  // 401: no token, a bad one, or the account is gone. Log in again.
  if (response.status === 401) await clearSessionCookies();

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

/**
 * Pull an array payload out of the common backend wrapper shapes:
 * a bare array, `{ items }`, `{ data }`, or `{ data: { items } }`.
 */
export function extractArray<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.items)) return inner.items as T[];
    }
  }
  return [];
}

/**
 * Best human-readable message from a backend error body. The specific problem
 * often sits one level down in `data` (`{ error }` or `{ errors: [...] }`)
 * while the top-level `message` is generic ("Teams cannot be created"), so
 * prefer the detail.
 */
export function extractBackendErrorMessage(
  errorData: Record<string, unknown>,
  fallback: string,
): string {
  const nested =
    errorData.data && typeof errorData.data === "object"
      ? (errorData.data as Record<string, unknown>)
      : undefined;

  const nestedErrors = Array.isArray(nested?.errors)
    ? (nested.errors as unknown[]).filter(
        (e): e is string => typeof e === "string",
      )
    : [];

  if (nestedErrors.length > 0) return nestedErrors.join("; ");
  if (typeof nested?.error === "string") return nested.error;
  if (typeof errorData.error === "string") return errorData.error;
  if (typeof errorData.message === "string" && errorData.message) {
    return errorData.message;
  }
  if (typeof errorData.msg === "string" && errorData.msg) return errorData.msg;
  return fallback;
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
