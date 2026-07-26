import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../utils/api-helper";
import type {
  CreateEventPayload,
  Event,
  EventSuccessResponse,
} from "../../models/events.model";
import {
  EVENTS_PAGE_SIZE,
  type PaginatedEvents,
} from "@/app/interface/pagination.interface";

type BackendBody =
  | Event[]
  | PaginatedEvents
  | { data: Event[] | PaginatedEvents };

function isPaginated(value: unknown): value is PaginatedEvents {
  return (
    !!value &&
    typeof value === "object" &&
    Array.isArray((value as PaginatedEvents).items)
  );
}

/** Normalize whatever the backend sends into a consistent paginated shape. */
function normalize(
  body: BackendBody,
  page: number,
  limit: number,
): PaginatedEvents {
  // Unwrap one level of envelope (`{ data: ... }`) if present.
  const inner =
    body && typeof body === "object" && "data" in body
      ? (body as { data: Event[] | PaginatedEvents }).data
      : body;

  if (isPaginated(inner)) return inner;

  // Bare array (old /events shape) — synthesize a single page.
  const items = Array.isArray(inner) ? inner : [];
  return {
    items,
    page,
    limit,
    total: items.length,
    totalPages: items.length ? 1 : 0,
    hasMore: false,
  };
}

const emptyPage = (page: number, limit: number): PaginatedEvents => ({
  items: [],
  page,
  limit,
  total: 0,
  totalPages: 0,
  hasMore: false,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawPage = Number(searchParams.get("page"));
    const page =
      Number.isFinite(rawPage) && rawPage > 0 ? Math.trunc(rawPage) : 1;

    const rawLimit = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0
        ? Math.min(Math.trunc(rawLimit), 100)
        : EVENTS_PAGE_SIZE;

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const response = await authenticatedFetch(
      `/events/paginatedEvents?${params.toString()}`,
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    // paginatedEvents returns 200 + empty items, but keep this as a guard in
    // case the route ever falls back to the non-paginated /events behavior.
    if (response.status === 404) {
      return successResponse(emptyPage(page, limit), { status: 200 });
    }

    const data = await handleExternalApiResponse<BackendBody>(response);

    return successResponse(normalize(data, page, limit), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      tournament,
      eventName,
      eventDescription,
      eventImage,
      eventDescriptionImage,
      haveThreeOptions,
      yesPlaceholder,
      noPlaceholder,
      maybePlaceholder,
      entryStartTime,
      entryCloseTime,
    } = body;

    const apiPayload: CreateEventPayload = {
      tournament,
      eventName,
      eventDescription,
      eventImage,
      eventDescriptionImage,
      haveThreeOptions,
      yesPlaceholder,
      noPlaceholder,
      maybePlaceholder,
      entryStartTime,
      entryCloseTime,
    };

    const response = await authenticatedFetch("/events/createEvent", {
      method: "POST",
      body: JSON.stringify(apiPayload),
    });

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      let errorData: Record<string, unknown>;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to create event" };
      }

      const errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.msg === "string"
              ? errorData.msg
              : `Failed to create event (Status: ${response.status})`;

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: response.status || 500 },
      );
    }

    const backendResponse =
      await handleExternalApiResponse<EventSuccessResponse>(response);

    return successResponse(backendResponse.data, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create event",
      },
      { status: 500 },
    );
  }
}
