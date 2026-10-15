import { NextResponse } from "next/server";
import type { KqSubmissionList } from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_CHAPTER_NAMES,
  KQ_LIST_DEFAULT_LIMIT,
  KQ_LIST_MAX_LIMIT,
  KQ_OBTAINED_STARS,
  KQ_SET_CATEGORIES,
  KQ_SPORTS,
  isKqChapterName,
  isKqObtainedStars,
  isKqSetCategory,
  isKqSport,
  isObjectId,
} from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { backendErrorMessage } from "../proxy";

const LIST_ENDPOINT = "/knowledge-quiz/submissions";

/** Mirror the backend's fallbacks: bad, zero, negative → default; fractions floored. */
function parsePageNumber(raw: string | null, fallback: number, max?: number) {
  const parsed = Number(raw);
  if (raw === null || raw === "" || !Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  const floored = Math.floor(parsed);
  return max === undefined ? floored : Math.min(floored, max);
}

function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = new URLSearchParams({
      page: String(parsePageNumber(searchParams.get("page"), 1)),
      limit: String(
        parsePageNumber(
          searchParams.get("limit"),
          KQ_LIST_DEFAULT_LIMIT,
          KQ_LIST_MAX_LIMIT,
        ),
      ),
    });

    // The backend silently ignores an unrecognised filter and returns the full
    // unfiltered list, which reads as a filtered result in the panel. Reject
    // loudly instead — the UI builds its chips from the enums, so this can only
    // fire on a client bug.
    for (const param of ["userId", "setId"] as const) {
      const value = searchParams.get(param);
      if (value) {
        if (!isObjectId(value)) {
          return badRequest(`${param} must be a valid id`);
        }
        query.set(param, value);
      }
    }

    const sportsType = searchParams.get("sportsType");
    if (sportsType) {
      if (!isKqSport(sportsType)) {
        return badRequest(`sportsType must be one of: ${KQ_SPORTS.join(", ")}`);
      }
      query.set("sportsType", sportsType);
    }

    const category = searchParams.get("category");
    if (category) {
      if (!isKqSetCategory(category)) {
        return badRequest(
          `category must be one of: ${KQ_SET_CATEGORIES.join(", ")}`,
        );
      }
      query.set("category", category);
    }

    const chapterName = searchParams.get("chapterName");
    if (chapterName) {
      if (!isKqChapterName(chapterName)) {
        return badRequest(
          `chapterName must be one of: ${KQ_CHAPTER_NAMES.join(", ")}`,
        );
      }
      query.set("chapterName", chapterName);
    }

    const isReplay = searchParams.get("isReplay");
    if (isReplay) {
      if (isReplay !== "true" && isReplay !== "false") {
        return badRequest('isReplay must be "true" or "false"');
      }
      query.set("isReplay", isReplay);
    }

    // Not parsePageNumber: 0 stars is a real value, not a missing one.
    const obtainedStars = searchParams.get("obtainedStars");
    if (obtainedStars) {
      const parsed = Number(obtainedStars);
      if (!isKqObtainedStars(parsed)) {
        return badRequest(
          `obtainedStars must be one of: ${KQ_OBTAINED_STARS.join(", ")}`,
        );
      }
      query.set("obtainedStars", String(parsed));
    }

    // The backend 400s on an unparseable date; catch it here so a mistyped
    // range never costs a round trip.
    for (const param of ["from", "to"] as const) {
      const value = searchParams.get(param);
      if (value) {
        if (Number.isNaN(Date.parse(value))) {
          return badRequest(`${param} must be a valid date`);
        }
        query.set(param, value);
      }
    }

    const search = searchParams.get("search")?.trim();
    if (search) {
      query.set("search", search);
    }

    const response = await authenticatedFetch(
      `${LIST_ENDPOINT}?${query.toString()}`,
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          message: backendErrorMessage(
            errorText,
            `Failed to load submissions (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<{ data: KqSubmissionList }>(
      response,
    );

    return successResponse(body?.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching knowledge quiz submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to load submissions",
      },
      { status: 500 },
    );
  }
}
