import type { WeeklyMatchStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<WeeklyMatchStats>(
    "/admin-data/getPenaltyShootoutWeeklyStats",
    "Failed to fetch penalty shootout weekly stats",
  );
}
