// Shared GET/PUT proxy for the curated trending lists
// (`/trending/tournaments`, `/trending/teams`). GET returns the list in display
// order; PUT replaces the whole list and needs at least one entry. A 400 names
// the bad entry by its position in the list that was sent, so its `message`
// (and `errors`, when present) are passed through untouched.

import { NextResponse } from "next/server";
import type { CuratedTrendingRecord } from "@/app/models/trending-curated.model";
import {
  authenticatedFetch,
  errorResponse,
  extractBackendErrorMessage,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

type Options = {
  /** Backend path, e.g. `/trending/teams`. */
  backendPath: string;
  /** Body key of the PUT, e.g. `trendingTeams`. */
  listKey: string;
  /** Key of the id in each entry, e.g. `team`. */
  idKey: string;
  /** Plural noun for messages, e.g. `trending teams`. */
  label: string;
};

async function backendError(
  response: Response,
  label: string,
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
      ? `Only a super admin can change ${label}`
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

export function curatedTrendingListHandlers<T>({
  backendPath,
  listKey,
  idKey,
  label,
}: Options) {
  async function GET() {
    const fallback = `Failed to fetch ${label}`;
    try {
      const response = await authenticatedFetch(backendPath);
      if (!response.ok) {
        return await backendError(response, label, fallback);
      }

      const body = await handleExternalApiResponse<{ data?: T[] | null }>(
        response,
      );
      return successResponse<T[]>(Array.isArray(body?.data) ? body.data : []);
    } catch (error) {
      return serverError(error, fallback);
    }
  }

  async function PUT(request: Request) {
    const fallback = `Failed to save ${label}`;
    try {
      const body = await request.json().catch(() => null);
      const rawEntries = (body as Record<string, unknown> | null)?.[listKey];
      if (!Array.isArray(rawEntries) || rawEntries.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: `${listKey} must be a non-empty array of { ${idKey} }`,
          },
          { status: 400 },
        );
      }

      // Keep only the id; the backend validates the ids themselves.
      const entries = rawEntries.map((entry) => ({
        [idKey]: (entry as Record<string, unknown> | null)?.[idKey],
      }));

      const payload = { [listKey]: entries };
      console.log(
        `[${backendPath}] PUT body:`,
        JSON.stringify(payload, null, 2),
      );

      const response = await authenticatedFetch(backendPath, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        return await backendError(response, label, fallback);
      }

      const saved = await handleExternalApiResponse<{
        data?: { items?: CuratedTrendingRecord[] } | null;
        message?: string;
      }>(response);
      return successResponse<{ items: CuratedTrendingRecord[] }>(
        { items: Array.isArray(saved?.data?.items) ? saved.data.items : [] },
        {
          message:
            typeof saved?.message === "string"
              ? saved.message
              : `${label} updated successfully`,
        },
      );
    } catch (error) {
      return serverError(error, fallback);
    }
  }

  return { GET, PUT };
}
