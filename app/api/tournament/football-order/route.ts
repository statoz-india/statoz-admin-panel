import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { Tournament } from "@/app/models/tournament.model";

type OrderBackendResponse = {
  statusCode: number;
  data: Tournament[];
  message: string;
  success?: boolean;
};

/**
 * The backend reports validation failures as `data: { error, missingIds… }`
 * inside the standard wrapper, so the detail lives one level below `message`.
 */
function readBackendError(errorData: Record<string, unknown>, fallback: string) {
  const nested =
    errorData.data &&
    typeof errorData.data === "object" &&
    errorData.data !== null
      ? (errorData.data as Record<string, unknown>)
      : undefined;

  const message =
    (typeof nested?.error === "string" && nested.error) ||
    (typeof errorData.error === "string" && errorData.error) ||
    (typeof errorData.message === "string" && errorData.message) ||
    fallback;

  // Ids the admin needs to act on — surfaced so the UI can say which ones.
  const details: Record<string, unknown> = {};
  for (const key of ["missingIds", "unknownIds", "invalidIds", "duplicateIds"]) {
    if (nested && Array.isArray(nested[key])) details[key] = nested[key];
  }

  return { message, details };
}

async function forwardOrder(
  method: "POST" | "PUT",
  payload: unknown,
  fallback: string,
  successMessage: string,
) {
  const response = await authenticatedFetch("/tournament/football-order", {
    method,
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    return await errorResponse();
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorData: Record<string, unknown>;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText || fallback };
    }

    const { message, details } = readBackendError(errorData, fallback);

    return NextResponse.json(
      { success: false, message, ...details },
      { status: response.status || 500 },
    );
  }

  const backendResponse =
    await handleExternalApiResponse<OrderBackendResponse>(response);

  return successResponse(
    Array.isArray(backendResponse?.data) ? backendResponse.data : [],
    {
      status: 200,
      message:
        typeof backendResponse?.message === "string"
          ? backendResponse.message
          : successMessage,
    },
  );
}

/** Set the complete football tournament order. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tournamentIds = body?.tournamentIds;

    if (
      !Array.isArray(tournamentIds) ||
      tournamentIds.length === 0 ||
      tournamentIds.some((id: unknown) => typeof id !== "string" || !id.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "tournamentIds must be a non-empty array of tournament ids",
        },
        { status: 400 },
      );
    }

    return await forwardOrder(
      "POST",
      { tournamentIds: tournamentIds.map((id: string) => id.trim()) },
      "Failed to set tournament order",
      "Tournament order set successfully",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error setting football tournament order:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to set tournament order",
      },
      { status: 500 },
    );
  }
}

/** Move one or more football tournaments without resending the whole list. */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const orders = body?.orders;

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "orders must be a non-empty array of { tournamentId, position } entries",
        },
        { status: 400 },
      );
    }

    const payload = orders.map((entry: unknown) => {
      const item = (entry ?? {}) as {
        tournamentId?: unknown;
        position?: unknown;
      };
      return {
        tournamentId: String(item.tournamentId ?? "").trim(),
        position: Number(item.position),
      };
    });

    const invalid = payload.find(
      (item) =>
        !item.tournamentId ||
        !Number.isInteger(item.position) ||
        item.position < 1,
    );

    if (invalid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Each entry needs a tournamentId and a position (integer from 1)",
        },
        { status: 400 },
      );
    }

    return await forwardOrder(
      "PUT",
      { orders: payload },
      "Failed to update tournament order",
      "Tournament order updated successfully",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating football tournament order:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update tournament order",
      },
      { status: 500 },
    );
  }
}
