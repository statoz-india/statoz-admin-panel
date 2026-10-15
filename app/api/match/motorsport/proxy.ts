import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

/**
 * Forward a request to the backend motorsport-match API and normalize the
 * result into this app's `{ success, data, message }` envelope.
 *
 * Validation and not-found errors from these endpoints use the backend's
 * normal envelope with `success: false` and the details in `data`:
 * `{ errors: [...] }` (several problems), `{ error: "..." }` (one problem) or
 * `null` (not found). Those strings are what the admin needs to read, so they
 * are surfaced as `message` (joined) and, when several, as an `errors` array.
 *
 * `options.emptyListOn404`: list endpoints that answer "nothing found" with a
 * 404 whose `data` is an array (`data: []`) are returned as an empty list. A 404
 * without an array (e.g. the race itself is missing) stays an error.
 */
export async function proxyMotorsport<T>(
  endpoint: string,
  init: RequestInit,
  fallbackMessage: string,
  options: { emptyListOn404?: boolean } = {},
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

    if (
      options.emptyListOn404 &&
      response.status === 404 &&
      Array.isArray(errorData.data)
    ) {
      return successResponse([], { status: 200 });
    }

    const nested = errorData.data as Record<string, unknown> | null | undefined;
    // Race endpoints nest the list in `data.errors`; quiz endpoints (ApiError)
    // put it at the top level with no `data`.
    const rawErrors =
      nested && Array.isArray(nested.errors)
        ? nested.errors
        : Array.isArray(errorData.errors)
          ? errorData.errors
          : [];
    const errors = rawErrors.filter(
      (e): e is string => typeof e === "string" && e.trim() !== "",
    );

    const message =
      errors.length > 0
        ? errors.join("; ")
        : nested && typeof nested.error === "string"
          ? nested.error
          : typeof errorData.message === "string" && errorData.message
            ? errorData.message
            : response.status === 403
              ? "Only a super admin can change motorsport matches"
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

/**
 * Fields a client may send. `matchId` is server-generated and `gameType` is
 * always `racing`, so neither is forwarded.
 */
export const MOTORSPORT_WRITE_FIELDS = [
  "name",
  "tournament",
  "seasonYear",
  "matchStatus",
  "tag",
  "description",
  "summary",
  "isVisible",
  "raceEventStartDate",
  "raceEventStopDate",
  "raceStartTime",
] as const;
