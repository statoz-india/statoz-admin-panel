import { proxyAdminGet } from "../../utils/admin-get-proxy";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

/**
 * GET handler for one of the backend's `/tracker/admin/:userId/<path>`
 * endpoints: the user's coin or XP history, exactly as they see it in the app.
 * An unknown but valid user id comes back as an empty list.
 */
export function trackerRoute<T>(
  path: string,
  queryKeys: readonly string[],
  label: string,
) {
  return async function GET(request: Request, context: RouteContext) {
    const { id } = await Promise.resolve(context.params);
    return proxyAdminGet<T>(
      `/tracker/admin/${encodeURIComponent(id)}/${path}`,
      new URL(request.url).searchParams,
      queryKeys,
      label,
    );
  };
}
