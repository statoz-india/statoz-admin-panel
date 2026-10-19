"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirectToLogin } from "@/app/api/utils/clearAuthStore";
import { useAuthHydrated } from "@/app/hooks/useAuthHydrated";
import { useAuthStore } from "@/app/store/authStore";
import { clearBrowserStorage, watchSession } from "@/app/utils/session";

/**
 * Sends the admin to login once their session is gone: signed out from another
 * device, expired, or refused by the backend.
 */
export default function SessionGuard() {
  const router = useRouter();
  const hasHydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) return;
    return watchSession(() => {
      clearBrowserStorage();
      redirectToLogin(router);
    });
  }, [hasHydrated, isAuthenticated, router]);

  return null;
}
