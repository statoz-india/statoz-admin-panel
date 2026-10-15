"use client";

import { useCallback, useEffect, useState } from "react";
import type { FutureBet } from "@/app/models/futures.model";
import { Atom } from "react-loading-indicators";

type FutureBetsProps = {
  futureId: string;
};

function formatInIST(iso: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatOddsChoice(value: number | null | undefined) {
  if (value == null) return "null";
  if (!Number.isFinite(value)) return "null";
  return `${value.toFixed(2)}%`;
}

function formatCoins(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return value.toLocaleString();
}

export default function FutureBets({ futureId }: FutureBetsProps) {
  const [bets, setBets] = useState<FutureBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!futureId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `/api/futures/${encodeURIComponent(futureId)}/future-bets`,
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
            "Failed to load future bets",
        );
        setBets([]);
        return;
      }

      if (!response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to load future bets",
        );
        setBets([]);
        return;
      }

      setBets(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load future bets");
      setBets([]);
    } finally {
      setLoading(false);
    }
  }, [futureId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Future bets
        </h2>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300">
            <span className="text-gray-500 dark:text-gray-400">Total bets</span>
            <span className="text-black dark:text-white">
              {bets.length.toLocaleString()}
            </span>
          </span>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Atom color="#5CDFFF" size="small" text="" textColor="" />
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {!loading && !error && bets.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No bets on this future yet.
        </p>
      )}

      {!loading && !error && bets.length > 0 && (
        <div className="-mx-2 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 dark:border-zinc-700 dark:text-gray-500">
                <th className="py-2 pr-4 font-medium">Submitted</th>
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">Choice</th>
                <th className="py-2 pr-4 font-medium">Bet</th>
                <th className="py-2 pr-4 font-medium">Odds</th>
                <th className="py-2 pr-4 font-medium">Won</th>
                <th className="py-2 pr-4 font-medium">Received</th>

                <th className="py-2 pr-0 font-medium">Payout</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-gray-100 align-top dark:border-zinc-800"
                >
                  <td className="whitespace-nowrap py-3 pr-4">
                    {formatInIST(row.submissionTime)}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-black dark:text-white">
                      {row.userId?.userName ?? "—"}
                    </span>
                    {row.userId?.email ? (
                      <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                        {row.userId.email}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4">
                    {row.futureChoiceId?.choiceName ?? "—"}
                  </td>
                  <td className="py-3 pr-4">{formatCoins(row.coinsBet)}</td>
                  <td className="py-3 pr-4">
                    {formatOddsChoice(row.oddsChoice)}
                  </td>
                  <td className="py-3 pr-4">{formatCoins(row.coinsWon)}</td>
                  <td className="py-3 pr-4">
                    {formatCoins(row.totalCoinsReceived)}
                  </td>

                  <td className="py-3 pr-0 capitalize">
                    {row.payoutStatus || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
