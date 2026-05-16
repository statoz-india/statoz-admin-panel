"use client";

import { useEffect, useState, type FormEvent } from "react";
import type {
  Tournament,
  UpdateTournamentPayload,
} from "@/app/models/tournament.model";

const DEFAULT_PRIMARY_COLOR = "#19398A";
const DEFAULT_SECONDARY_COLOR = "#ffffff";
const DEFAULT_TEXT_COLOR = "#ffffff";

interface EditTournamentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tournament: Tournament | null;
}

export default function EditTournamentSheet({
  isOpen,
  onClose,
  onSuccess,
  tournament,
}: EditTournamentSheetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    tournamentName: "",
    primaryColor: DEFAULT_PRIMARY_COLOR,
    secondaryColor: DEFAULT_SECONDARY_COLOR,
    textColor: DEFAULT_TEXT_COLOR,
  });

  useEffect(() => {
    if (!tournament) return;

    setFormData({
      tournamentName: tournament.tournamentName || "",
      primaryColor:
        tournament.primaryColor?.trim() || DEFAULT_PRIMARY_COLOR,
      secondaryColor:
        tournament.secondaryColor?.trim() || DEFAULT_SECONDARY_COLOR,
      textColor: tournament.textColor?.trim() || DEFAULT_TEXT_COLOR,
    });
    setError("");
  }, [tournament]);

  if (!isOpen || !tournament) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedName = formData.tournamentName.trim();
    if (!trimmedName) {
      setError("Tournament name is required");
      setLoading(false);
      return;
    }

    const payload: UpdateTournamentPayload = {
      tournamentName: trimmedName,
      primaryColor: formData.primaryColor.trim(),
      secondaryColor: formData.secondaryColor.trim(),
      textColor: formData.textColor.trim(),
    };

    try {
      const res = await fetch(`/api/tournament/${tournament._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (!res.ok || !response.success) {
        throw new Error(response.message || "Failed to update tournament");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update tournament",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close tournament editor"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-tournament-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-zinc-800 p-6">
          <div>
            <h2
              id="edit-tournament-title"
              className="text-2xl font-bold text-white"
            >
              Edit Tournament
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Update display name and colors
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto p-6"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tournament Abbreviation
            </label>
            <input
              type="text"
              readOnly
              value={tournament.tournament}
              className="w-full cursor-not-allowed rounded-md border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tournament Year
            </label>
            <input
              type="text"
              readOnly
              value={tournament.tournamentYear}
              className="w-full cursor-not-allowed rounded-md border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tournament Name *
            </label>
            <input
              type="text"
              required
              value={formData.tournamentName}
              onChange={(e) =>
                setFormData({ ...formData, tournamentName: e.target.value })
              }
              className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., Indian Premier League"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Primary Color
              </label>
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="h-10 w-full cursor-pointer rounded-md border border-zinc-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Secondary Color
              </label>
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className="h-10 w-full cursor-pointer rounded-md border border-zinc-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Text Color
              </label>
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) =>
                  setFormData({ ...formData, textColor: e.target.value })
                }
                className="h-10 w-full cursor-pointer rounded-md border border-zinc-600"
              />
            </div>
          </div>

          <div
            className="mb-6 rounded-lg border border-zinc-700 border-b-4 p-4 text-center"
            style={{
              backgroundColor: formData.primaryColor,
              borderBottomColor: formData.secondaryColor,
              color: formData.textColor,
            }}
          >
            <span className="text-xl font-bold tracking-wide">
              {tournament.tournament}
            </span>
            <p className="mt-1 text-sm font-medium opacity-95">
              {formData.tournamentName || "Tournament name"}
            </p>
            <p className="mt-1 text-xs opacity-80">{tournament.tournamentYear}</p>
          </div>

          <div className="mt-auto flex justify-end gap-3 border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
