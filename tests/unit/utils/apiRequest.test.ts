import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";
import { ApiRequestError, apiRequest } from "@/app/utils/apiRequest";
import { fetchCall, jsonResponse, mockFetch, textResponse } from "../../helpers/http";

describe("apiRequest", () => {
  it("unwraps data from a successful envelope", async () => {
    const fetchMock = mockFetch([jsonResponse({ success: true, data: { id: 7 } })]);

    await expect(apiRequest("/api/players", { method: "POST", body: "{}" }, "Failed")).resolves.toEqual({ id: 7 });

    const { url, init, method } = fetchCall(fetchMock);
    expect(url).toBe("/api/players");
    expect(method).toBe("POST");
    expect(init.credentials).toBe("include");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("throws the backend's message, field errors and status", async () => {
    mockFetch([jsonResponse({ success: false, message: "Invalid player", errors: ["playerName is required", 42] }, 422)]);

    const error = await apiRequest("/api/players", {}, "Failed").catch((e) => e);

    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error).toMatchObject({
      name: "ApiRequestError",
      message: "Invalid player",
      errors: ["playerName is required"],
      status: 422,
    });
  });

  it("treats success:false on a 200 as a failure", async () => {
    mockFetch([jsonResponse({ success: false, message: "Nope" })]);
    await expect(apiRequest("/x", {}, "Failed")).rejects.toMatchObject({ message: "Nope", status: 200 });
  });

  it("falls back to the given message for a non-JSON error", async () => {
    mockFetch([textResponse("<html>Bad gateway</html>", 502)]);
    await expect(apiRequest("/x", {}, "Could not load players")).rejects.toMatchObject({
      message: "Could not load players",
      errors: [],
      status: 502,
    });
  });

  it("lets a network failure through", async () => {
    mockFetch(() => {
      throw new TypeError("Failed to fetch");
    });
    await expect(apiRequest("/x", {}, "Failed")).rejects.toThrow("Failed to fetch");
  });
});

describe("ApiRequestError", () => {
  it("defaults to no field errors and status 0", () => {
    const error = new ApiRequestError("boom");
    expect(error).toBeInstanceOf(Error);
    expect(error.errors).toEqual([]);
    expect(error.status).toBe(0);
  });
});

describe("cn", () => {
  it("joins classes and lets later Tailwind classes win", () => {
    expect(cn("px-2 py-1", false && "hidden", { "text-white": true }, "px-4")).toBe("py-1 text-white px-4");
  });
});
