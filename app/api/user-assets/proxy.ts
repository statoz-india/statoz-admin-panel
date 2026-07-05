import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";

export async function proxyUserAssetsRequest<T>(
  endpoint: string,
  init: RequestInit,
  fallbackMessage: string,
  successStatus = 200,
): Promise<NextResponse> {
  const response = await authenticatedFetch(endpoint, init);

  if (response.status === 401 || response.status === 498) {
    return await errorResponse("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorData: Record<string, unknown>;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText || fallbackMessage };
    }
    const message =
      typeof errorData.error === "string"
        ? errorData.error
        : typeof errorData.message === "string"
          ? errorData.message
          : `${fallbackMessage} (Status: ${response.status})`;
    return NextResponse.json(
      { success: false, message },
      { status: response.status || 500 },
    );
  }

  const body = await handleExternalApiResponse<{
    data?: T;
    message?: string;
  }>(response);

  const data = (
    body && typeof body === "object" && "data" in body ? body.data : body
  ) as T;
  const message =
    body && typeof body === "object" && typeof body.message === "string"
      ? body.message
      : undefined;

  return successResponse(data, {
    status: successStatus,
    ...(message ? { message } : {}),
  });
}
