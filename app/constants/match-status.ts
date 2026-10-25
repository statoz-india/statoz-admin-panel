/**
 * `matchStatus` on cricket/football matches — the backend's
 * `MatchStatusTypes`. Lower-case, unlike quiz/prediction/event statuses.
 */
export const MATCH_STATUS_VALUES = [
  "upcoming",
  "live",
  "result",
  "canceled",
  "abandoned",
  "no_result",
  "postponed",
] as const;

export type MatchStatus = (typeof MATCH_STATUS_VALUES)[number];

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  upcoming: "Upcoming",
  live: "Live",
  result: "Result",
  canceled: "Canceled",
  abandoned: "Abandoned",
  no_result: "No result",
  postponed: "Postponed",
};

/** Backend expects a match `tag` when the admin sets one of these statuses. */
export const MATCH_STATUSES_REQUIRING_REASON: readonly MatchStatus[] = [
  "no_result",
  "abandoned",
  "canceled",
  "postponed",
];

export function matchStatusRequiresReason(
  status: string | undefined | null,
): boolean {
  if (!status) return false;
  const normalized = status.trim().toLowerCase();
  return (MATCH_STATUSES_REQUIRING_REASON as readonly string[]).includes(
    normalized,
  );
}
