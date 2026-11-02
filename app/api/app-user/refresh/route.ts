import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  APP_USER_SIGNED_OUT,
  appUserAuthPost,
} from "../../utils/app-user-proxy";

/** Swaps an app user's refresh token for a new access token. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const refreshToken =
    typeof body?.refreshToken === "string" ? body.refreshToken.trim() : "";
  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "Sign this user in again", [APP_USER_SIGNED_OUT]: true },
      { status: 401 },
    );
  }
  return appUserAuthPost(
    "/authorization/refresh-token",
    { refreshToken },
    "Renewing the session",
  );
}
