import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractArray,
  successResponse,
} from "./api-helper";

/**
 * Shared handler for the backend's match-scoped list endpoints
 * (`/quiz/matchQuizzes/:matchId`, `/prediction/matchPredictions/:matchId`,
 * `/events/matchEvents/:matchId`).
 *
 * Those endpoints answer 404 both for “this match has none of that type yet”
 * (`data: []`) and for “no such match” (`data: null`). Collapse the first into
 * an empty 200 so callers only ever handle real errors.
 *
 * `matchId` may be the match's Mongo `_id` or its external match id string —
 * the backend resolves either.
 */
export async function matchScopedListResponse<T>(
  matchId: string | undefined,
  buildEndpoint: (encodedMatchId: string) => string,
  label: string,
): Promise<NextResponse> {
  const trimmedMatchId = matchId?.trim();

  if (!trimmedMatchId) {
    return NextResponse.json(
      { success: false, message: "Match id is required" },
      { status: 400 },
    );
  }

  try {
    const response = await authenticatedFetch(
      buildEndpoint(encodeURIComponent(trimmedMatchId)),
    );

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
      // `data: []` → the match resolved, it just has no `label` yet.
      if (Array.isArray(payload.data)) {
        return successResponse<T[]>([], { status: 200, message });
      }
      return NextResponse.json(
        { success: false, message: message ?? "Match not found" },
        { status: 404 },
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
