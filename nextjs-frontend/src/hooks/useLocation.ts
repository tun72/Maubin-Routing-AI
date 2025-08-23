// hooks/useLocations.ts

import { useLocationStore } from "@/store/use-location-store";
import { useMemo } from "react";

export const useLocations = () => {
  const store = useLocationStore();

  const actions = useMemo(
    () => ({
      fetch: store.fetchLocations,
      reload: store.reloadLocations,
      add: store.addLocation,
      update: store.updateLocation,
      remove: store.removeLocation,
      clearError: store.clearError,
    }),
    [
      store.fetchLocations,
      store.reloadLocations,
      store.addLocation,
      store.updateLocation,
      store.removeLocation,
      store.clearError,
    ]
  );

  const state = useMemo(
    () => ({
      locations: store.locations,
      loading: store.loading,
      error: store.error,
      lastFetched: store.lastFetched,
      isEmpty: store.locations.length === 0,
      hasData: store.locations.length > 0,
    }),
    [store.locations, store.loading, store.error, store.lastFetched]
  );

  return {
    ...state,
    ...actions,
  };
};

// For components that only need to read data
export const useLocationData = () => {
  return useLocationStore((state) => ({
    locations: state.locations,
    loading: state.loading,
    error: state.error,
    isEmpty: state.locations.length === 0,
    hasData: state.locations.length > 0,
  }));
};

// For components that only need actions
export const useLocationActions = () => {
  return useLocationStore((state) => ({
    fetch: state.fetchLocations,
    reload: state.reloadLocations,
    add: state.addLocation,
    update: state.updateLocation,
    remove: state.removeLocation,
    clearError: state.clearError,
  }));
};
