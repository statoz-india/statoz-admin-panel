"use client";

import type {
  PendingEvent,
  PendingPrediction,
  PendingQuiz,
} from "@/app/interface/pending-settlement.interface";
import type { EventWinningOption } from "@/app/models/events.model";

export type PredictionWinningTeam = "A" | "B" | "D";

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

/** The proxies collapse the backend's 404-on-empty into an empty 200. */
async function getList<T>(path: string): Promise<T[]> {
  const res = await fetch(path, {
    method: "GET",
    headers: JSON_HEADERS,
    credentials: "include",
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return Array.isArray(body.data) ? body.data : [];
}

/** Returns the backend message so callers can surface e.g. "Payouts completed (no winners)". */
async function post(path: string, payload?: unknown): Promise<string | null> {
  const res = await fetch(path, {
    method: "POST",
    headers: JSON_HEADERS,
    credentials: "include",
    body: JSON.stringify(payload ?? {}),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return typeof body.message === "string" ? body.message : null;
}

export const unresolvedApi = {
  listQuizzes: () => getList<PendingQuiz>("/api/quiz/pending-settlement"),
  listPredictions: () =>
    getList<PendingPrediction>("/api/predictions/pending-settlement"),
  listEvents: () => getList<PendingEvent>("/api/events/pending-settlement"),

  /** Step 2 for quizzes: credits XP and closes the quiz. */
  settleQuiz: (id: string) =>
    post(`/api/quiz/${encodeURIComponent(id)}/settle-quiz`),

  /** Step 1 for predictions. `winningTeamId` is required for A/B and omitted for D. */
  declarePredictionResult: (
    id: string,
    winningTeam: PredictionWinningTeam,
    winningTeamId?: string,
  ) =>
    post(`/api/predictions/${encodeURIComponent(id)}/setCorrectTeamWon`, {
      winningTeam,
      ...(winningTeamId ? { winningTeamId } : {}),
    }),

  /** Step 2 for predictions. */
  settlePrediction: (id: string) =>
    post(`/api/predictions/${encodeURIComponent(id)}/distributePayout`),

  /** Step 1 for events. `M` is only accepted when `haveThreeOptions` is true. */
  declareEventResult: (id: string, winningOption: EventWinningOption) =>
    post(`/api/events/${encodeURIComponent(id)}/update-result`, {
      winningOption,
    }),

  /** Step 2 for events. Requires `eventStatus` to be exactly `WINNING_OPTION_UPDATED`. */
  settleEvent: (id: string) =>
    post(`/api/events/${encodeURIComponent(id)}/distribute-payout`),
};
