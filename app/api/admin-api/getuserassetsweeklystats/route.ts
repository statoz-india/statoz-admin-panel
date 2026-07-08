import type { WeeklyUserAssetsStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<WeeklyUserAssetsStats>(
    "/admin-data/getUserAssetsWeeklyStats",
    "Failed to fetch user assets weekly stats",
  );
}
