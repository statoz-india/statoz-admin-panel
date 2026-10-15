import type { DailyUserCardsStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<DailyUserCardsStats>(
    "/admin-data/getUserCardsStats",
    "Failed to fetch user cards stats",
  );
}
