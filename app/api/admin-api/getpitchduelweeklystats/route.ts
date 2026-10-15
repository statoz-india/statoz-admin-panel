import type { WeeklyMatchStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<WeeklyMatchStats>(
    "/admin-data/getPitchDuelWeeklyStats",
    "Failed to fetch pitch duel weekly stats",
  );
}
