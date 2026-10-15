/** Routes whose own logic (validation, paging, payload shaping) goes beyond forwarding. */

import { describe, expect, it } from "vitest";
import { PUT as putDefaultNavigation } from "@/app/api/app-navigation/default/route";
import { DELETE as deleteVersion, PUT as putVersion } from "@/app/api/app-navigation/version/route";
import { GET as getEvents, POST as createEvent } from "@/app/api/events/route";
import { GET as listKqQuestions, POST as createKqQuestion } from "@/app/api/knowledge-quiz/questions/route";
import { signIn } from "../helpers/cookies";
import { API_BASE_URL, fetchCall, jsonResponse, makeRequest, mockFetch, readJson, textResponse } from "../helpers/http";

const NAV = { tabs: ["MATCH", "GAMES"], navbar: ["SPORTS", "SHOP"], shopTabs: ["COINS"], matchesTabs: ["PREDICT"] };

describe("/api/app-navigation", () => {
  it("validates the default config before saving it", async () => {
    const fetchMock = mockFetch([jsonResponse({})]);
    const res = await putDefaultNavigation(makeRequest("/api/app-navigation/default", { method: "PUT", body: { ...NAV, tabs: [] } }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("saves a trimmed default config", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: { ...NAV, type: "default" }, message: "Saved" })]);

    const res = await putDefaultNavigation(
      makeRequest("/api/app-navigation/default", { method: "PUT", body: { ...NAV, navbar: [" SPORTS ", "SHOP"], extra: true } }),
    );

    const call = fetchCall(fetchMock);
    expect(call).toMatchObject({ url: `${API_BASE_URL}/app-navigation/default`, method: "PUT", body: NAV });
    expect(await readJson(res)).toMatchObject({ success: true, message: "Saved" });
  });

  it.each([
    [{ os: "windows", version: "1.0.0" }, "os is required and must be android or ios"],
    [{ os: "ios", version: " " }, "version is required"],
  ])("rejects a version override for %j", async (target, message) => {
    const res = await putVersion(makeRequest("/api/app-navigation/version", { method: "PUT", body: { ...NAV, ...target } }));
    expect(res.status).toBe(400);
    expect((await readJson(res)).message).toBe(message);
  });

  it("upserts a version override with its full config", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: {} })]);
    await putVersion(makeRequest("/api/app-navigation/version", { method: "PUT", body: { ...NAV, os: " android ", version: "2.3.0" } }));
    expect(fetchCall(fetchMock).body).toEqual({ os: "android", version: "2.3.0", ...NAV });
  });

  it("deletes a version override by os and version only", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: null, message: "Deleted" })]);
    await deleteVersion(makeRequest("/api/app-navigation/version", { method: "DELETE", body: { os: "ios", version: "2.3.0", tabs: ["X"] } }));
    expect(fetchCall(fetchMock)).toMatchObject({ method: "DELETE", body: { os: "ios", version: "2.3.0" } });
  });

  it("rejects a malformed body", async () => {
    const res = await putDefaultNavigation(makeRequest("/api/app-navigation/default", { method: "PUT", body: "{" }));
    expect(res.status).toBe(500);
    expect((await readJson(res)).success).toBe(false);
  });
});

