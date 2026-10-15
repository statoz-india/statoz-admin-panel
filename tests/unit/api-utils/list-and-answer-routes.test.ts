import { describe, expect, it, vi } from "vitest";
import { handleMatchAnswersRequest, MatchAnswersError } from "@/app/api/utils/match-answers-route";
import { matchScopedListResponse } from "@/app/api/utils/match-scoped-list";
import { pendingSettlementListResponse } from "@/app/api/utils/pending-settlement-list";
import type { MatchAnswersResult } from "@/app/interface/match-answers.interface";
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

describe("matchScopedListResponse", () => {
  const list = (matchId: string | undefined) =>
    matchScopedListResponse(matchId, (id) => `/quiz/matchQuizzes/${id}`, "quizzes");

  it("requires a match id", async () => {
    const res = await list("  ");
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ success: false, message: "Match id is required" });
  });

  it("trims and encodes the match id", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: [] })]);
    await list(" ipl/2026 final ");
    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}/quiz/matchQuizzes/ipl%2F2026%20final`);
  });

  it.each([
    [{ data: [{ _id: "q1" }] }, [{ _id: "q1" }]],
    [{ data: { items: [{ _id: "q2" }] } }, [{ _id: "q2" }]],
    [[{ _id: "q3" }], [{ _id: "q3" }]],
  ])("returns the list from %j", async (body, items) => {
    signIn();
    mockFetch([jsonResponse(body)]);
    expect(await readJson(await list("m1"))).toMatchObject({ success: true, data: items });
  });

  it("turns 'no quizzes yet' (404 with data: []) into an empty list", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, message: "No quizzes found", data: [] }, 404)]);
    const res = await list("m1");
    expect(res.status).toBe(200);
    expect(await readJson(res)).toEqual({ success: true, data: [], message: "No quizzes found" });
  });

  it("keeps 'no such match' (404 with data: null) a 404", async () => {
    signIn();
    mockFetch([jsonResponse({ success: false, data: null }, 404)]);
    const res = await list("m1");
    expect(res.status).toBe(404);
    expect(await readJson(res)).toEqual({ success: false, message: "Match not found" });
  });

  it("passes other failures on with the backend's message", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "DB timeout" }, 503)]);
    const res = await list("m1");
    expect(res.status).toBe(503);
    expect(await readJson(res)).toEqual({ success: false, message: "DB timeout" });
  });

  it("copes with a non-JSON failure", async () => {
    signIn();
    mockFetch([textResponse("<html>", 500)]);
    expect(await readJson(await list("m1"))).toEqual({ success: false, message: "Failed to fetch quizzes" });
  });

  it("reports an expired session", async () => {
    signIn();
    mockFetch(() => jsonResponse({}, 401));
    expect((await list("m1")).status).toBe(401);
  });

  it("turns a network failure into a 500", async () => {
    signIn();
    mockFetch(() => {
      throw new Error("ECONNREFUSED");
    });
    const res = await list("m1");
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ success: false, message: "ECONNREFUSED" });
  });
});

describe("pendingSettlementListResponse", () => {
  const list = () => pendingSettlementListResponse("/quiz/pendingSettlementQuizzes", "pending quizzes");

  it("returns the pending items", async () => {
    signIn();
    mockFetch([jsonResponse({ data: [{ _id: "q1" }], message: "Found" })]);
    expect(await readJson(await list())).toEqual({ success: true, data: [{ _id: "q1" }], message: "Found" });
  });

  it("treats 404 (nothing pending) as an empty list", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "Nothing pending" }, 404)]);
    const res = await list();
    expect(res.status).toBe(200);
    expect(await readJson(res)).toEqual({ success: true, data: [], message: "Nothing pending" });
  });

  it("explains a 403 for a non-superadmin", async () => {
    signIn();
    mockFetch([jsonResponse({}, 403)]);
    const res = await list();
    expect(res.status).toBe(403);
    expect(await readJson(res)).toEqual({ success: false, message: "Forbidden - SuperAdmin access required" });
  });

  it("passes the backend's 403 message on", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "Admins only" }, 403)]);
    expect((await readJson(await list())).message).toBe("Admins only");
  });

  it("reports other failures", async () => {
    signIn();
    mockFetch([textResponse("", 500)]);
    expect(await readJson(await list())).toEqual({ success: false, message: "Failed to fetch pending quizzes" });
  });

  it("reports an expired session", async () => {
    signIn();
    mockFetch(() => jsonResponse({}, 498));
    expect((await list()).status).toBe(401);
  });
});

describe("handleMatchAnswersRequest", () => {
  const quiz = {
    _id: "quiz-1",
    gameType: "cricket",
    teamA: { name: "India" },
    teamB: { name: "Australia" },
    questionsArray: [{ _id: "q1", questionText: "Which team will win the match?", options: ["India", "Australia"] }],
  };
  const result = { source: "cricbuzz", proposals: [] } as unknown as MatchAnswersResult;

  type Answer = Parameters<typeof handleMatchAnswersRequest>[3];

  const run = (body: unknown, answer: Answer = vi.fn(async () => result), gameType: "cricket" | "football" = "cricket") =>
    handleMatchAnswersRequest(
      makeRequest("/api/quiz/quiz-1/cricbuzz-answers", { method: "POST", body }),
      routeContext({ id: "quiz-1" }),
      gameType,
      answer,
    );

  it("loads the quiz and passes it, with the trimmed match URL, to the lookup", async () => {
    signIn();
    const fetchMock = mockFetch([jsonResponse({ data: quiz })]);
    const answer = vi.fn(async () => result);

    const res = await run({ matchUrl: "  https://www.cricbuzz.com/live-cricket-scores/1/x " }, answer);

    expect(fetchCall(fetchMock).url).toBe(`${API_BASE_URL}/quiz/getAdminQuizDetails/quiz-1`);
    expect(answer).toHaveBeenCalledWith(quiz, "https://www.cricbuzz.com/live-cricket-scores/1/x", []);
    expect(await readJson(res)).toEqual({ success: true, data: result });
  });

  it("works without a body", async () => {
    signIn();
    mockFetch([jsonResponse({ data: quiz })]);
    const answer = vi.fn(async () => result);
    await handleMatchAnswersRequest(
      makeRequest("/api/quiz/quiz-1/cricbuzz-answers", { method: "POST" }),
      routeContext({ id: "quiz-1" }),
      "cricket",
      answer,
    );
    expect(answer).toHaveBeenCalledWith(quiz, "", []);
  });

  it("requires a quiz id", async () => {
    const res = await handleMatchAnswersRequest(makeRequest("/x", { method: "POST" }), routeContext({ id: "" }), "cricket", vi.fn());
    expect(res.status).toBe(400);
  });

  it("refuses a quiz with no questions", async () => {
    signIn();
    mockFetch([jsonResponse({ data: { ...quiz, questionsArray: [] } })]);
    const res = await run({});
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ success: false, message: "This quiz has no questions to answer.", sourceUrls: [] });
  });

  it("refuses a quiz of another sport", async () => {
    signIn();
    mockFetch([jsonResponse({ data: { ...quiz, gameType: "football" } })]);
    const res = await run({});
    expect(res.status).toBe(400);
    expect((await readJson(res)).message).toBe("This lookup is for cricket quizzes (this one is football).");
  });

  it("returns the lookup's own 4xx with the pages it read", async () => {
    signIn();
    mockFetch([jsonResponse({ data: quiz })]);
    const answer = vi.fn<Answer>(async (_quiz, _url, sourceUrls) => {
      sourceUrls.push({ label: "Recent matches", url: "https://cricbuzz.test/recent" });
      throw new MatchAnswersError("Couldn't find India vs Australia on Cricbuzz.", 404);
    });

    const res = await run({}, answer);

    expect(res.status).toBe(404);
    expect(await readJson(res)).toEqual({
      success: false,
      message: "Couldn't find India vs Australia on Cricbuzz.",
      sourceUrls: [{ label: "Recent matches", url: "https://cricbuzz.test/recent" }],
    });
  });

  it("turns an unexpected lookup failure into a 502", async () => {
    signIn();
    mockFetch([jsonResponse({ data: quiz })]);
    const res = await run({}, vi.fn(async () => {
      throw new Error("Cricbuzz returned 503");
    }));
    expect(res.status).toBe(502);
    expect((await readJson(res)).message).toBe("Cricbuzz returned 503");
  });

  it("reports an expired session", async () => {
    signIn();
    mockFetch(() => jsonResponse({}, 401));
    expect((await run({})).status).toBe(401);
  });
});

describe("MatchAnswersError", () => {
  it("defaults to 400", () => {
    expect(new MatchAnswersError("x").status).toBe(400);
    expect(new MatchAnswersError("x", 404).status).toBe(404);
  });
});
