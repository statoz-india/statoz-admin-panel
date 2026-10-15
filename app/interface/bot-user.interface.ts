/** Types for the `/api/v1/bot-users` admin API (bot users + their cards/decks). */

/** A bot user (AI opponent) as returned by the list / create endpoints. */
export interface BotUser {
  _id: string;
  userName?: string;
  email: string;
  avatarUrl?: string;
  bannerUrl?: string;
  coins: number;
  userType: "bot";
  userStatus: string;
  gameXp?: { totalXP: number };
  xp?: { totalXP: number };
  profilePic?: { url?: string } | string | null;
  profileBanner?: { url?: string } | string | null;
  createdAt: string;
  updatedAt: string;
}

/** A populated player card document. */
export interface PlayerCard {
  _id: string;
  name: string;
  shortName?: string;
  image?: string;
  team?: string;
  ratings?: number;
  position?: string;
  playerType?: string;
  trait?: string;
  cardType?: string;
  finalRating?: number;
}

/** A populated action card document. */
export interface ActionCard {
  _id: string;
  baseId?: string;
  title: string;
  category?: string;
  basePower?: number;
  risky?: boolean;
  icon?: string;
  effectTemplate?: string;
}

/** An owned player card entry (card + acquisition metadata). */
export interface OwnedPlayerCard {
  playerCardData: PlayerCard;
  acquiredAt?: string;
  source?: string;
}

/** An owned action card entry (card + acquisition metadata). */
export interface OwnedActionCard {
  actionCardData: ActionCard;
  acquiredAt?: string;
  source?: string;
}

/** A named deck built from owned cards. */
export interface BotDeck {
  _id: string;
  name: string;
  cards: OwnedPlayerCard[];
  actionCards: OwnedActionCard[];
}

/** A deck without an id (current-deck shape). */
export interface DeckCards {
  cards: OwnedPlayerCard[];
  actionCards: OwnedActionCard[];
}

/** Payload of `GET /:botUserId/cards`. */
export interface BotCardsResponse {
  botUserId: string;
  cards: OwnedPlayerCard[];
  actionCards: OwnedActionCard[];
  currentDeck: DeckCards | null;
  allDecks: BotDeck[];
}

/** Payload of `PATCH /:botUserId/current-deck`. */
export interface CurrentDeckResponse {
  botUserId: string;
  deckId: string;
  currentDeck: DeckCards;
}

/** Payload of `GET /:botUserId/starter-pack`. */
export interface StarterPackResponse {
  botUserId: string;
  starterPack: OwnedPlayerCard[];
  starterActionCards: OwnedActionCard[];
  currentDeck: DeckCards;
}

/** Body for creating a bot user. */
export interface CreateBotPayload {
  email: string;
  userName?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  coins?: number;
  profilePic?: string;
  profileBanner?: string;
}

/** Body for creating a deck. */
export interface CreateDeckPayload {
  name: string;
  playerCardIds?: string[];
  actionCardIds?: string[];
}
