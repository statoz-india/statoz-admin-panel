"use client";

import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import { UserRound } from "lucide-react";
import {
  SPORT_LEADERBOARD_GAME_TYPES,
  type SportLeaderboard as SportBoard,
  type SportLeaderboardGameType,
} from "@/app/interface/sport-leaderboard.interface";
import { apiRequest } from "@/app/utils/apiRequest";

const SPORT_LABELS: Record<SportLeaderboardGameType, string> = {
  cricket: "Cricket",
  football: "Football",
  basketball: "Basketball",
  racing: "Racing",
};

/** Top 25 players of one sport, by XP summed over that sport's tournaments. */
export default function SportLeaderboard() {
  const [gameType, setGameType] = useState<SportLeaderboardGameType>("cricket");
  const [result, setResult] = useState<{ gameType: string; board: SportBoard | null; error: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest<SportBoard>(`/api/leaderboard/sport/${gameType}`, { method: "GET" }, "Failed to load the leaderboard")
      .then((board) => {
        if (!cancelled) setResult({ gameType, board, error: "" });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setResult({
            gameType,
            board: null,
            error: error instanceof Error ? error.message : "Failed to load the leaderboard",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [gameType]);

  const loading = result?.gameType !== gameType;
  const board = loading ? null : result?.board;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {SPORT_LEADERBOARD_GAME_TYPES.map((sport) => (
          <button
            key={sport}
            type="button"
            onClick={() => setGameType(sport)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              gameType === sport
                ? "bg-cyan-600 text-white"
                : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {SPORT_LABELS[sport]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      ) : result?.error ? (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-red-400">{result.error}</p>
        </div>
      ) : !board || board.leaderboard.length === 0 ? (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-10 text-center">
          <p className="text-white">No one has played {SPORT_LABELS[gameType].toLowerCase()} yet.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-400">
            Top {board.leaderboard.length} of {board.totalPlayers.toLocaleString("en-IN")} player
            {board.totalPlayers === 1 ? "" : "s"}
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-800">
                <tr>
                  {["Rank", "Username", `${SPORT_LABELS[gameType]} XP`, "Total XP", "Coins"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700 bg-zinc-900">
                {board.leaderboard.map((row) => (
                  <tr key={row._id} className="hover:bg-zinc-800">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">#{row.rank}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                      <span className="flex items-center gap-3">
                        {row.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- avatars are on an external CDN
                          <img src={row.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700">
                            <UserRound className="h-4 w-4 text-zinc-400" />
                          </span>
                        )}
                        {row.userName}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-white">
                      {row.sportXP.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {row.totalXP.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {row.coins.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
