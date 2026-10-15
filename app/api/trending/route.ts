import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import {
  isTrendingType,
  type TrendingItem,
  type TrendingListResponse,
  type TrendingPutEntry,
  type TrendingPutResponseItem,
} from "@/app/models/trending.model";

type TrendingGetBackendResponse = {
  statusCode: number;
  data: { items: TrendingItem[] } | null;
  message: string;
  success: boolean;
};

type TrendingPutBackendResponse = {
  statusCode: number;
  data: { items: TrendingPutResponseItem[] } | null;
  message: string;
  success: boolean;
};

/**
 * Fetches the curated trending list. Each item's `data` comes back through
 * the same aggregation pipeline its own homepage endpoint uses (odds
 * computed, teams populated, etc.) — not a raw `.populate()`. Items whose
 * referenced document no longer resolves are silently dropped by the backend.
 */
export async function GET() {
  try {
    const response = await authenticatedFetch("/trending/matches");

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (response.status === 404) {
      return successResponse<TrendingListResponse>(
        { items: [] },
        { status: 200 },
      );
    }

    const backendResponse =
      await handleExternalApiResponse<TrendingGetBackendResponse>(response);

    const items = Array.isArray(backendResponse?.data?.items)
      ? backendResponse.data.items
      : [];

    return successResponse<TrendingListResponse>({ items }, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching trending list:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch trending list",
      },
      { status: 500 },
    );
  }
}

/** Replaces the whole trending list — array position becomes display order. */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const rawEntries = body?.trendingMatches;

    if (!Array.isArray(rawEntries) || rawEntries.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "trendingMatches must be a non-empty array",
        },
        { status: 400 },
      );
    }

    const trendingMatches: TrendingPutEntry[] = [];
    for (let index = 0; index < rawEntries.length; index += 1) {
      const entry = (rawEntries[index] ?? {}) as {
        type?: unknown;
        data?: unknown;
      };
      if (
        !isTrendingType(entry.type) ||
        typeof entry.data !== "string" ||
        !entry.data.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `trendingMatches[${index}] needs a valid type (match, prediction, future, event, quiz) and a data id`,
          },
          { status: 400 },
        );
      }
      trendingMatches.push({ type: entry.type, data: entry.data.trim() });
    }

    const response = await authenticatedFetch("/trending/matches", {
      method: "PUT",
      body: JSON.stringify({ trendingMatches }),
    });

    if (response.status === 401) {
      return await errorResponse();
    }

    if (response.status === 403) {
      return NextResponse.json(
        {
          success: false,
          message: "Only a super admin can update the trending list",
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
        errorData = { message: errorText || "Failed to update trending list" };
      }

      const message =
        typeof errorData.message === "string"
          ? errorData.message
          : "Failed to update trending list";

      return NextResponse.json(
        { success: false, message },
        { status: response.status || 500 },
      );
    }

    // PUT confirms the raw stored records (unaggregated) — the caller
    // refetches via GET to display them fully resolved.
    const backendResponse =
      await handleExternalApiResponse<TrendingPutBackendResponse>(response);

    return successResponse<{ items: TrendingPutResponseItem[] }>(
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
            : "Trending list updated successfully",
      },
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating trending list:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update trending list",
      },
      { status: 500 },
    );
  }
}
