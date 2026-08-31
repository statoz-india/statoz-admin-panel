import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractArray,
  successResponse,
} from "../../utils/api-helper";

/**
 * One entry of the backend's in-memory live registry: a match the 30s
 * live-score sync has seen start and not yet seen finish.
 *
 * The registry is per backend process and empties on restart, so an empty list
 * right after a deploy is normal — it refills on the next sync tick.
 */
export interface LiveRegistryMatch {
  /** Subscription key for `match_stats_updated` on the socket. */
  espnEventId: string;
  league?: string;
  gameType?: string;
  /** Our `Match._id`, or null when the live feed couldn't be resolved to one. */
  matchId?: string | null;
  wentLiveAt?: string;
}

/**
 * GET /api/match/currently-live[?gameType=cricket|football|basketball]
 *
 * Proxies the backend's `/match/live`. This is *not* `/match/liveMatches`:
 * that one lists matches flagged live in the database, this one is the poller's
 * own registry — exactly the matches statistics are being fetched for.
 */
export async function GET(request: Request) {
  try {
    const gameType = new URL(request.url).searchParams.get("gameType")?.trim();
    const endpoint = gameType
      ? `/match/live?gameType=${encodeURIComponent(gameType)}`
      : "/match/live";

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

    // Nothing live is a normal state, whichever way the backend spells it.
    if (response.status === 404) {
      return successResponse<LiveRegistryMatch[]>([], { status: 200, message });
    }

    if (!response.ok) {
      console.error(
        `Backend error fetching the live registry (${response.status}):`,
        text?.slice(0, 200),
      );
      return NextResponse.json(
        { success: false, message: message ?? "Failed to fetch live matches" },
        { status: response.status || 500 },
      );
    }

    return successResponse<LiveRegistryMatch[]>(
      extractArray<LiveRegistryMatch>(payload),
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching the live registry:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch live matches",
      },
      { status: 500 },
    );
  }
}
