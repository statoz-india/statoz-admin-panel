import type { Paginated } from "@/app/interface/pagination.interface";
import {
  XP_HISTORY_QUERY_KEYS,
  type XpLedgerEntry,
} from "@/app/interface/userActivity.interface";
import { trackerRoute } from "../trackerRoute";

/** The user's XP history, newest first. */
export const GET = trackerRoute<Paginated<XpLedgerEntry>>(
  "xp",
  XP_HISTORY_QUERY_KEYS,
  "XP history",
);
