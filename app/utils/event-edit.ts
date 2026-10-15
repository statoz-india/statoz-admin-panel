import { EventStatus } from "@/app/utils/enums/event.enum";
import type { EditEventBody, Event } from "@/app/models/events.model";
import {
  convertToISTISO,
  isoToDatetimeLocal,
  validateEntryWindow,
} from "@/app/utils/future-edit";

const NON_EDITABLE_STATUSES = new Set<string>([
  EventStatus.SETTLEMENT_DONE,
  EventStatus.DELETED,
  EventStatus.CANCELLED,
]);

export function canEditEvent(eventStatus: string): boolean {
  return !NON_EDITABLE_STATUSES.has(eventStatus.trim().toUpperCase());
}

export type EditEventDetailsForm = {
  eventName: string;
  eventDescription: string;
  eventImage: string;
  eventDescriptionImage: string;
  entryStartTime: string;
  entryCloseTime: string;
  yesPlaceholder: string;
  noPlaceholder: string;
  maybePlaceholder: string;
  yesPlaceholderColor: string;
  noPlaceholderColor: string;
  maybePlaceholderColor: string;
  yesTextColor: string;
  noTextColor: string;
  maybeTextColor: string;
};

export function eventToForm(event: Event): EditEventDetailsForm {
  return {
    eventName: event.eventName ?? "",
    eventDescription: event.eventDescription ?? "",
    eventImage: event.eventImage ?? "",
    eventDescriptionImage: event.eventDescriptionImage ?? "",
    entryStartTime: isoToDatetimeLocal(event.entryStartTime),
    entryCloseTime: isoToDatetimeLocal(event.entryCloseTime),
    yesPlaceholder: event.yesPlaceholder ?? "Yes",
    noPlaceholder: event.noPlaceholder ?? "No",
    maybePlaceholder: event.maybePlaceholder ?? "Maybe",
    yesPlaceholderColor: event.yesPlaceholderColor ?? "",
    noPlaceholderColor: event.noPlaceholderColor ?? "",
    maybePlaceholderColor: event.maybePlaceholderColor ?? "",
    yesTextColor: event.yesTextColor ?? "",
    noTextColor: event.noTextColor ?? "",
    maybeTextColor: event.maybeTextColor ?? "",
  };
}

export function buildEditEventPayload(
  form: EditEventDetailsForm,
  haveThreeOptions: boolean,
): EditEventBody {
  const payload: EditEventBody = {
    eventName: form.eventName.trim(),
    eventDescription: form.eventDescription,
    eventImage: form.eventImage,
    eventDescriptionImage: form.eventDescriptionImage,
    entryStartTime: convertToISTISO(form.entryStartTime),
    entryCloseTime: convertToISTISO(form.entryCloseTime),
    yesPlaceholder: form.yesPlaceholder.trim(),
    noPlaceholder: form.noPlaceholder.trim(),
    yesPlaceholderColor: form.yesPlaceholderColor.trim() || undefined,
    noPlaceholderColor: form.noPlaceholderColor.trim() || undefined,
    yesTextColor: form.yesTextColor.trim() || undefined,
    noTextColor: form.noTextColor.trim() || undefined,
  };

  if (haveThreeOptions) {
    payload.maybePlaceholder = form.maybePlaceholder.trim();
    payload.maybePlaceholderColor =
      form.maybePlaceholderColor.trim() || undefined;
    payload.maybeTextColor = form.maybeTextColor.trim() || undefined;
  }

  return payload;
}

export function validateEditEventForm(
  form: EditEventDetailsForm,
  haveThreeOptions: boolean,
): string | null {
  if (!form.eventName.trim()) {
    return "Event name is required.";
  }
  if (!form.yesPlaceholder.trim()) {
    return "Yes label is required.";
  }
  if (!form.noPlaceholder.trim()) {
    return "No label is required.";
  }
  if (haveThreeOptions && !form.maybePlaceholder.trim()) {
    return "Maybe label is required for three-option events.";
  }
  return validateEntryWindow(form.entryStartTime, form.entryCloseTime);
}
