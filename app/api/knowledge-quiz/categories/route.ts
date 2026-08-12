import { NextResponse } from "next/server";
import type { KqCategoryCatalogue } from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { backendErrorMessage } from "../proxy";

const CATEGORIES_ENDPOINT = "/knowledge-quiz/categories";

export async function GET() {
  try {
    const response = await authenticatedFetch(CATEGORIES_ENDPOINT);

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          message: backendErrorMessage(
            errorText,
            `Failed to load categories (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<{
      data: KqCategoryCatalogue;
    }>(response);
    return successResponse(body.data, {
      status: 200,
      message: "Knowledge quiz categories fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching knowledge quiz categories:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to load categories",
      },
      { status: 500 },
    );
  }
}
