// GET /api/quiz/motorsport/:id -> backend GET /quiz/motorsport/:id
//
// One quiz (by Mongo `_id`) with its questions and race. Hidden quizzes are a
// 404. Correct answers are stripped until the quiz is settled.

import type { MotorsportQuiz } from "@/app/models/motorsport-quiz.model";
import {
  badRequest,
  proxyMotorsport,
  serverError,
} from "../../../match/motorsport/proxy";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await Promise.resolve(context.params);
    const trimmed = id?.trim();
    if (!trimmed) return badRequest("Quiz id is required");

    return await proxyMotorsport<MotorsportQuiz>(
      `/quiz/motorsport/${encodeURIComponent(trimmed)}`,
      { method: "GET" },
      "Failed to fetch the quiz",
    );
  } catch (error) {
    return serverError(error, "Failed to fetch the quiz");
  }
}
