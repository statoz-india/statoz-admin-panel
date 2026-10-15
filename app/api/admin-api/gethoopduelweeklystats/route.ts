import type { WeeklyMatchStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<WeeklyMatchStats>(
    "/admin-data/getHoopDuelWeeklyStats",
    "Failed to fetch hoop duel weekly stats",
  );
}
