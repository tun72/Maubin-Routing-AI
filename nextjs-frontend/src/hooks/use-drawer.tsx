// hooks/useRouteDrawer.ts
import { useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";


// interface UseRouteDrawerProps {
//   map: mapboxgl.Map | null;
//   onRouteStart?: () => void;
//   onRouteComplete?: () => void;
// }

export const useRouteDrawer = ({
  map,
  onRouteStart,
  onRouteComplete,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
  const routeAnimationRef = useRef<number | null>(null);
  const stepMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const animateRoute = useCallback(
    (routeCoordinates: number[][]) => {
      let step = 0;
      const numSteps = 100;

      const animate = () => {
        if (!map) return;

        const progress = step / numSteps;
        const segmentIndex = Math.floor(
          progress * (routeCoordinates.length - 1)
        );
        const segmentProgress =
          progress * (routeCoordinates.length - 1) - segmentIndex;

        let animatedCoordinates: number[][];

        if (segmentIndex >= routeCoordinates.length - 1) {
          animatedCoordinates = routeCoordinates;
        } else {
          animatedCoordinates = routeCoordinates.slice(0, segmentIndex + 1);

          if (segmentIndex < routeCoordinates.length - 1) {
            const current = routeCoordinates[segmentIndex];
            const next = routeCoordinates[segmentIndex + 1];
            const interpolated = [
              current[0] + (next[0] - current[0]) * segmentProgress,
              current[1] + (next[1] - current[1]) * segmentProgress,
            ];
            animatedCoordinates.push(interpolated);
          }
        }

        const source = map.getSource("route") as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: animatedCoordinates,
                },
                properties: {},
              },
            ],
          });
        }

        step++;

        if (step <= numSteps) {
          routeAnimationRef.current = requestAnimationFrame(animate);
        } else {
          onRouteComplete?.();
        }
      };

      animate();
    },
    [map, onRouteComplete]
  );

  const addStepMarkers = useCallback(
    (stepLocations: StepLocation[]) => {
      if (!map) return;

      // Remove existing markers
      stepMarkersRef.current.forEach((marker) => marker.remove());
      stepMarkersRef.current = [];

      stepLocations.forEach((step, index) => {
        const isStart = index === 0;
        const isEnd = index === stepLocations.length - 1;

        const markerEl = document.createElement("div");
        markerEl.style.cssText = `
                width: 30px;
                height: 30px;
                background: ${isStart ? "#00FF00" : isEnd ? "#FF0000" : "#FFA500"
          };
                border: 3px solid #ffffff;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            `;
        markerEl.innerHTML = isStart
          ? "🚩"
          : isEnd
            ? "🏁"
            : (index + 1).toString();

        const marker = new mapboxgl.Marker({ element: markerEl })
          .setLngLat([step.longitude, step.latitude])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              className: "step-popup",
            }).setHTML(`
                    <div style="text-align: center; padding: 8px; min-width: 200px;">
                        <div style="font-size: 16px; margin-bottom: 5px;">${isStart
                ? "🚩 START"
                : isEnd
                  ? "🏁 END"
                  : `📍 STEP ${index + 1}`
              }</div>
                        <div style="font-weight: bold; color: #333; margin-bottom: 3px; font-size: 14px;">${step.english_name
              }</div>
                        <div style="color: #666; font-size: 12px; font-family: 'Myanmar Text', serif; margin-bottom: 3px;">${step.burmese_name
              }</div>
                        <div style="color: #888; font-size: 11px;">${step.address
              }</div>
                    </div>
                `)
          )
          .addTo(map);

        stepMarkersRef.current.push(marker);
      });
    },
    [map]
  );

  const drawRoute = useCallback(
    (routeData: RouteData) => {
      if (!map || !routeData.is_success) {
        console.error("Route data is not valid or map is not available!");
        return;
      }

      onRouteStart?.();

      if (routeAnimationRef.current) {
        cancelAnimationFrame(routeAnimationRef.current);
      }

      const routeCoordinates = routeData.route.geometry.coordinates;

      // Remove existing route layers and sources
      if (map.getLayer("route-glow")) {
        map.removeLayer("route-glow");
      }
      if (map.getLayer("route")) {
        map.removeLayer("route");
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }

      // Add route source
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      });

      // Add route glow layer
      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#00D4FF",
          "line-width": 8,
          "line-opacity": 0.4,
          "line-blur": 2,
        },
      });

      // Add route layer
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#00D4FF",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      // Add step markers
      addStepMarkers(routeData.step_locations);

      // Start route animation
      animateRoute(routeCoordinates);

      // Fit map to route bounds
      const coordinates = routeCoordinates;
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord as [number, number]));
      map.fitBounds(bounds, { padding: 50 });
    },
    [map, onRouteStart, addStepMarkers, animateRoute]
  );

  const clearRoute = useCallback(() => {
    if (routeAnimationRef.current) {
      cancelAnimationFrame(routeAnimationRef.current);
    }

    // Remove step markers
    stepMarkersRef.current.forEach((marker) => marker.remove());
    stepMarkersRef.current = [];

    if (map) {
      // Remove route layers and sources
      if (map.getLayer("route-glow")) {
        map.removeLayer("route-glow");
      }
      if (map.getLayer("route")) {
        map.removeLayer("route");
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }
    }
  }, [map]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (routeAnimationRef.current) {
      cancelAnimationFrame(routeAnimationRef.current);
    }
    stepMarkersRef.current.forEach((marker) => marker.remove());
  }, []);

  return {
    drawRoute,
    clearRoute,
    cleanup,
  };
};
