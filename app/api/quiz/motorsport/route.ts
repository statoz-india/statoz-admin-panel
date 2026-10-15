// POST /api/quiz/motorsport -> backend POST /quiz/createMotorsportQuiz (super admins only)
//
// The quiz's tournament is read from the race server-side, so it is never sent.

import type { MotorsportQuiz } from "@/app/models/motorsport-quiz.model";
import {
  badRequest,
  pickDefined,
  proxyMotorsport,
  serverError,
} from "../../match/motorsport/proxy";

const CREATE_FIELDS = [
  "matchId",
  "entryStartTime",
  "entryStopTime",
  "questionsArray",
] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Request body must be a JSON object");
    }

    return await proxyMotorsport<MotorsportQuiz>(
      "/quiz/createMotorsportQuiz",
      {
        method: "POST",
        body: JSON.stringify(
          pickDefined(body as Record<string, unknown>, CREATE_FIELDS),
        ),
      },
      "Failed to create motorsport quiz",
    );
  } catch (error) {
    return serverError(error, "Failed to create motorsport quiz");
  }
}
