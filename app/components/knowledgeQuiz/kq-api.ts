"use client";

import type {
  CreateKqQuestionPayload,
  KqQuestion,
  KqQuestionList,
  KqQuestionListParams,
} from "@/app/interface/knowledge-quiz.interface";

/** Call a knowledge-quiz proxy route, unwrap `data`, and throw on failure. */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/knowledge-quiz${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}

export const kqApi = {
  listQuestions: (params: KqQuestionListParams = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sportsType) query.set("sportsType", params.sportsType);
    if (params.answerType) query.set("answerType", params.answerType);
    if (params.search?.trim()) query.set("search", params.search.trim());
    const qs = query.toString();
    return request<KqQuestionList>(`/questions${qs ? `?${qs}` : ""}`);
  },

  createQuestion: (payload: CreateKqQuestionPayload) =>
    request<KqQuestion>("/questions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
