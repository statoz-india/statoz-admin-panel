"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreatePredictionModal from "./CreatePredictionModal";
import {
  PREDICTION_STATUS_VALUES,
  PredictionStatus,
} from "@/app/constants/prediction-status";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Atom } from "react-loading-indicators";
import { Prediction } from "@/app/interface/prediction.interface";

const PREDICTIONS_SCROLL_POSITION_KEY = "admin_predictions_scroll_top";
const PREDICTIONS_SHOULD_RESTORE_SCROLL_KEY =
  "admin_predictions_should_restore_scroll";
const QUERY_PRED_TOURNAMENT = "predTournament";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

type PredictionStatusFilter =
  | "all"
  | "active"
  | "finished"
  | "settlement_done";

const PREDICTION_STATUS_FILTER_OPTIONS: {
  value: PredictionStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "finished", label: "Finished" },
  { value: "settlement_done", label: "Settlement done" },
];

function resolveTournamentQueryParam(
  raw: string | null,
  tournamentList: string[],
): string {
  if (raw === "LIVE") return "LIVE";
  if (raw && tournamentList.includes(raw)) return raw;
  return "LIVE";
}

const getPredictionStatusBadgeClass = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-green-900 text-green-200";
    case "LIVE":
      return "bg-blue-900 text-blue-200";
    case "UPCOMING":
      return "bg-violet-900 text-violet-200";
    case "CANCELLED":
      return "bg-red-900 text-red-200";
    case "SETTLEMENT_DONE":
      return "bg-indigo-800 text-indigo-200";
    case "NOT_VISIBLE":
      return "bg-gray-700 text-gray-200";
    case "ADMIN_VISIBLE":
      return "bg-cyan-900 text-cyan-200";
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

