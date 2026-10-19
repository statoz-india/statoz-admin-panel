"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";
import { loginErrorMessage, normalizeEmail } from "@/app/utils/login";
import { getDeviceId } from "@/app/utils/session";
import { LoginResponse } from "../api/login/route";
import { Atom } from "react-loading-indicators";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login: setAuth } = useAuthStore();
  const hasHydrated = useAuthHydrated();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Redirect if already authenticated — only after rehydration so a refresh
  // of a deep link never lands here and then gets bounced to "/".
  useEffect(() => {
    if (!hasHydrated) return;
    if (isAuthenticated) {
      router.replace("/?section=dashboard");
    }
  }, [hasHydrated, isAuthenticated, router]);

  const requestOtp = async (address: string): Promise<boolean> => {
    setError("");
    setNotice("");
    setSendingOtp(true);

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: address }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          loginErrorMessage(response.status, data.message, "Failed to send OTP")
        );
      }

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send OTP. Please try again."
      );
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSendOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Normalized once: login must send the exact string the code went to.
    const address = normalizeEmail(email);
    setEmail(address);
    if (await requestOtp(address)) setOtpSent(true);
  };

  const handleResendOTP = async () => {
    setOtp("");
    if (await requestOtp(email)) setNotice("A new code is on its way.");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp,
          deviceId: getDeviceId(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          loginErrorMessage(response.status, errorData.message, "Login failed")
        );
      }

      const data: LoginResponse = await response.json();

      if (!data.success) {
        throw new Error(
          loginErrorMessage(response.status, data.message, "Login failed")
        );
      }

      setAuth(data.data.accessToken, data.data.user);
      router.replace("/?section=dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasHydrated || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center  font-sans bg-black">
      <div className="w-full max-w-md space-y-8 rounded-lg  p-8 shadow-lg bg-zinc-900">
        <div>
          <h2 className="text-3xl font-bold text-center text-zinc-50">
            Sign in to your account
          </h2>
        </div>
        {!otpSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            {error && (
              <div className="rounded-md  p-4 bg-red-900/20">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none  border-zinc-600 dark:bg-zinc-800 text-white focus:border-white focus:ring-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-black hover:bg-zinc-200 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-md  p-4 bg-red-900/20">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            {notice && (
              <div className="rounded-md p-4 bg-emerald-900/20">
                <p className="text-sm text-emerald-200">{notice}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none  border-zinc-600 dark:bg-zinc-800 text-white focus:border-white focus:ring-white opacity-60 cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium  text-zinc-300"
                >
                  OTP (6 digits)
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setOtp(value);
                    }
                  }}
                  className="mt-1 block w-full rounded-md border  px-3 py-2 shadow-sm  focus:outline-none  border-zinc-600 bg-zinc-800 text-white focus:border-white focus:ring-white text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-black hover:bg-zinc-200 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </div>
            <p className="text-center text-sm text-zinc-400">
              Code expired or didn&apos;t arrive?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={sendingOtp || isLoading}
                className="font-medium text-white underline underline-offset-2 hover:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingOtp ? "Sending..." : "Resend code"}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
