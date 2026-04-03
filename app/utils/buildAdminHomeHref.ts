/** Build admin home URL with `section` and optional `tournament` query. */
export function buildAdminHomeHref(
  section: string | null | undefined,
  tournament: string | null | undefined,
): string {
  if (!section) return "/";
  const sp = new URLSearchParams();
  sp.set("section", section);
  if (tournament != null && tournament !== "") {
    sp.set("tournament", tournament);
  }
  return `/?${sp.toString()}`;
}
