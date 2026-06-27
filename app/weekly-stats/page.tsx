"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import WeeklyStatsView from "@/app/components/dashboard/WeeklyStatsView";
import { Atom } from "react-loading-indicators";

function WeeklyStatsPageInner() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <WeeklyStatsView />
    </div>
  );
}

export default function WeeklyStatsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      }
    >
      <WeeklyStatsPageInner />
    </Suspense>
  );
}
