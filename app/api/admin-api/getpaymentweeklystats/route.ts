import type { WeeklyPaymentStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<WeeklyPaymentStats>(
    "/admin-data/getPaymentWeeklyStats",
    "Failed to fetch payment weekly stats",
  );
}
