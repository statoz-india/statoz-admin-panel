/** Remove detail-page and “other tab” params so the home URL stays minimal. */
export function stripAdminHomeQueryNoise(
  activeSection: string,
  sp: URLSearchParams,
): void {
  sp.delete("from");
  if (activeSection === "predictions") {
    sp.delete("quizTournament");
    sp.delete("matchTournament");
  } else if (activeSection === "quizzes") {
    sp.delete("predTournament");
    sp.delete("matchTournament");
  } else if (activeSection === "matches") {
    sp.delete("predTournament");
    sp.delete("quizTournament");
    sp.delete("tournament");
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
