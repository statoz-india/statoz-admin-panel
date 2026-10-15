import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

/**
 * Forward a request to the backend player-dictionary API and normalize the
 * result into this app's `{ success, data, message }` envelope.
 *
 * Unlike most backend routes, these errors have **no `data` key**: the details
 * are a top-level `errors` list of strings (all problems at once). They are
 * surfaced as `message` (joined) and, as a list, as `errors`.
 */
export async function proxyPlayers<T>(
  endpoint: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<NextResponse> {
  const response = await authenticatedFetch(endpoint, init);

  if (response.status === 401 || response.status === 498) {
    return await errorResponse("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorData: Record<string, unknown>;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    const errors = Array.isArray(errorData.errors)
      ? errorData.errors.filter((e): e is string => typeof e === "string")
      : [];

    const message =
      errors.length > 0
        ? errors.join("; ")
        : typeof errorData.message === "string" && errorData.message
          ? errorData.message
          : response.status === 403
            ? "Only a super admin can change players"
            : `${fallbackMessage} (Status: ${response.status})`;

    return NextResponse.json(
      { success: false, message, ...(errors.length > 0 ? { errors } : {}) },
      { status: response.status || 500 },
    );
  }

  const body = await handleExternalApiResponse<{
    data?: T;
    message?: string;
  }>(response);

  const data = (
    body && typeof body === "object" && "data" in body ? body.data : body
  ) as T;
  const message =
    body && typeof body === "object" && typeof body.message === "string"
      ? body.message
      : undefined;

  return successResponse(data, {
    // Keep the backend's status (201 on create).
    status: response.status || 200,
    ...(message ? { message } : {}),
  });
}

/** Copy only the listed keys, and only when the client actually sent them. */
export function pickDefined(
  source: Record<string, unknown>,
  keys: readonly string[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export function serverError(error: unknown, fallback: string) {
  if (error instanceof NextResponse) return error;
  console.error(`${fallback}:`, error);
  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : fallback,
    },
    { status: 500 },
  );
}

/** Fields a client may send on create / update. */
export const PLAYER_WRITE_FIELDS = [
  "tournamentId",
  "playerName",
  "playerAbbreviation",
  "playerCode",
  "seasonYear",
  "playerImage",
  "description",
] as const;
