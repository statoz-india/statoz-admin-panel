"use client";

import { Prediction } from "@/app/api/predictions/route";
import { useState, FormEvent } from "react";

interface EditPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prediction: Prediction | null;
}

export default function EditPredictionModal({
  isOpen,
  onClose,
  onSuccess,
  prediction,
}: EditPredictionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [winningTeam, setWinningTeam] = useState<"A" | "B" | "">("");

  if (!isOpen || !prediction) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!winningTeam) {
      setError("Please select the winning team");
      return;
    }

    setLoading(true);

    try {
      // const payload: UpdatePredictionPayload = {
      //   winningTeam: winningTeam as "A" | "B",
      // };
      // await updatePrediction(prediction._id, payload);
      onSuccess();
      onClose();
      setWinningTeam("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update prediction",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Update Winning Team
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {prediction.predictionId} - {prediction.tournament}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Teams Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Select Winning Team *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Team A Option */}
              <button
                type="button"
                onClick={() => setWinningTeam("A")}
                className={`p-6 border-2 rounded-lg transition-all ${
                  winningTeam === "A"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500"
                }`}
              >
                <div className="text-center">
                  {prediction.teamA.primaryColor && (
                    <div
                      className="inline-block w-20 h-20 rounded-full mb-3"
                      style={{
                        backgroundColor: prediction.teamA.primaryColor,
                      }}
                    />
                  )}
                  <p className="font-semibold text-lg text-black dark:text-white mb-2">
                    {prediction.teamB.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(
                      prediction.coinsOnTeamA -
                      (prediction.initialCoinsOnTeamA ?? 0)
                    ).toLocaleString()}{" "}
                    coins
                  </p>
                  {winningTeam === "A" && (
                    <p className="text-green-600 dark:text-green-400 font-medium mt-2">
                      ✓ Selected
                    </p>
                  )}
                </div>
              </button>

              {/* Team B Option */}
              <button
                type="button"
                onClick={() => setWinningTeam("B")}
                className={`p-6 border-2 rounded-lg transition-all ${
                  winningTeam === "B"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500"
                }`}
              >
                <div className="text-center">
                  {prediction.teamB.primaryColor && (
                    <div
                      className="inline-block w-20 h-20 rounded-full mb-3"
                      style={{
                        backgroundColor: prediction.teamB.primaryColor,
                      }}
                    />
                  )}
                  <p className="font-semibold text-lg text-black dark:text-white mb-2">
                    {prediction.teamB.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(
                      prediction.coinsOnTeamB -
                      (prediction.initialCoinsOnTeamB ?? 0)
                    ).toLocaleString()}{" "}
                    coins
                  </p>
                  {winningTeam === "B" && (
                    <p className="text-green-600 dark:text-green-400 font-medium mt-2">
                      ✓ Selected
                    </p>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                setWinningTeam("");
                setError("");
              }}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !winningTeam}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Winning Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
