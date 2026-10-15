"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { Atom } from "react-loading-indicators";

type CoinsSort = "desc" | "asc";

/** Matches `GET /leaderboard/coinsLeaderboard` user rows. */
export interface CoinsLeaderboardUser {
  _id: string;
  userName: string;
  email: string;
  userType: string;
  coins: number;
  totalXP: number;
  rank: number;
}

/** Up to 2 decimal places; omits “.00” when the value is whole. */
function formatCoinsDisplay(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0";
  return String(parseFloat(n.toFixed(2)));
}

/**
 * Next.js route returns `successResponse(backendBody)`.
 * Backend body: `{ statusCode, data: { leaderboard, totalUsers }, message, success }`.
 */
function parseCoinsLeaderboardPayload(payload: unknown): {
  rows: CoinsLeaderboardUser[];
  totalUsers: number | null;
} {
  if (Array.isArray(payload)) {
    return {
      rows: payload.filter(isCoinsLeaderboardRow),
      totalUsers: null,
    };
  }
  if (!payload || typeof payload !== "object") {
    return { rows: [], totalUsers: null };
  }

  const root = payload as Record<string, unknown>;

  if (root.data && typeof root.data === "object") {
    const inner = root.data as Record<string, unknown>;
    if (Array.isArray(inner.leaderboard)) {
      return {
        rows: inner.leaderboard.filter(isCoinsLeaderboardRow),
        totalUsers:
          typeof inner.totalUsers === "number" ? inner.totalUsers : null,
      };
    }
  }

  if (Array.isArray(root.leaderboard)) {
    return {
      rows: root.leaderboard.filter(isCoinsLeaderboardRow),
      totalUsers: typeof root.totalUsers === "number" ? root.totalUsers : null,
    };
  }

  return { rows: [], totalUsers: null };
}

function isCoinsLeaderboardRow(row: unknown): row is CoinsLeaderboardUser {
  if (!row || typeof row !== "object") return false;
  const r = row as Record<string, unknown>;
  return typeof r._id === "string" && typeof r.rank === "number";
}

export default function CoinsLeaderboardSection() {
  const router = useRouter();
  const [users, setUsers] = useState<CoinsLeaderboardUser[]>([]);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coinsSort, setCoinsSort] = useState<CoinsSort>("desc");

  const sortedUsers = useMemo(() => {
    const copy = [...users];
    copy.sort((a, b) => {
      const ac = Number(a.coins) || 0;
      const bc = Number(b.coins) || 0;
      return coinsSort === "desc" ? bc - ac : ac - bc;
    });
    return copy;
  }, [users, coinsSort]);

  const toggleCoinsSort = useCallback(() => {
    setCoinsSort((s) => (s === "desc" ? "asc" : "desc"));
  }, []);

  const fetchCoinsLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/leaderboard/coins", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const response = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to fetch coins leaderboard";
        throw new Error(message);
      }

      const inner = response?.data;
      const { rows, totalUsers: count } = parseCoinsLeaderboardPayload(inner);
      setUsers(rows);
      setTotalUsers(count);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load coins leaderboard",
      );
      setUsers([]);
      setTotalUsers(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoinsLeaderboard();
  }, [fetchCoinsLeaderboard]);

  const goToUser = useCallback(
    (userId: string) => {
      const q = new URLSearchParams({
        fromSection: "leaderboard",
        leaderboardTab: "coins",
      });
      router.push(`/users/${userId}?${q.toString()}`, { scroll: false });
    },
    [router],
  );

  if (loading) {
    return (
      <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-[40vh]">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {totalUsers !== null && (
        <p className="text-sm text-gray-400 mb-4">
          {totalUsers} user{totalUsers === 1 ? "" : "s"} on the leaderboard
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Sl. no.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                aria-sort={coinsSort === "desc" ? "descending" : "ascending"}
              >
                <button
                  type="button"
                  onClick={toggleCoinsSort}
                  className="inline-flex items-center gap-1 rounded-md -mx-1 px-1 py-0.5 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  title={
                    coinsSort === "desc"
                      ? "Sorted by coins: highest first. Click for lowest first."
                      : "Sorted by coins: lowest first. Click for highest first."
                  }
                >
                  Coins
                  {coinsSort === "desc" ? (
                    <ArrowDownWideNarrow
                      className="h-3.5 w-3.5 shrink-0 opacity-80"
                      aria-hidden
                    />
                  ) : (
                    <ArrowUpNarrowWide
                      className="h-3.5 w-3.5 shrink-0 opacity-80"
                      aria-hidden
                    />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total XP
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user, index) => {
                const podium = coinsSort === "desc" && index < 3 ? index : -1;
                return (
                  <tr
                    key={user._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => goToUser(user._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goToUser(user._id);
                      }
                    }}
                    className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                      podium === 0
                        ? "bg-yellow-50 dark:bg-yellow-900/20"
                        : podium === 1
                          ? "bg-gray-50 dark:bg-gray-800/50"
                          : podium === 2
                            ? "bg-orange-50 dark:bg-orange-900/20"
                            : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          podium === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : podium === 1
                              ? "bg-gray-300 text-gray-700"
                              : podium === 2
                                ? "bg-orange-400 text-orange-900"
                                : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                      {user.userType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      {formatCoinsDisplay(user.coins)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      {typeof user.totalXP === "number"
                        ? user.totalXP.toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No coins leaderboard data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
