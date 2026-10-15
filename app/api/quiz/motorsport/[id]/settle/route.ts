// POST /api/quiz/motorsport/:id/settle -> backend POST /quiz/motorsport/settle/:id (super admins only)
//
// Grades every entry, credits XP, notifies each player, then moves the quiz to
// SETTLEMENT_DONE. The backend does all of it inside this one request, so a big
// quiz can take minutes. Node's fetch stops waiting after 5 minutes and that
// comes back here as a 500 while the backend keeps settling. A failure is
// therefore not proof that settlement stopped.

import type { MotorsportQuizSettlementResult } from "@/app/models/motorsport-quiz.model";
import {
  badRequest,
  proxyMotorsport,
  serverError,
} from "../../../../match/motorsport/proxy";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await Promise.resolve(context.params);
    const trimmed = id?.trim();
    if (!trimmed) return badRequest("Quiz id is required");

    return await proxyMotorsport<MotorsportQuizSettlementResult>(
      `/quiz/motorsport/settle/${encodeURIComponent(trimmed)}`,
      { method: "POST" },
      "Failed to settle the quiz",
    );
  } catch (error) {
    return serverError(error, "Failed to settle the quiz");
  }
}
