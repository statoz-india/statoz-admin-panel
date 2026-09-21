import type { DailyMatchStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<DailyMatchStats>(
    "/admin-data/getHoopDuelStats",
    "Failed to fetch hoop duel stats",
  );
}
