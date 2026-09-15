import type { GameType } from "@/app/constants/game-type";

/** A document from the backend `games` collection. */
export interface Game {
  _id: string;
  title: string;
  subtitle: string;
  /** Unique across all games. */
  key: string;
  gameType: GameType;
  isQuickPlay: boolean;
  isLive: boolean;
  message: string | null;
  /** 1-based position within its `gameType`; absent until an order is saved. */
  displayOrder?: number | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/**
 * One sport in the `GET /games/get-games` response. The backend always returns
 * every sport (football, cricket, basketball, racing, in that order), with
 * `games` already in display order: `displayOrder` ascending, then games with
 * no order, newest first.
 */
export interface GameSection {
  gameType: GameType;
  /** Material icon name for the sport, e.g. `sports_soccer`. */
  icon: string;
  games: Game[];
}

/**
 * Body for `POST /games/create-game`. Only `title`, `subtitle`, `key` and
 * `gameType` are required; the backend defaults the booleans to `false` and
 * `message` to `null`.
 */
export interface CreateGamePayload {
  title: string;
  subtitle: string;
  key: string;
  gameType: GameType;
  isQuickPlay?: boolean;
  isLive?: boolean;
  message?: string | null;
}

/**
 * Body for `PUT /games/update-game/:id`: only the fields to change, at least
 * one. `message: null` clears the message. Changing `gameType` moves the game
 * to the end of the new sport's order.
 */
export type UpdateGamePayload = Partial<CreateGamePayload>;
