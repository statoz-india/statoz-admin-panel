/**
 * Badge classes for quiz / prediction / event statuses, shared by the match
 * and quiz detail pages so a status looks the same everywhere.
 */
export function statusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case "LIVE":
      return "bg-emerald-900 text-emerald-200";
    case "ACTIVE":
      return "bg-teal-900 text-teal-200";
    case "UPCOMING":
      return "bg-violet-900 text-violet-200";
    case "FINISHED":
      return "bg-zinc-700 text-zinc-200";
    case "ENTRYNOTSTARTED":
      return "bg-slate-700 text-slate-200";
    case "ENTRYCLOSED":
      return "bg-amber-900 text-amber-200";
    case "SETTLEMENT_DONE":
      return "bg-purple-900 text-purple-200";
    case "ANSWER_UPDATED":
    case "WINNING_TEAM_UPDATED":
    case "WINNING_OPTION_UPDATED":
      return "bg-blue-900 text-blue-200";
    case "CANCELLED":
    case "DELETED":
      return "bg-red-900 text-red-200";
    case "NOT_VISIBLE":
      return "bg-rose-900 text-rose-200";
    case "ADMIN_VISIBLE":
      return "bg-cyan-900 text-cyan-200";
    default:
      return "bg-zinc-800 text-zinc-200";
  }
}
