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
        zoom: 14,
        maxBounds: [
          [95.6244, 16.7215],
          [95.6644, 16.7415],
        ],
      })

      mapRef.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        // setMapError(`Map error: ${e.error?.message || "Unknown error"}`)
      })
      // const fetchNodesFromAPI = async () => {
      //     setIsLoadingNodes(true)
      //     try {
      //         const response = await getLocations()
      //         const locations: LocationNode[] = response.locations.data

      //         const convertedNodes: Node[] = locations.map((location) => ({
      //             coords: [location.lon, location.lat] as [number, number],
      //             name: `${location.english_name}\n${location.burmese_name}`,
      //             color: getColorByType(location.type),
      //             type: location.type,
      //             icon: getIconByType(location.type),
      //         }))

      //         setApiNodes(convertedNodes)
      //         console.log(`[v0] Loaded ${convertedNodes.length} nodes from API`)
      //     } catch (error) {
      //         console.error("[v0] Error fetching nodes from API:", error)
      //         setApiNodes([])
      //     } finally {
      //         setIsLoadingNodes(false)
      //     }
      // }

      mapRef.current.on("load", () => {
        setLoaded(true);
      });
      // mapRef.current.on("load", () => {
      //   console.log("Map loaded successfully")
      //   // setMapError(null)


      //   // fetchNodesFromAPI()

      //   // if (navigator.geolocation) {
      //   //     navigator.geolocation.getCurrentPosition(
      //   //         (position) => {
      //   //             const loc: [number, number] = [position.coords.longitude, position.coords.latitude]
      //   //             setUserLocation(loc)
      //   //             userLocationRef.current = loc

      //   //             const userMarkerEl = document.createElement("div")
      //   //             userMarkerEl.style.cssText = `
      //   //                 width: 20px;
      //   //                 height: 20px;
      //   //                 background: #00D4FF;
      //   //                 border: 3px solid #ffffff;
      //   //                 border-radius: 50%;
      //   //                 box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
      //   //                 animation: pulse 2s infinite;
      //   //             `

      //   //             const style = document.createElement("style")
      //   //             style.textContent = `
      //   //                 @keyframes pulse {
      //   //                     0% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.6); }
      //   //                     50% { box-shadow: 0 0 30px rgba(0, 212, 255, 0.8); }
      //   //                     100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.6); }
      //   //                 }
      //   //             `
      //   //             document.head.appendChild(style)

      //   //             new mapboxgl.Marker({ element: userMarkerEl })
      //   //                 .setLngLat(loc)
      //   //                 .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("📍 Your Location"))
      //   //                 .addTo(mapRef.current!)
      //   //                 .togglePopup()

      //   //             mapRef.current!.flyTo({
      //   //                 center: loc,
      //   //                 zoom: 14,
      //   //                 duration: 2000,
      //   //                 essential: true,
      //   //             })
      //   //         },
      //   //         (err) => console.error("Geolocation error:", err),
      //   //     )
      //   // }

      //   // setTimeout(() => {
      //   //     console.log("[v0] Auto-showing sample route")
      //   //     showSampleRoute()
      //   // }, 3000)
      // })
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