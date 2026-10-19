import { User } from "@/app/store/authStore";
import { normalizeEmail } from "@/app/utils/login";
import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE_MAX_AGE,
  REFRESH_COOKIE_MAX_AGE,
  sessionCookieOptions,
} from "../utils/api-helper";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/const-helpers";
import { loginDevice } from "../utils/device";

const API_BASE_URL = process.env.API_BASE_URL;

export interface LoginResponse {
  statusCode: number;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

interface LoginBody {
  email?: unknown;
  otp?: unknown;
  /** This browser's id from localStorage: logging in again reuses its session. */
  deviceId?: unknown;
}

function isSessionCookie(setCookie: string): boolean {
  const name = setCookie.slice(0, setCookie.indexOf("=")).trim();
  return name === ACCESS_TOKEN || name === REFRESH_TOKEN;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginBody;

    const response = await fetch(
      `${API_BASE_URL}/authorization/superadmin-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // The same string send-otp got: the code is checked against it.
          email: normalizeEmail(body.email),
          otp: body.otp,
          ...loginDevice(body.deviceId, request.headers.get("user-agent")),
        }),
      },
    );

    const data = await response.json();

    // Create response with CORS headers
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Keep the tokens in httpOnly cookies that server-side API routes read
    if (data.success && data.data?.accessToken) {
      nextResponse.cookies.set(
        ACCESS_TOKEN,
        data.data.accessToken,
        sessionCookieOptions(ACCESS_COOKIE_MAX_AGE),
      );

      if (data.data.refreshToken) {
        nextResponse.cookies.set(
          REFRESH_TOKEN,
          data.data.refreshToken,
          sessionCookieOptions(REFRESH_COOKIE_MAX_AGE),
        );
      }
    }

    // Pass on any other cookie the backend sets. Not its own copies of the
    // session tokens: the panel's are set above, with the panel's options.
    // Appended after them because setting a cookie through `cookies` rewrites
    // the whole Set-Cookie list.
    for (const cookie of response.headers.getSetCookie()) {
      if (!isSessionCookie(cookie)) {
        nextResponse.headers.append("set-cookie", cookie);
      }
    }

    // Add CORS headers
    nextResponse.headers.set("Access-Control-Allow-Origin", "*");
    nextResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    nextResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    nextResponse.headers.set("Access-Control-Allow-Credentials", "true");

    return nextResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to connect to backend server" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
