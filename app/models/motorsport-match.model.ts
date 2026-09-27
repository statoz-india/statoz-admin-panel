import type { Paginated } from "@/app/interface/pagination.interface";

/** Exact capitalization matters — the backend rejects anything else. */
export const MOTORSPORT_MATCH_STATUSES = [
  "Upcoming",
  "Ongoing",
  "Finished",
  "Cancelled",
] as const;

export type MotorsportMatchStatus = (typeof MOTORSPORT_MATCH_STATUSES)[number];

/** A document from the backend `MotorSportMatch` collection (racing fixtures). */
export interface MotorsportMatch {
  _id: string;
  /** Server-generated, e.g. `F1-R3`. Never sent by the client; can't be changed. */
  matchId: string;
  name: string;
  /** The tournament's canonical code (e.g. `F1`), not the name typed on create. */
  tournament: string;
  tournamentId?: string;
  seasonYear: string;
  /** Always `racing` for these — not exposed as a choice. */
  gameType?: string;
  matchStatus: MotorsportMatchStatus;
  tag?: string | null;
  description?: string | null;
  summary?: string | null;
  isVisible: boolean;
  /** The span of the whole race weekend. */
  raceEventStartDate?: string | null;
  raceEventStopDate?: string | null;
  /** When the race itself starts; the list is ordered by it. */
  raceStartTime?: string | null;
  createdBy?: {
    _id: string;
    username?: string;
    email?: string;
    userType?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedMotorsportMatches = Paginated<MotorsportMatch>;

/** Page size the admin races table asks for (backend default 20, max 100). */
export const MOTORSPORT_MATCHES_PAGE_SIZE = 20;

/** Body for `POST /match/motorsport`. `gameType` is omitted — it defaults to `racing`. */
export interface CreateMotorsportMatchPayload {
  name: string;
  /** Code, name or `_id`; the form uses the code from a dropdown. */
  tournament: string;
  seasonYear: string;
  matchStatus?: MotorsportMatchStatus;
  tag?: string;
  description?: string;
  summary?: string;
  isVisible?: boolean;
  raceEventStartDate?: string;
  raceEventStopDate?: string;
  raceStartTime?: string;
}

/**
 * Body for `PATCH /match/motorsport/:id`: only the fields being changed, at
 * least one. `null` clears `tag` / `description` / `summary`.
 */
export interface UpdateMotorsportMatchPayload {
  name?: string;
  tournament?: string;
  seasonYear?: string;
  matchStatus?: MotorsportMatchStatus;
  tag?: string | null;
  description?: string | null;
  summary?: string | null;
  isVisible?: boolean;
  raceEventStartDate?: string;
  raceEventStopDate?: string;
  raceStartTime?: string;
}
