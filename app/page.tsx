"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import Sidebar from "@/app/components/Sidebar";
import UsersSection from "@/app/components/users/UsersSection";
import QuizzesSection from "@/app/components/quiz/QuizzesSection";
import PredictionsSection from "@/app/components/predictions/PredictionsSection";
import LeaderboardSection from "@/app/components/leaderboard/LeaderboardSection";
import NotificationSection from "@/app/components/notifications/NotificationSection";
import TeamsSection from "@/app/components/teams/TeamsSection";
import MatchesSection from "./components/matches/MatchesSection";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section, isValidSection } from "@/app/utils/enums/section.enum";
import { Atom } from "react-loading-indicators";
import FuturesSection from "./components/futures/FuturesSection";
import EventsSection from "./components/events/EventsSection";
import TournamentSection from "./components/tournaments/TournamentSection";
import DashboardSection from "./components/dashboard/DashboardSection";
import BotUsersSection from "./components/botUsers/BotUsersSection";
import ShopSection from "./components/shop/ShopSection";
import UserCardsSection from "./components/userCards/UserCardsSection";
import GamesSection from "./components/games/GamesSection";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, logout } = useAuthStore();
  const sectionFromUrl = searchParams.get("section");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection =
    sectionFromUrl && isValidSection(sectionFromUrl)
      ? sectionFromUrl
      : Section.DASHBOARD;

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
    if (s === Section.PLAYER_CARDS || s === Section.USER_ASSETS) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", Section.SHOP);
      sp.set(
        "shopTab",
        s === Section.PLAYER_CARDS ? "player" : "profilePics",
      );
      stripAdminHomeQueryNoise(Section.SHOP, sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
      return;
    }
    if (!s || !isValidSection(s)) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", Section.DASHBOARD);
      stripAdminHomeQueryNoise(Section.DASHBOARD, sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const handleSectionChange = (section: string) => {
    if (!isValidSection(section)) return;
    if (section === activeSection) {
      setIsMobileMenuOpen(false);
      return;
    }
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("section", section);
    stripAdminHomeQueryNoise(section, sp);
    router.push(`/?${sp.toString()}`, { scroll: false });
    setIsMobileMenuOpen(false);
  };

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case Section.DASHBOARD:
        return <DashboardSection onNavigate={handleSectionChange} />;
      case Section.USERS:
        return <UsersSection />;
      case Section.TOURNAMENTS:
        return <TournamentSection />;
      case Section.TEAMS:
        return <TeamsSection />;
      case Section.MATCHES:
        return <MatchesSection />;
      case Section.QUIZZES:
        return <QuizzesSection />;
      case Section.PREDICTIONS:
        return <PredictionsSection />;
      case Section.EVENTS:
        return <EventsSection />;
      case Section.FUTURES:
        return <FuturesSection />;
      case Section.LEADERBOARD:
        return <LeaderboardSection />;
      case Section.NOTIFICATION:
        return <NotificationSection />;
      case Section.BOT_USERS:
        return <BotUsersSection />;
      case Section.SHOP:
        return <ShopSection />;
      case Section.USER_CARDS:
        return <UserCardsSection />;
      case Section.GAMES:
        return <GamesSection />;
      default:
        return <DashboardSection onNavigate={handleSectionChange} />;
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

      <div
        id="app-main-scroll-container"
        className="relative flex-1 overflow-y-auto"
      >
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
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
