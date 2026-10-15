import type { DailyPaymentStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

export async function GET() {
  return proxyAdminStats<DailyPaymentStats>(
    "/admin-data/getPaymentStats",
    "Failed to fetch payment stats",
  );
}
