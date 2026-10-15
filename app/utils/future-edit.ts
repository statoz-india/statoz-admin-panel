import { FutureStatus } from "@/app/utils/enums/future.enum";
import type { EditFutureBody } from "@/app/models/futures.model";

const NON_EDITABLE_STATUSES = new Set<string>([
  FutureStatus.SETTLEMENT_DONE,
  FutureStatus.DELETED,
  FutureStatus.CANCELLED,
]);

export function canEditFuture(futureStatus: string): boolean {
  return !NON_EDITABLE_STATUSES.has(futureStatus.trim().toUpperCase());
}

/** datetime-local value → IST ISO (matches create future flow). */
export function convertToISTISO(dateTimeLocal: string): string {
  if (!dateTimeLocal) return "";
  const [datePart, timePart] = dateTimeLocal.split("T");
  if (!datePart || !timePart) return dateTimeLocal;
  return `${datePart}T${timePart}:00.000+05:30`;
}

export function isoToDatetimeLocal(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export type EditFutureDetailsForm = {
  eventName: string;
  eventDescription: string;
  eventImage: string;
  eventDescriptionImage: string;
  entryStartTime: string;
  entryCloseTime: string;
};

export function buildEditFuturePayload(
  form: EditFutureDetailsForm,
): EditFutureBody {
  return {
    eventName: form.eventName.trim(),
    eventDescription: form.eventDescription,
    eventImage: form.eventImage,
    eventDescriptionImage: form.eventDescriptionImage,
    entryStartTime: convertToISTISO(form.entryStartTime),
    entryCloseTime: convertToISTISO(form.entryCloseTime),
  };
}

export function validateEntryWindow(
  entryStartTime: string,
  entryCloseTime: string,
): string | null {
  if (!entryStartTime.trim() || !entryCloseTime.trim()) {
    return "Entry start and close times are required.";
  }
  const start = new Date(convertToISTISO(entryStartTime));
  const close = new Date(convertToISTISO(entryCloseTime));
  if (Number.isNaN(start.getTime()) || Number.isNaN(close.getTime())) {
    return "Invalid entry start or close time.";
  }
  if (close.getTime() <= start.getTime()) {
    return "Entry close time must be after entry start time.";
  }
  return null;
}
