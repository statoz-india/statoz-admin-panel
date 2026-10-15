// curl -X GET "http://localhost:8000/api/v1/admin-data/getUsers?searchQuery=john&page=1" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Server-side user search (by name/email). Paginated, same shape as the
// plain user list so the UI can reuse the same rendering/pagination.

import { User } from "@/app/store/authStore";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { NextResponse } from "next/server";
import {
  PaginatedUsers,
  USERS_PAGE_SIZE,
} from "@/app/interface/pagination.interface";

type BackendBody = User[] | PaginatedUsers | { data: User[] | PaginatedUsers };

function isPaginated(value: unknown): value is PaginatedUsers {
  return (
    !!value &&
    typeof value === "object" &&
    Array.isArray((value as PaginatedUsers).items)
  );
}

/** Normalize the backend response into a consistent paginated shape. */
function normalize(body: BackendBody, page: number): PaginatedUsers {
  const inner =
    body && typeof body === "object" && "data" in body
      ? (body as { data: User[] | PaginatedUsers }).data
      : body;

  if (isPaginated(inner)) return inner;

  const items = Array.isArray(inner) ? inner : [];
  return {
    items,
    page,
    limit: USERS_PAGE_SIZE,
    total: items.length,
    totalPages: items.length ? 1 : 0,
    hasMore: false,
  };
}

const EMPTY_PAGE: PaginatedUsers = {
  items: [],
  page: 1,
  limit: USERS_PAGE_SIZE,
  total: 0,
  totalPages: 0,
  hasMore: false,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get("page"));
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const searchQuery = searchParams.get("searchQuery")?.trim() ?? "";

    // No query → nothing to search; return an empty page without hitting the API.
    if (!searchQuery) {
      return successResponse(EMPTY_PAGE, { status: 200 });
    }

    const backendParams = new URLSearchParams({
      page: String(page),
      searchQuery,
    });

    const response = await authenticatedFetch(
      `/admin-data/searchUser?${backendParams.toString()}`,
    );
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    const body = await handleExternalApiResponse<BackendBody>(response);
    return successResponse(normalize(body, page), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error searching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to search users",
      },
      { status: 500 },
    );
  }
}
