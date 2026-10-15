"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";
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

  const handleSendOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSendingOtp(true);

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send OTP. Please try again."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
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
          </form>
        )}
      </div>
    </div>
  );
}
