import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  userName: string;
  email: string;
  userType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  coins: number;
  xp: number;
  authProvider?: string;
  userStatus?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  /**
   * False until zustand-persist has rehydrated from localStorage.
   * Auth redirects must wait on this — otherwise a refresh briefly looks
   * logged-out and bounces through /login → /.
   */
  hasHydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      hasHydrated: false,
      login: (token: string, user: User) => {
        set({
          isAuthenticated: true,
          token,
          user,
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
        });
      },
      setHasHydrated: (value: boolean) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
