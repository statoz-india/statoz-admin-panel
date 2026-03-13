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
  const [activeSection, setActiveSection] = useState(() =>
    sectionFromUrl && VALID_SECTIONS.includes(sectionFromUrl)
      ? sectionFromUrl
      : "users",
  );

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
    <div className="flex h-screen  font-sans bg-black">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
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
