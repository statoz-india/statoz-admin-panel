/**
 * Which seasons can be given to a team, per tournament — these are the options
 * in the Seasons dropdown on the team create and edit forms.
 *
 * Add a tournament by its code — the same code the Teams page shows for it,
 * e.g. "IPL" — and list the seasons its teams can pick. Each season is either a
 * single year ("2026") or a split season ("2026/27"). The first one is what a
 * new team in that tournament starts with. Matching ignores letter case.
 *
 * Example:
 *   IPL: ["2026"],
 *   EPL: ["2025/26", "2026/27"],
 */
export const TEAM_SEASONS_BY_TOURNAMENT: Record<string, readonly string[]> = {
  // IPL: ["2026"],
};

/** Offered for any tournament that has no entry above, and before one is picked. */
export const DEFAULT_TEAM_SEASON_OPTIONS: readonly string[] = [
  "2026",
  "2026/27",
];

/**
 * The season options for a tournament code. `alsoInclude` keeps seasons a team
 * already has that aren't configured (e.g. saved before this list existed)
 * selectable instead of silently dropping them.
 */
export function getTeamSeasonOptions(
  tournament: string,
  alsoInclude: readonly string[] = [],
): string[] {
  const code = tournament.trim().toLowerCase();
  const configured = Object.entries(TEAM_SEASONS_BY_TOURNAMENT).find(
    ([key]) => key.toLowerCase() === code,
  );
  const options = [...(configured ? configured[1] : DEFAULT_TEAM_SEASON_OPTIONS)];

  for (const season of alsoInclude) {
    if (!options.includes(season)) options.push(season);
  }

  return options;
}
