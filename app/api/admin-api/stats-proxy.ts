import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

export async function proxyAdminStats<T>(
  endpoint: string,
  fallbackMessage: string,
): Promise<NextResponse> {
  try {
    const response = await authenticatedFetch(endpoint);
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    const body = await handleExternalApiResponse<T | { data: T }>(response);
    const data =
      body && typeof body === "object" && "data" in body
        ? (body as { data: T }).data
        : (body as T);
    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error(`${fallbackMessage}:`, error);
    return NextResponse.json(
      { success: false, message: fallbackMessage },
      { status: 500 },
    );
  }
}
