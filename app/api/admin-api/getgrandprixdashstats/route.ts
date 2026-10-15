import type { DailyMatchStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<DailyMatchStats>(
    "/admin-data/getGrandPrixDashStats",
    "Failed to fetch grand prix dash stats",
  );
}
