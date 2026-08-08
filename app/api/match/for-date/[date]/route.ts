import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractArray,
  successResponse,
} from "../../../utils/api-helper";
import { MATCH_DAY_PATTERN, isRealMatchDay } from "@/app/utils/matchDay";
import type { MatchData } from "../../route";

/**
 * One calendar day of matches, all tournaments and team sports together, sorted
 * by `matchStartTime` ascending.
 *
 * The day boundary is the backend's `SCORE_TIMEZONE` (IST), not UTC — build the
 * `:date` string with `toMatchDay` in `app/utils/matchDay.ts`.
 *
 * Racing lives in a separate collection and never appears here, and matches
 * with no `matchStartTime` belong to no day at all.
 */
export type MatchForDate = MatchData & {
  gameType?: string;
  /** Cached live-score snapshot; null until the sync service has resolved it. */
  matchEvent?: Record<string, unknown> | null;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ date: string }> | { date: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const date = params.date?.trim() ?? "";

    if (!MATCH_DAY_PATTERN.test(date)) {
      return NextResponse.json(
        { success: false, message: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 },
      );
    }

    // The backend's check is shape-only, so a calendar-invalid date would come
    // back as an empty day. Reject it here so bad input reads as bad input.
    if (!isRealMatchDay(date)) {
      return NextResponse.json(
        { success: false, message: `${date} is not a real calendar date` },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(`/match/matchesForDate/${date}`);

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

    // A day with no fixtures is normal, and the backend signals it with a 404.
    if (response.status === 404) {
      return successResponse<MatchForDate[]>([], { status: 200, message });
    }

    if (!response.ok) {
      console.error(
        `Backend error fetching matches for ${date} (${response.status}):`,
        text?.slice(0, 200),
      );
      return NextResponse.json(
        { success: false, message: message ?? "Failed to fetch matches" },
        { status: response.status || 500 },
      );
    }

    return successResponse<MatchForDate[]>(extractArray<MatchForDate>(payload), {
      status: 200,
      message,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching matches for date:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch matches",
      },
      { status: 500 },
    );
  }
}
