import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

type BackendResponse<T> = {
  statusCode: number;
  data: T;
  message?: string;
  success?: boolean;
};

/**
 * Proxies one of the backend's `/user/<endpoint>/:userId` admin activity
 * endpoints, unwrapping the backend envelope into the panel's own.
 */
export async function proxyUserActivity<T>(
  context: RouteContext,
  endpoint: string,
  label: string,
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(`/user/${endpoint}/${id}`);
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const data = await handleExternalApiResponse<BackendResponse<T>>(response);

    return successResponse(data.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error(`Error fetching ${label} for admin:`, error);
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
