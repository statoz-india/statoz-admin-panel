import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

/**
 * Forward a request to the backend app-navigation API and normalize the result
 * into this app's `{ success, data, message }` envelope. Unwraps the backend's
 * own `{ data }` wrapper and propagates backend error messages + status codes.
 */
export async function proxyAppNavigation<T>(
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
    const message =
      typeof errorData.error === "string"
        ? errorData.error
        : typeof errorData.message === "string"
          ? errorData.message
          : `${fallbackMessage} (Status: ${response.status})`;
    return NextResponse.json(
      { success: false, message },
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

/** Reject anything that is not a non-empty array of non-empty strings. */
export function parseNavList(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const items: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") return null;
    const trimmed = entry.trim();
    if (!trimmed) return null;
    items.push(trimmed);
  }
  return items;
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ success: false, message }, { status: 400 });
}
