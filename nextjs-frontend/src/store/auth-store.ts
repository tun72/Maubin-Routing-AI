"use client";

import { User } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  hasEmailConfig: boolean;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHasEmailConfig: (hasConfig: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      hasEmailConfig: false,
      hydrated: false,

      // Updated to accept token separately
      setAuth: (token: string, user: User) => {
        if (token && user) {
          set({
            user,
            isAuthenticated: true,
            token,
            hasEmailConfig: false, // backend doesn’t provide, default false
          });
        }
      },

      setHasEmailConfig: (hasConfig: boolean) =>
        set({ hasEmailConfig: hasConfig }),

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          hasEmailConfig: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);

// Helper to check hydration
export const useIsHydrated = () => useAuthStore((state) => state.hydrated);
