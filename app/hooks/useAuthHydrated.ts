"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";

/**
 * Wait for auth-storage rehydration before trusting `isAuthenticated`.
 * Without this, a page refresh looks logged-out for one tick and redirects
 * to /login, which then sends the user to /.
 */
export function useAuthHydrated(): boolean {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);

  useEffect(() => {
    // Cover the case where rehydration finished before this mount subscribed.
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    return useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, [setHasHydrated]);

  return hasHydrated;
}
