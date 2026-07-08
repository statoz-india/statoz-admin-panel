import type { DailyUserAssetsStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<DailyUserAssetsStats>(
    "/admin-data/getUserAssetsStats",
    "Failed to fetch user assets stats",
  );
}
