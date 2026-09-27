// GET  /api/players -> backend GET  /players  (paginated, sorted by name)
// POST /api/players -> backend POST /players  (super admins only)

import type { PaginatedPlayers, Player } from "@/app/models/player.model";
import {
  badRequest,
  PLAYER_WRITE_FIELDS,
  pickDefined,
  proxyPlayers,
  serverError,
} from "./proxy";

const LIST_FILTERS = [
  "tournamentId",
  "team",
  "season",
  "search",
  "page",
  "limit",
] as const;

export async function GET(request: Request) {
  try {
    const incoming = new URL(request.url).searchParams;
    const outgoing = new URLSearchParams();
    for (const key of LIST_FILTERS) {
      const value = incoming.get(key)?.trim();
      if (value) outgoing.set(key, value);
    }
    const query = outgoing.toString();

    return await proxyPlayers<PaginatedPlayers>(
      `/player-dictionary${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch players",
    );
  } catch (error) {
    return serverError(error, "Failed to fetch players");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Request body must be a JSON object");
    }

    // The backend validates and reports every problem at once.
    const payload = pickDefined(
      body as Record<string, unknown>,
      PLAYER_WRITE_FIELDS,
    );

    return await proxyPlayers<Player>(
      "/player-dictionary",
      { method: "POST", body: JSON.stringify(payload) },
      "Failed to create player",
    );
  } catch (error) {
    return serverError(error, "Failed to create player");
  }
}
