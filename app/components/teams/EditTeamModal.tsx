"use client";

import { useState, FormEvent, useEffect } from "react";
import { Team } from "../../api/tournament/teams/route";

interface UpdateTeamPayload {
  name?: string;
  abbreviation?: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
}

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  team: Team | null;
}

export default function EditTeamModal({
  isOpen,
  onClose,
  onSuccess,
  team,
}: EditTeamModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<UpdateTeamPayload>({
    name: "",
    abbreviation: "",
    description: "",
    primaryColor: "",
    secondaryColor: "",
    textColor: "",
  });

  // Initialize form data when team changes
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        abbreviation: team.abbreviation || "",
        description: team.description || "",
        primaryColor: team.primaryColor || "",
        secondaryColor: team.secondaryColor || "",
        textColor: team.textColor || "",
      });
    }
  }, [team]);

  if (!isOpen || !team) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Prepare payload with only changed fields
    const payload: UpdateTeamPayload = {};

    if (formData.name && formData.name !== team.name) {
      payload.name = formData.name;
    }
    if (formData.abbreviation && formData.abbreviation !== team.abbreviation) {
      payload.abbreviation = formData.abbreviation;
    }
    if (formData.description?.trim()) {
      payload.description = formData.description.trim();
    }
    if (formData.primaryColor?.trim()) {
      payload.primaryColor = formData.primaryColor.trim();
    }
    if (formData.secondaryColor?.trim()) {
      payload.secondaryColor = formData.secondaryColor.trim();
    }
    if (formData.textColor?.trim()) {
      payload.textColor = formData.textColor.trim();
    }

    // Check if there are any changes
    if (Object.keys(payload).length === 0) {
      setError("No changes made");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/tournament/teams/${team._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update team");
      }

      const response = await res.json();

      if (!response.success) {
        throw new Error(response.message || "Failed to update team");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">Edit Team</h2>
          <p className="text-sm text-gray-400 mt-1">
            {team.name} - {team.tournament}
          </p>
          <p className="text-sm text-gray-400 mt-1">Mongo ID: {team._id}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Name
            </label>
            <input
              type="text"
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
              Abbreviation
            </label>
            <input
              type="text"
              value={formData.abbreviation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  abbreviation: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., barca"
              maxLength={10}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Color
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
                Secondary Color
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
                Text Color
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
              {loading ? "Updating..." : "Update Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
