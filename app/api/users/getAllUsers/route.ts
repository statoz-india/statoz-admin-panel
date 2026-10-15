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

type BackendBody =
  | User[]
  | PaginatedUsers
  | { data: User[] | PaginatedUsers };

function isPaginated(value: unknown): value is PaginatedUsers {
  return (
    !!value &&
    typeof value === "object" &&
    Array.isArray((value as PaginatedUsers).items)
  );
}

/** Normalize the backend response into a consistent paginated shape. */
function normalize(body: BackendBody, page: number): PaginatedUsers {
  // Unwrap one level of envelope (`{ data: ... }`) if present.
  const inner =
    body && typeof body === "object" && "data" in body
      ? (body as { data: User[] | PaginatedUsers }).data
      : body;

  if (isPaginated(inner)) return inner;

  // Legacy: backend returned a bare array of users.
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get("page"));
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const response = await authenticatedFetch(
      `/user/getAllUsers?page=${page}`,
    );
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }
    const body = await handleExternalApiResponse<BackendBody>(response);
    return successResponse(normalize(body, page), { status: 200 });
  } catch (error) {
    // If error is a NextResponse (from authenticatedFetch), return it
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 },
    );
  }
}
