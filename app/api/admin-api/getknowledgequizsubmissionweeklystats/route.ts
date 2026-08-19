// curl -X GET "http://localhost:8000/api/v1/admin-data/getKnowledgeQuizSubmissionWeeklyStats" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Total knowledge quiz attempts, attempts this week, and weekly counts (IST).

import type { WeeklySubmissionStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<WeeklySubmissionStats>(
    "/admin-data/getKnowledgeQuizSubmissionWeeklyStats",
    "Failed to fetch knowledge quiz submission weekly stats",
  );
}
