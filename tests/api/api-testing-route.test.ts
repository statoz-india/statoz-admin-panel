import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/api-testing/route";
import { signIn } from "../helpers/cookies";
import { API_BASE_URL, fetchCall, jsonResponse, makeRequest, mockFetch, readJson, textResponse } from "../helpers/http";

type Sent = { request: Record<string, unknown>; response: Record<string, unknown> };

function send(payload: unknown) {
  return POST(makeRequest("/api/api-testing", { method: "POST", body: payload }));
}

describe("POST /api/api-testing", () => {
  it("needs an admin session", async () => {
    const res = await send({ url: "/users" });
    expect(res.status).toBe(401);
  });

  it("sends a path to API_BASE_URL with the admin's token, masking it in the echo", async () => {
    signIn("secret-token-123");
    const fetchMock = mockFetch([jsonResponse({ hello: "world" }, 200, { "X-Request-Id": "r1" })]);

    const res = await send({
      method: "post",
      url: "knowledge-quiz/questions",
      headers: [
        { key: "X-Trace", value: "abc" },
        { key: "Authorization", value: "Bearer stolen" },
        { key: "Cookie", value: "accessToken=other" },
        { key: "Host", value: "evil.test" },
        { key: 7, value: "dropped" },
      ],
      body: '{"a":1}',
    });

    const call = fetchCall(fetchMock);
    expect(call.url).toBe(`${API_BASE_URL}/knowledge-quiz/questions`);
    expect(call.method).toBe("POST");
    expect(call.body).toEqual({ a: 1 });
    expect(call.headers).toMatchObject({
      "X-Trace": "abc",
      "Content-Type": "application/json",
      Cookie: "accessToken=secret-token-123",
      Authorization: "Bearer secret-token-123",
    });
    expect(call.headers).not.toHaveProperty("Host");

    const { data } = await readJson<{ data: Sent }>(res);
    expect(data.request).toMatchObject({ method: "POST", url: `${API_BASE_URL}/knowledge-quiz/questions`, body: '{"a":1}', refreshedToken: false });
    expect(data.request.headers).toContainEqual({ key: "Authorization", value: "Bearer <session access token>" });
    expect(data.request.headers).toContainEqual({ key: "Cookie", value: "accessToken=<session access token>" });
    expect(JSON.stringify(data)).not.toContain("secret-token-123");
    expect(data.response).toMatchObject({ status: 200, ok: true, body: '{"hello":"world"}', truncated: false });
    expect(data.response.headers).toContainEqual({ key: "x-request-id", value: "r1" });
  });

  it("sends an absolute URL as-is and never a body on GET", async () => {
    signIn();
    const fetchMock = mockFetch([textResponse("ok")]);

    await send({ method: "GET", url: "https://staging.statoz.test/api/v1/health", body: "ignored" });

    const call = fetchCall(fetchMock);
    expect(call.url).toBe("https://staging.statoz.test/api/v1/health");
    expect(call.init.body).toBeUndefined();
  });

  it("reports the backend's failure as data, not as its own failure", async () => {
    signIn();
    mockFetch([jsonResponse({ message: "nope" }, 404)]);
    const res = await send({ url: "/missing" });
    expect(res.status).toBe(200);
    expect((await readJson<{ data: Sent }>(res)).data.response).toMatchObject({ status: 404, ok: false });
  });

  it("refreshes an expired token and retries once", async () => {
    signIn("old", "refresh");
    const fetchMock = mockFetch((url, init) => {
      if (url.endsWith("/authorization/refresh-token")) return jsonResponse({ success: true, data: { accessToken: "new" } });
      return (init.headers as Record<string, string>).Cookie === "accessToken=new" ? textResponse("fresh") : textResponse("", 498);
    });

    const { data } = await readJson<{ data: Sent }>(await send({ url: "/x" }));

    expect(data.request.refreshedToken).toBe(true);
    expect(data.response).toMatchObject({ status: 200, body: "fresh" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it.each([
    [{ method: "TRACE", url: "/x" }, 'Unsupported HTTP method "TRACE".'],
    [{ url: "  " }, "No URL in the request."],
    [{ url: 42 }, "No URL in the request."],
    [{ url: "file:///etc/passwd" }, "Only http and https URLs can be sent."],
    [{ url: "https://exa mple.test/" }, '"https://exa mple.test/" is not a valid URL.'],
  ])("rejects %j", async (payload, message) => {
    signIn();
    const fetchMock = mockFetch([textResponse("")]);
    const res = await send(payload);
    expect(res.status).toBe(400);
    expect((await readJson(res)).message).toBe(message);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed payload", async () => {
    signIn();
    const res = await POST(makeRequest("/api/api-testing", { method: "POST", body: "{not json" }));
    expect(res.status).toBe(400);
    expect((await readJson(res)).message).toBe("Malformed request payload.");
  });

  it("explains a timeout", async () => {
    signIn();
    mockFetch(() => {
      throw Object.assign(new Error("timed out"), { name: "TimeoutError" });
    });
    const res = await send({ url: "/slow" });
    expect(res.status).toBe(504);
    expect((await readJson(res)).message).toBe("The request did not finish within 30s.");
  });
});
