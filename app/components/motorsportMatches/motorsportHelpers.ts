import type { MotorsportMatchStatus } from "@/app/models/motorsport-match.model";

/**
 * Race times are entered and shown in IST, like the rest of the admin panel.
 * `<input type="datetime-local">` has no timezone, so the offset is applied
 * explicitly in both directions rather than relying on the browser's zone.
 */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** ISO string → `YYYY-MM-DDTHH:mm` (IST) for a `datetime-local` input. */
export function isoToIstInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 16);
}

/** `datetime-local` value read as IST → ISO string (UTC). */
export function istInputToIso(value: string): string {
  return new Date(`${value}:00+05:30`).toISOString();
}

export function formatIst(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Tailwind classes for a status, used on the quick-change select. */
export const STATUS_STYLES: Record<MotorsportMatchStatus, string> = {
  Upcoming: "border-blue-500/50 bg-blue-500/10 text-blue-200",
  Ongoing: "border-green-500/50 bg-green-500/10 text-green-200",
  Finished: "border-zinc-600 bg-zinc-800 text-gray-300",
  Cancelled: "border-red-500/50 bg-red-500/10 text-red-300",
};

/** Badge classes for a motorsport quiz status. */
export function quizStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case "LIVE":
      return "bg-emerald-900 text-emerald-200";
    case "UPCOMING":
      return "bg-violet-900 text-violet-200";
    case "ANSWER_UPDATED":
      return "bg-blue-900 text-blue-200";
    case "SETTLEMENT_DONE":
      return "bg-purple-900 text-purple-200";
    case "CANCELLED":
      return "bg-red-900 text-red-200";
    case "ABANDONED":
      return "bg-orange-900 text-orange-200";
    case "NO_RESULT":
      return "bg-stone-700 text-stone-200";
    default:
      return "bg-zinc-700 text-zinc-200";
  }
}

/** Badge classes for an event status. */
export function eventStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-teal-900 text-teal-200";
    case "UPCOMING":
      return "bg-violet-900 text-violet-200";
    case "FINISHED":
      return "bg-zinc-700 text-zinc-200";
    case "WINNING_OPTION_UPDATED":
      return "bg-blue-900 text-blue-200";
    case "SETTLEMENT_DONE":
      return "bg-purple-900 text-purple-200";
    case "CANCELLED":
    case "DELETED":
      return "bg-red-900 text-red-200";
    case "ABANDONED":
      return "bg-orange-900 text-orange-200";
    case "NO_RESULT":
      return "bg-stone-700 text-stone-200";
    default:
      return "bg-zinc-700 text-zinc-200";
  }
}

/** Statuses the race page hides unless asked; the backend returns them all. */
export const HIDDEN_EVENT_STATUSES = new Set(["CANCELLED", "DELETED"]);
