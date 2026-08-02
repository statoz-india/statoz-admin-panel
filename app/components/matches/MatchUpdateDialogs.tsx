"use client";

import { useState } from "react";
import { MatchData } from "../../api/match/route";

/** ISO string → value for an `<input type="datetime-local">`, shifted to IST. */
export function formatDateTimeLocalValue(
  isoString: string | undefined,
): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

type MatchUpdateDialogProps = {
  match: MatchData;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
};

export function UpdateMatchBannerDialog({
  match,
  onClose,
  onUpdated,
}: MatchUpdateDialogProps) {
  const [bannerUrlInput, setBannerUrlInput] = useState(match.matchBanner ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    const trimmed = bannerUrlInput.trim();
    if (!trimmed) {
      setError("Enter a banner image URL");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/match/${encodeURIComponent(match._id)}/matchBanner`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ matchBanner: trimmed }),
        },
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof payload.message === "string"
            ? payload.message
            : `Request failed (${res.status})`;
        throw new Error(msg);
      }
      if (!payload.success) {
        throw new Error(
          typeof payload.message === "string"
            ? payload.message
            : "Failed to update banner",
        );
      }
      onClose();
      await onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-match-dialog-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-zinc-800 p-6">
          <h2
            id="update-match-dialog-title"
            className="text-xl font-bold text-white"
          >
            Update match data
          </h2>
          <p className="mt-1 font-mono text-xs text-zinc-500">
            {match.matchId} · {match._id}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-950/40 p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <label
            htmlFor="match-banner-url"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Update match banner
          </label>
          <input
            id="match-banner-url"
            type="url"
            value={bannerUrlInput}
            onChange={(e) => setBannerUrlInput(e.target.value)}
            placeholder="https://…"
            className="mb-6 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            disabled={loading}
            autoComplete="off"
          />

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleUpdate()}
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpdateMatchStartTimeDialog({
  match,
  onClose,
  onUpdated,
}: MatchUpdateDialogProps) {
  const [startTimeInput, setStartTimeInput] = useState(
    formatDateTimeLocalValue(match.matchStartTime),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!startTimeInput) {
      setError("Select a date and time");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const localDate = new Date(startTimeInput);
      const matchStartTime = localDate.toISOString();

      const res = await fetch(
        `/api/match/${encodeURIComponent(match._id)}/matchStartTime`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ matchStartTime }),
        },
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof payload.message === "string"
            ? payload.message
            : `Request failed (${res.status})`;
        throw new Error(msg);
      }
      if (!payload.success) {
        throw new Error(
          typeof payload.message === "string"
            ? payload.message
            : "Failed to update start time",
        );
      }
      onClose();
      await onUpdated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update start time",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-start-time-dialog-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-zinc-800 p-6">
          <h2
            id="update-start-time-dialog-title"
            className="text-xl font-bold text-white"
          >
            Update match start time
          </h2>
          <p className="mt-1 font-mono text-xs text-zinc-500">
            {match.matchId} · {match._id}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-950/40 p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <label
            htmlFor="match-start-time"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Match start time (IST)
          </label>
          <input
            id="match-start-time"
            type="datetime-local"
            value={startTimeInput}
            onChange={(e) => setStartTimeInput(e.target.value)}
            className="mb-6 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            disabled={loading}
          />

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleUpdate()}
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
