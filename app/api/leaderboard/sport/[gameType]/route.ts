import { NextResponse } from "next/server";
import { authenticatedFetch, errorResponse, successResponse } from "../../../utils/api-helper";
import {
  isSportLeaderboardGameType,
  type SportLeaderboard,
} from "@/app/interface/sport-leaderboard.interface";

type RouteContext = { params: Promise<{ gameType: string }> };

/**
 * Top 25 of one sport by XP. The backend route is public; the admin's session
 * still goes along like every other panel call, and the backend ignores it.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const gameType = (await params).gameType.trim().toLowerCase();
  if (!isSportLeaderboardGameType(gameType)) {
    return NextResponse.json({ success: false, message: "Unknown sport" }, { status: 400 });
  }

  try {
    const response = await authenticatedFetch(
      `/leaderboard/public/sport/${encodeURIComponent(gameType)}`,
      { method: "GET", cache: "no-store" },
    );

    if (response.status === 401) {
      return await errorResponse();
    }
    // 429 is plain text, not JSON.
    if (response.status === 429) {
      return NextResponse.json(
        { success: false, message: "Too many requests, try again shortly" },
        { status: 429 },
      );
    }

    const text = await response.text();
    let payload: { message?: unknown; data?: unknown } = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = {};
    }

    if (!response.ok) {
      // A 400 carries its reason in `data.error`, not `message`.
      const detail = (payload.data as { error?: unknown } | undefined)?.error;
      const message =
        typeof detail === "string"
          ? detail
          : typeof payload.message === "string"
            ? payload.message
            : "Failed to fetch the sport leaderboard";
      return NextResponse.json({ success: false, message }, { status: response.status || 500 });
    }

    const data = (payload.data ?? {}) as Partial<SportLeaderboard>;
    const leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : [];
    return successResponse<SportLeaderboard>(
      {
        gameType: typeof data.gameType === "string" ? data.gameType : gameType,
        totalUsers: typeof data.totalUsers === "number" ? data.totalUsers : leaderboard.length,
        totalPlayers: typeof data.totalPlayers === "number" ? data.totalPlayers : leaderboard.length,
        leaderboard,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching sport leaderboard:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch the sport leaderboard",
      },
      { status: 500 },
    );
  }
}
