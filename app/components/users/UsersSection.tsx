"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/app/store/authStore";

const USERS_SCROLL_POSITION_KEY = "admin_users_scroll_top";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";

export default function UsersSection() {
  const router = useRouter();
  const hasRestoredScrollRef = useRef(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
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
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
        Users
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User Type
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
            {users.map((user) => (
              <tr
                key={user._id}
                onClick={() => navigateToUser(user._id)}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.userType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.coins}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
