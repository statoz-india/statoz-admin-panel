import { matchScopedListResponse } from "../../../utils/match-scoped-list";
import type { MatchQuiz } from "@/app/interface/match-picks.interface";

/** Quizzes attached to a single match. `matchId` may be the Mongo id or the external match id. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ matchId: string }> | { matchId: string } },
) {
  const params = await Promise.resolve(context.params);
  return matchScopedListResponse<MatchQuiz>(
    params.matchId,
    (id) => `/quiz/matchQuizzes/${id}`,
    "match quizzes",
  );
}
