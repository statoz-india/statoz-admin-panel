import {
  getRefreshTokenCookie,
  getSessionCookie,
  successResponse,
} from "../utils/api-helper";

/**
 * Whether this browser still holds a session. After a failed call the panel
 * asks this to tell "signed out" (go to login) from any other failure. The
 * cookies are enough: routes clear them whenever the backend ends the session.
 */
export async function GET() {
  const signedIn = Boolean(
    (await getSessionCookie()) || (await getRefreshTokenCookie()),
  );
  return successResponse({ signedIn });
}