describe("GET /api/events", () => {
  const page = { items: [{ _id: "e1" }], page: 2, limit: 20, total: 21, totalPages: 2, hasMore: false };

  it.each([
    ["", "page=1&limit=20"],
    ["?page=3&limit=5", "page=3&limit=5"],
    ["?page=2.7&limit=500", "page=2&limit=100"],
    ["?page=-1&limit=abc", "page=1&limit=20"],
  ])("pages %j as %s", async (query, backendQuery) => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: page })]);
    await getEvents(makeRequest(`/api/events${query}`));
    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}/events/paginatedEvents?${backendQuery}`);
  });

  it("passes a paginated body through", async () => {
    signIn();
    mockFetch([jsonResponse({ data: page })]);
    expect((await readJson(await getEvents(makeRequest("/api/events?page=2")))).data).toEqual(page);
  });

  it("wraps a bare list in a single page", async () => {
    signIn();
    mockFetch([jsonResponse([{ _id: "e1" }, { _id: "e2" }])]);
    expect((await readJson(await getEvents(makeRequest("/api/events?page=1&limit=10")))).data).toEqual({
      items: [{ _id: "e1" }, { _id: "e2" }],
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
      hasMore: false,
    });
  });

  it("treats a 404 as an empty page", async () => {
    signIn();
    mockFetch([jsonResponse({}, 404)]);
    expect((await readJson(await getEvents(makeRequest("/api/events")))).data).toEqual({
      items: [],
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasMore: false,
    });
  });
});

describe("POST /api/events", () => {
  const event = {
    tournament: "IPL",
    eventName: "Will it rain?",
    haveThreeOptions: false,
    yesPlaceholder: "Yes",
    noPlaceholder: "No",
    entryStartTime: "2026-08-08T10:00:00.000+05:30",
    entryCloseTime: "2026-08-08T19:30:00.000+05:30",
  };

  it("sends only the event fields, linking a match when asked", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: { _id: "e1" } }, 201)]);

    const res = await createEvent(
      makeRequest("/api/events", {
        method: "POST",
        body: { ...event, matchId: "  m1  ", isRacingMatchEvent: false, eventStatus: "SETTLEMENT_DONE" },
      }),
    );

    expect(res.status).toBe(201);
    const { body } = fetchCall(fetchMock);
    expect(body).toMatchObject({ ...event, matchId: "m1", isRacingMatchEvent: false });
    expect(body).not.toHaveProperty("eventStatus");
  });

  it.each([
    ["a blank match id", { matchId: "  ", isRacingMatchEvent: "yes" }],
    ["a non-string match id", { matchId: 42 }],
  ])("leaves the match link out for %s", async (_, extra) => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: {} }, 201)]);
    await createEvent(makeRequest("/api/events", { method: "POST", body: { ...event, ...extra } }));
    const { body } = fetchCall(fetchMock);
    expect(body).not.toHaveProperty("matchId");
    expect(body).not.toHaveProperty("isRacingMatchEvent");
  });

  it.each([
    [{ errors: ["eventName is required", "tournament is required"] }, "eventName is required; tournament is required"],
    [{ message: "Validation failed", data: { error: "Race does not belong to the given tournament" } }, "Race does not belong to the given tournament"],
  ])("shows the backend's reason (%#)", async (backend, message) => {
    signIn();
    mockFetch([jsonResponse(backend, 400)]);
    const res = await createEvent(makeRequest("/api/events", { method: "POST", body: event }));
    expect(res.status).toBe(400);
    expect((await readJson(res)).message).toBe(message);
  });
});

describe("/api/knowledge-quiz/questions", () => {
  const question = {
    sportsType: "cricket",
    questionText: "  Which country won the 2011 World Cup?  ",
    answerOptions: [" India ", "Sri Lanka"],
    correctAnswer: ["India "],
    correctAnswerIndex: [0],
    xp: 10,
  };

  it("validates before creating", async () => {
    const fetchMock = mockFetch([jsonResponse({})]);
    const res = await createKqQuestion(makeRequest("/api/knowledge-quiz/questions", { method: "POST", body: { ...question, xp: -1 } }));
    expect(res.status).toBe(400);
    expect((await readJson(res)).message).toBe("xp must be a number greater than or equal to 0");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("trims the question, defaults the answer type and never sends a client id", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: { _id: "q1", kqQuestionId: "KQ-C-1" } }, 201)]);

    const res = await createKqQuestion(
      makeRequest("/api/knowledge-quiz/questions", { method: "POST", body: { ...question, kqQuestionId: "KQ-C-999" } }),
    );

    expect(res.status).toBe(201);
    expect(fetchCall(fetchMock).body).toEqual({
      sportsType: "cricket",
      answerType: "single",
      questionText: "Which country won the 2011 World Cup?",
      answerOptions: ["India", "Sri Lanka"],
      correctAnswer: ["India"],
      correctAnswerIndex: [0],
      xp: 10,
    });
  });

  it("replays once when two admins collide on the question id", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({}, 409), jsonResponse({ data: { _id: "q1" } }, 201)]);
    const res = await createKqQuestion(makeRequest("/api/knowledge-quiz/questions", { method: "POST", body: question }));
    expect(res.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchCall(fetchMock, 1).body).toEqual(fetchCall(fetchMock, 0).body);
  });

  it("gives up after a second collision", async () => {
    signIn();
    mockFetch([jsonResponse({}, 409)]);
    const res = await createKqQuestion(makeRequest("/api/knowledge-quiz/questions", { method: "POST", body: question }));
    expect(res.status).toBe(409);
    expect((await readJson(res)).message).toMatch(/^Another superadmin created a question/);
  });

  it.each([
    ["", "page=1&limit=50"],
    ["?page=2&limit=500&search=%20kohli%20&sportsType=cricket&answerType=multiple", "page=2&limit=100&sportsType=cricket&answerType=multiple&search=kohli"],
  ])("lists with %j as %s", async (query, backendQuery) => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: { items: [] } })]);
    await listKqQuestions(makeRequest(`/api/knowledge-quiz/questions${query}`));
    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}/knowledge-quiz/questions?${backendQuery}`);
  });

  it.each([
    ["?sportsType=golf", "sportsType must be one of: football, cricket, basketball, tennis, racing"],
    ["?answerType=both", "answerType must be one of: single, multiple"],
  ])("refuses an unknown filter %s instead of returning everything", async (query, message) => {
    const fetchMock = mockFetch([jsonResponse({})]);
    const res = await listKqQuestions(makeRequest(`/api/knowledge-quiz/questions${query}`));
    expect(res.status).toBe(400);
    expect((await readJson(res)).message).toBe(message);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("hides an HTML error page behind a readable message", async () => {
    signIn();
    mockFetch([textResponse("<html>502 Bad Gateway</html>", 502)]);
    const res = await listKqQuestions(makeRequest("/api/knowledge-quiz/questions"));
    expect(res.status).toBe(502);
    expect((await readJson(res)).message).toBe("Failed to load questions (Status: 502)");
  });
});
