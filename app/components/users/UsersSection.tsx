"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/app/store/authStore";
import { Atom } from "react-loading-indicators";
import {
  PaginatedUsers,
  USERS_PAGE_SIZE,
} from "@/app/interface/pagination.interface";

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
  // Distinguishes the very first load (full-screen spinner) from later refetches
  // triggered by paging/search (which keep the table + search box mounted).
  const initialLoadRef = useRef(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // `searchInput` is what the user types; `searchQuery` is the debounced value
  // actually sent to the server.
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<
    Pick<PaginatedUsers, "total" | "totalPages" | "hasMore" | "limit">
  >({
    total: 0,
    totalPages: 0,
    hasMore: false,
    limit: USERS_PAGE_SIZE,
  });

  // Run the search on demand (icon click / Enter), starting from page 1.
  const submitSearch = useCallback(() => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  }, [searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setPage(1);
    setSearchQuery("");
  }, []);

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

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
    if (typeof window !== "undefined") {
      const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
      (container ?? window).scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        // Plain list vs. server-side search use separate endpoints.
        const url = searchQuery
          ? `/api/users/searchUsers?searchQuery=${encodeURIComponent(
              searchQuery,
            )}&page=${page}`
          : `/api/users/getAllUsers?page=${page}`;
        const res = await fetch(url, {
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

        const data = response.data ?? {};
        const list: User[] = Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : [];
        setUsers(list);
        setPageInfo({
          total: Number(data.total) || list.length,
          totalPages: Number(data.totalPages) || (list.length ? 1 : 0),
          hasMore: Boolean(data.hasMore),
          limit: Number(data.limit) || USERS_PAGE_SIZE,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
        initialLoadRef.current = false;
      }
    };

    fetchUsers();
  }, [page, searchQuery]);

  useEffect(() => {
    if (loading || hasRestoredScrollRef.current) return;
    restoreScrollPosition();
    hasRestoredScrollRef.current = true;
  }, [loading, restoreScrollPosition]);

  if (loading && initialLoadRef.current) {
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
          Users ({searchQuery ? "Matches" : "Total"}:{" "}
          {pageInfo.total.toLocaleString("en-IN")})
        </h2>
        <div className="relative w-full sm:max-w-xs">
          <button
            type="button"
            onClick={submitSearch}
            aria-label="Search"
            className="absolute left-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-400 hover:text-cyan-500 dark:text-gray-500 dark:hover:text-cyan-400"
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            placeholder="Search by name or email"
            aria-label="Search users by name or email"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-gray-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
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
      <div
        className={`overflow-x-auto transition-opacity ${
          loading ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
      >
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
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {searchQuery
                    ? "No users match your search."
                    : "No users found."}
                </td>
              </tr>
            ) : null}
            {users.map((user, index) => (
              <tr
                key={user._id}
                onClick={() => navigateToUser(user._id)}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {(page - 1) * pageInfo.limit + index + 1}
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

      {pageInfo.total > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            {users.length === 0 ? 0 : (page - 1) * pageInfo.limit + 1}
            {"–"}
            {(page - 1) * pageInfo.limit + users.length} of{" "}
            {pageInfo.total.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {Math.max(pageInfo.totalPages, 1)}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={!pageInfo.hasMore && page >= pageInfo.totalPages}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
