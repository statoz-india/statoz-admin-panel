// POST /api/logout-all -> backend POST /authorization/logout-all
// `{ keepCurrent: true }` signs out every other device; anything else signs
// out everywhere, this browser included.

import { withSessionCleared } from "../utils/api-helper";
import { proxySessions, serverError } from "../sessions/proxy";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const keepCurrent = body?.keepCurrent === true;

    const response = await proxySessions<unknown>(
      "/logout-all",
      {
        method: "POST",
        body: JSON.stringify(keepCurrent ? { keepCurrent: true } : {}),
      },
      "Failed to sign out",
    );

    // This browser's session went too: drop its cookies.
    if (!keepCurrent && response.ok) return await withSessionCleared(response);
    return response;
  } catch (error) {
    return serverError(error, "Failed to sign out");
  }
}
