/** `from` value used when a detail page was opened from the match detail screen. */
export const FROM_MATCH_DETAIL = "match";
/** Query param carrying the parent match's Mongo id on nested detail pages. */
export const QUERY_PARENT_MATCH_ID = "matchId";

/** Remove detail-page and “other tab” params so the home URL stays minimal. */
export function stripAdminHomeQueryNoise(
  activeSection: string,
  sp: URLSearchParams,
): void {
  sp.delete("from");
  sp.delete("id");
  sp.delete("tab");
  sp.delete(QUERY_PARENT_MATCH_ID);
  if (activeSection !== "leaderboard") {
    sp.delete("leaderboardTab");
  }
  if (activeSection !== "shop") {
    sp.delete("shopTab");
  }
  if (activeSection !== "payments") {
    sp.delete("paymentsTab");
  }
  if (activeSection !== "games") {
    sp.delete("gameType");
    sp.delete("gamesTab");
  }
  if (activeSection === "predictions") {
    sp.delete("quizTournament");
    sp.delete("matchTournament");
  } else if (activeSection === "quizzes") {
    sp.delete("predTournament");
    sp.delete("matchTournament");
  } else if (activeSection === "matches" || activeSection === "teams") {
    sp.delete("predTournament");
    sp.delete("quizTournament");
  } else {
    sp.delete("predTournament");
    sp.delete("quizTournament");
    sp.delete("matchTournament");
    sp.delete("tournament");
  }
}

/** Admin home URL: set `section`, drop noise params, keep the rest. */
export function buildAdminHomeHref(
  section: string | null | undefined,
  currentSearchParams: { toString(): string } | null | undefined,
): string {
  if (!section) return "/";
  const sp = new URLSearchParams(currentSearchParams?.toString() ?? "");
  sp.set("section", section);
  stripAdminHomeQueryNoise(section, sp);
  return `/?${sp.toString()}`;
}

/**
 * Back target for a detail page. Detail pages opened from the match detail screen
 * (`from=match` + `matchId`) return to that match; everything else goes to admin home.
 */
export function buildDetailBackHref(
  section: string | null | undefined,
  currentSearchParams: { toString(): string } | null | undefined,
): string {
  const sp = new URLSearchParams(currentSearchParams?.toString() ?? "");
  const parentMatchId = sp.get(QUERY_PARENT_MATCH_ID);

  if (section === FROM_MATCH_DETAIL) {
    if (!parentMatchId) return buildAdminHomeHref("matches", sp);
    const target = new URLSearchParams({ from: "matches" });
    const tournament = sp.get("matchTournament");
    if (tournament) target.set("matchTournament", tournament);
    return `/match/${encodeURIComponent(parentMatchId)}?${target.toString()}`;
  }

  return buildAdminHomeHref(section, sp);
}
