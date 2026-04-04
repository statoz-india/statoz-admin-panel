"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { UserSubmittedBets } from "@/app/api/predictions/[id]/userSubmissions/route";
import { buildAdminHomeHref } from "@/app/utils/buildAdminHomeHref";
import { Atom } from "react-loading-indicators";
import { Prediction } from "@/app/interface/prediction.interface";

export default function PredictionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userResponses, setUserResponses] = useState<UserSubmittedBets[]>([]);
  const [setCorrectTeamWonOpen, setSetCorrectTeamWonOpen] = useState(false);
  const [selectedWinningTeam, setSelectedWinningTeam] = useState<
    "A" | "B" | "D" | null
  >(null);
  const [submittingTeamWon, setSubmittingTeamWon] = useState(false);
  const [setCorrectError, setSetCorrectError] = useState("");
  const [distributePayoutOpen, setDistributePayoutOpen] = useState(false);
  const [distributingPayout, setDistributingPayout] = useState(false);
  const [distributePayoutError, setDistributePayoutError] = useState("");
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");
  const predictionId = params?.id as string;

  const isSettlementDone =
    prediction?.predictionStatus.toUpperCase() === "SETTLEMENT_DONE";
  const canDistributePayout =
    prediction?.predictionStatus.toUpperCase() === "WINNING_TEAM_UPDATED" &&
    prediction.winningTeam != null &&
    prediction.winningTeam !== "";

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/predictions/${predictionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const response = await res.json();
      setPrediction(response.data.data);
      setError("");
    } catch (err) {
      setPrediction(null);
      setError(err instanceof Error ? err.message : "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubmissions = async () => {
    if (!predictionId) return;
    try {
      const res = await fetch(
        `/api/predictions/${predictionId}/userSubmissions`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const response = await res.json();
      if (response.success && Array.isArray(response.data)) {
        setUserResponses(response.data);
      } else {
        setUserResponses([]);
      }
    } catch (err) {
      setUserResponses([]);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  useEffect(() => {
    if (predictionId && prediction) {
      fetchUserSubmissions();
    }
  }, [predictionId, prediction]);

  const handleSubmitTeamWon = async (winningTeam: "A" | "B" | "D") => {
    if (!predictionId || !prediction) return;
    const winningTeamId =
      winningTeam === "A"
        ? prediction.teamA._id
        : winningTeam === "B"
          ? prediction.teamB._id
          : undefined;
    setSubmittingTeamWon(true);
    setSetCorrectError("");
    try {
      const res = await fetch(
        `/api/predictions/${predictionId}/setCorrectTeamWon`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ winningTeam, winningTeamId }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setSetCorrectError(data?.message || "Failed to submit team won");
        return;
      }
      setSetCorrectTeamWonOpen(false);
      setSelectedWinningTeam(null);
      fetchPrediction();
    } catch (err) {
      setSetCorrectError(
        err instanceof Error ? err.message : "Failed to submit team won",
      );
    } finally {
      setSubmittingTeamWon(false);
    }
  };

  const handleDistributePayout = async () => {
    if (!predictionId) return;
    setDistributingPayout(true);
    setDistributePayoutError("");
    try {
      const res = await fetch(
        `/api/predictions/${predictionId}/distributePayout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({}),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setDistributePayoutError(
          data?.message || "Failed to distribute payouts",
        );
        return;
      }
      setDistributePayoutOpen(false);
      fetchPrediction();
    } catch (err) {
      setDistributePayoutError(
        err instanceof Error ? err.message : "Failed to distribute payouts",
      );
    } finally {
      setDistributingPayout(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
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
            onClick={() =>
              router.push(buildAdminHomeHref(fromSection, searchParams))
            }
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
            onClick={() =>
              router.push(buildAdminHomeHref(fromSection, searchParams))
            }
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            {!isSettlementDone && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSetCorrectError("");
                    setSelectedWinningTeam(null);
                    setSetCorrectTeamWonOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm font-medium"
                >
                  Submit correct team won
                </button>
                {canDistributePayout && (
                  <button
                    type="button"
                    onClick={() => {
                      setDistributePayoutError("");
                      setDistributePayoutOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-sm font-medium"
                  >
                    Distribute payouts
                  </button>
                )}
              </>
            )}
            {setCorrectTeamWonOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
              >
                <div
                  className="fixed inset-0 bg-black/50 dark:bg-black/70"
                  aria-hidden
                  onClick={() =>
                    !submittingTeamWon && setSetCorrectTeamWonOpen(false)
                  }
                />
                <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 shadow-xl p-6">
                  <h2
                    id="dialog-title"
                    className="text-lg font-semibold text-black dark:text-white mb-4"
                  >
                    Submit correct team won
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Choose the winning team for this prediction.
                  </p>
                  <div
                    className={`mb-6 ${
                      prediction.gameType === "football"
                        ? "grid grid-cols-1 md:grid-cols-3 gap-3"
                        : "flex gap-3"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedWinningTeam("A")}
                      disabled={submittingTeamWon}
                      className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedWinningTeam === "A"
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500"
                          : "border-gray-200 dark:border-zinc-600 hover:border-gray-300 dark:hover:border-zinc-500"
                      }`}
                    >
                      <span className="font-medium text-black dark:text-white block">
                        Team A
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {prediction.teamA.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWinningTeam("B")}
                      disabled={submittingTeamWon}
                      className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedWinningTeam === "B"
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500"
                          : "border-gray-200 dark:border-zinc-600 hover:border-gray-300 dark:hover:border-zinc-500"
                      }`}
                    >
                      <span className="font-medium text-black dark:text-white block">
                        Team B
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {prediction.teamB.name}
                      </span>
                    </button>
                    {prediction.gameType === "football" && (
                      <button
                        type="button"
                        onClick={() => setSelectedWinningTeam("D")}
                        disabled={submittingTeamWon}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedWinningTeam === "D"
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500"
                            : "border-gray-200 dark:border-zinc-600 hover:border-gray-300 dark:hover:border-zinc-500"
                        }`}
                      >
                        <span className="font-medium text-black dark:text-white block">
                          Draw
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          No team wins
                        </span>
                      </button>
                    )}
                  </div>
                  {setCorrectError && (
                    <p className="text-sm text-red-500 dark:text-red-400 mb-4">
                      {setCorrectError}
                    </p>
                  )}
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setSetCorrectTeamWonOpen(false)}
                      disabled={submittingTeamWon}
                      className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        selectedWinningTeam &&
                        handleSubmitTeamWon(selectedWinningTeam)
                      }
                      disabled={!selectedWinningTeam || submittingTeamWon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {submittingTeamWon ? "Submitting…" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {distributePayoutOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="distribute-dialog-title"
              >
                <div
                  className="fixed inset-0 bg-black/50 dark:bg-black/70"
                  aria-hidden
                  onClick={() =>
                    !distributingPayout && setDistributePayoutOpen(false)
                  }
                />
                <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 shadow-xl p-6">
                  <h2
                    id="distribute-dialog-title"
                    className="text-lg font-semibold text-black dark:text-white mb-4"
                  >
                    Distribute payouts
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to distribute payout?
                  </p>
                  {distributePayoutError && (
                    <p className="text-sm text-red-500 dark:text-red-400 mb-4">
                      {distributePayoutError}
                    </p>
                  )}
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setDistributePayoutOpen(false)}
                      disabled={distributingPayout}
                      className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDistributePayout}
                      disabled={distributingPayout}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
                    >
                      {distributingPayout ? "Distributing…" : "Yes, distribute"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <span
              className={`px-4 py-2 rounded text-sm font-medium ${
                prediction.predictionStatus === "SETTLEMENT_DONE"
                  ? "bg-indigo-800 text-indigo-200"
                  : prediction.isVisible
                    ? "text-white bg-green-900"
                    : "bg-gray-700 text-gray-200"
              }`}
            >
              {prediction.predictionStatus}
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
            <p className="text-gray-600 dark:text-gray-400">
              Prediction ID: {prediction._id}
            </p>
            {prediction.matchStartTime && (
              <p className="text-gray-600 dark:text-gray-400">
                Match start:{" "}
                {new Date(prediction.matchStartTime).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>

          {/* Teams */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <div className="flex-1 text-center">
              {prediction.teamA.primaryColor && (
                <div
                  className="inline-flex items-center justify-center w-20 h-20 text-lg rounded-full mb-3"
                  style={{
                    backgroundColor: prediction.teamA.primaryColor,
                    color: prediction.teamA.textColor,
                  }}
                >
                  {prediction.teamA.abbreviation}
                </div>
              )}
              <p className="font-semibold text-lg text-black dark:text-white mb-1">
                {prediction.teamA.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(
                  prediction.coinsOnTeamA -
                  (prediction.initialCoinsOnTeamA ?? 0)
                ).toLocaleString()}{" "}
                coins
              </p>
            </div>
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xl">
              VS
            </span>
            <div className="flex-1 text-center">
              {prediction.teamB.primaryColor && (
                <div
                  className="inline-flex items-center justify-center w-20 h-20 text-lg rounded-full mb-3"
                  style={{
                    backgroundColor: prediction.teamB.primaryColor,
                    color: prediction.teamB.textColor,
                  }}
                >
                  {prediction.teamB.abbreviation}
                </div>
              )}
              <p className="font-semibold text-lg text-black dark:text-white mb-1">
                {prediction.teamB.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(
                  prediction.coinsOnTeamB -
                  (prediction.initialCoinsOnTeamB ?? 0)
                ).toLocaleString()}{" "}
                coins
              </p>
            </div>
          </div>

          {/* Winning Team */}
          {prediction.winningTeam != null && prediction.winningTeam !== "" && (
            <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-1">
                Winning team
              </p>
              <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                {prediction.winningTeam === "A"
                  ? prediction.teamA.name
                  : prediction.winningTeam === "B"
                    ? prediction.teamB.name
                    : "Draw"}
              </p>
            </div>
          )}

          {/* Odds and Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Total Coins
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(
                  prediction.totalCoins -
                  (prediction.initialCoinsOnTeamA ?? 0) -
                  (prediction.initialCoinsOnTeamB ?? 0) -
                  (prediction.initialCoinsOnDraw ?? 0)
                ).toLocaleString()}
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
                {(
                  prediction.coinsOnTeamA -
                  (prediction.initialCoinsOnTeamA ?? 0)
                ).toLocaleString()}{" "}
                coins
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
                {(
                  prediction.coinsOnTeamB -
                  (prediction.initialCoinsOnTeamB ?? 0)
                ).toLocaleString()}{" "}
                coins
              </p>
            </div>
            {prediction.oddsDraw !== null && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Draw Coins
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {prediction.oddsDraw.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(
                    prediction.coinsOnDraw -
                    (prediction.initialCoinsOnDraw ?? 0)
                  ).toLocaleString()}{" "}
                  coins
                </p>
              </div>
            )}
          </div>

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
                  key={response._id || idx}
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-black dark:text-white">
                        Email: {response.userData.email}
                      </p>
                      {response.userData?.userName && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Name: {response.userData.userName}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        User ID: {response.userId}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Team Chosen
                        </p>
                        <p className="font-medium text-black dark:text-white">
                          Team{" "}
                          {response.teamChosen === "A"
                            ? prediction.teamA.name
                            : prediction.teamB.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Coins Bet
                        </p>
                        <p className="font-medium text-black dark:text-white">
                          {response.coinsBet.toLocaleString()} coins
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Payout Status
                        </p>
                        <p className="font-medium text-black dark:text-white">
                          {response.payoutStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Coins Won
                        </p>
                        <p className="font-medium text-black dark:text-white">
                          {response.coinsWon}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Submitted At
                        </p>
                        <p className="text-black dark:text-white">
                          {new Date(
                            response.submissionTime || response.createdAt,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
