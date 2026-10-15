/**
 * A team's `season` is an array of strings, each either a single year
 * (`"2026"`) or a split season (`"2026/27"`). Which ones can be picked is set in
 * `app/utils/team-season-options.ts`; the backend enforces the format.
 */

/** Same pattern the backend enforces: `YYYY` or `YYYY/YY`. */
export const SEASON_PATTERN = /^\d{4}(\/\d{2})?$/;

export function isValidSeason(value: string): boolean {
  return SEASON_PATTERN.test(value);
}

/** Trim entries and drop duplicates, keeping first-seen order (the backend does the same). */
export function normalizeSeasons(seasons: readonly string[]): string[] {
  return Array.from(new Set(seasons.map((season) => season.trim())));
}

export function sameSeasons(
  a: readonly string[],
  b: readonly string[],
): boolean {
  return a.length === b.length && a.every((season, i) => season === b[i]);
}

/**
 * Older teams have no `season` field at all (not `[]`), and an empty list means
 * "no seasons" — both read as "not set" in the table.
 */
export function formatSeasons(seasons: readonly string[] | null | undefined) {
  return seasons && seasons.length > 0 ? seasons.join(", ") : "—";
}