export default function PredictionsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournamentParam =
    searchParams.get(QUERY_PRED_TOURNAMENT) ?? searchParams.get("tournament");
  const hasRestoredScrollRef = useRef(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const saveScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    const scrollTop = container ? container.scrollTop : window.scrollY;
    sessionStorage.setItem(PREDICTIONS_SCROLL_POSITION_KEY, String(scrollTop));
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem(PREDICTIONS_SCROLL_POSITION_KEY);
    if (!raw) return;

    const parsedScrollTop = Number(raw);
    if (!Number.isFinite(parsedScrollTop)) return;

    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTo({ top: parsedScrollTop, behavior: "auto" });
      } else {
        window.scrollTo({ top: parsedScrollTop, behavior: "auto" });
      }
    });
  }, []);

  const [tournaments, setTournaments] = useState<string[]>([]);
  const [tournamentListReady, setTournamentListReady] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState("LIVE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openStatusDropdownPredictionId, setOpenStatusDropdownPredictionId] =
    useState<string | null>(null);
  const [statusUpdateLoadingPredictionId, setStatusUpdateLoadingPredictionId] =
    useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<PredictionStatusFilter>("all");

  const filteredPredictions = useMemo(() => {
    if (statusFilter === "all") return predictions;
    return predictions.filter((p) => {
      const s = p.predictionStatus.toUpperCase();
      if (statusFilter === "active") return s === "ACTIVE";
      if (statusFilter === "finished") return s === "FINISHED";
      if (statusFilter === "settlement_done") return s === "SETTLEMENT_DONE";
      return true;
    });
  }, [predictions, statusFilter]);

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

  const fetchTournamentsList = async (): Promise<string[]> => {
    try {
      const res = await fetch("/api/tournament", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        return [];
      }

      const response = await res.json();
      const tournamentData = response.success ? response.data.data : [];
      return Array.isArray(tournamentData) ? tournamentData : [];
    } catch {
      return [];
    }
  };

  const fetchPredictions = useCallback(async (tournament: string) => {
    try {
      setLoading(true);
      setError("");
      const endpoint =
        tournament === "LIVE"
          ? `/api/predictions/live-predictions`
          : `/api/predictions/tournament/${encodeURIComponent(tournament)}`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const response = await res.json();

      if (!res.ok) {
        const message =
          (typeof response?.metadata?.message === "string" &&
            response?.metadata?.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load predictions 1";
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
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const list = await fetchTournamentsList();
      if (cancelled) return;
      setTournaments(list);
      setTournamentListReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!tournamentListReady) return;

    let cancelled = false;

    (async () => {
      const resolved = resolveTournamentQueryParam(
        tournamentParam,
        tournaments,
      );
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "predictions");
      const needsNormalize =
        searchParams.get("section") !== "predictions" ||
        searchParams.get(QUERY_PRED_TOURNAMENT) !== resolved ||
        searchParams.get("tournament") != null ||
        searchParams.get("from") != null ||
        searchParams.get("quizTournament") != null;
      if (needsNormalize) {
        sp.set(QUERY_PRED_TOURNAMENT, resolved);
        sp.delete("tournament");
        stripAdminHomeQueryNoise("predictions", sp);
        router.replace(`/?${sp.toString()}`, { scroll: false });
      }
      if (cancelled) return;
      setSelectedTournament(resolved);
      await fetchPredictions(resolved);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    tournamentListReady,
    tournamentParam,
    tournaments,
    fetchPredictions,
    router,
    searchParams,
  ]);

  const replacePredictionsTournamentInUrl = useCallback(
    (tournament: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "predictions");
      sp.set(QUERY_PRED_TOURNAMENT, tournament);
      sp.delete("tournament");
      stripAdminHomeQueryNoise("predictions", sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const predictionHrefWithListContext = useCallback(
    (path: string) => {
      const sep = path.includes("?") ? "&" : "?";
      return `${path}${sep}from=predictions&${QUERY_PRED_TOURNAMENT}=${encodeURIComponent(selectedTournament)}`;
    },
    [selectedTournament],
  );

  useEffect(() => {
    if (loading || hasRestoredScrollRef.current) return;
    const shouldRestore =
      typeof window !== "undefined" &&
      sessionStorage.getItem(PREDICTIONS_SHOULD_RESTORE_SCROLL_KEY) === "1";
    if (shouldRestore) {
      sessionStorage.removeItem(PREDICTIONS_SHOULD_RESTORE_SCROLL_KEY);
      restoreScrollPosition();
    }
    hasRestoredScrollRef.current = true;
  }, [loading, restoreScrollPosition]);

  const handlePredictionClick = (predictionId: string) => {
    saveScrollPosition();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(PREDICTIONS_SHOULD_RESTORE_SCROLL_KEY, "1");
    }
    router.push(predictionHrefWithListContext(`/prediction/${predictionId}`), {
      scroll: false,
    });
  };

  const updatePredictionStatus = async (
    predictionId: string,
    predictionStatus: PredictionStatus,
  ) => {
    try {
      setStatusUpdateLoadingPredictionId(predictionId);
      const res = await fetch(
        `/api/predictions/${predictionId}/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ predictionStatus }),
        },
      );

      const response = await res.json();
      if (!res.ok || !response?.success) {
        throw new Error(
          response?.message || "Failed to update prediction status",
        );
      }

      setPredictions((prev) =>
        prev.map((prediction) =>
          prediction._id === predictionId
            ? { ...prediction, predictionStatus }
            : prediction,
        ),
      );
      setOpenStatusDropdownPredictionId(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update prediction status",
      );
    } finally {
      setStatusUpdateLoadingPredictionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
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

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Tournament
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => replacePredictionsTournamentInUrl("LIVE")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedTournament === "LIVE"
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            Show Live Predictions
          </button>
          {tournaments.map((tournament) => (
            <button
              key={tournament}
              onClick={() => replacePredictionsTournamentInUrl(tournament)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedTournament === tournament
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
              }`}
            >
              {tournament}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Filter by status
        </label>
        <div className="flex flex-wrap gap-3">
          {PREDICTION_STATUS_FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                statusFilter === value
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <CreatePredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchPredictions(selectedTournament)}
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
          ) : filteredPredictions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No predictions match this filter.
            </p>
          ) : (
            filteredPredictions.map((prediction) => (
              <div
                key={prediction._id}
                className="border border-gray-200 dark:border-zinc-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    onClick={() => handlePredictionClick(prediction._id)}
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
                  <div className="relative">
                    <button
                      type="button"
                      disabled={
                        statusUpdateLoadingPredictionId === prediction._id
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          prediction.predictionStatus.toUpperCase() ===
                          "SETTLEMENT_DONE"
                        ) {
                          return;
                        }
                        setOpenStatusDropdownPredictionId((prev) =>
                          prev === prediction._id ? null : prediction._id,
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPredictionStatusBadgeClass(
                        prediction.predictionStatus,
                      )} ${
                        prediction.predictionStatus.toUpperCase() ===
                        "SETTLEMENT_DONE"
                          ? "cursor-not-allowed opacity-80"
                          : "cursor-pointer"
                      } ${
                        statusUpdateLoadingPredictionId === prediction._id
                          ? "opacity-60 cursor-wait"
                          : ""
                      }`}
                    >
                      {prediction.predictionStatus}
                    </button>

                    {openStatusDropdownPredictionId === prediction._id && (
                      <div
                        className="absolute right-0 mt-2 min-w-[220px] bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-20 p-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {PREDICTION_STATUS_VALUES.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() =>
                              updatePredictionStatus(prediction._id, status)
                            }
                            className={`w-full text-left px-3 py-2 rounded text-sm ${
                              prediction.predictionStatus.toUpperCase() ===
                              status
                                ? "bg-white text-black"
                                : "text-zinc-200 hover:bg-zinc-800"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
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
                  onClick={() => handlePredictionClick(prediction._id)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer"
                >
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Total Coins
                    </p>
                    <p className="text-lg font-bold text-black dark:text-white">
                      {(
                        prediction.totalCoins -
                        (prediction.initialCoinsOnTeamA ?? 0) -
                        (prediction.initialCoinsOnTeamB ?? 0) -
                        (prediction.initialCoinsOnDraw ?? 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Team A Coins
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {(
                        prediction.coinsOnTeamA -
                        (prediction.initialCoinsOnTeamA ?? 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Team B Coins
                    </p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {(
                        prediction.coinsOnTeamB -
                        (prediction.initialCoinsOnTeamB ?? 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                  {prediction.oddsDraw !== null && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Draw Coins
                      </p>
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                        {(
                          prediction.coinsOnDraw -
                          (prediction.initialCoinsOnDraw ?? 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
