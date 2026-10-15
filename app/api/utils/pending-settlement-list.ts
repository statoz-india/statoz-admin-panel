import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractArray,
  successResponse,
} from "./api-helper";

/**
 * Shared handler for the superadmin pending-settlement list endpoints
 * (`/quiz/pendingSettlementQuizzes`, `/prediction/pendingSettlementPredictions`,
 * `/events/pendingSettlementEvents`).
 *
 * Those endpoints answer 404 when nothing is pending. An empty worklist is the
 * good state, not an error, so collapse it into an empty 200 — same as
 * `matchScopedListResponse` — and callers only ever handle real failures.
 *
 * All three require a superadmin JWT; a non-superadmin token gets 403, which is
 * passed through with the backend's message so the panel can say why.
 */
export async function pendingSettlementListResponse<T>(
  endpoint: string,
  label: string,
): Promise<NextResponse> {
  try {
    const response = await authenticatedFetch(endpoint);

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const text = await response.text();
    let payload: Record<string, unknown> = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = {};
    }
    const message =
      typeof payload.message === "string" ? payload.message : undefined;

    if (response.status === 404) {
      return successResponse<T[]>([], { status: 200, message });
    }

    if (response.status === 403) {
      return NextResponse.json(
        {
          success: false,
          message: message ?? "Forbidden - SuperAdmin access required",
        },
        { status: 403 },
      );
    }

    if (!response.ok) {
      console.error(
        `Backend error fetching ${label} (${response.status}):`,
        text?.slice(0, 200),
      );
      return NextResponse.json(
        { success: false, message: message ?? `Failed to fetch ${label}` },
        { status: response.status || 500 },
      );
    }

    return successResponse<T[]>(extractArray<T>(payload), {
      status: 200,
      message,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error(`Error fetching ${label}:`, error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : `Failed to fetch ${label}`,
      },
      { status: 500 },
    );
  }
}
