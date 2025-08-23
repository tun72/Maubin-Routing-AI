// stores/useLocationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLocations } from "@/lib/admin/locations";

interface LocationState {
  locations: Location[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchLocations: () => Promise<void>;
  reloadLocations: () => Promise<void>;
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  removeLocation: (id: string) => void;
  clearError: () => void;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes - longer cache since we're persisting

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [],
      loading: false,
      error: null,
      lastFetched: null,

      fetchLocations: async () => {
        const { lastFetched, loading } = get();
        const now = Date.now();

        // Avoid duplicate requests if already loading
        if (loading) return;

        // Use cache if data is fresh and we have data
        if (
          lastFetched &&
          now - lastFetched < CACHE_DURATION &&
          get().locations.length > 0
        ) {
          console.log("Using cached location data");
          return;
        }

        console.log("Fetching fresh location data");
        set({ loading: true, error: null });

        try {
          const data = await getLocations();
          set({
            locations: data?.locations?.data || [],
            loading: false,
            lastFetched: now,
          });
        } catch (error) {
          console.error("Failed to fetch locations:", error);
          set({
            error: "Failed to load locations.",
            loading: false,
          });
        }
      },

      reloadLocations: async () => {
        set({ lastFetched: null }); // Force fresh fetch
        await get().fetchLocations();
      },

      addLocation: (location) => {
        set((state) => ({
          locations: [...state.locations, location],
        }));
      },

      updateLocation: (id, updates) => {
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...updates } : loc
          ),
        }));
      },

      removeLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id),
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "location-store", // localStorage key
      partialize: (state) => ({
        locations: state.locations,
        lastFetched: state.lastFetched,
        // Don't persist loading/error states
      }),
      version: 1, // For migrations if needed
    }
  )
);
