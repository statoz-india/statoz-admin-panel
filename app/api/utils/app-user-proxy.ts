import { NextResponse } from "next/server";
import { APP_USER_TOKEN_HEADER } from "@/app/interface/app-user.interface";
import {
  extractBackendErrorMessage,
  requireAuth,
  successResponse,
} from "./api-helper";

/**
 * Make Predictions: an admin signs in as app users and plays as them. These
 * calls carry the app user's token, never the admin's session cookie: the
 * backend reads the cookie first, so sending both would act as the admin.
 * The admin must still be signed in to the panel to use any of them.
 */

const API_BASE_URL = process.env.API_BASE_URL;

const ID = "[0-9a-fA-F]{24}";

type Method = "GET" | "POST" | "PUT";

/**
 * The player endpoints the Make Predictions screens use, and nothing else:
 * this is not an open proxy to the backend.
 */
const ALLOWED_ACTIONS: readonly [Method, RegExp][] = [
  ["GET", /^user\/current-user$/],
  ["GET", /^quiz\/homePageQuizzes$/],
  ["GET", new RegExp(`^quiz/${ID}$`)],
  ["POST", new RegExp(`^quiz/submitQuiz/${ID}$`)],
  ["PUT", new RegExp(`^quiz/updateSubmission/${ID}$`)],
  ["GET", /^prediction\/homePagePredictions$/],
  ["POST", new RegExp(`^prediction/submitPrediction/${ID}$`)],
  ["GET", new RegExp(`^prediction/userSubmittedBets/${ID}$`)],
  ["GET", /^events\/homePageEvents$/],
  ["POST", new RegExp(`^events/submitEventBet/${ID}$`)],
  ["GET", new RegExp(`^events/${ID}/userEventBet$`)],
  ["GET", /^futures\/homePageFutures$/],
  ["POST", new RegExp(`^futures/submitBet/${ID}$`)],
  ["GET", new RegExp(`^futures/${ID}/userBet$`)],
];

/** The home-page lists answer 404 with `data: []` when there's nothing to show. */
const EMPTY_ON_404 = /^(quiz\/homePageQuizzes|prediction\/homePagePredictions|events\/homePageEvents|futures\/homePageFutures)$/;

export function isAllowedAppUserAction(method: string, path: string): boolean {
  return ALLOWED_ACTIONS.some(([m, pattern]) => m === method && pattern.test(path));
}

async function readPayload(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  try {
    const parsed = text ? JSON.parse(text) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Set when the backend refused the app user's session (not the admin's): the
 * browser then asks for that user to log in again. A 401 without it means the
 * admin's own panel session is gone.
 */
export const APP_USER_SIGNED_OUT = "appUserSignedOut";

function failure(
  message: string,
  status: number,
  data?: unknown,
  appUserSignedOut = false,
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(data !== undefined ? { data } : {}),
      ...(appUserSignedOut ? { [APP_USER_SIGNED_OUT]: true } : {}),
    },
    { status },
  );
}

function unexpected(error: unknown, label: string) {
  if (error instanceof NextResponse) return error;
  console.error(`[app user] ${label} failed:`, error);
  return failure(
    error instanceof Error && error.message ? error.message : `${label} failed`,
    500,
  );
}

/**
 * POST one of the backend's `/authorization/*` endpoints for an app user
 * (send-otp, login, refresh-token) and return its `data`. The backend's own
 * cookies are dropped: the user's tokens go back to the browser in the body.
 */
export async function appUserAuthPost(
  endpoint: string,
  body: Record<string, unknown>,
  label: string,
): Promise<NextResponse> {
  try {
    await requireAuth();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = await readPayload(response);
    if (!response.ok) {
      return failure(
        extractBackendErrorMessage(payload, `${label} failed`),
        response.status,
        undefined,
        response.status === 401,
      );
    }
    return successResponse(payload.data ?? null, {
      status: 200,
      ...(typeof payload.message === "string" ? { message: payload.message } : {}),
    });
  } catch (error) {
    return unexpected(error, label);
  }
}

/**
 * Forward one allowed player action as the app user whose access token is in
 * the `X-Statoz-User-Token` header. The backend's status comes back as-is, so
 * the browser can renew the token on a 498 and ask for a new login on a 401.
 */
export async function proxyAppUserAction(
  request: Request,
  method: Method,
  segments: string[] | undefined,
): Promise<NextResponse> {
  const path = (segments ?? []).join("/");
  try {
    await requireAuth();

    if (!isAllowedAppUserAction(method, path)) {
      return failure("This action isn't available here", 404);
    }

    const token = request.headers.get(APP_USER_TOKEN_HEADER)?.trim();
    if (!token) {
      return failure("Sign this user in again", 401, undefined, true);
    }

    const body = method === "GET" ? undefined : await request.text();
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body ? { body } : {}),
      cache: "no-store",
    });
    const payload = await readPayload(response);

    if (response.status === 404 && EMPTY_ON_404.test(path)) {
      return successResponse([], { status: 200 });
    }

    if (!response.ok) {
      return failure(
        extractBackendErrorMessage(payload, "The request failed"),
        response.status,
        payload.data,
        response.status === 401,
      );
    }

    return successResponse(payload.data ?? null, {
      status: 200,
      ...(typeof payload.message === "string" ? { message: payload.message } : {}),
    });
  } catch (error) {
    return unexpected(error, path || "User action");
  }
}
