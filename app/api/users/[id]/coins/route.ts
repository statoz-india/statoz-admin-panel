import type { Paginated } from "@/app/interface/pagination.interface";
import {
  COIN_HISTORY_QUERY_KEYS,
  type CoinLedgerEntry,
} from "@/app/interface/userActivity.interface";
import { trackerRoute } from "../trackerRoute";

/** The user's coin history, newest first. */
export const GET = trackerRoute<Paginated<CoinLedgerEntry>>(
  "coins",
  COIN_HISTORY_QUERY_KEYS,
  "coin history",
);
