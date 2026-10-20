import type { MotorsportQuizSubmission } from "@/app/interface/userActivity.interface";
import { proxyUserActivity } from "../proxyUserActivity";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  return proxyUserActivity<MotorsportQuizSubmission[]>(context, "playedMotorsportQuizzesForAdmin", "played motorsport quizzes");
}
