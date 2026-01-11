"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import Sidebar from "@/app/components/Sidebar";
import UsersSection from "@/app/components/UsersSection";
import QuizzesSection from "@/app/components/QuizzesSection";
import PredictionsSection from "@/app/components/PredictionsSection";
import LeaderboardSection from "@/app/components/LeaderboardSection";
import TeamsSection from "@/app/components/TeamsSection";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeSection, setActiveSection] = useState("users");

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
      case "quizzes":
        return <QuizzesSection />;
      case "predictions":
        return <PredictionsSection />;
      case "leaderboard":
        return <LeaderboardSection />;
      case "teams":
        return <TeamsSection />;
      default:
        return <UsersSection />;
    }
  };

  return (
    <div className="flex h-screen  font-sans bg-black">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
