"use client";

import { useState, FormEvent, useEffect } from "react";

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_PRIMARY_COLOR = "#19398A";
const DEFAULT_SECONDARY_COLOR = "#ffffff";
const DEFAULT_TEXT_COLOR = "#ffffff";

const initialFormData = {
  tournament: "",
  tournamentName: "",
  tournamentYear: "",
  primaryColor: DEFAULT_PRIMARY_COLOR,
  secondaryColor: DEFAULT_SECONDARY_COLOR,
  textColor: DEFAULT_TEXT_COLOR,
};

export default function CreateTournamentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTournamentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialFormData });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.tournament?.trim() ||
      !formData.tournamentName?.trim() ||
      !formData.tournamentYear?.trim()
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tournament: formData.tournament.trim(),
          tournamentName: formData.tournamentName.trim(),
          tournamentYear: formData.tournamentYear.trim(),
          primaryColor: formData.primaryColor.trim(),
          secondaryColor: formData.secondaryColor.trim(),
          textColor: formData.textColor.trim(),
        }),
      });

      const response = await res.json();

      if (!res.ok || !response.success) {
        throw new Error(response.message || "Failed to create tournament");
      }

      onSuccess();
      onClose();
      setFormData(initialFormData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create tournament",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">
            Create New Tournament
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Abbreviation *
            </label>
            <input
              type="text"
              required
              value={formData.tournament ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, tournament: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., IPL-2026"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Name *
            </label>
            <input
              type="text"
              required
              value={formData.tournamentName ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, tournamentName: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., Indian Premier League"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Year *
            </label>
            <input
              type="text"
              required
              value={formData.tournamentYear ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, tournamentYear: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., 2026"
            />
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={formData.primaryColor ?? DEFAULT_PRIMARY_COLOR}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secondary Color
              </label>
              <input
                type="color"
                value={formData.secondaryColor ?? DEFAULT_SECONDARY_COLOR}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className="w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={formData.textColor ?? DEFAULT_TEXT_COLOR}
                onChange={(e) =>
                  setFormData({ ...formData, textColor: e.target.value })
                }
                className="w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Tournament"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
