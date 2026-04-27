"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/app/store/authStore";
import { Atom } from "react-loading-indicators";

const USERS_SCROLL_POSITION_KEY = "admin_users_scroll_top";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

/** Up to 2 decimal places; omits “.00” when the value is whole. */
function formatCoinsDisplay(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0";
  return String(parseFloat(n.toFixed(2)));
}

export default function UsersSection() {
  const router = useRouter();
  const hasRestoredScrollRef = useRef(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => {
      const name = (user.userName ?? "").toLowerCase();
      const email = (user.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, searchQuery]);

  const saveScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    const scrollTop = container ? container.scrollTop : window.scrollY;
    sessionStorage.setItem(USERS_SCROLL_POSITION_KEY, String(scrollTop));
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem(USERS_SCROLL_POSITION_KEY);
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

  const navigateToUser = useCallback(
    (userId: string) => {
      saveScrollPosition();
      router.push(`/users/${userId}`, { scroll: false });
    },
    [router, saveScrollPosition],
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/users/getAllUsers", {
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
            "Failed to load users";
          setError(message);
          setUsers([]);
          return;
        }

        if (!response?.success) {
          setError(
            (typeof response?.message === "string" && response.message) ||
              "Failed to load users",
          );
          setUsers([]);
          return;
        }

        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
        setUsers(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (loading || hasRestoredScrollRef.current) return;
    restoreScrollPosition();
    hasRestoredScrollRef.current = true;
  }, [loading, restoreScrollPosition]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Users (Total: {filteredUsers.length}
          {searchQuery.trim() ? ` of ${users.length}` : ""})
        </h2>
        <div className="relative w-full sm:max-w-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email"
            aria-label="Search users by name or email"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-gray-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Sl No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                AuthProvider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Coins
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No users match your search.
                </td>
              </tr>
            ) : null}
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                onClick={() => navigateToUser(user._id)}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.authProvider ?? "unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.userStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatCoinsDisplay(user.coins)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(user.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
