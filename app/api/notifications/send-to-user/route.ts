import { NextRequest, NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";

interface SendToUserNotificationBody {
  userId: string;
  title: string;
  body: string;
  type?: string;
  data?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SendToUserNotificationBody;
    const { userId, title, body: messageBody, type, data } = body;

    if (!userId || !title || !messageBody) {
      return NextResponse.json(
        {
          success: false,
          message: "userId, title and body are required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch("/notifications/send-to-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        title,
        body: messageBody,
        type: type ?? "SYSTEM_ANNOUNCEMENT",
        data: data ?? {
          screen: "home",
          entityId: "test-123",
        },
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
          message: errorText || "Failed to send notification",
        };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to send notification (Status: ${response.status})`;

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
          : "Notification sent successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    console.error("Error sending notification to user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send notification",
      },
      { status: 500 },
    );
  }
}
