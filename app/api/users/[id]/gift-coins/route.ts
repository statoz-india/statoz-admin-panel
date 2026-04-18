import { NextRequest, NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  successResponse,
} from "../../../utils/api-helper";

interface GiftCoinsBody {
  giftedcoins?: number;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as GiftCoinsBody;
    const giftedcoins = body.giftedcoins;

    if (
      typeof giftedcoins !== "number" ||
      !Number.isFinite(giftedcoins) ||
      giftedcoins <= 0 ||
      !Number.isInteger(giftedcoins)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "giftedcoins must be a positive whole number",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/user/giftCoinsToUser/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftedcoins }),
      },
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
        errorData = { message: errorText || "Failed to gift coins" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to gift coins (Status: ${response.status})`;

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status || 500 },
      );
    }

    const text = await response.text();
    if (!text.trim()) {
      return successResponse({ giftedcoins }, {
        status: 200,
        message: "Coins gifted successfully",
      });
    }

    let backendResponse: { data?: unknown; message?: string };
    try {
      backendResponse = JSON.parse(text) as {
        data?: unknown;
        message?: string;
      };
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid response from server" },
        { status: 502 },
      );
    }

    return successResponse(backendResponse.data ?? backendResponse, {
      status: 200,
      message:
        typeof backendResponse.message === "string"
          ? backendResponse.message
          : "Coins gifted successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    console.error("Error gifting coins:", error);
    return NextResponse.json(
      { success: false, message: "Failed to gift coins" },
      { status: 500 },
    );
  }
}
