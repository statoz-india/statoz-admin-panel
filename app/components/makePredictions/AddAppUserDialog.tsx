"use client";

import { useState, type FormEvent } from "react";
import type { AppUserSession } from "@/app/interface/app-user.interface";
import { sendAppUserCode, signInAppUser } from "@/app/utils/appUsers";
import { loginErrorMessage } from "@/app/utils/login";
import { getDeviceId } from "@/app/utils/session";

const INPUT_CLASS =
  "w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none disabled:opacity-50";

const messageOf = (error: unknown, fallback: string) => {
  const status = (error as { status?: number })?.status ?? 0;
  return loginErrorMessage(
    status,
    error instanceof Error ? error.message : "",
    fallback,
  );
};

/**
 * Signs an app user in the way the app does: email, then the code emailed to
 * them. The user is then stored in this browser.
 */
export default function AddAppUserDialog({
  initialEmail = "",
  onClose,
  onAdded,
}: {
  /** Pre-filled when signing a signed-out user in again. */
  initialEmail?: string;
  onClose: () => void;
  onAdded: (user: AppUserSession) => void;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const sendCode = async () => {
    if (!email.trim()) {
      setError("Enter the user's email.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await sendAppUserCode(email);
      setStep("otp");
      setNotice(`A code was sent to ${email.trim()}.`);
    } catch (err) {
      setError(messageOf(err, "Couldn't send the code."));
    } finally {
      setBusy(false);
    }
  };

  const signIn = async () => {
    if (!otp.trim()) {
      setError("Enter the code.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const user = await signInAppUser(email, otp, getDeviceId());
      onAdded(user);
    } catch (err) {
      setError(messageOf(err, "Couldn't sign in."));
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void (step === "email" ? sendCode() : signIn());
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-app-user-title"
        className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-zinc-800 p-6">
          <h2 id="add-app-user-title" className="text-xl font-bold text-white">
            Add user
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Sign in as an existing app user with the code sent to their email.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          {error ? (
            <div className="rounded-lg bg-red-950/40 p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          ) : notice && step === "otp" ? (
            <p className="text-sm text-emerald-300">{notice}</p>
          ) : null}

          <div>
            <label htmlFor="app-user-email" className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="app-user-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy || step === "otp"}
              placeholder="player@example.com"
              className={INPUT_CLASS}
              autoFocus={step === "email"}
            />
          </div>

          {step === "otp" && (
            <div>
              <label htmlFor="app-user-otp" className="mb-2 block text-sm font-medium text-gray-300">
                Code
              </label>
              <input
                id="app-user-otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={busy}
                placeholder="6-digit code"
                className={INPUT_CLASS}
                autoFocus
              />
              <div className="mt-2 flex gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => void sendCode()}
                  disabled={busy}
                  className="text-sky-400 hover:underline disabled:opacity-50"
                >
                  Send a new code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  }}
                  disabled={busy}
                  className="text-zinc-400 hover:underline disabled:opacity-50"
                >
                  Use a different email
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
            >
              {step === "email"
                ? busy
                  ? "Sending…"
                  : "Send code"
                : busy
                  ? "Signing in…"
                  : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
