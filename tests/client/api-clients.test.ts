/**
 * The browser-side clients the sections call: each builds the right URL,
 * method and body for its proxy route, unwraps `data`, and throws the
 * route's message on failure.
 */

import { describe, expect, it } from "vitest";
import { appNavigationApi } from "@/app/components/appNavigation/app-navigation-api";
import { botApi } from "@/app/components/botUsers/bot-api";
import { kqApi } from "@/app/components/knowledgeQuiz/kq-api";
import { paymentsApi } from "@/app/components/payments/payments-api";
import { cardsApi } from "@/app/components/playerCards/cards-api";
import { GamesApiError, gamesApi } from "@/app/components/statozGames/statoz-games-api";
import { unresolvedApi } from "@/app/components/unresolved/unresolved-api";
import {
  assetBusinessId,
  assetDescription,
  assetName,
  assetUrl,
  isItemFree,
  isProfilePic,
  userAssetsApi,
  type CatalogItem,
} from "@/app/components/userAssets/user-assets-api";
import { userCardsApi } from "@/app/components/userCards/user-cards-api";
import { SUGGESTED_MATCHES_TABS, SUGGESTED_SHOP_TABS } from "@/app/interface/app-navigation.interface";
import { fetchCall, jsonResponse, mockFetch, textResponse } from "../helpers/http";

const ok = (data: unknown, message?: string) => jsonResponse({ success: true, data, ...(message ? { message } : {}) });

/** Run a client call against a successful response and return what it sent. */
async function sent(call: () => Promise<unknown>, data: unknown = {}) {
  const fetchMock = mockFetch([ok(data)]);
  const result = await call();
  return { ...fetchCall(fetchMock), result };
}

describe("shared request behaviour", () => {
  const clients: [string, () => Promise<unknown>][] = [
    ["appNavigationApi", () => appNavigationApi.deleteVersion({ os: "ios", version: "1" })],
    ["botApi", () => botApi.list()],
    ["kqApi", () => kqApi.listSports()],
    ["paymentsApi", () => paymentsApi.listPayments()],
    ["cardsApi", () => cardsApi.listPlayerCards()],
    ["gamesApi", () => gamesApi.listGames()],
    ["unresolvedApi", () => unresolvedApi.settleQuiz("q1")],
    ["userAssetsApi", () => userAssetsApi.listProfilePics()],
    ["userCardsApi", () => userCardsApi.all(1)],
  ];

  it.each(clients)("%s sends the session cookie as JSON", async (_, call) => {
    const { init } = await sent(call);
    expect(init.credentials).toBe("include");
    expect(new Headers(init.headers).get("content-type")).toBe("application/json");
  });

  it.each(clients)("%s throws the route's message", async (_, call) => {
    mockFetch([jsonResponse({ success: false, message: "Nope" }, 400)]);
    await expect(call()).rejects.toThrow("Nope");
  });

  it.each(clients)("%s throws on success:false even with a 200", async (_, call) => {
    mockFetch([jsonResponse({ success: false, message: "Soft failure" })]);
    await expect(call()).rejects.toThrow("Soft failure");
  });

  it.each(clients)("%s falls back to the status for a non-JSON error", async (_, call) => {
    mockFetch([textResponse("<html>", 502)]);
    await expect(call()).rejects.toThrow("Request failed (502)");
  });
});

describe("kqApi", () => {
  it("builds the question list query, trimming search", async () => {
    const { url } = await sent(() =>
      kqApi.listQuestions({ page: 2, limit: 25, sportsType: "cricket", answerType: "single", search: "  kohli " }),
    );
    expect(url).toBe("/api/knowledge-quiz/questions?page=2&limit=25&sportsType=cricket&answerType=single&search=kohli");
  });

  it("leaves the query off when there are no filters", async () => {
    expect((await sent(() => kqApi.listQuestions())).url).toBe("/api/knowledge-quiz/questions");
    expect((await sent(() => kqApi.listQuestions({ search: "   " }))).url).toBe("/api/knowledge-quiz/questions");
  });

  it("keeps falsy-but-real submission filters", async () => {
    const { url } = await sent(() => kqApi.listSubmissions({ isReplay: false, obtainedStars: 0, setId: "s1" }));
    expect(url).toBe("/api/knowledge-quiz/submissions?setId=s1&isReplay=false&obtainedStars=0");
  });

  it("encodes ids in paths", async () => {
    expect((await sent(() => kqApi.getQuestion("a/b"))).url).toBe("/api/knowledge-quiz/questions/a%2Fb");
    expect((await sent(() => kqApi.listChapterSets("kq 1", "easy", "foundation"))).url).toBe(
      "/api/knowledge-quiz/kq%201/easy/foundation",
    );
    expect((await sent(() => kqApi.getSet("s1", { includeQuestions: true }))).url).toBe(
      "/api/knowledge-quiz/sets/s1?includeQuestions=true",
    );
  });

  it("sends writes with the right method", async () => {
    const created = await sent(() => kqApi.createSet({ knowledgeQuizId: "k" } as never));
    expect(created).toMatchObject({ url: "/api/knowledge-quiz/sets", method: "POST", body: { knowledgeQuizId: "k" } });
    const updated = await sent(() => kqApi.updateSport("sp1", { gameHeading: "New" }));
    expect(updated).toMatchObject({ url: "/api/knowledge-quiz/sports/sp1", method: "PUT", body: { gameHeading: "New" } });
  });
});

