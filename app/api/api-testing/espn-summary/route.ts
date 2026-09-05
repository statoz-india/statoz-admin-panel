import { NextResponse } from "next/server";
import { requireAuth } from "../../utils/api-helper";

const ESPN_SUMMARY_BASE =
  "https://site.api.espn.com/apis/site/v2/sports";

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_BODY_CHARS = 2_000_000;

function collectResponseHeaders(
  response: Response,
): { key: string; value: string }[] {
  const list: { key: string; value: string }[] = [];
  response.headers.forEach((value, key) => {
    list.push({ key, value });
  });
  return list.sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * GET ESPN event summary for a sport/league path + event id.
 * Example tournament: `soccer/eng.1`, `basketball/nba`, `cricket/icc`.
 */
export async function GET(request: Request) {
  try {
    await requireAuth();

    const incoming = new URL(request.url).searchParams;
    const tournament = incoming.get("tournament")?.trim() ?? "";
    const eventId = incoming.get("eventId")?.trim() ?? "";

    if (!tournament || !eventId) {
      return NextResponse.json(
        {
          success: false,
          message: "tournament and eventId are required",
        },
        { status: 400 },
      );
    }

    if (tournament.includes("://") || tournament.includes("..")) {
      return NextResponse.json(
        { success: false, message: "Invalid tournament path" },
        { status: 400 },
      );
    }

    const segments = tournament
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);
    if (segments.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "tournament must be an ESPN sport/league path, e.g. soccer/eng.1",
        },
        { status: 400 },
      );
    }

    const path = segments.map(encodeURIComponent).join("/");
    const targetUrl = `${ESPN_SUMMARY_BASE}/${path}/summary?event=${encodeURIComponent(eventId)}`;

    const startedAt = Date.now();
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: { Accept: "application/json, text/plain, */*" },
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const durationMs = Date.now() - startedAt;
    const rawText = await response.text();
    const truncated = rawText.length > MAX_BODY_CHARS;

    return NextResponse.json({
      success: true,
      data: {
        request: {
          method: "GET",
          url: targetUrl,
          headers: [{ key: "Accept", value: "application/json, text/plain, */*" }],
          body: null,
          refreshedToken: false,
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          durationMs,
          sizeBytes: rawText.length,
          truncated,
          headers: collectResponseHeaders(response),
          body: truncated ? rawText.slice(0, MAX_BODY_CHARS) : rawText,
        },
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        {
          success: false,
          message: `The request did not finish within ${REQUEST_TIMEOUT_MS / 1000}s.`,
        },
        { status: 504 },
      );
    }
    console.error("ESPN summary request failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch ESPN summary.",
      },
      { status: 500 },
    );
  }
}
