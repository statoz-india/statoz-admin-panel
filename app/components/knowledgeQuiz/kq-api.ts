"use client";

import type {
  CreateKqQuestionPayload,
  CreateKqSetPayload,
  CreateKqSportPayload,
  KqSet,
  KqSetList,
  KqSetListParams,
  KqQuestion,
  KqQuestionList,
  KqQuestionListParams,
  KqSportQuiz,
  UpdateKqQuestionPayload,
  UpdateKqSportPayload,
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

  updateQuestion: (id: string, payload: UpdateKqQuestionPayload) =>
    request<KqQuestion>(`/questions/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  listSports: () => request<KqSportQuiz[]>("/sports"),

  createSport: (payload: CreateKqSportPayload) =>
    request<KqSportQuiz>("/sports", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateSport: (id: string, payload: UpdateKqSportPayload) =>
    request<KqSportQuiz>(`/sports/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  listSets: (params: KqSetListParams = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.knowledgeQuizId)
      query.set("knowledgeQuizId", params.knowledgeQuizId);
    if (params.category) query.set("category", params.category);
    if (params.chapterName) query.set("chapterName", params.chapterName);
    if (params.includeQuestions) query.set("includeQuestions", "true");
    const qs = query.toString();
    return request<KqSetList>(`/sets${qs ? `?${qs}` : ""}`);
  },

  createSet: (payload: CreateKqSetPayload) =>
    request<KqSet>("/sets", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
