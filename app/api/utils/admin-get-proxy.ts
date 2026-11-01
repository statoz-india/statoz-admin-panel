import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  extractBackendErrorMessage,
  successResponse,
} from "./api-helper";

/**
 * GET proxy for backend admin lists that take query filters (the coin/XP
 * trackers, settlement failures). Forwards only `queryKeys` from the panel's
 * request, unwraps `data`, and keeps the backend's status and message on
 * failure: a bad filter is a 400 saying which value was wrong, a
 * non-superadmin token a 403.
 */
export async function proxyAdminGet<T>(
  endpoint: string,
  searchParams: URLSearchParams,
  queryKeys: readonly string[],
  label: string,
): Promise<NextResponse> {
  try {
    const query = new URLSearchParams();
    for (const key of queryKeys) {
      const value = searchParams.get(key)?.trim();
      if (value) query.set(key, value);
    }
    const qs = query.toString();

    const response = await authenticatedFetch(qs ? `${endpoint}?${qs}` : endpoint);
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const text = await response.text();
    let payload: Record<string, unknown> = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = {};
    }

    if (!response.ok) {
      console.error(
        `Backend error fetching ${label} (${response.status}):`,
        text.slice(0, 200),
      );
      return NextResponse.json(
        {
          success: false,
          message: extractBackendErrorMessage(payload, `Failed to fetch ${label}`),
        },
        { status: response.status },
      );
    }

    return successResponse<T>(payload.data as T, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error(`Error fetching ${label}:`, error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error && error.message
            ? error.message
            : `Failed to fetch ${label}`,
      },
      { status: 500 },
    );
  }
}
