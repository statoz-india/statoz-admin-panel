"use client";

import { useState, FormEvent } from "react";
import { CreateTeamPayload } from "../api/tournament/teams/route";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tournaments: string[];
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  onSuccess,
  tournaments,
}: CreateTeamModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateTeamPayload>({
    name: "",
    abbreviation: "",
    tournamentType: "",
    description: "",
    primaryColor: "",
    secondaryColor: "",
    textColor: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.abbreviation || !formData.tournamentType) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Prepare payload - include optional fields if they have values
      const payload: CreateTeamPayload = {
        name: formData.name,
        abbreviation: formData.abbreviation,
        tournamentType: formData.tournamentType,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        textColor: formData.textColor,
      };

      // Add optional fields only if they have values
      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      }

      const res = await fetch("/api/tournament/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create team");
      }

      const response = await res.json();

      if (!response.success) {
        throw new Error(response.message || "Failed to create team");
      }

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: "",
        abbreviation: "",
        tournamentType: "",
        description: "",
        primaryColor: "",
        secondaryColor: "",
        textColor: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">Create New Team</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., Barcelona"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Abbreviation *
            </label>
            <input
              type="text"
              required
              value={formData.abbreviation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  abbreviation: e.target.value.toLowerCase(),
                })
              }
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., barca"
              maxLength={10}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament *
            </label>
            <select
              required
              value={formData.tournamentType}
              onChange={(e) =>
                setFormData({ ...formData, tournamentType: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="">-- Select a tournament --</option>
              {tournaments.map((tournament) => (
                <option key={tournament} value={tournament}>
                  {tournament}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Color *
              </label>
              <input
                type="color"
                value={formData.primaryColor || "#000000"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    primaryColor: e.target.value,
                  })
                }
                className="w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secondary Color *
              </label>
              <input
                type="color"
                value={formData.secondaryColor || "#000000"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secondaryColor: e.target.value,
                  })
                }
                className="w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text Color *
              </label>
              <input
                type="color"
                value={formData.textColor || "#000000"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    textColor: e.target.value,
                  })
                }
                className="w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
              />
            </div>
          </div>

          {/* Optional Fields */}
          <div className="mb-6 border-t border-zinc-800 pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Optional Team Details
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Team description..."
                rows={3}
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
              {loading ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
