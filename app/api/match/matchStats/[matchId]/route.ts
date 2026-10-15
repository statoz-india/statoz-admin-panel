// GET /api/match/matchStats/:matchId → backend GET /match/matchStats/:matchId

import { NextResponse } from "next/server";
import type { MatchStatsDocument } from "@/app/interface/match-stats.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ matchId: string }> | { matchId: string } },
) {
  try {
    const { matchId: rawId } = await Promise.resolve(context.params);
    const matchId = String(rawId ?? "").trim();

    if (!OBJECT_ID_RE.test(matchId)) {
      return NextResponse.json(
        {
          success: false,
          message: "matchId must be a valid ObjectId",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/match/matchStats/${encodeURIComponent(matchId)}`,
      { method: "GET" },
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    // No stats document yet — treat as a clean null, not an error.
    if (response.status === 404) {
      return successResponse(null, {
        status: 200,
        message: "Match stats not found",
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown> = {};
      try {
        errorData = JSON.parse(errorText) as Record<string, unknown>;
      } catch {
        errorData = { message: errorText };
      }

      const message =
        (typeof errorData.message === "string" && errorData.message) ||
        (typeof errorData.error === "string" && errorData.error) ||
        `Failed to load match stats (Status: ${response.status})`;

      return NextResponse.json(
        { success: false, message },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<{
      data?: MatchStatsDocument | null;
      message?: string;
    }>(response);

    const data =
      body && typeof body === "object" && "data" in body
        ? (body.data ?? null)
        : (body as MatchStatsDocument | null);

    return successResponse(data, {
      status: 200,
      message:
        (body && typeof body === "object" && typeof body.message === "string"
          ? body.message
          : undefined) ?? "Match stats fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error loading match stats:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to load match stats",
      },
      { status: 500 },
    );
  }
}
