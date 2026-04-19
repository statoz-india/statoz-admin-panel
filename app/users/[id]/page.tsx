"use client";

import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { UserDataForAdmin } from "@/app/api/users/[id]/userDataForAdmin/route";
import PlayedPrediction from "@/app/users/[id]/PlayedPrediction";
import PlayedQuizzes from "@/app/users/[id]/PlayedQuizzes";
import { Atom } from "react-loading-indicators";

function homeHrefFromUserEntry(searchParams: URLSearchParams): {
  href: string;
  backLabel: string;
} {
  const fromSection = searchParams.get("fromSection");
  if (fromSection === "leaderboard") {
    const sp = new URLSearchParams();
    sp.set("section", "leaderboard");
    const tab = searchParams.get("leaderboardTab");
    if (tab === "coins" || tab === "tournament") {
      sp.set("leaderboardTab", tab);
    }
    return { href: `/?${sp.toString()}`, backLabel: "← Back to Leaderboard" };
  }
  return { href: "/?section=users", backLabel: "← Back to Users" };
}

function UserDetailPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { href: homeBackHref, backLabel: homeBackLabel } =
    homeHrefFromUserEntry(searchParams);
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [userData, setUserData] = useState<UserDataForAdmin>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [converting, setConverting] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [notificationSuccess, setNotificationSuccess] = useState("");
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    body: "",
    type: "SYSTEM_ANNOUNCEMENT",
    screen: "home",
    entityId: "test-123",
  });
  const [playedActivityTab, setPlayedActivityTab] = useState<
    "quizzes" | "predictions" | null
  >(null);
  const [isGiftCoinDialogOpen, setIsGiftCoinDialogOpen] = useState(false);
  const [giftingCoins, setGiftingCoins] = useState(false);
  const [giftCoinError, setGiftCoinError] = useState("");
  const [giftCoinSuccess, setGiftCoinSuccess] = useState("");
  const [giftCoinAmount, setGiftCoinAmount] = useState("");

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

  const openNotificationDialog = () => {
    setNotificationError("");
    setNotificationSuccess("");
    setNotificationForm({
      title: "",
      body: "",
      type: "SYSTEM_ANNOUNCEMENT",
      screen: "home",
      entityId: "test-123",
    });
    setIsNotificationDialogOpen(true);
  };

  const closeNotificationDialog = () => {
    if (sendingNotification) return;
    setIsNotificationDialogOpen(false);
  };

  const handleSendNotification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userData?._id || sendingNotification) return;

    const title = notificationForm.title.trim();
    const body = notificationForm.body.trim();

    if (!title || !body) {
      setNotificationError("Title and body are required");
      return;
    }

    try {
      setSendingNotification(true);
      setNotificationError("");
      setNotificationSuccess("");

      const res = await fetch("/api/notifications/send-to-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: userData._id,
          title,
          body,
          type: notificationForm.type,
          data: {
            screen: notificationForm.screen,
            entityId: notificationForm.entityId,
          },
        }),
      });

      const response = await res.json();

      if (!res.ok || !response?.success) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to send notification";
        setNotificationError(message);
        return;
      }

      setNotificationSuccess(
        (typeof response?.message === "string" && response.message) ||
          "Notification sent successfully",
      );
      setNotificationForm((prev) => ({ ...prev, title: "", body: "" }));
    } catch (err) {
      setNotificationError(
        err instanceof Error ? err.message : "Failed to send notification",
      );
    } finally {
      setSendingNotification(false);
    }
  };

  const openGiftCoinDialog = () => {
    setGiftCoinError("");
    setGiftCoinSuccess("");
    setGiftCoinAmount("");
    setIsGiftCoinDialogOpen(true);
  };

  const closeGiftCoinDialog = () => {
    if (giftingCoins) return;
    setIsGiftCoinDialogOpen(false);
  };

  const handleGiftCoins = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userData?._id || giftingCoins) return;

    const parsed = Number.parseInt(giftCoinAmount.trim(), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setGiftCoinError("Enter a positive whole number of coins");
      return;
    }

    try {
      setGiftingCoins(true);
      setGiftCoinError("");
      setGiftCoinSuccess("");

      const res = await fetch(`/api/users/${userData._id}/gift-coins`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ giftedcoins: parsed }),
      });

      const response = await res.json();

      if (!res.ok || !response?.success) {
        const message =
          (typeof response?.message === "string" && response.message) ||
          (typeof response?.error === "string" && response.error) ||
          "Failed to gift coins";
        setGiftCoinError(message);
        return;
      }

      setGiftCoinSuccess(
        (typeof response?.message === "string" && response.message) ||
          "Coins gifted successfully",
      );
      setGiftCoinAmount("");
      await fetchUserData();
    } catch (err) {
      setGiftCoinError(
        err instanceof Error ? err.message : "Failed to gift coins",
      );
    } finally {
      setGiftingCoins(false);
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

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "User not found"}</p>
          <button
            type="button"
            onClick={() => router.push(homeBackHref, { scroll: false })}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200"
          >
            {homeBackLabel}
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
            type="button"
            onClick={() => router.push(homeBackHref, { scroll: false })}
            className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
          >
            {homeBackLabel}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={openNotificationDialog}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send Notification
            </button>
            <button
              type="button"
              onClick={openGiftCoinDialog}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Gift Coin
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

        <div className="mt-8 space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Activity</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPlayedActivityTab("quizzes")}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                  playedActivityTab === "quizzes"
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900 text-white border-zinc-600 hover:bg-zinc-800"
                }`}
              >
                Played quizzes
              </button>
              <button
                type="button"
                onClick={() => setPlayedActivityTab("predictions")}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                  playedActivityTab === "predictions"
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900 text-white border-zinc-600 hover:bg-zinc-800"
                }`}
              >
                Played predictions
              </button>
            </div>
          </div>
          {playedActivityTab === null && (
            <p className="text-sm text-gray-500">
              Choose quizzes or predictions to load that data.
            </p>
          )}
          {playedActivityTab === "quizzes" && <PlayedQuizzes userId={userId} />}
          {playedActivityTab === "predictions" && (
            <PlayedPrediction userId={userId} />
          )}
        </div>
      </div>
      {isGiftCoinDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-md w-full border border-zinc-700">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">Gift Coin</h2>
              <p className="text-sm text-gray-400 mt-1">
                User ID: {userData._id}
              </p>
            </div>

            <form onSubmit={handleGiftCoins} className="p-6 space-y-4">
              {giftCoinError && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded-md text-red-300 text-sm">
                  {giftCoinError}
                </div>
              )}
              {giftCoinSuccess && (
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-md text-green-300 text-sm">
                  {giftCoinSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Coins to gift
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={giftCoinAmount}
                  onChange={(event) => setGiftCoinAmount(event.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 rounded-md border border-zinc-600 bg-zinc-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeGiftCoinDialog}
                  className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={giftingCoins}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={giftingCoins}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {giftingCoins ? "Gifting…" : "Gift"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isNotificationDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-xl w-full border border-zinc-700">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">
                Send Notification
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                User ID: {userData._id}
              </p>
            </div>

            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              {notificationError && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded-md text-red-300 text-sm">
                  {notificationError}
                </div>
              )}
              {notificationSuccess && (
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-md text-green-300 text-sm">
                  {notificationSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(event) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Test Notification"
                  className="w-full px-3 py-2 rounded-md border border-zinc-600 bg-zinc-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Body *
                </label>
                <textarea
                  value={notificationForm.body}
                  onChange={(event) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      body: event.target.value,
                    }))
                  }
                  placeholder="This is a direct test notification"
                  className="w-full px-3 py-2 rounded-md border border-zinc-600 bg-zinc-800 text-white min-h-[100px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeNotificationDialog}
                  className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={sendingNotification}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingNotification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingNotification ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen bg-black">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      }
    >
      <UserDetailPageInner />
    </Suspense>
  );
}
