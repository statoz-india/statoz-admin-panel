import { describe, expect, it } from "vitest";
import { GET as getSettlementFailures } from "@/app/api/admin-api/getsettlementfailures/route";
import { GET as getUnresolvedEvents } from "@/app/api/events/unresolved/route";
import { GET as getUnresolvedPredictions } from "@/app/api/predictions/unresolved/route";
import { GET as getUnresolvedQuizzes } from "@/app/api/quiz/unresolved/route";
import { GET as getCoinMap } from "@/app/api/users/[id]/coins/map/route";
import { GET as getCoins } from "@/app/api/users/[id]/coins/route";
import { GET as getXpMap } from "@/app/api/users/[id]/xp/map/route";
import { GET as getXp } from "@/app/api/users/[id]/xp/route";
import { proxyAdminGet } from "@/app/api/utils/admin-get-proxy";
import { signIn } from "../../helpers/cookies";
import {
  API_BASE_URL,
  fetchCall,
  jsonResponse,
  makeRequest,
  mockFetch,
  readJson,
  routeContext,
  textResponse,
} from "../../helpers/http";

const PAGE = { items: [{ _id: "e1" }], page: 1, limit: 20, total: 1, totalPages: 1, hasMore: false };

describe("proxyAdminGet", () => {
  const get = (query = "") =>
    proxyAdminGet("/things", new URLSearchParams(query), ["page", "kind"], "things");

  it("forwards only the allowed, non-empty query keys", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: PAGE })]);
    await get("page=2&kind=%20quiz%20&other=x&empty=");
    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}/things?page=2&kind=quiz`);
  });

  it("calls the bare endpoint without a query", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: PAGE })]);
    await get("kind=");
    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}/things`);
  });

  it("unwraps the backend's data", async () => {
    signIn();
    mockFetch([jsonResponse({ statusCode: 200, data: PAGE, success: true })]);
    const res = await get();
    expect(res.status).toBe(200);
    expect(await readJson(res)).toMatchObject({ success: true, data: PAGE });
  });

  it("keeps a bad filter's 400 and says which value was wrong", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, message: "kind must be one of: quiz, prediction, event" }, 400)]);
    const res = await get("kind=race");
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ success: false, message: "kind must be one of: quiz, prediction, event" });
  });

  it("passes a non-superadmin 403 on", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "Forbidden - SuperAdmin access required" }, 403)]);
    const res = await get();
    expect(res.status).toBe(403);
    expect((await readJson(res)).message).toBe("Forbidden - SuperAdmin access required");
  });

  it("falls back to its own message for a non-JSON failure", async () => {
    signIn();
    mockFetch([textResponse("<html>", 502)]);
    const res = await get();
    expect(res.status).toBe(502);
    expect(await readJson(res)).toEqual({ success: false, message: "Failed to fetch things" });
  });

  it("reports an expired session", async () => {
    signIn();
    mockFetch(() => jsonResponse({}, 401));
    expect((await get()).status).toBe(401);
  });

  it("turns a network failure into a 500", async () => {
    signIn();
    mockFetch(() => {
      throw new Error("ECONNREFUSED");
    });
    const res = await get();
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ success: false, message: "ECONNREFUSED" });
  });
});

describe("user coin and XP history routes", () => {
  const userId = "6721f0c2a1b2c3d4e5f60718";

  it.each([
    [getCoins, "coins", "page=2&limit=20&ledgerType=DEBITED&ledgerSource=ADMIN_GIFT&from=x", "coins?page=2&limit=20&ledgerType=DEBITED&ledgerSource=ADMIN_GIFT"],
    [getCoinMap, "coins/map", "from=2026-10-01&to=2026-10-31&page=3", "coins/map?from=2026-10-01&to=2026-10-31"],
    [getXp, "xp", "page=1&xpType=CREDITED&xpSource=GAME&ledgerType=x", "xp?page=1&xpType=CREDITED&xpSource=GAME"],
    [getXpMap, "xp/map", "to=2026-10-31", "xp/map?to=2026-10-31"],
  ])("%#: /users/:id/%s forwards its own filters to the tracker", async (handler, path, query, backend) => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: PAGE })]);
    await handler(makeRequest(`/api/users/${userId}/${path}?${query}`), routeContext({ id: userId }));
    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}/tracker/admin/${userId}/${backend}`);
  });
});

describe("unresolved list routes", () => {
  it.each([
    [getUnresolvedQuizzes, "/quiz/unresolvedQuizzes"],
    [getUnresolvedPredictions, "/prediction/unresolvedPredictions"],
    [getUnresolvedEvents, "/events/unresolvedEvents"],
  ])("%#: reads %s, and an empty list (404) is not an error", async (handler, backend) => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ statusCode: 404, data: [], message: "No unresolved quizes found", success: false }, 404)]);
    const res = await handler();
    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}${backend}`);
    expect(res.status).toBe(200);
    expect(await readJson(res)).toMatchObject({ success: true, data: [] });
  });
});

describe("GET /api/admin-api/getsettlementfailures", () => {
  it("forwards status, kind and paging", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: PAGE })]);
    await getSettlementFailures(
      makeRequest("/api/admin-api/getsettlementfailures?status=open&kind=quiz&page=2&limit=1&x=y"),
    );
    expect(fetchCall(fetchMock).url).toBe(
      `${API_BASE_URL}/admin-data/getSettlementFailures?status=open&kind=quiz&page=2&limit=1`,
    );
  });
});
