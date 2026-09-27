// GET /api/events/motorsport/race/:matchId -> backend GET /events/motorsport/race/:matchId
//
// `:matchId` is the race's Mongo `_id` or its readable id (e.g. F1-R3). Only
// racing events (`isRacingMatchEvent: true`) come back, in every status. A race
// with no events is an empty list; a missing race stays a 404.

import type { Event } from "@/app/models/events.model";
import {
  badRequest,
  proxyMotorsport,
  serverError,
} from "../../../../match/motorsport/proxy";

type RouteContext = {
  params: Promise<{ matchId: string }> | { matchId: string };
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { matchId } = await Promise.resolve(context.params);
    const trimmed = matchId?.trim();
    if (!trimmed) return badRequest("Race id is required");

    return await proxyMotorsport<Event[]>(
      `/events/motorsport/race/${encodeURIComponent(trimmed)}`,
      { method: "GET" },
      "Failed to fetch the race's events",
      { emptyListOn404: true },
    );
  } catch (error) {
    return serverError(error, "Failed to fetch the race's events");
  }
}
