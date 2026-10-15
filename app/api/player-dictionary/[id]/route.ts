// GET    /api/players/:id -> backend GET    /players/:id
// PATCH  /api/players/:id -> backend PATCH  /players/:id  (super admins only, partial)
// DELETE /api/players/:id -> backend DELETE /players/:id  (super admins only, permanent)

import type { Player } from "@/app/models/player.model";
import {
  badRequest,
  PLAYER_WRITE_FIELDS,
  pickDefined,
  proxyPlayers,
  serverError,
} from "../proxy";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

async function endpointFor(context: RouteContext): Promise<string | null> {
  const { id } = await Promise.resolve(context.params);
  const trimmed = id?.trim();
  return trimmed ? `/player-dictionary/${encodeURIComponent(trimmed)}` : null;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const endpoint = await endpointFor(context);
    if (!endpoint) return badRequest("Player id is required");

    return await proxyPlayers<Player>(
      endpoint,
      { method: "GET" },
      "Failed to fetch player",
    );
  } catch (error) {
    return serverError(error, "Failed to fetch player");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const endpoint = await endpointFor(context);
    if (!endpoint) return badRequest("Player id is required");

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Request body must be a JSON object");
    }

    // Partial update: forward only what was sent. `null` / `""` clears the
    // description and `[]` clears images, so those values must survive.
    const payload = pickDefined(
      body as Record<string, unknown>,
      PLAYER_WRITE_FIELDS,
    );

    return await proxyPlayers<Player>(
      endpoint,
      { method: "PATCH", body: JSON.stringify(payload) },
      "Failed to update player",
    );
  } catch (error) {
    return serverError(error, "Failed to update player");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const endpoint = await endpointFor(context);
    if (!endpoint) return badRequest("Player id is required");

    return await proxyPlayers<Pick<Player, "_id" | "playerName">>(
      endpoint,
      { method: "DELETE" },
      "Failed to delete player",
    );
  } catch (error) {
    return serverError(error, "Failed to delete player");
  }
}
