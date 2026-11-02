import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeEmail } from "@/app/utils/login";
import { appUserAuthPost } from "../../utils/app-user-proxy";

/** Emails an app user a login code (`purpose: "login"`: the account must exist). */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  // Login sends the same normalized string: the code is checked against it.
  const email = normalizeEmail(body?.email);
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 },
    );
  }
  return appUserAuthPost(
    "/authorization/send-otp",
    { email, purpose: "login" },
    "Sending the code",
  );
}
