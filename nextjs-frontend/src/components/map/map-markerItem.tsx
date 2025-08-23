"use client";
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useMap } from "@/context/map-context";

interface MarkerProps {
    location: Location;
}

export default function MarkerItem({ location }: MarkerProps) {
    const { map } = useMap();

    useEffect(() => {
        if (!map) return; // ✅ don’t run until map is ready

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <h3>${location.english_name}</h3>
      <p><strong>Burmese:</strong> ${location.burmese_name}</p>
      <p><strong>Address:</strong> ${location.address}</p>
      ${location.description ? `<p>${location.description}</p>` : ""}
    `);

        const marker = new mapboxgl.Marker({
            color: location.type === "landmark" ? "red" : "blue",
        })
            .setLngLat([location.lon, location.lat])
            .setPopup(popup)
            .addTo(map);

        return () => {
            marker.remove();
        };
    }, [map, location]);

    return null;
}
