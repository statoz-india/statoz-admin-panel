// POST /api/match/matchStats/f1/race -> backend POST /match/matchStats/f1/race  (super admins only)
// Pulls the race from the live-score service (ESPN) and saves it; re-fetching
// overwrites that race's row.

import { NextResponse } from "next/server";
import type {
  F1RaceStats,
  FetchF1RaceStatsPayload,
} from "@/app/models/f1-race-stats.model";
import {
  badRequest,
  proxyMotorsport,
  serverError,
} from "../../../motorsport/proxy";

const YEAR_RE = /^\d{4}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Request body must be a JSON object");
    }

    const { matchId, name, year } = body as Record<string, unknown>;
    const trimmedId = typeof matchId === "string" ? matchId.trim() : "";
    if (!trimmedId) return badRequest("matchId is required");

    // Blank name/year are left out so the backend falls back to the race's own.
    const payload: FetchF1RaceStatsPayload = { matchId: trimmedId };
    if (typeof name === "string" && name.trim()) payload.name = name.trim();
    const yearText =
      typeof year === "number"
        ? String(year)
        : typeof year === "string"
          ? year.trim()
          : "";
    if (yearText) {
      if (!YEAR_RE.test(yearText))
        return badRequest("Year must be four digits");
      payload.year = yearText;
    }

    // The backend waits up to 45 s for the live-score service.
    return await proxyMotorsport<F1RaceStats>(
      "/match/matchStats/f1/race",
      {
        method: "POST",
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60_000),
      },
      "Failed to fetch F1 race stats",
    );
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "F1 race stats request timed out, try again",
        },
        { status: 504 },
      );
    }
    return serverError(error, "Failed to fetch F1 race stats");
  }
}
