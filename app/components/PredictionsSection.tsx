"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatePredictionModal from "./CreatePredictionModal";
import EditPredictionModal from "./EditPredictionModal";
import { Prediction } from "../api/predictions/route";

export default function PredictionsSection() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/predictions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const response = await res.json();
      setPredictions(response.data.data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load predictions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">
          Loading predictions...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Predictions</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200"
        >
          Create New Prediction
        </button>
      </div>

      <CreatePredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPredictions}
      />
      {error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500 dark:text-red-400">{error}</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {predictions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No predictions found.
            </p>
          ) : (
            predictions.map((prediction) => (
              <div
                key={prediction._id}
                className="border border-gray-200 dark:border-zinc-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    onClick={() => router.push(`/prediction/${prediction._id}`)}
                    className="flex-1 cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                      {prediction.predictionId}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tournament: {prediction.tournament}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        prediction.isVisible
                          ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {prediction.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Teams */}
                <div
                  onClick={() => router.push(`/prediction/${prediction._id}`)}
                  className="flex items-center gap-4 mb-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  <div className="flex-1 text-center">
                    {prediction.teamA.primaryColor ? (
                      <div
                        className="inline-block w-16 h-16 rounded-full mb-2"
                        style={{
                          backgroundColor: prediction.teamA.primaryColor,
                        }}
                      />
                    ) : (
                      <div className="inline-block w-16 h-16 rounded-full mb-2 bg-gray-300 dark:bg-gray-600" />
                    )}
                    <p className="font-semibold text-black dark:text-white mb-1">
                      {prediction.teamA.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {prediction.coinsOnTeamA.toLocaleString()} coins
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {prediction.oddsTeamA.toFixed(2)}% odds
                    </p>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500 font-bold">
                    VS
                  </span>
                  <div className="flex-1 text-center">
                    {prediction.teamB.primaryColor ? (
                      <div
                        className="inline-block w-16 h-16 rounded-full mb-2"
                        style={{
                          backgroundColor: prediction.teamB.primaryColor,
                        }}
                      />
                    ) : (
                      <div className="inline-block w-16 h-16 rounded-full mb-2 bg-gray-300 dark:bg-gray-600" />
                    )}
                    <p className="font-semibold text-black dark:text-white mb-1">
                      {prediction.teamB.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {prediction.coinsOnTeamB.toLocaleString()} coins
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {prediction.oddsTeamB.toFixed(2)}% odds
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div
                  onClick={() => router.push(`/prediction/${prediction._id}`)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer"
                >
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Total Coins
                    </p>
                    <p className="text-lg font-bold text-black dark:text-white">
                      {prediction.totalCoins.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Team A Coins
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {prediction.coinsOnTeamA.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Team B Coins
                    </p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {prediction.coinsOnTeamB.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Participants
                    </p>
                    <p className="text-lg font-bold text-black dark:text-white">
                      {prediction.responseSubmittedByUsers?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Winning Team Coin (if exists) */}
                {prediction.winningTeamCoin !== undefined && (
                  <div
                    onClick={() => router.push(`/prediction/${prediction._id}`)}
                    className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg cursor-pointer"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Winning Team Coin:</span>{" "}
                      {prediction.winningTeamCoin.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Created By */}
                {prediction.createdByUserData &&
                  (prediction.createdByUserData.email ||
                    prediction.createdByUserData.userType) && (
                    <div
                      onClick={() =>
                        router.push(`/prediction/${prediction._id}`)
                      }
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm cursor-pointer"
                    >
                      <p className="text-gray-500 dark:text-gray-400">
                        Created by:{" "}
                        {prediction.createdByUserData.email || "Unknown"}{" "}
                        {prediction.createdByUserData.userType &&
                          `(${prediction.createdByUserData.userType})`}
                      </p>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
