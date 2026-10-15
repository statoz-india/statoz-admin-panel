// GET /api/user-cards/all?page=N -> backend GET /userCards/admin/all?page=N
// Super-admin only. Returns a page (size 50) of users with their full card
// inventory, current deck, and all decks.

import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import type { Paginated } from "@/app/interface/pagination.interface";
import {
  AdminUserCards,
  USER_CARDS_PAGE_SIZE,
} from "@/app/interface/userCards.interface";

type BackendBody =
  | Paginated<AdminUserCards>
  | { data: Paginated<AdminUserCards> };

function isPaginated(value: unknown): value is Paginated<AdminUserCards> {
  return (
    !!value &&
    typeof value === "object" &&
    Array.isArray((value as Paginated<AdminUserCards>).items)
  );
}

/** Unwrap one optional `{ data }` envelope and coerce into a paginated shape. */
function normalize(body: BackendBody, page: number): Paginated<AdminUserCards> {
  const inner =
    body && typeof body === "object" && "data" in body
      ? (body as { data: Paginated<AdminUserCards> }).data
      : body;

  if (isPaginated(inner)) return inner;

  const items = Array.isArray(inner) ? inner : [];
  return {
    items,
    page,
    limit: USER_CARDS_PAGE_SIZE,
    total: items.length,
    totalPages: items.length ? 1 : 0,
    hasMore: false,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get("page"));
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const response = await authenticatedFetch(
      `/user-cards/admin/all?page=${page}`,
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
        errorData = { message: errorText || "Failed to fetch user cards" };
      }
      const message =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : `Failed to fetch user cards (Status: ${response.status})`;
      return NextResponse.json(
        { success: false, message },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<BackendBody>(response);
    return successResponse(normalize(body, page), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching user cards:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user cards" },
      { status: 500 },
    );
  }
}
