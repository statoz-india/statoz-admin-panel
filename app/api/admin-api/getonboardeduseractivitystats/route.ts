import type { NextRequest } from "next/server";
import type { OnboardedUserActivityStats } from "@/app/interface/dashboard.interface";
import { proxyAdminStats } from "../stats-proxy";

/**
 * Day-0 activation for one onboarding cohort. `date` (YYYY-MM-DD) is optional;
 * the backend defaults to today in IST and rejects malformed or non-existent
 * dates with a 400.
 */
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return proxyAdminStats<OnboardedUserActivityStats>(
    `/admin-data/getOnboardedUserActivityStats${query}`,
    "Failed to fetch onboarded user activity stats",
  );
}
