import { NextRequest, NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

interface BroadcastNotificationBody {
  title: string;
  body: string;
  type?: string;
  data?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BroadcastNotificationBody;
    const { title, body: messageBody, type, data } = body;

    if (!title || !messageBody) {
      return NextResponse.json(
        {
          success: false,
          message: "title and body are required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch("/notification/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        body: messageBody,
        type: type ?? "ANNOUNCEMENT",
        ...(data && Object.keys(data).length > 0 ? { data } : {}),
      }),
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
        errorData = {
          message: errorText || "Failed to broadcast notification",
        };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to broadcast notification (Status: ${response.status})`;

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const backendResponse = await handleExternalApiResponse<{
      data?: unknown;
      message?: string;
    }>(response);

    return successResponse(backendResponse.data ?? backendResponse, {
      status: 200,
      message:
        typeof backendResponse.message === "string"
          ? backendResponse.message
          : "Broadcast sent successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    console.error("Error broadcasting notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to broadcast notification",
      },
      { status: 500 },
    );
  }
}