describe("paymentsApi / cardsApi / gamesApi query strings", () => {
  it("skips empty values", async () => {
    const { url } = await sent(() => paymentsApi.listPayments({ page: 1, status: "", userId: undefined } as never));
    expect(url).toBe("/api/payments/admin?page=1");
    expect((await sent(() => paymentsApi.listUserAssets())).url).toBe("/api/payments/user-assets");
  });

  it("routes player and action cards", async () => {
    expect((await sent(() => cardsApi.listPlayerCards({ page: 2 } as never))).url).toBe("/api/player-cards?page=2");
    expect((await sent(() => cardsApi.filterPlayerCards({ tier: "gold" } as never))).url).toBe("/api/player-cards/filter?tier=gold");
    expect(await sent(() => cardsApi.deleteActionCard("ac1"))).toMatchObject({ url: "/api/player-cards/action-cards/ac1", method: "DELETE" });
    expect(await sent(() => cardsApi.updatePlayerCard("pc1", { name: "x" } as never))).toMatchObject({
      url: "/api/player-cards/pc1",
      method: "PUT",
      body: { name: "x" },
    });
  });

  it("routes game results and the catalog", async () => {
    expect((await sent(() => gamesApi.listPenaltyShootouts({ page: 1, userId: "" } as never))).url).toBe(
      "/api/statoz-games/penalty-shootouts?page=1",
    );
    expect((await sent(() => gamesApi.getTennisRally("t1"))).url).toBe("/api/statoz-games/tennis-rally/t1");
    expect(await sent(() => gamesApi.setGameOrder("cricket", ["g2", "g1"]))).toMatchObject({
      url: "/api/statoz-games/games/order",
      method: "PUT",
      body: { gameType: "cricket", gameIds: ["g2", "g1"] },
    });
    expect((await sent(() => gamesApi.updateGame("a b", {} as never))).url).toBe("/api/statoz-games/games/a%20b");
  });

  it("keeps the ids the admin must fix on a GamesApiError", async () => {
    mockFetch([jsonResponse({ success: false, message: "Order must list every game", missingIds: ["g3"] }, 400)]);
    const error = await gamesApi.setGameOrder("cricket", ["g1"]).catch((e) => e);
    expect(error).toBeInstanceOf(GamesApiError);
    expect(error.body.missingIds).toEqual(["g3"]);
  });
});

describe("unresolvedApi", () => {
  it("returns an empty list when data isn't one", async () => {
    mockFetch([ok(null)]);
    expect(await unresolvedApi.listQuizzes()).toEqual([]);
  });

  it("returns the backend's message from a settle step", async () => {
    mockFetch([ok({}, "Payouts completed (no winners)")]);
    expect(await unresolvedApi.settlePrediction("p1")).toBe("Payouts completed (no winners)");
    mockFetch([ok({})]);
    expect(await unresolvedApi.settleEvent("e1")).toBeNull();
  });

  it("resolves a match with a PATCH of its status", async () => {
    expect(await sent(() => unresolvedApi.setMatchStatus("m/1", "abandoned"))).toMatchObject({
      url: "/api/match/m%2F1/matchStartTime",
      method: "PATCH",
      body: { matchStatus: "abandoned" },
    });
  });

  it("only sends the winning team's id for a win", async () => {
    expect((await sent(() => unresolvedApi.declarePredictionResult("p1", "A", "team-a"))).body).toEqual({
      winningTeam: "A",
      winningTeamId: "team-a",
    });
    expect((await sent(() => unresolvedApi.declarePredictionResult("p1", "D"))).body).toEqual({ winningTeam: "D" });
  });

  it("posts an empty body for settle steps", async () => {
    expect(await sent(() => unresolvedApi.settleQuiz("q1"))).toMatchObject({ url: "/api/quiz/q1/settle-quiz", method: "POST", body: {} });
  });
});

