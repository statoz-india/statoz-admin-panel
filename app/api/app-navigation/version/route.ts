// PUT    /api/app-navigation/version -> backend PUT    /app-navigation/version (upsert)
// DELETE /api/app-navigation/version -> backend DELETE /app-navigation/version

import { NextRequest, NextResponse } from "next/server";
import type {
  UpsertVersionBody,
  VersionNavigationConfig,
} from "@/app/interface/app-navigation.interface";
import { isAppOs } from "@/app/interface/app-navigation.interface";
import { badRequest, parseNavList, proxyAppNavigation } from "../proxy";

/** Validate the `(os, version)` pair shared by both handlers. */
function parseTarget(body: Partial<UpsertVersionBody>):
  | { os: string; version: string }
  | { error: NextResponse } {
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

    const tabs = parseNavList(body.tabs);
    if (!tabs) {
      return badRequest("tabs must be a non-empty list of non-empty strings");
    }

    const navbar = parseNavList(body.navbar);
    if (!navbar) {
      return badRequest("navbar must be a non-empty list of non-empty strings");
    }

    return await proxyAppNavigation<VersionNavigationConfig>(
      "/app-navigation/version",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          os: target.os,
          version: target.version,
          tabs,
          navbar,
        }),
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
        body: JSON.stringify({ os: target.os, version: target.version }),
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
