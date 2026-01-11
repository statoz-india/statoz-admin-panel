"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPredictionById, Prediction, UserPrediction } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import EditPredictionModal from "@/app/components/EditPredictionModal";

interface PredictionUserResponse {
  userId: string;
  userName?: string;
  email?: string;
  userPrediction?: UserPrediction;
  [key: string]: unknown;
}

export default function PredictionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userResponses, setUserResponses] = useState<PredictionUserResponse[]>(
    []
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const predictionId = params?.id as string;

  const fetchPrediction = useCallback(async () => {
      if (!predictionId) return;

      try {
        setLoading(true);
        const response = await getPredictionById(predictionId);
        setPrediction(response.data);

        // Map user IDs to user response objects
        // Note: You may need to create an API endpoint to fetch user details
        // For now, we'll show the user IDs from responseSubmittedByUsers
        setUserResponses(
          response.data.responseSubmittedByUsers.map((userId: string) => ({
            userId,
          }))
        );
        setError("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load prediction"
        );
      } finally {
        setLoading(false);
      }
  }, [predictionId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchPrediction();
  }, [isAuthenticated, router, fetchPrediction]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">
          Loading prediction details...
        </p>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">
            {error || "Prediction not found"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Prediction
          </button>
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

        {/* Prediction Info Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              {prediction.predictionId}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tournament: {prediction.tournament}
            </p>
          </div>

          {/* Teams */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <div className="flex-1 text-center">
              {prediction.teamAcolorPrimary && (
                <div
                  className="inline-block w-20 h-20 rounded-full mb-3"
                  style={{ backgroundColor: prediction.teamAcolorPrimary }}
                />
              )}
              <p className="font-semibold text-lg text-black dark:text-white mb-1">
                {prediction.teamA}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {prediction.coinsOnTeamA.toLocaleString()} coins
              </p>
            </div>
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xl">
              VS
            </span>
            <div className="flex-1 text-center">
              {prediction.teamBcolorPrimary && (
                <div
                  className="inline-block w-20 h-20 rounded-full mb-3"
                  style={{ backgroundColor: prediction.teamBcolorPrimary }}
                />
              )}
              <p className="font-semibold text-lg text-black dark:text-white mb-1">
                {prediction.teamB}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {prediction.coinsOnTeamB.toLocaleString()} coins
              </p>
            </div>
          </div>

          {/* Odds and Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Total Coins
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {prediction.totalCoins.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Team A Odds
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {prediction.oddsTeamA.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {prediction.coinsOnTeamA.toLocaleString()} coins
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Team B Odds
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {prediction.oddsTeamB.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {prediction.coinsOnTeamB.toLocaleString()} coins
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Participants
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {prediction.responseSubmittedByUsers?.length || 0}
              </p>
            </div>
          </div>

          {/* Winning Team Coin (if exists) */}
          {prediction.winningTeamCoin !== undefined && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Winning Team Coin
              </p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {prediction.winningTeamCoin.toLocaleString()} coins
              </p>
            </div>
          )}

          {/* Created By */}
          {prediction.createdByUserData &&
            (prediction.createdByUserData.email ||
              prediction.createdByUserData.userType) && (
              <div className="pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Created by: {prediction.createdByUserData.email || "Unknown"}{" "}
                  {prediction.createdByUserData.userType &&
                    `(${prediction.createdByUserData.userType})`}
                </p>
              </div>
            )}
        </div>

        {/* User Responses Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            Users Who Participated ({userResponses.length})
          </h2>
          {userResponses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No users have participated in this prediction yet.
            </p>
          ) : (
            <div className="space-y-4">
              {userResponses.map((response, idx) => (
                <div
                  key={response.userId || idx}
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-black dark:text-white">
                        User ID: {response.userId}
                      </p>
                      {response.userName && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Name: {response.userName}
                        </p>
                      )}
                      {response.email && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email: {response.email}
                        </p>
                      )}
                    </div>
                  </div>
                  {response.userPrediction && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Team Chosen
                          </p>
                          <p className="font-medium text-black dark:text-white">
                            Team{" "}
                            {response.userPrediction.teamChosen === "A"
                              ? prediction.teamA
                              : prediction.teamB}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Coins Bet
                          </p>
                          <p className="font-medium text-black dark:text-white">
                            {response.userPrediction.coinsBet.toLocaleString()}{" "}
                            coins
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Predicted At
                          </p>
                          <p className="text-black dark:text-white">
                            {new Date(
                              response.userPrediction.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Prediction Modal */}
      <EditPredictionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchPrediction();
        }}
        prediction={prediction}
      />
    </div>
  );
}
