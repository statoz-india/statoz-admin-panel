import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PendingQuiz } from "@/app/interface/pending-settlement.interface";

/** Quizzes whose entry window has opened but that are not settled yet. */
export async function GET() {
  return pendingSettlementListResponse<PendingQuiz>(
    "/quiz/pendingSettlementQuizzes",
    "pending settlement quizzes",
  );
}
