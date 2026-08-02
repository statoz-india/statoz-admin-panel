import { matchScopedListResponse } from "../../../utils/match-scoped-list";
import type { MatchPrediction } from "@/app/interface/match-picks.interface";

/** Predictions attached to a single match. `matchId` may be the Mongo id or the external match id. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ matchId: string }> | { matchId: string } },
) {
  const params = await Promise.resolve(context.params);
  return matchScopedListResponse<MatchPrediction>(
    params.matchId,
    (id) => `/prediction/matchPredictions/${id}`,
    "match predictions",
  );
}
