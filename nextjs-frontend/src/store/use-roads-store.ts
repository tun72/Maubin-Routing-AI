// stores/useRoadStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRoads } from "@/lib/admin/roads";

interface RoadState {
  roads: Road[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchRoads: () => Promise<void>;
  reloadRoads: () => Promise<void>;
  addRoad: (road: Road) => void;
  updateRoad: (id: string, updates: Partial<Road>) => void;
  removeRoad: (id: string) => void;
  clearError: () => void;
  getRoadById: (id: string) => Road | null;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const useRoadStore = create<RoadState>()(
  persist(
    (set, get) => ({
      roads: [],
      loading: false,
      error: null,
      lastFetched: null,

      fetchRoads: async () => {
        const { lastFetched, loading } = get();
        const now = Date.now();

        // Avoid duplicate requests if already loading
        if (loading) return;

        // Use cache if data is fresh and we have data
        if (
          lastFetched &&
          now - lastFetched < CACHE_DURATION &&
          get().roads.length > 0
        ) {
          console.log("Using cached road data");
          return;
        }

        console.log("Fetching fresh road data");
        set({ loading: true, error: null });

        try {
          const data = await getRoads();
          set({
            roads: data?.roads?.data || [],
            loading: false,
            lastFetched: now,
          });
        } catch (error) {
          console.error("Failed to fetch roads:", error);
          set({
            error: "Failed to load roads.",
            loading: false,
          });
        }
      },

      reloadRoads: async () => {
        set({ lastFetched: null }); // Force fresh fetch
        await get().fetchRoads();
      },

      addRoad: (road) => {
        set((state) => ({
          roads: [...state.roads, road],
        }));
      },

      getRoadById: (id) => {
        const { roads } = get();

        // if (!locations.length) {
        //   return {};
        // }
        const location = roads.filter((location) => location.id === id);

        return location.length ? location[0] : null;
      },

      updateRoad: (id, updates) => {
        set((state) => ({
          roads: state.roads.map((road) =>
            road.id === id ? { ...road, ...updates } : road
          ),
        }));
      },

      removeRoad: (id) => {
        set((state) => ({
          roads: state.roads.filter((road) => road.id !== id),
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "road-store", // localStorage key
      partialize: (state) => ({
        roads: state.roads,
        lastFetched: state.lastFetched,
        // Don't persist loading/error states
      }),
      version: 1, // For migrations if needed
    }
  )
);
