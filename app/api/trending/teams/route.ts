// GET /api/trending/teams -> backend GET /trending/teams
// PUT /api/trending/teams -> backend PUT /trending/teams (super admins only)
//
// The trending teams list shown in the app, in display order.

import type { CuratedTrendingTeam } from "@/app/models/trending-curated.model";
import { curatedTrendingListHandlers } from "../curatedTrendingList";

const handlers = curatedTrendingListHandlers<CuratedTrendingTeam>({
  backendPath: "/trending/teams",
  listKey: "trendingTeams",
  idKey: "team",
  label: "trending teams",
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
