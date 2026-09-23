import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { GameSection } from "@/app/interface/game-catalog.interface";
import type {
  TrendingGamePutEntry,
  TrendingGameRecord,
} from "@/app/models/trending-games.model";

type TrendingGamesGetBackendResponse = {
  statusCode: number;
  data: GameSection[] | null;
  message: string;
  success: boolean;
};

type TrendingGamesPutBackendResponse = {
  statusCode: number;
  data: { items: TrendingGameRecord[] } | null;
  message: string;
  success: boolean;
};

/**
 * Fetches the curated trending games, grouped by sport — same shape as
 * `GET /api/statoz-games/games`, just scoped to the curated set. Every sport
 * always appears, even with an empty `games: []`. A curated game that was
 * since deleted is silently dropped rather than returned broken.
 */
export async function GET() {
  try {
    const response = await authenticatedFetch("/trending/games");

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const backendResponse =
      await handleExternalApiResponse<TrendingGamesGetBackendResponse>(
        response,
      );

    return successResponse<GameSection[]>(
      Array.isArray(backendResponse?.data) ? backendResponse.data : [],
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching trending games:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch trending games",
      },
      { status: 500 },
    );
  }
}

/** Replaces the whole trending games list — array position becomes display order. */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const rawEntries = body?.trendingGames;

    if (!Array.isArray(rawEntries) || rawEntries.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "trendingGames must be a non-empty array",
        },
        { status: 400 },
      );
    }

    const trendingGames: TrendingGamePutEntry[] = [];
    for (let index = 0; index < rawEntries.length; index += 1) {
      const entry = (rawEntries[index] ?? {}) as { game?: unknown };
      if (typeof entry.game !== "string" || !entry.game.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `trendingGames[${index}] needs a valid game id`,
          },
          { status: 400 },
        );
      }
      trendingGames.push({ game: entry.game.trim() });
    }

    const response = await authenticatedFetch("/trending/games", {
      method: "PUT",
      body: JSON.stringify({ trendingGames }),
    });

    if (response.status === 401) {
      return await errorResponse();
    }

    if (response.status === 403) {
      return NextResponse.json(
        {
          success: false,
          message: "Only a super admin can update the trending games list",
        },
        { status: 403 },
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = {
          message: errorText || "Failed to update trending games",
        };
      }

      const message =
        typeof errorData.message === "string"
          ? errorData.message
          : "Failed to update trending games";

      return NextResponse.json(
        { success: false, message },
        { status: response.status || 500 },
      );
    }

    // PUT confirms the raw stored records (unaggregated) — the caller
    // refetches via GET to display them grouped by sport.
    const backendResponse =
      await handleExternalApiResponse<TrendingGamesPutBackendResponse>(
        response,
      );

    return successResponse<{ items: TrendingGameRecord[] }>(
      {
        items: Array.isArray(backendResponse?.data?.items)
          ? backendResponse.data.items
          : [],
      },
      {
        status: 200,
        message:
          typeof backendResponse?.message === "string"
            ? backendResponse.message
            : "Trending games updated successfully",
      },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating trending games:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update trending games",
      },
      { status: 500 },
    );
  }
}
