// GET /api/app-navigation/all -> backend GET /app-navigation/admin/all

import { NextResponse } from "next/server";
import type { AppNavigationOverview } from "@/app/interface/app-navigation.interface";
import { proxyAppNavigation } from "../proxy";

export async function GET() {
  try {
    return await proxyAppNavigation<AppNavigationOverview>(
      "/app-navigation/admin/all",
      { method: "GET" },
      "Failed to fetch app navigation config",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching app navigation config:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch app navigation config" },
      { status: 500 },
    );
  }
}
