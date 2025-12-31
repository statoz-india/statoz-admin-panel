"use client";

import { useState, FormEvent } from "react";
import { createPrediction, CreatePredictionPayload } from "@/app/lib/api";

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePredictionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePredictionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreatePredictionPayload>({
    teamA: "",
    teamAlogo: "",
    teamAcolorPrimary: "",
    teamAcolorSecondary: "",
    teamB: "",
    teamBlogo: "",
    teamBcolorPrimary: "",
    teamBcolorSecondary: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createPrediction(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        teamA: "",
        teamAlogo: "",
        teamAcolorPrimary: "",
        teamAcolorSecondary: "",
        teamB: "",
        teamBlogo: "",
        teamBcolorPrimary: "",
        teamBcolorSecondary: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create prediction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Create New Prediction
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team A *
              </label>
              <input
                type="text"
                required
                value={formData.teamA}
                onChange={(e) =>
                  setFormData({ ...formData, teamA: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team B *
              </label>
              <input
                type="text"
                required
                value={formData.teamB}
                onChange={(e) =>
                  setFormData({ ...formData, teamB: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Optional Team Details */}
          <div className="mb-6 border-t border-gray-200 dark:border-zinc-800 pt-4">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Optional Team Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team A Logo URL
                </label>
                <input
                  type="url"
                  value={formData.teamAlogo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, teamAlogo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team B Logo URL
                </label>
                <input
                  type="url"
                  value={formData.teamBlogo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, teamBlogo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team A Primary Color
                </label>
                <input
                  type="color"
                  value={formData.teamAcolorPrimary || "#000000"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamAcolorPrimary: e.target.value,
                    })
                  }
                  className="w-full h-10 border border-gray-300 dark:border-zinc-600 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team B Primary Color
                </label>
                <input
                  type="color"
                  value={formData.teamBcolorPrimary || "#000000"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamBcolorPrimary: e.target.value,
                    })
                  }
                  className="w-full h-10 border border-gray-300 dark:border-zinc-600 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team A Secondary Color
                </label>
                <input
                  type="color"
                  value={formData.teamAcolorSecondary || "#000000"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamAcolorSecondary: e.target.value,
                    })
                  }
                  className="w-full h-10 border border-gray-300 dark:border-zinc-600 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team B Secondary Color
                </label>
                <input
                  type="color"
                  value={formData.teamBcolorSecondary || "#000000"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamBcolorSecondary: e.target.value,
                    })
                  }
                  className="w-full h-10 border border-gray-300 dark:border-zinc-600 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Prediction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
