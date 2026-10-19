import { describe, expect, it } from "vitest";
import {
  API_TESTING_HISTORY_LIMIT,
  historyKey,
  toCurlCommand,
  withRequest,
  type ApiTestingHistoryEntry,
} from "@/app/utils/apiTestingHistory";
import { parseCurl } from "@/app/utils/curl-parser";

const request = {
  method: "post",
  url: " /knowledge-quiz/create ",
  headers: [
    { key: "Content-Type", value: "application/json" },
    { key: "Authorization", value: "Bearer secret" },
  ],
  body: '{"name":"it\'s"}',
};

describe("API testing history", () => {
  it("stores the request without auth headers, newest first", () => {
    const [entry] = withRequest([], request, 1);
    expect(entry).toEqual({
      method: "POST",
      url: "/knowledge-quiz/create",
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: '{"name":"it\'s"}',
      lastSentAt: 1,
    });
  });

  it("moves a repeated request to the top instead of duplicating it", () => {
    let history = withRequest([], request, 1);
    history = withRequest(history, { ...request, method: "GET", body: null }, 2);
    history = withRequest(history, request, 3);
    expect(history.map((e) => [e.method, e.lastSentAt])).toEqual([
      ["POST", 3],
      ["GET", 2],
    ]);
  });

  it("keeps at most the limit", () => {
    let history: ApiTestingHistoryEntry[] = [];
    for (let i = 0; i < API_TESTING_HISTORY_LIMIT + 5; i += 1) {
      history = withRequest(history, { ...request, url: `/x/${i}` }, i);
    }
    expect(history).toHaveLength(API_TESTING_HISTORY_LIMIT);
    expect(history[0].url).toBe(`/x/${API_TESTING_HISTORY_LIMIT + 4}`);
  });

  it("rebuilds a cURL command the parser reads back unchanged", () => {
    const [entry] = withRequest([], request, 1);
    const parsed = parseCurl(toCurlCommand(entry));
    expect(historyKey(parsed)).toBe(historyKey(entry));
    expect(parsed.headers).toEqual(entry.headers);
  });
});
