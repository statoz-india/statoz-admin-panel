import {
  TRACKER_MAP_QUERY_KEYS,
  type TrackerMap,
} from "@/app/interface/userActivity.interface";
import { trackerRoute } from "../../trackerRoute";

/** The user's coin balance after each change, oldest first. */
export const GET = trackerRoute<TrackerMap>(
  "coins/map",
  TRACKER_MAP_QUERY_KEYS,
  "coin balance chart",
);
