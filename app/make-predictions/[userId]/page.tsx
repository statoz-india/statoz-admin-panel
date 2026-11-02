"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Coins } from "lucide-react";
import { Atom } from "react-loading-indicators";
import PlayEvents from "@/app/components/makePredictions/PlayEvents";
import PlayFutures from "@/app/components/makePredictions/PlayFutures";
import PlayPredictions from "@/app/components/makePredictions/PlayPredictions";
import PlayQuizzes from "@/app/components/makePredictions/PlayQuizzes";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";
import { useAuthStore } from "@/app/store/authStore";
import { appUserRequest, updateAppUser, useAppUsers } from "@/app/utils/appUsers";
import { Section } from "@/app/utils/enums/section.enum";

const PLAY_TABS = [
  { key: "quizzes", label: "Quizzes" },
  { key: "predictions", label: "Predictions" },
  { key: "events", label: "Events" },
  { key: "futures", label: "Futures" },
] as const;

type PlayTab = (typeof PLAY_TABS)[number]["key"];

const BACK_HREF = `/?section=${Section.MAKE_PREDICTIONS}`;

/** Plays as one stored app user: their open quizzes, predictions, events and futures. */
function PlayAsUserInner() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = decodeURIComponent(params?.userId ?? "");
  const { isAuthenticated } = useAuthStore();
  const hasHydrated = useAuthHydrated();
  const users = useAppUsers();
  const user = users.find((u) => u._id === userId);
  const [tab, setTab] = useState<PlayTab>("quizzes");
  const [balanceVersion, setBalanceVersion] = useState(0);
  const [balanceError, setBalanceError] = useState("");

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) router.push("/login");
  }, [hasHydrated, isAuthenticated, router]);

  const signedIn = Boolean(user && !user.signedOut);

  // The balance the app would show, refreshed after every bet.
  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !signedIn) return;
    let cancelled = false;
    appUserRequest<{ coins?: number; userName?: string }>(userId, "GET", "user/current-user")
      .then((me) => {
        if (cancelled) return;
        setBalanceError("");
        updateAppUser(userId, {
          ...(typeof me?.coins === "number" ? { coins: me.coins } : {}),
          ...(me?.userName ? { userName: me.userName } : {}),
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) setBalanceError(error instanceof Error ? error.message : "Couldn't load the balance");
      });
    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isAuthenticated, signedIn, userId, balanceVersion]);

  const refreshBalance = useCallback(() => setBalanceVersion((v) => v + 1), []);

  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push(BACK_HREF)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Make Predictions
        </button>

        {!user ? (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-10 text-center">
            <p className="text-lg font-medium text-white">This user isn&apos;t added on this browser.</p>
            <p className="mt-1 text-sm text-gray-400">Add them from Make Predictions first.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-700 bg-zinc-900 p-5">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Playing as</p>
                <h1 className="truncate text-2xl font-bold">{user.userName || user.email}</h1>
                <p className="truncate text-sm text-zinc-400">{user.email}</p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1.5 text-xl font-semibold tabular-nums">
                  <Coins className="h-5 w-5 text-amber-400" />
                  {user.coins !== undefined ? user.coins.toLocaleString() : "—"}
                </p>
                <p className="text-xs text-zinc-500">coins</p>
                {balanceError && !user.signedOut ? (
                  <p className="mt-1 text-xs text-red-300">{balanceError}</p>
                ) : null}
              </div>
            </div>

            {user.signedOut ? (
              <div className="rounded-lg border border-red-800/60 bg-red-950/30 p-4 text-sm text-red-200">
                This user&apos;s session has ended. Go back to Make Predictions and
                use <span className="font-medium">Sign in again</span> on their card.
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-700">
                  {PLAY_TABS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                        tab === key
                          ? "border-cyan-500 text-white"
                          : "border-transparent text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {tab === "quizzes" && <PlayQuizzes userId={userId} />}
                {tab === "predictions" && <PlayPredictions userId={userId} onCoinsChanged={refreshBalance} />}
                {tab === "events" && <PlayEvents userId={userId} onCoinsChanged={refreshBalance} />}
                {tab === "futures" && <PlayFutures userId={userId} onCoinsChanged={refreshBalance} />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PlayAsUserPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      }
    >
      <PlayAsUserInner />
    </Suspense>
  );
}
