// GET  /api/match/motorsport -> backend GET  /match/motorsport  (paginated; hidden races included unless isVisible is passed)
// POST /api/match/motorsport -> backend POST /match/motorsport  (super admins only)

import type {
  MotorsportMatch,
  PaginatedMotorsportMatches,
} from "@/app/models/motorsport-match.model";
import {
  badRequest,
  MOTORSPORT_WRITE_FIELDS,
  pickDefined,
  proxyMotorsport,
  serverError,
} from "./proxy";

const LIST_FILTERS = [
  "tournament",
  "seasonYear",
  "tag",
  "matchStatus",
  "isVisible",
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

    return await proxyMotorsport<PaginatedMotorsportMatches>(
      `/match/motorsport${query ? `?${query}` : ""}`,
      { method: "GET" },
      "Failed to fetch motorsport matches",
    );
  } catch (error) {
    return serverError(error, "Failed to fetch motorsport matches");
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
      MOTORSPORT_WRITE_FIELDS,
    );

    return await proxyMotorsport<MotorsportMatch>(
      "/match/motorsport",
      { method: "POST", body: JSON.stringify(payload) },
      "Failed to create motorsport match",
    );
  } catch (error) {
    return serverError(error, "Failed to create motorsport match");
  }
}
