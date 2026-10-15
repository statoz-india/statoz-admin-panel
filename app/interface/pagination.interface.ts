import type { User } from "@/app/store/authStore";
import type { Tournament } from "@/app/models/tournament.model";
import type { Event } from "@/app/models/events.model";

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

export type PaginatedTournaments = Paginated<Tournament>;

/** Page size the backend uses for the admin tournament search. */
export const TOURNAMENTS_PAGE_SIZE = 50;

export type PaginatedEvents = Paginated<Event>;

/** Default page size for the admin events list. */
export const EVENTS_PAGE_SIZE = 20;
