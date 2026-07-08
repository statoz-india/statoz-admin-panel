import type { DailyMatchStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<DailyMatchStats>(
    "/admin-data/getPenaltyShootoutStats",
    "Failed to fetch penalty shootout stats",
  );
}
