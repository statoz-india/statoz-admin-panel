import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

/**
 * Forward a request to the backend admin game-result API and normalize the
 * result into
 * this app's `{ success, data, message }` envelope. Unwraps the backend's own
 * `{ data }` wrapper and propagates backend error messages + status codes.
 */
export async function proxyGames<T>(
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
      errorData = { message: errorText || fallbackMessage };
    }
    // Validation failures list every problem in `data.errors`; conflicts put
    // a single `data.error` inside `data` rather than at the top level.
    const nested = errorData.data as Record<string, unknown> | null | undefined;
    const nestedErrors =
      nested && Array.isArray(nested.errors)
        ? nested.errors.filter((e): e is string => typeof e === "string")
        : [];
    const message =
      nestedErrors.length > 0
        ? nestedErrors.join("; ")
        : nested && typeof nested.error === "string"
          ? nested.error
          : typeof errorData.error === "string"
            ? errorData.error
            : typeof errorData.message === "string"
              ? errorData.message
              : `${fallbackMessage} (Status: ${response.status})`;
    // Ids the admin needs to act on (e.g. a game order that left one out), so
    // the UI can name them.
    const details: Record<string, unknown> = {};
    for (const key of ["missingIds", "unknownIds", "invalidIds", "duplicateIds"]) {
      if (nested && Array.isArray(nested[key])) details[key] = nested[key];
    }

    return NextResponse.json(
      { success: false, message, ...details },
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
    status: 200,
    ...(message ? { message } : {}),
  });
}
