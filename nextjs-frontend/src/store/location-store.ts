import { create } from "zustand";

// Types
interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

interface LocationActions {
  setCoordinates: (lat: number, lon: number) => void;
  getCoordinates: () => { lat: number | null; lon: number | null };

  reset: () => void;
}

interface LocationComputed {
  //   coordinates: { lat: number; lon: number } | null;
  hasLocation: boolean;
}

// Combined store type
type LocationStore = LocationState & LocationActions & LocationComputed;

// Location store
const useLocationStore = create<LocationStore>((set, get) => ({
  // State
  latitude: null,
  longitude: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Actions
  setCoordinates: (lat: number, lon: number) => {
    console.log(lat, lon);

    set({
      latitude: lat,
      longitude: lon,
      error: null,
      lastUpdated: new Date().toISOString(),
    });
  },

  getCoordinates: () => {
    const state = get();
    return { lat: state.latitude, lon: state.longitude };
  },
  // Get current location

  // Reset store
  reset: () =>
    set({
      latitude: null,
      longitude: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
    }),

  // Computed getters
  //   get coordinates(): { lat: number; lon: number } | null {
  //     const state = get();
  //     // console.log(state);

  //     return state.latitude && state.longitude
  //       ? { lat: state.latitude, lon: state.longitude }
  //       : null;
  //   },

  get hasLocation(): boolean {
    const state = get();
    return state.latitude !== null && state.longitude !== null;
  },
}));

export default useLocationStore;

// Export types for use in other files
export type { LocationStore, LocationState, LocationActions, LocationComputed };
