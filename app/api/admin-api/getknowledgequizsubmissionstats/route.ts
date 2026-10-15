// curl -X GET "http://localhost:8000/api/v1/admin-data/getKnowledgeQuizSubmissionStats" \
//   -H "Content-Type: application/json" \
//   --cookie "accessToken=<superadmin_access_token>"
//
// Knowledge quiz attempts today + daily counts for the last 7 IST days.

import type { SubmissionStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<SubmissionStats>(
    "/admin-data/getKnowledgeQuizSubmissionStats",
    "Failed to fetch knowledge quiz submission stats",
  );
}