describe("appNavigationApi", () => {
  it("fills in tab lists that older rows don't have", async () => {
    mockFetch([
      ok({
        default: { tabs: ["MATCH"], navbar: ["SHOP"], shopTabs: [], matchesTabs: undefined },
        versions: [{ os: "ios", version: "2", tabs: ["MATCH"], navbar: ["SHOP"], shopTabs: ["COINS"], matchesTabs: ["PICKS"] }],
      }),
    ]);

    const overview = await appNavigationApi.getOverview();

    expect(overview.default.shopTabs).toEqual([...SUGGESTED_SHOP_TABS]);
    expect(overview.default.matchesTabs).toEqual([...SUGGESTED_MATCHES_TABS]);
    expect(overview.versions[0]).toMatchObject({ shopTabs: ["COINS"], matchesTabs: ["PICKS"] });
  });

  it("copes with no versions", async () => {
    mockFetch([ok({ default: { tabs: [], navbar: [], shopTabs: ["A"], matchesTabs: ["B"] } })]);
    expect((await appNavigationApi.getOverview()).versions).toEqual([]);
  });

  it("saves with PUT", async () => {
    const config = { tabs: ["MATCH"], navbar: ["SHOP"], shopTabs: ["COINS"], matchesTabs: ["PICKS"] };
    expect(await sent(() => appNavigationApi.updateDefault(config), config)).toMatchObject({
      url: "/api/app-navigation/default",
      method: "PUT",
      body: config,
    });
  });
});

describe("botApi / userCardsApi", () => {
  it("routes bot actions", async () => {
    expect(await sent(() => botApi.setCurrentDeck("b1", "d1"))).toMatchObject({
      url: "/api/bot-users/b1/current-deck",
      method: "PATCH",
      body: { deckId: "d1" },
    });
    expect((await sent(() => botApi.assignStarterPack("b1"))).url).toBe("/api/bot-users/b1/starter-pack");
  });

  it("pages user cards", async () => {
    expect((await sent(() => userCardsApi.all(3))).url).toBe("/api/user-cards/all?page=3");
  });
});

describe("user assets", () => {
  const pic = { ppId: "PP1", ppName: "Lion", ppUrl: "https://img/pp1.png", ppDescription: "Roar", coinValue: 0 } as unknown as CatalogItem;
  const banner = { pbId: "PB1", pbName: "Stadium", pbUrl: "https://img/pb1.png", isFree: false, coinValue: 0 } as unknown as CatalogItem;

  it("reads either kind of asset", () => {
    expect(isProfilePic(pic)).toBe(true);
    expect(isProfilePic(banner)).toBe(false);
    expect([assetBusinessId(pic), assetName(pic), assetUrl(pic), assetDescription(pic)]).toEqual(["PP1", "Lion", "https://img/pp1.png", "Roar"]);
    expect([assetBusinessId(banner), assetName(banner), assetUrl(banner), assetDescription(banner)]).toEqual([
      "PB1",
      "Stadium",
      "https://img/pb1.png",
      undefined,
    ]);
  });

  it("decides free from isFree first, then from the price", () => {
    expect(isItemFree(pic)).toBe(true);
    expect(isItemFree(banner)).toBe(false);
    expect(isItemFree({ ...pic, isFree: true, coinValue: 500 } as CatalogItem)).toBe(true);
    expect(isItemFree({ ...pic, coinValue: 100 } as CatalogItem)).toBe(false);
  });

  it("routes asset calls", async () => {
    expect((await sent(() => userAssetsApi.listPaidProfileBanners())).url).toBe("/api/user-assets/profile-banners/paid?page=1&limit=50");
    expect((await sent(() => userAssetsApi.profilePicsByTeam("CSK & MI"))).url).toBe("/api/user-assets/profile-pics/by-team/CSK%20%26%20MI");
    expect(await sent(() => userAssetsApi.updateProfilePic("PP1", { ppName: "x" } as never))).toMatchObject({
      url: "/api/user-assets/profile-pics/PP1",
      method: "PATCH",
    });
  });
});
