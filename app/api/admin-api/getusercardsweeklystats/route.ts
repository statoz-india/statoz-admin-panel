import type { WeeklyUserCardsStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<WeeklyUserCardsStats>(
    "/admin-data/getUserCardsWeeklyStats",
    "Failed to fetch user cards weekly stats",
  );
}
