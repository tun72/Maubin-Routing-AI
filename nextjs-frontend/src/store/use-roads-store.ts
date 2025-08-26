/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/useRoadStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRoads } from "@/lib/admin/roads";

interface Road {
  id: string;
  burmese_name: string;
  english_name: string;
  coordinates: number[][];
  length_m: number[];
  road_type: string;
  is_oneway?: boolean;
  geojson: string;
  // Add any other fields that might be present
  [key: string]: any;
}

interface RoadState {
  roads: Road[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  // Cache for individual roads to avoid filtering
  roadsById: Record<string, Road>;

  // Actions
  fetchRoads: () => Promise<void>;
  reloadRoads: () => Promise<void>;
  addRoad: (road: Road) => void;
  updateRoad: (id: string, updates: Partial<Road>) => void;
  removeRoad: (id: string) => void;
  clearError: () => void;
  getRoadById: (id: string) => Road | null;
  // Batch operations for better performance
  addRoads: (roads: Road[]) => void;
  updateRoads: (updates: Array<{ id: string; data: Partial<Road> }>) => void;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper function to create roads lookup
const createRoadsById = (roads: Road[]): Record<string, Road> => {
  return roads.reduce((acc, road) => {
    if (road.id) {
      acc[road.id] = road;
    }
    return acc;
  }, {} as Record<string, Road>);
};

export const useRoadStore = create<RoadState>()(
  persist(
    (set, get) => ({
      roads: [],
      loading: false,
      error: null,
      lastFetched: null,
      roadsById: {},

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
          const response = await getRoads();
          const roadsData = response?.roads?.data || [];

          // Ensure all roads have proper geojson field
          const processedRoads = roadsData.map((road: any) => ({
            ...road,
            geojson:
              road.geojson ||
              JSON.stringify({
                type: "LineString",
                coordinates: road.coordinates || [],
              }),
          }));

          set({
            roads: processedRoads,
            roadsById: createRoadsById(processedRoads),
            loading: false,
            lastFetched: now,
            error: null,
          });
        } catch (error) {
          console.error("Failed to fetch roads:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to load roads.",
            loading: false,
          });
        }
      },

      reloadRoads: async () => {
        set({ lastFetched: null }); // Force fresh fetch
        await get().fetchRoads();
      },

      addRoad: (road) => {
        set((state) => {
          const newRoads = [...state.roads, road];
          return {
            roads: newRoads,
            roadsById: road.id
              ? { ...state.roadsById, [road.id]: road }
              : state.roadsById,
          };
        });
      },

      addRoads: (roads) => {
        set((state) => {
          const newRoads = [...state.roads, ...roads];
          const newRoadsById = { ...state.roadsById };

          roads.forEach((road) => {
            if (road.id) {
              newRoadsById[road.id] = road;
            }
          });

          return {
            roads: newRoads,
            roadsById: newRoadsById,
          };
        });
      },

      getRoadById: (id) => {
        const { roadsById } = get();
        return roadsById[id] || null;
      },

      updateRoad: (id, updates) => {
        set((state) => {
          const updatedRoads = state.roads.map((road) => {
            if (road.id === id) {
              const updatedRoad = { ...road, ...updates };

              // Ensure geojson is updated if coordinates change
              if (updates.coordinates && !updates.geojson) {
                updatedRoad.geojson = JSON.stringify({
                  type: "LineString",
                  coordinates: updates.coordinates,
                });
              }

              return updatedRoad;
            }
            return road;
          });

          const updatedRoad = updatedRoads.find((road) => road.id === id);
          const newRoadsById = updatedRoad
            ? { ...state.roadsById, [id]: updatedRoad }
            : state.roadsById;

          return {
            roads: updatedRoads,
            roadsById: newRoadsById,
          };
        });
      },

      updateRoads: (updates) => {
        set((state) => {
          const updatesMap = new Map(updates.map(({ id, data }) => [id, data]));

          const updatedRoads = state.roads.map((road) => {
            const roadUpdates = updatesMap.get(road.id);
            if (roadUpdates) {
              const updatedRoad = { ...road, ...roadUpdates };

              // Ensure geojson is updated if coordinates change
              if (roadUpdates.coordinates && !roadUpdates.geojson) {
                updatedRoad.geojson = JSON.stringify({
                  type: "LineString",
                  coordinates: roadUpdates.coordinates,
                });
              }

              return updatedRoad;
            }
            return road;
          });

          return {
            roads: updatedRoads,
            roadsById: createRoadsById(updatedRoads),
          };
        });
      },

      removeRoad: (id) => {
        set((state) => {
          const filteredRoads = state.roads.filter((road) => road.id !== id);
          const { [id]: removed, ...remainingRoadsById } = state.roadsById;

          return {
            roads: filteredRoads,
            roadsById: remainingRoadsById,
          };
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "road-store", // localStorage key
      partialize: (state) => ({
        roads: state.roads,
        roadsById: state.roadsById,
        lastFetched: state.lastFetched,
        // Don't persist loading/error states
      }),
      version: 2, // Increment version for the new roadsById field
      migrate: (persistedState: any, version: number) => {
        // Migration for version 2 - add roadsById if missing
        if (version < 2) {
          return {
            ...persistedState,
            roadsById: createRoadsById(persistedState.roads || []),
          };
        }
        return persistedState;
      },
    }
  )
);
