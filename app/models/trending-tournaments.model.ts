import type { Tournament } from "./tournament.model";

/**
 * Sports that can have trending tournaments, in the order the backend returns
 * them. A tournament can only be trending if its `gameType` is one of these.
 * The admin screen takes the sports from `GET /tournament/trending` itself, so
 * a sport added on the backend shows up (and is kept on save) without a change
 * here.
 */
export const TRENDING_TOURNAMENT_SPORTS = [
  "football",
  "cricket",
  "basketball",
  "racing",
] as const;

export type TrendingTournamentSport =
  (typeof TRENDING_TOURNAMENT_SPORTS)[number];

export interface TrendingTournamentTeam {
  _id: string;
  name: string;
  displayName?: string;
  abbreviation?: string;
  logo?: string;
}

/** A tournament in `GET /tournament/trending`, with its teams sorted by name. */
export interface TrendingTournament extends Omit<Tournament, "gameType"> {
  gameType: TrendingTournamentSport;
  teams: TrendingTournamentTeam[];
}

/**
 * One sport in `GET /tournament/trending`. Every sport always comes back, in
 * `TRENDING_TOURNAMENT_SPORTS` order, with `tournamentList` in display order.
 */
export interface TrendingTournamentSection {
  sportsType: TrendingTournamentSport;
  /** Material icon name for the sport, e.g. `sports_soccer`. */
  icon: string;
  tournamentList: TrendingTournament[];
}

/**
 * One entry of the body for `PUT /tournament/trending`. The body lists every
 * trending tournament; order matters only within a sport.
 */
export interface TrendingTournamentPutEntry {
  /** The tournament's `_id`. */
  tournament: string;
}

/** A record from the backend `trendingTournaments` collection, as `PUT` returns it. */
export interface TrendingTournamentRecord {
  _id: string;
  tournament: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
