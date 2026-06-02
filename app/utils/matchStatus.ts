export type MatchStatusBucket = "live" | "finished" | "upcoming" | "unknown";

const LIVE_KEYWORDS = [
  "live",
  "in progress",
  "ongoing",
  "stumps",
  "innings break",
  "half-time",
  "quarter",
  "first half",
];

const FINISHED_EXACT = [
  "full time",
  "final",
  "result",
  "final score - after extra time",
  "final score - after penalties",
];

const FINISHED_CONTAINS = [
  "ft",
  "match ended",
  "won by",
  "match drawn",
  "match tied",
  "abandoned",
  "no result",
];

const UPCOMING_KEYWORDS = [
  "not started",
  "scheduled",
  "starts at",
  "starts in",
  "tbd",
];

export function resolveMatchStatusBucket(
  status: string | undefined | null,
  matchStartTime?: string | null,
  hasMatchEvent: boolean = true,
): MatchStatusBucket {
  const raw = (status ?? "").trim().toLowerCase();

  if (!raw) {
    if (!hasMatchEvent && matchStartTime) {
      const t = Date.parse(matchStartTime);
      if (Number.isFinite(t) && t > Date.now()) return "upcoming";
    }
    return "unknown";
  }

  if (LIVE_KEYWORDS.some((k) => raw.includes(k))) return "live";

  if (FINISHED_EXACT.includes(raw)) return "finished";
  if (FINISHED_CONTAINS.some((k) => raw.includes(k))) return "finished";

  if (UPCOMING_KEYWORDS.some((k) => raw.includes(k))) return "upcoming";

  return "unknown";
}
