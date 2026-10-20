// GET /api/trending/tournaments -> backend GET /trending/tournaments
// PUT /api/trending/tournaments -> backend PUT /trending/tournaments (super admins only)
//
// The trending tournaments list shown in the app, in display order. Not the
// signup list, which is `/api/tournament/trending`.

import type { CuratedTrendingTournament } from "@/app/models/trending-curated.model";
import { curatedTrendingListHandlers } from "../curatedTrendingList";

const handlers = curatedTrendingListHandlers<CuratedTrendingTournament>({
  backendPath: "/trending/tournaments",
  listKey: "trendingTournaments",
  idKey: "tournament",
  label: "trending tournaments",
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
