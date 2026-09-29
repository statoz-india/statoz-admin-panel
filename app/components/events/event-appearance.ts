import { EventStatus } from "@/app/utils/enums/event.enum";

export function eventStatusBadgeClass(status: string) {
  switch (status.toUpperCase()) {
    case EventStatus.UPCOMING:
      return "bg-violet-900 text-violet-200";
    case EventStatus.ACTIVE:
      return "bg-emerald-900 text-emerald-200";
    case EventStatus.FINISHED:
      return "bg-zinc-700 text-zinc-200";
    case EventStatus.CANCELLED:
      return "bg-rose-900 text-rose-200";
    case EventStatus.DELETED:
      return "bg-zinc-800 text-zinc-300";
    case EventStatus.SETTLEMENT_DONE:
      return "bg-purple-900 text-purple-200";
    case EventStatus.WINNING_OPTION_UPDATED:
      return "bg-cyan-900 text-cyan-200";
    case EventStatus.ABANDONED:
      return "bg-orange-900 text-orange-200";
    case EventStatus.NO_RESULT:
      return "bg-stone-700 text-stone-200";
    case EventStatus.NOT_ENOUGH_DATA:
      return "bg-yellow-900 text-yellow-200";
    case EventStatus.POSTPONED:
      return "bg-sky-900 text-sky-200";
    default:
      return "bg-zinc-800 text-zinc-200";
  }
}
