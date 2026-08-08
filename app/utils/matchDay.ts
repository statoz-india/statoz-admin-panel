/**
 * Helpers for the match-day date strings used by `/match/matchesForDate/:date`.
 *
 * The backend buckets a match into a day by rendering `matchStartTime` through
 * `$dateToString` with `timezone: SCORE_TIMEZONE`, **not** UTC. A fixture at
 * `2026-08-08T20:30:00Z` is `2026-08-09 02:00 IST` and therefore belongs to
 * `2026-08-09`. Every day string sent to that endpoint has to be built in the
 * same timezone, or late-evening fixtures land on the wrong day.
 */

/** Must match the backend's `SCORE_TIMEZONE`. */
export const SCORE_TIMEZONE = "Asia/Kolkata";

/** The shape the backend validates `:date` against. */
export const MATCH_DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const pad = (value: number) => String(value).padStart(2, "0");

function partsOf(day: string): [number, number, number] {
  const [year, month, date] = day.split("-").map(Number);
  return [year, month, date];
}

/**
 * `Date` → `YYYY-MM-DD` as seen in `SCORE_TIMEZONE`.
 *
 * `toISOString().slice(0, 10)` is UTC and skews for anyone outside IST, so the
 * parts are read back from `Intl` instead of assuming a locale's field order.
 */
export function toMatchDay(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SCORE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Today's date in `SCORE_TIMEZONE`. */
export const todayMatchDay = () => toMatchDay(new Date());

/**
 * The backend's regex is shape-only, so `2026-13-45` passes validation and then
 * quietly matches nothing. Check the calendar too, to tell bad input apart from
 * a genuinely empty day.
 */
export function isRealMatchDay(day: string): boolean {
  if (!MATCH_DAY_PATTERN.test(day)) return false;
  const [year, month, date] = partsOf(day);
  const parsed = new Date(Date.UTC(year, month - 1, date));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === date
  );
}

/** Step a day string by whole calendar days. Timezone-free: the string is already wall-clock. */
export function shiftMatchDay(day: string, deltaDays: number): string {
  const [year, month, date] = partsOf(day);
  const shifted = new Date(
    Date.UTC(year, month - 1, date) + deltaDays * 24 * 60 * 60 * 1000,
  );
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(
    shifted.getUTCDate(),
  )}`;
}

/**
 * `YYYY-MM-DD` → a local-midnight `Date`, for calendar widgets.
 *
 * Deliberately *not* timezone-converted: a calendar shows wall-clock days, so
 * the cell the admin clicks is the day they mean. Pair with `dateToMatchDay`.
 */
export function matchDayToDate(day: string): Date | undefined {
  if (!isRealMatchDay(day)) return undefined;
  const [year, month, date] = partsOf(day);
  return new Date(year, month - 1, date);
}

/** Inverse of `matchDayToDate` — reads the `Date`'s local calendar fields. */
export function dateToMatchDay(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `2026-08-08` → `Sat, 8 Aug 2026`. */
export function formatMatchDayLabel(day: string): string {
  if (!isRealMatchDay(day)) return day;
  const [year, month, date] = partsOf(day);
  return new Date(Date.UTC(year, month - 1, date)).toLocaleDateString("en-IN", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
