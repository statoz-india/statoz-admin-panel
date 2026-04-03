"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import Sidebar from "@/app/components/Sidebar";
import UsersSection from "@/app/components/users/UsersSection";
import QuizzesSection from "@/app/components/quiz/QuizzesSection";
import PredictionsSection from "@/app/components/predictions/PredictionsSection";
import LeaderboardSection from "@/app/components/leaderboard/LeaderboardSection";
import TeamsSection from "@/app/components/teams/TeamsSection";
import MatchesSection from "./components/matches/MatchesSection";

const VALID_SECTIONS = [
  "users",
  "matches",
  "quizzes",
  "predictions",
  "leaderboard",
  "teams",
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, logout } = useAuthStore();
  const sectionFromUrl = searchParams.get("section");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection =
    sectionFromUrl && VALID_SECTIONS.includes(sectionFromUrl)
      ? sectionFromUrl
      : "users";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      logout();
      router.push("/login");
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const s = searchParams.get("section");
    if (!s || !VALID_SECTIONS.includes(s)) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "users");
      router.replace(`/?${sp.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const handleSectionChange = (section: string) => {
    if (VALID_SECTIONS.includes(section)) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", section);
      router.push(`/?${sp.toString()}`, { scroll: false });
      setIsMobileMenuOpen(false);
    }
  };

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UsersSection />;
      case "teams":
        return <TeamsSection />;
      case "matches":
        return <MatchesSection />;
      case "quizzes":
        return <QuizzesSection />;
      case "predictions":
        return <PredictionsSection />;
      case "leaderboard":
        return <LeaderboardSection />;
      default:
        return <UsersSection />;
    }
  };

  return (
    <div className="flex h-screen font-sans bg-black">
      <div className="hidden md:block">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>

      <div id="app-main-scroll-container" className="relative flex-1 overflow-y-auto">
        <button
          type="button"
          className={`fixed top-4 z-60 md:hidden rounded-md border border-zinc-700 bg-zinc-900 p-2 text-white ${
            isMobileMenuOpen ? "ml-50" : "left-4"
          }`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-y-0 left-0 z-50 md:hidden">
              <Sidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </div>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/60 md:hidden right-0"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close mobile menu overlay"
            />
          </>
        )}

        <div className="pt-16 md:pt-0">{renderContent()}</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center font-sans bg-black text-white">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
