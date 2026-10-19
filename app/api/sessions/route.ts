// GET /api/sessions -> backend GET /authorization/sessions
// The admin's signed-in devices, most recently used first.

import type { DeviceSession } from "@/app/interface/session.interface";
import { proxySessions, serverError } from "./proxy";

export async function GET() {
  try {
    return await proxySessions<DeviceSession[]>(
      "/sessions",
      { method: "GET" },
      "Failed to load signed-in devices",
    );
  } catch (error) {
    return serverError(error, "Failed to load signed-in devices");
  }
}
