/** `from` value used when a detail page was opened from the match detail screen. */
export const FROM_MATCH_DETAIL = "match";
/** `from` value used when a detail page was opened from a motorsport race page. */
export const FROM_MOTORSPORT_DETAIL = "motorsport";
/** Query param carrying the parent match's Mongo id on nested detail pages. */
export const QUERY_PARENT_MATCH_ID = "matchId";
/** Team sports vs motorsport within the Matches section. */
export const QUERY_MATCHES_TAB = "matchesTab";
export const MATCHES_TAB_MOTORSPORT = "motorsport";
/** Sub-tab within Statoz Games (`section=statoz_games`). */
export const QUERY_GAMES_TAB = "gamesTab";
export const STATOZ_GAMES_TAB_KNOWLEDGE_QUIZ = "knowledgeQuiz";

/** Legacy quizzes list used `quizTournament`; matches uses `matchTournament`. */
function migrateQuizzesHomeParams(sp: URLSearchParams): void {
  const quizTournament = sp.get("quizTournament");
  if (quizTournament && !sp.get("matchTournament")) {
    sp.set("matchTournament", quizTournament);
  }
  sp.delete("quizTournament");
}

/** Legacy predictions list used `predTournament`; matches uses `matchTournament`. */
function migratePredictionsHomeParams(sp: URLSearchParams): void {
  const predTournament = sp.get("predTournament");
  if (predTournament && !sp.get("matchTournament")) {
    sp.set("matchTournament", predTournament);
  }
  sp.delete("predTournament");
}

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
  if (activeSection !== "unresolved") {
    sp.delete("unresolvedTab");
    sp.delete("unresolvedGame");
    sp.delete("unresolvedStatus");
    sp.delete("unresolvedTournament");
  }
  if (activeSection !== "statoz_games") {
    sp.delete("kqTab");
  }
  if (activeSection !== "contactus") {
    sp.delete("contactIssue");
  }
  if (activeSection !== "matches") {
    sp.delete("matchDate");
    sp.delete(QUERY_MATCHES_TAB);
  }
  if (
    activeSection !== "games" &&
    activeSection !== "statoz_games" &&
    activeSection !== "teamstournaments"
  ) {
    sp.delete("gameType");
    sp.delete(QUERY_GAMES_TAB);
  }
  if (activeSection === "matches" || activeSection === "teams") {
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
  let resolvedSection = section;
  if (resolvedSection === "motorsportmatches") {
    resolvedSection = "matches";
    sp.set(QUERY_MATCHES_TAB, MATCHES_TAB_MOTORSPORT);
  }
  if (resolvedSection === "knowledgequiz") {
    resolvedSection = "statoz_games";
    sp.set(QUERY_GAMES_TAB, STATOZ_GAMES_TAB_KNOWLEDGE_QUIZ);
  }
  if (resolvedSection === "quizzes") {
    resolvedSection = "matches";
    migrateQuizzesHomeParams(sp);
  }
  if (resolvedSection === "predictions") {
    resolvedSection = "matches";
    migratePredictionsHomeParams(sp);
  }
  sp.set("section", resolvedSection);
  stripAdminHomeQueryNoise(resolvedSection, sp);
  return `/?${sp.toString()}`;
}

/**
 * Back target for a detail page. Detail pages opened from the match detail screen
 * (`from=match` + `matchId`) return to that match, and those opened from a motorsport
 * race (`from=motorsport` + `matchId`) return to that race; everything else goes to
 * admin home.
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

  if (
    section === FROM_MOTORSPORT_DETAIL ||
    section === "motorsportmatches"
  ) {
    if (!parentMatchId) {
      sp.set(QUERY_MATCHES_TAB, MATCHES_TAB_MOTORSPORT);
      return buildAdminHomeHref("matches", sp);
    }
    const target = new URLSearchParams({
      from: "matches",
      [QUERY_MATCHES_TAB]: MATCHES_TAB_MOTORSPORT,
    });
    return `/motorsport/${encodeURIComponent(parentMatchId)}?${target.toString()}`;
  }

  return buildAdminHomeHref(section, sp);
}
