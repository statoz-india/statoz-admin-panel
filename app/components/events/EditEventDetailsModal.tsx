"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Event } from "@/app/models/events.model";
import {
  buildEditEventPayload,
  eventToForm,
  validateEditEventForm,
  type EditEventDetailsForm,
} from "@/app/utils/event-edit";

interface EditEventDetailsModalProps {
  isOpen: boolean;
  event: Event;
  onClose: () => void;
  onSuccess: () => void;
}

function ColorField({
  label,
  value,
  fallback,
  onChange,
  ariaLabel,
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (hex: string) => void;
  ariaLabel: string;
}) {
  const display = value || fallback;
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={display}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-gray-300 dark:border-zinc-600"
          aria-label={ariaLabel}
        />
        <span className="font-mono text-xs text-zinc-500">{display}</span>
      </div>
    </div>
  );
}

export default function EditEventDetailsModal({
  isOpen,
  event,
  onClose,
  onSuccess,
}: EditEventDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<EditEventDetailsForm>(() => eventToForm(event));

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(eventToForm(event));
  }, [isOpen, event]);

  const updateForm = (patch: Partial<EditEventDetailsForm>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateEditEventForm(
      form,
      event.haveThreeOptions,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/events/${encodeURIComponent(event._id)}/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(
            buildEditEventPayload(form, event.haveThreeOptions),
          ),
        },
      );
      const response = await res.json();
      if (!res.ok || !response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to update event",
        );
        return;
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-event-details-dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70"
        aria-hidden
        onClick={() => !loading && onClose()}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900">
        <h2
          id="edit-event-details-dialog-title"
          className="mb-1 text-lg font-semibold text-black dark:text-white"
        >
          Edit event details
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {event.eventId} · Status: {event.eventStatus}
          {event.haveThreeOptions ? " · 3 options" : " · Yes / No"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Basic info
            </legend>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event name *
              </label>
              <input
                type="text"
                required
                value={form.eventName}
                onChange={(e) => updateForm({ eventName: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description{" "}
                <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={form.eventDescription}
                onChange={(e) =>
                  updateForm({ eventDescription: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event image URL{" "}
                <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <input
                type="text"
                inputMode="url"
                placeholder="https://…"
                value={form.eventImage}
                onChange={(e) => updateForm({ eventImage: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description image URL{" "}
                <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <input
                type="text"
                inputMode="url"
                placeholder="https://…"
                value={form.eventDescriptionImage}
                onChange={(e) =>
                  updateForm({ eventDescriptionImage: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Schedule
            </legend>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Entry start time *
              </label>
              <input
                type="datetime-local"
                required
                value={form.entryStartTime}
                onChange={(e) =>
                  updateForm({ entryStartTime: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Entry close time *
              </label>
              <input
                type="datetime-local"
                required
                value={form.entryCloseTime}
                onChange={(e) =>
                  updateForm({ entryCloseTime: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Options copy & colors
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Yes label *
                </label>
                <input
                  type="text"
                  required
                  value={form.yesPlaceholder}
                  onChange={(e) =>
                    updateForm({ yesPlaceholder: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  No label *
                </label>
                <input
                  type="text"
                  required
                  value={form.noPlaceholder}
                  onChange={(e) =>
                    updateForm({ noPlaceholder: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            {event.haveThreeOptions ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maybe label *
                </label>
                <input
                  type="text"
                  required
                  value={form.maybePlaceholder}
                  onChange={(e) =>
                    updateForm({ maybePlaceholder: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            ) : null}

            <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
              <p className="mb-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Yes
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <ColorField
                  label="Placeholder color"
                  value={form.yesPlaceholderColor}
                  fallback="#2CA85E"
                  onChange={(hex) =>
                    updateForm({ yesPlaceholderColor: hex })
                  }
                  ariaLabel="Yes placeholder color"
                />
                <ColorField
                  label="Text color"
                  value={form.yesTextColor}
                  fallback="#FFFFFF"
                  onChange={(hex) => updateForm({ yesTextColor: hex })}
                  ariaLabel="Yes text color"
                />
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
              <p className="mb-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                No
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <ColorField
                  label="Placeholder color"
                  value={form.noPlaceholderColor}
                  fallback="#FF3B30"
                  onChange={(hex) => updateForm({ noPlaceholderColor: hex })}
                  ariaLabel="No placeholder color"
                />
                <ColorField
                  label="Text color"
                  value={form.noTextColor}
                  fallback="#FFFFFF"
                  onChange={(hex) => updateForm({ noTextColor: hex })}
                  ariaLabel="No text color"
                />
              </div>
            </div>

            {event.haveThreeOptions ? (
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <p className="mb-3 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Maybe
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ColorField
                    label="Placeholder color"
                    value={form.maybePlaceholderColor}
                    fallback="#FF9500"
                    onChange={(hex) =>
                      updateForm({ maybePlaceholderColor: hex })
                    }
                    ariaLabel="Maybe placeholder color"
                  />
                  <ColorField
                    label="Text color"
                    value={form.maybeTextColor}
                    fallback="#FFFFFF"
                    onChange={(hex) => updateForm({ maybeTextColor: hex })}
                    ariaLabel="Maybe text color"
                  />
                </div>
              </div>
            ) : null}
          </fieldset>

          {error ? (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? "Saving…" : "Save details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
