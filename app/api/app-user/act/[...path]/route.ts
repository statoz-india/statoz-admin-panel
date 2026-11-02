import { proxyAppUserAction } from "../../../utils/app-user-proxy";

type RouteContext = {
  params: Promise<{ path?: string[] }> | { path?: string[] };
};

/** One player action, as the app user whose token the request carries. */
export async function GET(request: Request, context: RouteContext) {
  const { path } = await Promise.resolve(context.params);
  return proxyAppUserAction(request, "GET", path);
}

export async function POST(request: Request, context: RouteContext) {
  const { path } = await Promise.resolve(context.params);
  return proxyAppUserAction(request, "POST", path);
}

export async function PUT(request: Request, context: RouteContext) {
  const { path } = await Promise.resolve(context.params);
  return proxyAppUserAction(request, "PUT", path);
}
