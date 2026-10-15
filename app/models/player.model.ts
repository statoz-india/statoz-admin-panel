import type { Paginated } from "@/app/interface/pagination.interface";

/** The expanded team a player entry carries in *responses*. */
export interface PlayerTeam {
  _id: string;
  name: string;
  displayName?: string;
  abbreviation?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
}

/** One `{ team, season }` entry of a player's history (response shape). */
export interface PlayerSeasonEntry {
  /** Expanded in responses — but guard for a team that has since been removed. */
  team: PlayerTeam | null;
  /** `"2026"` or `"2026/27"`. */
  season: string;
}

/** A document from the backend player dictionary. */
export interface Player {
  _id: string;
  /** The tournament's id — a plain string, not expanded. */
  tournamentId: string;
  playerName: string;
  /** Short form of the name, e.g. `VER`. */
  playerAbbreviation?: string | null;
  playerCode?: string | null;
  seasonYear: PlayerSeasonEntry[];
  playerImage: string[];
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedPlayers = Paginated<Player>;

/** Page size the players table asks for (backend default 20, max 100). */
export const PLAYERS_PAGE_SIZE = 20;

/** One `{ team, season }` entry as *sent*: `team` is just the team's id. */
export interface PlayerSeasonPayload {
  team: string;
  season: string;
}

/** Body for `POST /players`. */
export interface CreatePlayerPayload {
  tournamentId: string;
  playerName: string;
  playerAbbreviation?: string;
  playerCode?: string;
  seasonYear: PlayerSeasonPayload[];
  playerImage?: string[];
  description?: string;
}

/**
 * Body for `PATCH /players/:id`: only the fields being changed, at least one.
 * `seasonYear` and `playerImage` *replace* the whole list; `""`/`null` clears
 * `description`, `playerAbbreviation` and `playerCode`.
 */
export interface UpdatePlayerPayload {
  playerName?: string;
  playerAbbreviation?: string | null;
  playerCode?: string | null;
  description?: string | null;
  playerImage?: string[];
  tournamentId?: string;
  seasonYear?: PlayerSeasonPayload[];
}
