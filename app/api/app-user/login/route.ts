import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeEmail } from "@/app/utils/login";
import { appUserAuthPost } from "../../utils/app-user-proxy";
import { describeBrowser, loginDevice } from "../../utils/device";

/**
 * Signs an existing app user in with the code from send-otp. Uses `/login`,
 * not the app's `/loginSignupUser`, so a mistyped email can't create an
 * account. Answers `{ user, accessToken, refreshToken }`.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(body?.email);
  const otp = typeof body?.otp === "string" ? body.otp.trim() : "";
  if (!email || !otp) {
    return NextResponse.json(
      { success: false, message: "Enter the email and the code." },
      { status: 400 },
    );
  }
  const userAgent = request.headers.get("user-agent");
  return appUserAuthPost(
    "/authorization/login",
    {
      email,
      otp,
      ...loginDevice(body?.deviceId, userAgent),
      // Shows up in the user's own devices list.
      deviceName: `Statoz admin panel (${describeBrowser(userAgent)})`,
    },
    "Signing in",
  );
}
