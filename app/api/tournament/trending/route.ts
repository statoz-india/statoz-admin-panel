// GET /api/tournament/trending -> backend GET /tournament/trending
// PUT /api/tournament/trending -> backend PUT /tournament/trending (super admins only)
//
// GET is what the app calls too: every sport, each with its trending
// tournaments in display order and their teams. PUT replaces the whole list
// (`[]` clears it); a 400 changes nothing and its `errors` are passed through,
// each naming a position in the list that was sent.

import { NextResponse } from "next/server";
import type {
  TrendingTournamentPutEntry,
  TrendingTournamentRecord,
  TrendingTournamentSection,
} from "@/app/models/trending-tournaments.model";
import {
  authenticatedFetch,
  errorResponse,
  extractBackendErrorMessage,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

/** Turns a failed backend response into this app's error envelope, keeping `errors`. */
async function backendError(
  response: Response,
  fallback: string,
): Promise<NextResponse> {
  if (response.status === 401 || response.status === 498) {
    return await errorResponse("Session expired. Please log in again.");
  }

  const errorText = await response.text();
  let errorData: Record<string, unknown>;
  try {
    errorData = JSON.parse(errorText);
  } catch {
    errorData = { message: errorText };
  }

  const errors = Array.isArray(errorData.errors)
    ? errorData.errors.filter(
        (e): e is string => typeof e === "string" && e.trim() !== "",
      )
    : [];
  const message =
    response.status === 403
      ? "Only a super admin can change trending tournaments"
      : typeof errorData.message === "string" && errorData.message
        ? errorData.message
        : extractBackendErrorMessage(
            errorData,
            `${fallback} (Status: ${response.status})`,
          );

  return NextResponse.json(
    { success: false, message, ...(errors.length > 0 ? { errors } : {}) },
    { status: response.status || 500 },
  );
}

function serverError(error: unknown, fallback: string) {
  if (error instanceof NextResponse) return error;
  console.error(`${fallback}:`, error);
  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : fallback,
    },
    { status: 500 },
  );
}

export async function GET() {
  try {
    const response = await authenticatedFetch("/tournament/trending");
    if (!response.ok) {
      return await backendError(response, "Failed to fetch trending tournaments");
    }

    const body = await handleExternalApiResponse<{
      data?: TrendingTournamentSection[] | null;
    }>(response);
    return successResponse<TrendingTournamentSection[]>(
      Array.isArray(body?.data) ? body.data : [],
    );
  } catch (error) {
    return serverError(error, "Failed to fetch trending tournaments");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEntries = (body as { trendingTournaments?: unknown } | null)
      ?.trendingTournaments;
    if (!Array.isArray(rawEntries)) {
      return NextResponse.json(
        {
          success: false,
          message: "trendingTournaments must be an array of { tournament }",
        },
        { status: 400 },
      );
    }

    // Keep only `tournament`; the backend validates the ids themselves.
    const trendingTournaments: TrendingTournamentPutEntry[] = rawEntries.map(
      (entry) => ({
        tournament: (entry as { tournament?: unknown } | null)
          ?.tournament as string,
      }),
    );

    const response = await authenticatedFetch("/tournament/trending", {
      method: "PUT",
      body: JSON.stringify({ trendingTournaments }),
    });
    if (!response.ok) {
      return await backendError(response, "Failed to save trending tournaments");
    }

    const saved = await handleExternalApiResponse<{
      data?: { items?: TrendingTournamentRecord[] } | null;
      message?: string;
    }>(response);
    return successResponse<{ items: TrendingTournamentRecord[] }>(
      {
        items: Array.isArray(saved?.data?.items) ? saved.data.items : [],
      },
      {
        message:
          typeof saved?.message === "string"
            ? saved.message
            : "Trending tournaments updated successfully",
      },
    );
  } catch (error) {
    return serverError(error, "Failed to save trending tournaments");
  }
}
