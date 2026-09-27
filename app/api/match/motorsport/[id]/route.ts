// `:id` is the race's Mongo `_id` or its `matchId` (e.g. F1-R3, case-insensitive).
// GET    /api/match/motorsport/:id -> backend GET    /match/motorsport/:id
// PATCH  /api/match/motorsport/:id -> backend PATCH  /match/motorsport/:id  (super admins only, partial)
// DELETE /api/match/motorsport/:id -> backend DELETE /match/motorsport/:id  (super admins only, hard delete)

import type { MotorsportMatch } from "@/app/models/motorsport-match.model";
import {
  badRequest,
  MOTORSPORT_WRITE_FIELDS,
  pickDefined,
  proxyMotorsport,
  serverError,
} from "../proxy";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

async function endpointFor(context: RouteContext): Promise<string | null> {
  const { id } = await Promise.resolve(context.params);
  const trimmed = id?.trim();
  return trimmed ? `/match/motorsport/${encodeURIComponent(trimmed)}` : null;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const endpoint = await endpointFor(context);
    if (!endpoint) return badRequest("Motorsport match id is required");

    return await proxyMotorsport<MotorsportMatch>(
      endpoint,
      { method: "GET" },
      "Failed to fetch motorsport match",
    );
  } catch (error) {
    return serverError(error, "Failed to fetch motorsport match");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const endpoint = await endpointFor(context);
    if (!endpoint) return badRequest("Motorsport match id is required");

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Request body must be a JSON object");
    }

    // Partial update: forward only what was sent. `null` clears tag /
    // description / summary, so it must survive (JSON drops `undefined` only).
    const payload = pickDefined(
      body as Record<string, unknown>,
      MOTORSPORT_WRITE_FIELDS,
    );

    return await proxyMotorsport<MotorsportMatch>(
      endpoint,
      { method: "PATCH", body: JSON.stringify(payload) },
      "Failed to update motorsport match",
    );
  } catch (error) {
    return serverError(error, "Failed to update motorsport match");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const endpoint = await endpointFor(context);
    if (!endpoint) return badRequest("Motorsport match id is required");

    return await proxyMotorsport<Pick<MotorsportMatch, "_id" | "matchId">>(
      endpoint,
      { method: "DELETE" },
      "Failed to delete motorsport match",
    );
  } catch (error) {
    return serverError(error, "Failed to delete motorsport match");
  }
}
