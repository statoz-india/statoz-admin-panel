import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "http://localhost:8000/api/v1";

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

    // Copy set-cookie header from backend response if present
    // Note: Multiple set-cookie headers are combined with comma
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
      { status: 500 }
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
