"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { UserDataForAdmin } from "@/app/api/users/[id]/userDataForAdmin/route";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [userData, setUserData] = useState<UserDataForAdmin>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [converting, setConverting] = useState(false);

  const userId = params?.id as string;

  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/users/${userId}/userDataForAdmin`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();

      if (!res.ok) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to load user data";
        setError(message);

        return;
      }

      if (!response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to load user data",
        );

        return;
      }

      const data = response.data;
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId, fetchUserData]);

  const isWaitlist = userData?.userType?.toLowerCase() === "waitlist";

  const handleConvertToUser = async () => {
    if (!userData?.email || converting) return;
    try {
      setConverting(true);
      setError("");
      const res = await fetch("/api/users/updateWaitlistToUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ emailId: userData.email }),
      });
      const response = await res.json();

      if (!res.ok) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to convert to user";
        setError(message);
        return;
      }

      if (!response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to convert to user",
        );
        return;
      }

      await fetchUserData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to convert to user",
      );
    } finally {
      setConverting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-gray-400">Loading user data...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "User not found"}</p>
          <button
            onClick={() => router.push("/?section=users")}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      try {
        return new Date(value).toLocaleString();
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const xp =
    userData?.xp &&
    typeof userData.xp === "object" &&
    !Array.isArray(userData.xp)
      ? (userData.xp as Record<string, number>)
      : null;
  const xpEntries = xp ? Object.entries(xp) : [];

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => router.push("/?section=users")}
            className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
          >
            ← Back to Users
          </button>
          {isWaitlist && (
            <button
              onClick={handleConvertToUser}
              disabled={converting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {converting ? "Converting…" : "Convert to User"}
            </button>
          )}
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {userData.userName}
          </h1>
          <p className="text-gray-400 text-sm mb-2">
            Email id - {userData.email || ""}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Mongodb ID - {userData._id || ""}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                User type
              </p>
              <p className="text-white font-medium capitalize">
                {String(userData.userType ?? "—")}
              </p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Coins
              </p>
              <p className="text-white font-medium">
                {formatValue(userData.coins)}
              </p>
            </div>
            {xpEntries.length > 0 && (
              <>
                {xpEntries.map(([key, value]) => (
                  <div key={key} className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      {key === "totalXP" ? "Total XP" : key}
                    </p>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
