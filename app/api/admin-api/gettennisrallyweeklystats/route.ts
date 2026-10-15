import type { WeeklyMatchStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<WeeklyMatchStats>(
    "/admin-data/getTennisRallyWeeklyStats",
    "Failed to fetch tennis rally weekly stats",
  );
}
