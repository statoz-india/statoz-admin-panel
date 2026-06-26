import type { User } from "@/app/store/authStore";

/** Generic paginated payload returned by list endpoints. */
export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export type PaginatedUsers = Paginated<User>;

/** Page size the backend uses for the admin users list. */
export const USERS_PAGE_SIZE = 50;
