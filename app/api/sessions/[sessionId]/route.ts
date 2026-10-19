// DELETE /api/sessions/:sessionId -> backend DELETE /authorization/sessions/:sessionId
// Signs one device out. The backend answers 404 for an unknown id or someone
// else's session.

import { badRequest, proxySessions, serverError } from "../proxy";

type RouteContext = {
  params: Promise<{ sessionId: string }> | { sessionId: string };
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { sessionId } = await Promise.resolve(context.params);
    const id = sessionId?.trim();
    if (!id) return badRequest("Session id is required");

    return await proxySessions<unknown>(
      `/sessions/${encodeURIComponent(id)}`,
      { method: "DELETE" },
      "Failed to sign the device out",
    );
  } catch (error) {
    return serverError(error, "Failed to sign the device out");
  }
}
