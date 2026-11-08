import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  successResponse,
} from "./api-helper";
import {
  DATA_SET_BACKEND_PREFIX,
  isDataSetTab,
  type DataSetTab,
} from "@/app/interface/data-set.interface";

/** Resolves the `[tab]` param, or a 400 response when it isn't a Data Set tab. */
export async function dataSetTabFrom(
  params: Promise<{ tab: string }>,
): Promise<DataSetTab | NextResponse> {
  const { tab } = await params;
  if (isDataSetTab(tab)) return tab;
  return NextResponse.json(
    { success: false, message: `Unknown data set tab: ${tab}` },
    { status: 400 },
  );
}

export const dataSetPrefix = (tab: DataSetTab) =>
  `/${DATA_SET_BACKEND_PREFIX[tab]}`;

/**
 * Forwards a superadmin `statuses` / `byStatus` call and unwraps `data`.
 * These endpoints answer an empty list with 200, so no 404 handling is needed.
 */
export async function dataSetResponse<T>(
  endpoint: string,
  label: string,
): Promise<NextResponse> {
  try {
    const response = await authenticatedFetch(endpoint, {
      method: "GET",
      cache: "no-store",
    });

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
    const message =
      typeof payload.message === "string" ? payload.message : undefined;

    if (!response.ok) {
      // A 400 lists the valid statuses in errors[0]; a 429 is plain text.
      const errors = Array.isArray(payload.errors)
        ? payload.errors.filter((e): e is string => typeof e === "string")
        : [];
      const fallback =
        response.status === 429
          ? "Too many requests, try again shortly"
          : `Failed to fetch ${label}`;
      return NextResponse.json(
        { success: false, message: errors[0] ?? message ?? fallback, errors },
        { status: response.status || 500 },
      );
    }

    return successResponse<T>(payload.data as T, { status: 200, message });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error(`Error fetching ${label}:`, error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : `Failed to fetch ${label}`,
      },
      { status: 500 },
    );
  }
}
