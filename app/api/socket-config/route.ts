import { NextResponse } from "next/server";
import { successResponse } from "../utils/api-helper";

export interface SocketConfig {
  /** Origin the browser opens the Socket.IO connection against. */
  url: string;
}

/**
 * Where the live-stats socket lives.
 *
 * The browser talks to the backend directly for the socket — there is no
 * Next.js proxy in front of it — so it needs an absolute origin. `API_BASE_URL`
 * is server-only, hence this tiny endpoint instead of a `NEXT_PUBLIC_` var.
 * Set `SOCKET_URL` when the socket is served from somewhere other than the API
 * origin; the backend's `CORS_ORIGIN` must list this panel's origin either way.
 */
export async function GET() {
  const explicit = process.env.SOCKET_URL?.trim();
  if (explicit) {
    return successResponse<SocketConfig>({ url: explicit.replace(/\/+$/, "") });
  }

  const apiBaseUrl = process.env.API_BASE_URL?.trim();
  if (!apiBaseUrl) {
    return NextResponse.json(
      { success: false, message: "API_BASE_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    // `http://host/api/v1` → `http://host`: the socket sits at the origin.
    return successResponse<SocketConfig>({ url: new URL(apiBaseUrl).origin });
  } catch {
    return NextResponse.json(
      { success: false, message: "API_BASE_URL is not a valid URL" },
      { status: 500 },
    );
  }
}
