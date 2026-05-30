import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  userName?: string;
  email: string;
  userType: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  coins?: number;
  xp?: number | { totalXP: number; [k: string]: number };
  authProvider?: string;
  userStatus?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
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
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
);
