import { NextResponse } from "next/server";
import { authenticatedFetch, withSessionCleared } from "../utils/api-helper";

/**
 * Ends this browser's session only; the admin stays signed in on their other
 * devices. The backend finds the session from the access token, so this calls
 * it while the cookies are still there, renewing an expired token first.
 */
export async function POST() {
  try {
    await authenticatedFetch("/authorization/logout", { method: "POST" });

    return await withSessionCleared(
      NextResponse.json({
        success: true,
        message: "Logged out successfully",
      }),
    );
  } catch (error) {
    console.error("Error during logout:", error);

    return await withSessionCleared(
      NextResponse.json(
        { success: false, message: "Failed to logout" },
        { status: 500 },
      ),
    );
  }
}
