// POST /api/match/matchStats → backend POST /match/matchStats

import { NextResponse } from "next/server";
import type {
  FetchMatchStatsPayload,
  MatchStatsDocument,
} from "@/app/interface/match-stats.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<FetchMatchStatsPayload>;

    const matchUniqueId = String(body.matchUniqueId ?? "").trim();
    const matchId = String(body.matchId ?? "").trim();
    const espnId = String(body.espnId ?? "").trim();

    if (!matchUniqueId || !matchId || !espnId) {
      return NextResponse.json(
        {
          success: false,
          message: "matchUniqueId, matchId and espnId are required",
        },
        { status: 400 },
      );
    }

    if (!OBJECT_ID_RE.test(matchId)) {
      return NextResponse.json(
        {
          success: false,
          message: "matchId must be a valid ObjectId",
        },
        { status: 400 },
      );
    }

    const payload: FetchMatchStatsPayload = {
      matchUniqueId,
      matchId,
      espnId,
    };

    // Summary microservice can take up to ~45s — do not abort early.
    const response = await authenticatedFetch("/match/matchStats", {
      method: "POST",
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown> = {};
      try {
        errorData = JSON.parse(errorText) as Record<string, unknown>;
      } catch {
        errorData = { message: errorText };
      }

      const nested =
        errorData.data && typeof errorData.data === "object"
          ? (errorData.data as Record<string, unknown>)
          : null;
      const message =
        (typeof nested?.error === "string" && nested.error) ||
        (typeof errorData.error === "string" && errorData.error) ||
        (typeof errorData.message === "string" && errorData.message) ||
        `Failed to fetch match stats (Status: ${response.status})`;

      return NextResponse.json(
        { success: false, message },
        { status: response.status || 500 },
      );
    }

    const body_ = await handleExternalApiResponse<{
      data?: MatchStatsDocument;
      message?: string;
    }>(response);

    const data =
      body_ && typeof body_ === "object" && "data" in body_
        ? body_.data
        : (body_ as MatchStatsDocument);

    return successResponse(data, {
      status: 200,
      message:
        (body_ && typeof body_ === "object" && typeof body_.message === "string"
          ? body_.message
          : undefined) ?? "Match stats fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    console.error("Error fetching match stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: timedOut
          ? "Match stats request timed out — try again"
          : error instanceof Error
            ? error.message
            : "Failed to fetch match stats",
      },
      { status: timedOut ? 504 : 500 },
    );
  }
}
