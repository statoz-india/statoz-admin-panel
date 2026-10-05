// GET /api/contact-us -> backend GET /contact-us (super admins only)
//
// Messages users sent from the app's Contact Us form, newest first. Only
// `page`, `limit` and `contactIssue` are forwarded.

import { NextRequest, NextResponse } from "next/server";
import type { PaginatedContactUs } from "@/app/interface/contact-us.interface";
import {
  authenticatedFetch,
  errorResponse,
  extractBackendErrorMessage,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

const FORWARDED_PARAMS = ["page", "limit", "contactIssue"];

export async function GET(request: NextRequest) {
  try {
    const sp = new URLSearchParams();
    for (const key of FORWARDED_PARAMS) {
      const value = request.nextUrl.searchParams.get(key);
      if (value) sp.set(key, value);
    }
    const query = sp.toString();

    const response = await authenticatedFetch(
      `/contact-us${query ? `?${query}` : ""}`,
      { method: "GET" },
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      return NextResponse.json(
        {
          success: false,
          message: extractBackendErrorMessage(
            errorData,
            `Failed to fetch Contact Us messages (Status: ${response.status})`,
          ),
        },
        { status: response.status },
      );
    }

    const body = await handleExternalApiResponse<{ data: PaginatedContactUs }>(
      response,
    );
    return successResponse(body.data);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching Contact Us messages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch Contact Us messages" },
      { status: 500 },
    );
  }
}
