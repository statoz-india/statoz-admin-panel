// PUT /api/app-navigation/default -> backend PUT /app-navigation/default

import { NextRequest, NextResponse } from "next/server";
import type { NavigationConfig } from "@/app/interface/app-navigation.interface";
import { parseNavigationConfig, proxyAppNavigation } from "../proxy";

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<NavigationConfig>;

    const config = parseNavigationConfig(body);
    if ("error" in config) return config.error;

    return await proxyAppNavigation<NavigationConfig & { type: "default" }>(
      "/app-navigation/default",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      },
      "Failed to update default navigation",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating default navigation:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update default navigation" },
      { status: 500 },
    );
  }
}
