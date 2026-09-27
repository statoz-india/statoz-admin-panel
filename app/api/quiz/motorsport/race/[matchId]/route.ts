// GET /api/quiz/motorsport/race/:matchId -> backend GET /quiz/motorsport/race/:matchId
//
// `:matchId` is the race's Mongo `_id` or its readable id (e.g. F1-R3). Only
// visible quizzes come back, without questions (`questionCount` instead). A
// race with no quizzes is an empty list; a missing race stays a 404.

import type { MotorsportQuizListItem } from "@/app/models/motorsport-quiz.model";
import {
  badRequest,
  proxyMotorsport,
  serverError,
} from "../../../../match/motorsport/proxy";

type RouteContext = {
  params: Promise<{ matchId: string }> | { matchId: string };
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { matchId } = await Promise.resolve(context.params);
    const trimmed = matchId?.trim();
    if (!trimmed) return badRequest("Race id is required");

    return await proxyMotorsport<MotorsportQuizListItem[]>(
      `/quiz/motorsport/race/${encodeURIComponent(trimmed)}`,
      { method: "GET" },
      "Failed to fetch the race's quizzes",
      { emptyListOn404: true },
    );
  } catch (error) {
    return serverError(error, "Failed to fetch the race's quizzes");
  }
}
