/** Types for the `/api/v1/userCards/admin/all` admin API (real users + their cards/decks). */

import type { PlayerCard, ActionCard } from "@/app/interface/bot-user.interface";

/** A real user as returned by the admin user-cards endpoint. */
export interface AdminUser {
  _id: string;
  userName?: string;
  email: string;
  avatarUrl?: string;
  userType: string;
  userStatus: string;
}

/** An owned player card entry (populated card + acquisition metadata). */
export interface PlayerCardEntry {
  playerCardData: PlayerCard | null;
  acquiredAt?: string;
  source?: string;
}

/** An owned action card entry (populated card + acquisition metadata). */
export interface ActionCardEntry {
  actionCardData: ActionCard | null;
  acquiredAt?: string;
  source?: string;
}

/** A deck (current deck has no id/name; entries in `allDecks` do). */
export interface DeckContents {
  _id?: string;
  name?: string;
  cards: PlayerCardEntry[];
  actionCards: ActionCardEntry[];
}

/** One row of the admin user-cards list: a user and their full inventory. */
export interface AdminUserCards {
  user: AdminUser | null;
  cards: PlayerCardEntry[];
  actionCards: ActionCardEntry[];
  currentDeck: DeckContents;
  allDecks: DeckContents[];
}

/** Page size the backend uses for the admin user-cards list (fixed server-side). */
export const USER_CARDS_PAGE_SIZE = 50;
