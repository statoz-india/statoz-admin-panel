"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Future } from "@/app/models/futures.model";
import {
  buildEditFuturePayload,
  isoToDatetimeLocal,
  validateEntryWindow,
  type EditFutureDetailsForm,
} from "@/app/utils/future-edit";

interface EditFutureDetailsModalProps {
  isOpen: boolean;
  future: Future;
  onClose: () => void;
  onSuccess: () => void;
}

function futureToForm(future: Future): EditFutureDetailsForm {
  return {
    eventName: future.eventName ?? "",
    eventDescription: future.eventDescription ?? "",
    eventImage: future.eventImage ?? "",
    eventDescriptionImage: future.eventDescriptionImage ?? "",
    entryStartTime: isoToDatetimeLocal(future.entryStartTime),
    entryCloseTime: isoToDatetimeLocal(future.entryCloseTime),
  };
}

export default function EditFutureDetailsModal({
  isOpen,
  future,
  onClose,
  onSuccess,
}: EditFutureDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<EditFutureDetailsForm>(() =>
    futureToForm(future),
  );

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(futureToForm(future));
  }, [isOpen, future]);

  const updateForm = (patch: Partial<EditFutureDetailsForm>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.eventName.trim()) {
      setError("Event name is required.");
      return;
    }

    const windowError = validateEntryWindow(
      form.entryStartTime,
      form.entryCloseTime,
    );
    if (windowError) {
      setError(windowError);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/futures/${encodeURIComponent(future._id)}/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(buildEditFuturePayload(form)),
        },
      );
      const response = await res.json();
      if (!res.ok || !response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to update future",
        );
        return;
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update future",
      );
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
      aria-labelledby="edit-future-details-dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70"
        aria-hidden
        onClick={() => !loading && onClose()}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900">
        <h2
          id="edit-future-details-dialog-title"
          className="mb-1 text-lg font-semibold text-black dark:text-white"
        >
          Edit event details
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {future.futureId} · Status: {future.futureStatus}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
