/**
 * The proxy helpers every feature's routes go through: they forward to the
 * backend and normalise its answer into `{ success, data, message }`.
 */

import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";
import { proxyAdminStats } from "@/app/api/admin-api/stats-proxy";
import { badRequest as navBadRequest, parseNavigationConfig, proxyAppNavigation } from "@/app/api/app-navigation/proxy";
import { proxyBotUsers } from "@/app/api/bot-users/proxy";
import { backendErrorMessage } from "@/app/api/knowledge-quiz/proxy";
import {
  MOTORSPORT_WRITE_FIELDS,
  pickDefined as motorsportPickDefined,
  proxyMotorsport,
  serverError as motorsportServerError,
} from "@/app/api/match/motorsport/proxy";
import { proxyPaymentsRequest } from "@/app/api/payments/proxy";
import { proxyPlayerCards } from "@/app/api/player-cards/proxy";
import {
  badRequest,
  PLAYER_WRITE_FIELDS,
  pickDefined,
  proxyPlayers,
  serverError,
} from "@/app/api/player-dictionary/proxy";
import { proxyGames } from "@/app/api/statoz-games/proxy";
import { proxyUserAssetsRequest } from "@/app/api/user-assets/proxy";
import { signIn } from "../../helpers/cookies";
import { API_BASE_URL, fetchCall, jsonResponse, mockFetch, readJson, textResponse } from "../../helpers/http";

type Proxy = (endpoint: string, init: RequestInit, fallback: string) => Promise<NextResponse>;

const PROXIES: [string, Proxy][] = [
  ["proxyAppNavigation", proxyAppNavigation],
  ["proxyBotUsers", proxyBotUsers],
  ["proxyPaymentsRequest", proxyPaymentsRequest],
  ["proxyPlayerCards", proxyPlayerCards],
  ["proxyPlayers", proxyPlayers],
  ["proxyGames", proxyGames],
  ["proxyUserAssetsRequest", proxyUserAssetsRequest],
  ["proxyMotorsport", proxyMotorsport],
];

