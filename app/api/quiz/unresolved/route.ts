import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PendingQuiz } from "@/app/interface/pending-settlement.interface";

/** Quizzes an admin marked unresolved; they're left out of pending settlement. */
export async function GET() {
  return pendingSettlementListResponse<PendingQuiz>(
    "/quiz/unresolvedQuizzes",
    "unresolved quizzes",
  );
}
