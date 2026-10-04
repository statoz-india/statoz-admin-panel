// POST /api/quiz/motorsport/:id/submit-correct-answer
//   -> backend POST /quiz/motorsport/submitCorrectAnswer/:id (super admins only)
//
// Saves the correct answer of each listed question; questions left out keep
// theirs. The quiz moves to ANSWER_UPDATED straight away, which closes
// entries. Returns the whole quiz with every question's `correctAnswer`.

import type { MotorsportQuiz } from "@/app/models/motorsport-quiz.model";
import {
  badRequest,
  proxyMotorsport,
  serverError,
} from "../../../../match/motorsport/proxy";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await Promise.resolve(context.params);
    const trimmed = id?.trim();
    if (!trimmed) return badRequest("Quiz id is required");

    const body = await request.json().catch(() => null);
    const answers =
      body && typeof body === "object"
        ? (body as Record<string, unknown>).answers
        : undefined;
    if (!Array.isArray(answers) || answers.length === 0) {
      return badRequest("answers array is required");
    }

    return await proxyMotorsport<MotorsportQuiz>(
      `/quiz/motorsport/submitCorrectAnswer/${encodeURIComponent(trimmed)}`,
      { method: "POST", body: JSON.stringify({ answers }) },
      "Failed to save the correct answers",
    );
  } catch (error) {
    return serverError(error, "Failed to save the correct answers");
  }
}
