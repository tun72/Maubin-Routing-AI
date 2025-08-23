// hooks/useLocations.ts
import { useRoadStore } from "@/store/use-roads-store";
import { useMemo } from "react";

export const useLocations = () => {
  const store = useRoadStore();

  const actions = useMemo(
    () => ({
      fetch: store.fetchRoads,
      reload: store.reloadRoads,
      add: store.addRoad,
      update: store.updateRoad,
      remove: store.removeRoad,
      clearError: store.clearError,
    }),
    [
      store.fetchRoads,
      store.reloadRoads,
      store.addRoad,
      store.updateRoad,
      store.removeRoad,
      store.clearError,
    ]
  );

  const state = useMemo(
    () => ({
      locations: store.roads,
      loading: store.loading,
      error: store.error,
      lastFetched: store.lastFetched,
      isEmpty: store.roads.length === 0,
      hasData: store.roads.length > 0,
    }),
    [store.roads, store.loading, store.error, store.lastFetched]
  );

  return {
    ...state,
    ...actions,
  };
};

// For components that only need to read data
export const useLocationData = () => {
  return useRoadStore((state) => ({
    locations: state.roads,
    loading: state.loading,
    error: state.error,
    isEmpty: state.roads.length === 0,
    hasData: state.roads.length > 0,
  }));
};

// For components that only need actions
export const useLocationActions = () => {
  return useRoadStore((state) => ({
    fetch: state.fetchRoads,
    reload: state.reloadRoads,
    add: state.addRoad,
    update: state.updateRoad,
    remove: state.removeRoad,
    clearError: state.clearError,
  }));
};
