"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatePredictionModal from "./CreatePredictionModal";
import { Prediction } from "../../api/predictions/route";

export default function PredictionsSection() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDateTime = (isoString: string | undefined): string => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "—";
    }
  };

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/predictions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const response = await res.json();

      if (!res.ok) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load predictions";
        setError(message);
        setPredictions([]);
        return;
      }

      if (!response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to load predictions",
        );
        setPredictions([]);
        return;
      }

      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setPredictions(list);
    } catch (err) {
      setPredictions([]);
      setError(
        err instanceof Error ? err.message : "Failed to load predictions",
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
                    {prediction.matchStartTime && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                        Match start: {formatDateTime(prediction.matchStartTime)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        prediction.status === "SETTLEMENT_DONE"
                          ? "bg-indigo-800 text-indigo-200"
                          : prediction.isVisible
                            ? "bg-green-900 text-green-200"
                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {prediction.status}
                    </span>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center gap-4 mb-4 p-4 bg-zinc-800 rounded-lg">
                  <div className="flex-1 text-center">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg"
                      style={{
                        backgroundColor: prediction.teamA.primaryColor,
                        color: prediction.teamA.textColor,
                      }}
                    >
                      {prediction.teamA.abbreviation}
                    </div>
                    <p className="font-semibold text-white">
                      {prediction.teamA.name}
                    </p>
                  </div>
                  <span className="text-gray-500 font-bold">VS</span>
                  <div className="flex-1 text-center">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg"
                      style={{
                        backgroundColor: prediction.teamB.primaryColor,
                        color: prediction.teamB.textColor,
                      }}
                    >
                      {prediction.teamB.abbreviation}
                    </div>
                    <p className="font-semibold text-white">
                      {prediction.teamB.name}
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
                      {(prediction.totalCoins - (prediction.initialCoinsOnTeamA ?? 0) - (prediction.initialCoinsOnTeamB ?? 0)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Team A Coins
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {(prediction.coinsOnTeamA - (prediction.initialCoinsOnTeamA ?? 0)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Team B Coins
                    </p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {(prediction.coinsOnTeamB - (prediction.initialCoinsOnTeamB ?? 0)).toLocaleString()}
                    </p>
                  </div>
                </div>

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
