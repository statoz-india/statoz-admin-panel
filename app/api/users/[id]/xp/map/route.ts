import {
  TRACKER_MAP_QUERY_KEYS,
  type TrackerMap,
} from "@/app/interface/userActivity.interface";
import { trackerRoute } from "../../trackerRoute";

/** The user's net XP per IST day, oldest first. */
export const GET = trackerRoute<TrackerMap>(
  "xp/map",
  TRACKER_MAP_QUERY_KEYS,
  "XP chart",
);
