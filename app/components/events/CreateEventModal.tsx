"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CreateEventPayload } from "../../models/events.model";

function convertToISTISO(dateTimeLocal: string): string {
  if (!dateTimeLocal) return "";
  const [datePart, timePart] = dateTimeLocal.split("T");
  if (!datePart || !timePart) return dateTimeLocal;
  return `${datePart}T${timePart}:00.000+05:30`;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultForm = (): CreateEventPayload => ({
  tournament: "",
  eventName: "",
  eventDescription: "",
  eventImage: "",
  haveThreeOptions: false,
  yesPlaceholder: "Yes",
  noPlaceholder: "No",
  maybePlaceholder: "Maybe",
  entryStartTime: "",
  entryCloseTime: "",
});

/** Ensures no field is undefined so inputs stay controlled. */
function normalizeForm(
  partial: Partial<CreateEventPayload>,
): CreateEventPayload {
  const d = defaultForm();
  return {
    tournament: partial.tournament ?? d.tournament,
    eventName: partial.eventName ?? d.eventName,
    eventDescription: partial.eventDescription ?? d.eventDescription,
    eventImage: partial.eventImage ?? d.eventImage,
    haveThreeOptions: partial.haveThreeOptions ?? d.haveThreeOptions,
    yesPlaceholder: partial.yesPlaceholder ?? d.yesPlaceholder,
    noPlaceholder: partial.noPlaceholder ?? d.noPlaceholder,
    maybePlaceholder: partial.maybePlaceholder ?? d.maybePlaceholder,
    entryStartTime: partial.entryStartTime ?? d.entryStartTime,
    entryCloseTime: partial.entryCloseTime ?? d.entryCloseTime,
  };
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateEventPayload>(() =>
    defaultForm(),
  );

  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournament", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) return;
      const response = await res.json();
      const tournamentData = response.success ? response.data.data : [];
      setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
    } catch {
      setTournaments([]);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchTournaments();
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const close = new Date(now.getTime() + 60 * 60 * 1000);
    const localClose = `${close.getFullYear()}-${pad(close.getMonth() + 1)}-${pad(close.getDate())}T${pad(close.getHours())}:${pad(close.getMinutes())}`;
    setFormData((prev) =>
      normalizeForm({
        ...prev,
        entryStartTime: local,
        entryCloseTime: localClose,
      }),
    );
    setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.tournament.trim()) {
      setError("Please select a tournament");
      return;
    }
    if (!formData.eventName.trim()) {
      setError("Please enter an event name");
      return;
    }
    if (!formData.entryStartTime) {
      setError("Please set entry start time");
      return;
    }
    if (!formData.entryCloseTime) {
      setError("Please set entry close time");
      return;
    }
    const startMs = new Date(`${formData.entryStartTime}+05:30`).getTime();
    const closeMs = new Date(`${formData.entryCloseTime}+05:30`).getTime();
    if (
      Number.isFinite(startMs) &&
      Number.isFinite(closeMs) &&
      closeMs <= startMs
    ) {
      setError("Entry close time must be after entry start time");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateEventPayload = {
        ...formData,
        tournament: formData.tournament.trim(),
        eventName: formData.eventName.trim(),
        eventDescription: formData.eventDescription.trim(),
        eventImage: formData.eventImage.trim(),
        yesPlaceholder: formData.yesPlaceholder.trim() || "Yes",
        noPlaceholder: formData.noPlaceholder.trim() || "No",
        maybePlaceholder: formData.haveThreeOptions
          ? formData.maybePlaceholder.trim() || "Maybe"
          : "",
        entryStartTime: convertToISTISO(formData.entryStartTime),
        entryCloseTime: convertToISTISO(formData.entryCloseTime),
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const response = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          (typeof response.message === "string" && response.message) ||
          (typeof response.error === "string" && response.error) ||
          "Failed to create event";
        throw new Error(message);
      }
      if (!response.success) {
        throw new Error(
          (typeof response.message === "string" && response.message) ||
            "Failed to create event",
        );
      }

      setFormData(defaultForm());
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Create new event
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tournament *
            </label>
            <select
              required
              value={formData.tournament ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, tournament: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
            >
              <option value="">-- Select a tournament --</option>
              {tournaments.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event name *
            </label>
            <input
              type="text"
              required
              value={formData.eventName ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, eventName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.eventDescription ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, eventDescription: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event image URL
            </label>
            <input
              type="text"
              inputMode="url"
              placeholder="https://…"
              value={formData.eventImage ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, eventImage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="haveThreeOptions"
              type="checkbox"
              checked={formData.haveThreeOptions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  haveThreeOptions: e.target.checked,
                })
              }
              className="rounded border-gray-300 dark:border-zinc-600"
            />
            <label
              htmlFor="haveThreeOptions"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Three options (Yes / No / Maybe)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Yes label
              </label>
              <input
                type="text"
                value={formData.yesPlaceholder ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, yesPlaceholder: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                No label
              </label>
              <input
                type="text"
                value={formData.noPlaceholder ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, noPlaceholder: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {formData.haveThreeOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maybe label
              </label>
              <input
                type="text"
                value={formData.maybePlaceholder ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maybePlaceholder: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Entry start time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.entryStartTime ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, entryStartTime: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Entry close time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.entryCloseTime ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, entryCloseTime: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-zinc-600 text-gray-800 dark:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200 disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
            >
              {loading ? "Creating…" : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
