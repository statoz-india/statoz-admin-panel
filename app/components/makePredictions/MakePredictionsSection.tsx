"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Target, Trash2, UserPlus } from "lucide-react";
import type { AppUserSession } from "@/app/interface/app-user.interface";
import { removeAppUser, useAppUsers } from "@/app/utils/appUsers";
import AddAppUserDialog from "./AddAppUserDialog";

/**
 * App users the admin has signed in as on this browser. Opening one lists
 * the open quizzes, predictions, events and futures to play as them.
 */
export default function MakePredictionsSection() {
  const router = useRouter();
  const users = useAppUsers();
  /** The dialog is open; `email` pre-fills it when signing a user in again. */
  const [adding, setAdding] = useState<{ email: string } | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const openUser = (user: AppUserSession) =>
    router.push(`/make-predictions/${encodeURIComponent(user._id)}`);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Target className="h-6 w-6 text-cyan-400" />
            Make Predictions
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-400">
            Sign in as app users and play as them: answer quizzes and bet on
            predictions, events and futures that are open. Users stay listed on
            this browser until you remove them or log out of the panel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding({ email: "" })}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
        >
          <UserPlus className="h-4 w-4" />
          Add user
        </button>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-10 text-center">
          <p className="text-lg font-medium text-white">No users added yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Add a user with their email and the code sent to it.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <li key={user._id}>
              <article
                role="button"
                tabIndex={0}
                onClick={() => openUser(user)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openUser(user);
                  }
                }}
                className="flex h-full cursor-pointer flex-col rounded-lg border border-zinc-700 bg-zinc-800/90 p-4 transition-colors hover:bg-indigo-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold uppercase text-white">
                    {(user.userName || user.email).charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white">
                      {user.userName || user.email}
                    </h3>
                    <p className="truncate text-xs text-zinc-400">{user.email}</p>
                  </div>
                  {user.signedOut && (
                    <span className="shrink-0 rounded-md bg-red-900 px-2 py-0.5 text-xs font-medium text-red-200">
                      Signed out
                    </span>
                  )}
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-sm text-gray-300">
                  <Coins className="h-4 w-4 text-amber-400" />
                  {user.coins !== undefined ? user.coins.toLocaleString() : "—"} coins
                </p>

                <div
                  className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-700/80 pt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.signedOut && (
                    <button
                      type="button"
                      onClick={() => setAdding({ email: user.email })}
                      className="rounded-md border border-zinc-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
                    >
                      Sign in again
                    </button>
                  )}
                  {confirmRemove === user._id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(null)}
                        className="rounded-md border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeAppUser(user._id);
                          setConfirmRemove(null);
                        }}
                        className="rounded-md bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmRemove(user._id)}
                      aria-label={`Remove ${user.userName || user.email}`}
                      className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <AddAppUserDialog
          initialEmail={adding.email}
          onClose={() => setAdding(null)}
          onAdded={() => setAdding(null)}
        />
      )}
    </div>
  );
}
