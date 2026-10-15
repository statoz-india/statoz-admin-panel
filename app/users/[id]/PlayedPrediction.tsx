"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlayedPrediction } from "@/app/interface/playedPrediction.interface";
import { Atom } from "react-loading-indicators";

type PlayedPredictionProps = {
  userId: string;
};

export default function PlayedPrediction({ userId }: PlayedPredictionProps) {
  const [items, setItems] = useState<PlayedPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `/api/users/${userId}/playedPredictionsForAdmin`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const response = await res.json();

      if (!res.ok) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            (typeof response?.error === "string" && response.error) ||
            "Failed to load played predictions",
        );
        return;
      }

      if (!response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to load played predictions",
        );
        return;
      }

      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load played predictions",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h2 className="text-xl font-semibold text-white">Played predictions</h2>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="px-3 py-1.5 text-sm border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Atom color="#5CDFFF" size="small" text="" textColor="" />
        </div>
      )}

      {!loading && error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-400 text-sm">No prediction bets yet.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500">
                <th className="py-2 pr-4 font-medium">Submitted</th>
                <th className="py-2 pr-4 font-medium">Match</th>
                <th className="py-2 pr-4 font-medium">Chosen</th>
                <th className="py-2 pr-4 font-medium">Bet</th>
                <th className="py-2 pr-4 font-medium">Won</th>
                <th className="py-2 pr-4 font-medium">Net</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-0 font-medium">Settled</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.submissionId}
                  className="border-b border-zinc-800 align-top"
                >
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {formatDate(row.submissionTime)}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-white">
                      {row.prediction?.teamA?.displayName ??
                        row.prediction?.teamA?.name}{" "}
                      vs{" "}
                      {row.prediction?.teamB?.displayName ??
                        row.prediction?.teamB?.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {row.prediction?.tournament} · {row.prediction?.gameType}
                    </div>
                  </td>
                  <td className="py-3 pr-4 capitalize">{row.teamChosen}</td>
                  <td className="py-3 pr-4">{row.coinsBet}</td>
                  <td className="py-3 pr-4">{row.coinsWon}</td>
                  <td className="py-3 pr-4">{row.coinsBet + row.coinsWon}</td>
                  <td className="py-3 pr-4 capitalize">
                    {row.coinsBet + row.coinsWon}
                  </td>
                  <td className="py-3 pr-0">{row.isSettled ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
