"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { MapContext } from "@/context/map-context";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type MapComponentProps = {
  mapContainer: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
};

export default function MapProvider({
  mapContainer,
  children,
}: MapComponentProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // const mapContainer = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    if (mapRef.current) return


    if (!mapContainer.current) {
      // setMapError("Map container not found")
      console.error("Map container ref is null")
      return
    }

    try {

      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
        center: [95.6483, 16.7341],
        zoom: 9.5, // less zoomed in
        maxBounds: [
          [95.55, 16.65], // southwest corner
          [95.75, 16.80], // northeast corner
        ],
      });


      mapRef.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        // setMapError(`Map error: ${e.error?.message || "Unknown error"}`)
      })


      mapRef.current.on("load", () => {
        setLoaded(true);
      });
    } catch (error) {
      console.error("Failed to initialize map:", error)
      // setMapError(`Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapContainer])

  return (
    <div className="z-[1000]">
      <MapContext.Provider value={{ map: mapRef.current! }}>
        {children}
      </MapContext.Provider>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
          <div className="text-lg font-medium">Loading map...</div>
        </div>
      )}
    </div>
  );
}