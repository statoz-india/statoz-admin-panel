import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PlayQuiz } from "@/app/interface/app-user.interface";

/** Every `UPCOMING` quiz, soonest match first. */
export async function GET() {
  return pendingSettlementListResponse<PlayQuiz>("/quiz/upcomingQuizzes", "upcoming quizzes");
}
