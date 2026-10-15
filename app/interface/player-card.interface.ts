/** Types & enums for the superadmin `/player-cards` API (player + action cards). */

export const SPORTS = ["football", "cricket"] as const;
export const CARD_TYPES = ["platinum", "gold", "silver", "bronze"] as const;
export const PLAYER_TYPES = ["attacker", "defender", "goalkeeper"] as const;
export const ACTION_CATEGORIES = ["attack", "defense", "special"] as const;
export const FOOTBALL_POSITIONS = [
  "GK",
  "CB",
  "LB",
  "RB",
  "LWB",
  "RWB",
  "SW",
  "CDM",
  "CM",
  "CAM",
  "LM",
  "RM",
  "LW",
  "RW",
  "LF",
  "RF",
  "CF",
  "ST",
  "SS",
] as const;

export type Sport = (typeof SPORTS)[number];
export type CardType = (typeof CARD_TYPES)[number];
export type PlayerType = (typeof PLAYER_TYPES)[number];
export type ActionCategory = (typeof ACTION_CATEGORIES)[number];
export type FootballPosition = (typeof FOOTBALL_POSITIONS)[number];

/** A full player card document returned by the API. */
export interface PlayerCard {
  _id: string;
  playerId: string;
  name: string;
  shortName?: string;
  image: string;
  team: string;
  teamAbbreviation: string;
  sport: Sport;
  ratings: number;
  coinValue: number;
  cardType: CardType;
  position: string;
  playerType?: PlayerType;
  trait?: string;
  finalRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** A full action card document returned by the API. */
export interface ActionCard {
  _id: string;
  baseId: string;
  title: string;
  category: ActionCategory;
  basePower: number;
  icon: string;
  effectTemplate: string;
  risky?: boolean;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Paginated list envelope (the `data` payload of the list endpoints). */
export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/* ---------- Create / update payloads ---------- */

export interface CreatePlayerCardInput {
  playerId: string;
  name: string;
  image: string;
  team: string;
  teamAbbreviation: string;
  sport: Sport;
  ratings: number;
  coinValue: number;
  cardType: CardType;
  position: string;
  shortName?: string;
  playerType?: PlayerType;
  trait?: string;
}

export type UpdatePlayerCardInput = Partial<CreatePlayerCardInput>;

export interface CreateActionCardInput {
  baseId: string;
  title: string;
  category: ActionCategory;
  basePower: number;
  icon: string;
  effectTemplate: string;
  risky?: boolean;
  isVisible?: boolean;
}

export type UpdateActionCardInput = Partial<CreateActionCardInput>;

/* ---------- List query params ---------- */

export interface ListPlayerCardsParams {
  page?: number;
  limit?: number;
  sport?: Sport;
  cardType?: CardType;
  position?: FootballPosition;
  team?: string;
}

export interface FilterPlayerCardsParams {
  playerType?: string;
  cardType?: CardType;
}

export interface ListActionCardsParams {
  page?: number;
  limit?: number;
  category?: ActionCategory;
  risky?: boolean;
  isVisible?: boolean;
}
