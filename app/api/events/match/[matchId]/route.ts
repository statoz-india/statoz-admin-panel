import { matchScopedListResponse } from "../../../utils/match-scoped-list";
import type { MatchEvent } from "@/app/interface/match-picks.interface";

/** Events attached to a single match. `matchId` may be the Mongo id or the external match id. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ matchId: string }> | { matchId: string } },
) {
  const params = await Promise.resolve(context.params);
  return matchScopedListResponse<MatchEvent>(
    params.matchId,
    (id) => `/events/matchEvents/${id}`,
    "match events",
  );
}
