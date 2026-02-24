import { NextRequest, NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

interface UpdateWaitlistBody {
  emailId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateWaitlistBody;
    const { emailId } = body;

    if (!emailId || typeof emailId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "emailId is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch("/user/updateWaitlistToUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailId }),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to convert waitlist to user" };
      }
      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to convert waitlist to user (Status: ${response.status})`;
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      data?: unknown;
      message?: string;
      success?: boolean;
    }>(response);
    return successResponse(backendResponse.data ?? backendResponse, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating waitlist to user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to convert waitlist to user",
      },
      { status: 500 },
    );
  }
}
