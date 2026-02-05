import { User } from "@/app/store/authStore";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/const-helpers";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/users/superadmin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Create response with CORS headers
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Extract accessToken from response data and set it as a cookie
    // This allows server-side API routes to read the token
    if (data.success && data.data?.accessToken) {
      // Set the accessToken as a cookie that server-side routes can read
      nextResponse.cookies.set(ACCESS_TOKEN, data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // Set expiration (24 hours)
        maxAge: 60 * 60 * 24,
      });

      // Also set refreshToken if available
      if (data.data.refreshToken) {
        nextResponse.cookies.set(REFRESH_TOKEN, data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    }

    // Copy set-cookie headers from backend response if present (for any other cookies)
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
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