describe.each(PROXIES)("%s (shared behaviour)", (_, proxy) => {
  it("forwards method, body and session to the backend", async () => {
    signIn("acc");
    const fetchMock = mockFetch([jsonResponse({ success: true, data: { id: 1 } })]);

    await proxy("/things/1", { method: "PUT", body: JSON.stringify({ a: 1 }) }, "Failed");

    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/things/1`);
    expect(call.method).toBe("PUT");
    expect(call.body).toEqual({ a: 1 });
    expect(call.headers.Cookie).toBe("accessToken=acc");
  });

  it("unwraps the backend's data and keeps its message", async () => {
    signIn();
    mockFetch([jsonResponse({ success: true, data: [{ id: 1 }], message: "Fetched" })]);

    const res = await proxy("/things", {}, "Failed");

    expect(res.status).toBeLessThan(300);
    expect(await readJson(res)).toEqual({ success: true, data: [{ id: 1 }], message: "Fetched" });
  });

  it("passes a body without a data wrapper through as data", async () => {
    signIn();
    mockFetch([jsonResponse([{ id: 1 }])]);
    expect((await readJson(await proxy("/things", {}, "Failed"))).data).toEqual([{ id: 1 }]);
  });

  it.each([401, 498])("turns a %d into 'session expired'", async (status) => {
    signIn();
    mockFetch(() => jsonResponse({ message: "jwt expired" }, status));

    const res = await proxy("/things", {}, "Failed");

    expect(res.status).toBe(401);
    expect(await readJson(res)).toEqual({ success: false, message: "Session expired. Please log in again." });
  });

  it("propagates the backend's status and message", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, message: "Card not found" }, 404)]);

    const res = await proxy("/things/9", {}, "Failed");

    expect(res.status).toBe(404);
    expect(await readJson(res)).toMatchObject({ success: false, message: "Card not found" });
  });

  it("falls back to the given message with the status when the backend says nothing useful", async () => {
    signIn();
    mockFetch([jsonResponse({ code: 1 }, 500)]);
    expect(await readJson(await proxy("/x", {}, "Failed to load"))).toMatchObject({
      success: false,
      message: "Failed to load (Status: 500)",
    });
  });

  it("rejects when the backend can't be reached (the route's catch handles it)", async () => {
    signIn();
    mockFetch(() => {
      throw new TypeError("fetch failed");
    });
    await expect(proxy("/x", {}, "Failed")).rejects.toThrow("fetch failed");
  });
});

describe.each([
  ["proxyAppNavigation", proxyAppNavigation],
  ["proxyBotUsers", proxyBotUsers],
  ["proxyPaymentsRequest", proxyPaymentsRequest],
  ["proxyPlayerCards", proxyPlayerCards],
  ["proxyUserAssetsRequest", proxyUserAssetsRequest],
] as [string, Proxy][])("%s (error details)", (_, proxy) => {
  it("prefers `error` over `message`", async () => {
    signIn();
    mockFetch([jsonResponse({ error: "Duplicate name", message: "Validation failed" }, 409)]);
    const res = await proxy("/x", {}, "Failed");
    expect(res.status).toBe(409);
    expect((await readJson(res)).message).toBe("Duplicate name");
  });

  it("shows a plain-text error body", async () => {
    signIn();
    mockFetch([textResponse("Service unavailable", 503)]);
    expect((await readJson(await proxy("/x", {}, "Failed"))).message).toBe("Service unavailable");
  });

  it("uses the fallback for an empty error body", async () => {
    signIn();
    mockFetch([textResponse("", 502)]);
    expect((await readJson(await proxy("/x", {}, "Failed to save"))).message).toBe("Failed to save");
  });

  it("answers 200 on success", async () => {
    signIn();
    mockFetch([jsonResponse({ data: {} }, 201)]);
    expect((await proxy("/x", {}, "Failed")).status).toBe(200);
  });
});

describe("proxyGames", () => {
  it("joins every validation error in data.errors", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, message: "Validation failed", data: { errors: ["name required", 3, "type invalid"] } }, 400)]);
    expect((await readJson(await proxyGames("/x", {}, "Failed"))).message).toBe("name required; type invalid");
  });

  it("shows a conflict's data.error", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "Conflict", data: { error: "Game already exists" } }, 409)]);
    expect((await readJson(await proxyGames("/x", {}, "Failed"))).message).toBe("Game already exists");
  });

  it("passes on the ids the admin has to fix", async () => {
    signIn();
    mockFetch([
      jsonResponse(
        { message: "Order must list every game", data: { missingIds: ["g3"], duplicateIds: ["g1"], unknownIds: "not-a-list" } },
        400,
      ),
    ]);
    const body = await readJson(await proxyGames("/games/order", { method: "PUT" }, "Failed"));
    expect(body).toEqual({
      success: false,
      message: "Order must list every game",
      missingIds: ["g3"],
      duplicateIds: ["g1"],
    });
  });
});

describe("proxyPlayers", () => {
  it("lists every problem from the top-level errors", async () => {
    signIn();
    mockFetch([jsonResponse({ errors: ["playerName is required", "seasonYear must be a number"] }, 400)]);
    expect(await readJson(await proxyPlayers("/x", {}, "Failed"))).toEqual({
      success: false,
      message: "playerName is required; seasonYear must be a number",
      errors: ["playerName is required", "seasonYear must be a number"],
    });
  });

  it("explains a 403 with no message", async () => {
    signIn();
    mockFetch([jsonResponse({}, 403)]);
    expect((await readJson(await proxyPlayers("/x", {}, "Failed"))).message).toBe("Only a super admin can change players");
  });

  it("keeps the backend's 201 on create", async () => {
    signIn();
    mockFetch([jsonResponse({ data: { _id: "p1" }, message: "Created" }, 201)]);
    const res = await proxyPlayers("/players", { method: "POST" }, "Failed");
    expect(res.status).toBe(201);
    expect(await readJson(res)).toEqual({ success: true, data: { _id: "p1" }, message: "Created" });
  });
});

describe("proxyMotorsport", () => {
  it("returns an empty list for a list endpoint's 404 with data: []", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, data: [] }, 404)]);
    const res = await proxyMotorsport("/races", {}, "Failed", { emptyListOn404: true });
    expect(res.status).toBe(200);
    expect(await readJson(res)).toEqual({ success: true, data: [] });
  });

  it("keeps a 404 for a missing race even on a list endpoint", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, message: "Race not found", data: null }, 404)]);
    const res = await proxyMotorsport("/races/x/quizzes", {}, "Failed", { emptyListOn404: true });
    expect(res.status).toBe(404);
    expect((await readJson(res)).message).toBe("Race not found");
  });

  it("keeps a list endpoint's 404 an error unless asked", async () => {
    signIn();
    mockFetch([jsonResponse({ data: [] }, 404)]);
    expect((await proxyMotorsport("/races", {}, "Failed")).status).toBe(404);
  });

  it.each([
    ["nested data.errors (race endpoints)", { data: { errors: ["name is required", " "] } }],
    ["top-level errors (quiz endpoints)", { errors: ["name is required"] }],
  ])("lists %s", async (_, body) => {
    signIn();
    mockFetch([jsonResponse(body, 400)]);
    expect(await readJson(await proxyMotorsport("/x", {}, "Failed"))).toEqual({
      success: false,
      message: "name is required",
      errors: ["name is required"],
    });
  });

  it("shows a single data.error", async () => {
    signIn();
    mockFetch([jsonResponse({ data: { error: "Stop date before start date" } }, 400)]);
    expect((await readJson(await proxyMotorsport("/x", {}, "Failed"))).message).toBe("Stop date before start date");
  });

  it("explains a 403 with no message", async () => {
    signIn();
    mockFetch([jsonResponse({}, 403)]);
    expect((await readJson(await proxyMotorsport("/x", {}, "Failed"))).message).toBe(
      "Only a super admin can change motorsport matches",
    );
  });
});

describe("proxyUserAssetsRequest", () => {
  it("answers with the requested success status", async () => {
    signIn();
    mockFetch([jsonResponse({ data: { ppId: "PP1" } })]);
    expect((await proxyUserAssetsRequest("/x", { method: "POST" }, "Failed", 201)).status).toBe(201);
  });
});

describe("proxyAdminStats", () => {
  it("unwraps data", async () => {
    signIn();
    mockFetch([jsonResponse({ data: { total: 5 } })]);
    const res = await proxyAdminStats("/admin-data/getPaymentStats", "Failed");
    expect(await readJson(res)).toEqual({ success: true, data: { total: 5 } });
  });

  it("passes a bare body through", async () => {
    signIn();
    mockFetch([jsonResponse({ total: 5 })]);
    expect((await readJson(await proxyAdminStats("/x", "Failed"))).data).toEqual({ total: 5 });
  });

  it("reports an expired session", async () => {
    signIn();
    mockFetch(() => jsonResponse({}, 401));
    expect((await proxyAdminStats("/x", "Failed")).status).toBe(401);
  });

  it("hides backend failures behind the fallback message", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "db down" }, 500)]);
    const res = await proxyAdminStats("/x", "Failed to fetch payment stats");
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ success: false, message: "Failed to fetch payment stats" });
  });

  it("survives an unreachable backend", async () => {
    signIn();
    mockFetch(() => {
      throw new TypeError("fetch failed");
    });
    expect((await proxyAdminStats("/x", "Failed")).status).toBe(500);
  });
});

describe("parseNavigationConfig", () => {
  const valid = {
    tabs: ["MATCH", "GAMES"],
    navbar: ["SPORTS", "SHOP"],
    shopTabs: ["COINS"],
    matchesTabs: ["PREDICT"],
  };

  it("accepts and trims a full config without changing case", () => {
    expect(parseNavigationConfig({ ...valid, tabs: [" MATCH ", "games"] })).toEqual({ ...valid, tabs: ["MATCH", "games"] });
  });

  it("names every invalid list in one 400", async () => {
    const result = parseNavigationConfig({ ...valid, tabs: [], navbar: ["SHOP", " "], shopTabs: undefined });
    expect("error" in result).toBe(true);
    const res = (result as { error: NextResponse }).error;
    expect(res.status).toBe(400);
    expect((await readJson(res)).message).toBe(
      "tabs must be a non-empty array of non-empty strings, navbar must be a non-empty array of non-empty strings, shopTabs must be a non-empty array of non-empty strings",
    );
  });

  it("rejects non-string entries", () => {
    expect("error" in parseNavigationConfig({ ...valid, matchesTabs: ["PREDICT", 1 as unknown as string] })).toBe(true);
  });

  it("badRequest is a 400 envelope", async () => {
    const res = navBadRequest("nope");
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ success: false, message: "nope" });
  });
});

describe("backendErrorMessage (knowledge quiz)", () => {
  it.each([
    ['{"message":"Set not found"}', "Set not found"],
    ['{"error":"Bad category"}', "Bad category"],
    ['{"code":1}', "fallback"],
    ["Plain reason", "Plain reason"],
    ["  ", "fallback"],
    ["<!DOCTYPE html><html>404</html>", "fallback"],
    ["x".repeat(201), "fallback"],
  ])("%j → %s", (raw, expected) => {
    expect(backendErrorMessage(raw, "fallback")).toBe(expected);
  });
});

describe("write-field helpers", () => {
  it.each([
    ["player-dictionary", pickDefined],
    ["motorsport", motorsportPickDefined],
  ])("%s pickDefined copies only listed keys the client sent", (_, pick) => {
    expect(pick({ a: 1, b: undefined, c: null, d: 0, extra: "x" }, ["a", "b", "c", "d"])).toEqual({ a: 1, c: null, d: 0 });
  });

  it("never lets a client set server-owned motorsport fields", () => {
    expect(MOTORSPORT_WRITE_FIELDS).not.toContain("matchId");
    expect(MOTORSPORT_WRITE_FIELDS).not.toContain("gameType");
    expect(PLAYER_WRITE_FIELDS).not.toContain("_id");
  });

  it("badRequest is a 400 envelope", async () => {
    const res = badRequest("bad");
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ success: false, message: "bad" });
  });

  it.each([
    ["player-dictionary", serverError],
    ["motorsport", motorsportServerError],
  ])("%s serverError turns errors into a 500 and passes responses through", async (_, toResponse) => {
    const res = toResponse(new Error("boom"), "Failed");
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ success: false, message: "boom" });
    expect((await readJson(toResponse("weird", "Failed to save"))).message).toBe("Failed to save");
    const thrown = NextResponse.json({ success: false }, { status: 401 });
    expect(toResponse(thrown, "x")).toBe(thrown);
  });
});
