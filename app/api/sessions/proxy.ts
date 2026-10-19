import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractBackendErrorMessage,
  successResponse,
} from "../utils/api-helper";

/**
 * Forward a request to the backend's session endpoints (under
 * `/authorization`) and normalize the result into this app's
 * `{ success, data, message }` envelope. Other errors keep their status, so a
 * 403 reads as "no access" rather than as a login problem.
 */
export async function proxySessions<T>(
  endpoint: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<NextResponse> {
  const response = await authenticatedFetch(`/authorization${endpoint}`, init);

  if (response.status === 401 || response.status === 498) {
    return await errorResponse("Session expired. Please log in again.");
  }

  const text = await response.text();
  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = text ? JSON.parse(text) : {};
    if (parsed && typeof parsed === "object") {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    // Not JSON (a proxy's error page): fall back to the generic message.
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        success: false,
        message: extractBackendErrorMessage(
          body,
          `${fallbackMessage} (Status: ${response.status})`,
        ),
      },
      { status: response.status || 500 },
    );
  }

  const message = typeof body.message === "string" ? body.message : undefined;
  return successResponse(body.data as T, message ? { message } : {});
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export function serverError(error: unknown, fallback: string) {
  if (error instanceof NextResponse) return error;
  console.error(`${fallback}:`, error);
  return NextResponse.json({ success: false, message: fallback }, { status: 500 });
}
