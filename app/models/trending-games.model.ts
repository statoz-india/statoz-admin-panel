/** One entry as sent to `PUT /api/trending/games` — just the game's id. */
export interface TrendingGamePutEntry {
  game: string;
}

/**
 * One entry as returned by `PUT /api/trending/games`'s confirmation response
 * — the raw stored record (unaggregated/ungrouped), since PUT only confirms
 * what was saved. Call `GET /api/trending/games` afterward to see it grouped
 * by sport the way the home screen will render it.
 */
export interface TrendingGameRecord {
  _id: string;
  game: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
