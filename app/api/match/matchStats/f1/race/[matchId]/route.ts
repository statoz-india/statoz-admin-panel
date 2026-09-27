// GET /api/match/matchStats/f1/race/:matchId -> backend GET /match/matchStats/f1/race/:matchId
// `:matchId` is the race's Mongo `_id` or its readable id (e.g. F1-R3).
// 404 `F1 race stats not found` means the race exists but was never fetched.

import type { F1RaceStats } from "@/app/models/f1-race-stats.model";
import {
  badRequest,
  proxyMotorsport,
  serverError,
} from "../../../../motorsport/proxy";

type RouteContext = {
  params: Promise<{ matchId: string }> | { matchId: string };
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { matchId } = await Promise.resolve(context.params);
    const trimmed = matchId?.trim();
    if (!trimmed) return badRequest("matchId is required");

    return await proxyMotorsport<F1RaceStats>(
      `/match/matchStats/f1/race/${encodeURIComponent(trimmed)}`,
      { method: "GET", signal: AbortSignal.timeout(15_000) },
      "Failed to fetch F1 race stats",
    );
  } catch (error) {
    return serverError(error, "Failed to fetch F1 race stats");
  }
}
