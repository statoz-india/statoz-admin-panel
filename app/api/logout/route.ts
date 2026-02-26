import { NextResponse } from "next/server";
import {
  getRefreshTokenCookie,
  getSessionCookie,
} from "../utils/api-helper";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/const-helpers";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST() {
  try {
    const accessToken = await getSessionCookie();
    const refreshToken = await getRefreshTokenCookie();

    if (API_BASE_URL) {
      const cookieHeader = [
        `accessToken=${accessToken ?? ""}`,
        `refreshToken=${refreshToken ?? ""}`,
      ].join("; ");

      await fetch(`${API_BASE_URL}/authorization/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.set(ACCESS_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set(REFRESH_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.delete(ACCESS_TOKEN);
    response.cookies.delete(REFRESH_TOKEN);

    return response;
  } catch (error) {
    console.error("Error during logout:", error);

    const response = NextResponse.json(
      { success: false, message: "Failed to logout" },
      { status: 500 },
    );
    response.cookies.set(ACCESS_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set(REFRESH_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.delete(ACCESS_TOKEN);
    response.cookies.delete(REFRESH_TOKEN);

    return response;
  }
}
