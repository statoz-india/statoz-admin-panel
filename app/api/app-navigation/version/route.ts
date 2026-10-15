// PUT    /api/app-navigation/version -> backend PUT    /app-navigation/version (upsert)
// DELETE /api/app-navigation/version -> backend DELETE /app-navigation/version

import { NextRequest, NextResponse } from "next/server";
import type {
  UpsertVersionBody,
  VersionNavigationConfig,
} from "@/app/interface/app-navigation.interface";
import { isAppOs } from "@/app/interface/app-navigation.interface";
import { badRequest, parseNavigationConfig, proxyAppNavigation } from "../proxy";

/** Validate the `(os, version)` pair that identifies an override. */
function parseTarget(
  body: Partial<UpsertVersionBody>,
): { os: string; version: string } | { error: NextResponse } {
  const os = typeof body.os === "string" ? body.os.trim() : "";
  if (!isAppOs(os)) {
    return { error: badRequest("os is required and must be android or ios") };
  }

  const version = typeof body.version === "string" ? body.version.trim() : "";
  if (!version) {
    return { error: badRequest("version is required") };
  }

  return { os, version };
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<UpsertVersionBody>;

    const target = parseTarget(body);
    if ("error" in target) return target.error;

    // A version override replaces the default wholesale rather than merging
    // field-by-field, so all three lists are required here too.
    const config = parseNavigationConfig(body);
    if ("error" in config) return config.error;

    return await proxyAppNavigation<VersionNavigationConfig>(
      "/app-navigation/version",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...target, ...config }),
      },
      "Failed to save version override",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error saving version override:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save version override" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<UpsertVersionBody>;

    const target = parseTarget(body);
    if ("error" in target) return target.error;

    return await proxyAppNavigation<unknown>(
      "/app-navigation/version",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      },
      "Failed to delete version override",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error deleting version override:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete version override" },
      { status: 500 },
    );
  }
}
