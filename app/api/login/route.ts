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
    isNewUser: boolean;
  };
  message: string;
  success: boolean;
}

interface IncomingBody {
  email?: string;
  password?: string;
  name?: string;
  deviceType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IncomingBody;

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/authorization/email-password-auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
          name: body.name,
          deviceType: body.deviceType ?? "web",
        }),
      },
    );

    const data = await response.json();

    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    if (data?.success && data?.data?.accessToken) {
      nextResponse.cookies.set(ACCESS_TOKEN, data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      if (data.data.refreshToken) {
        nextResponse.cookies.set(REFRESH_TOKEN, data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

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
