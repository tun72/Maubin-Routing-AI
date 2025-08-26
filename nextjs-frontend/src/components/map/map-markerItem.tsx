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
        if (!map) return;

        // Get marker color and icon based on type
        const getMarkerStyles = (type: string) => {
            switch (type) {
                case 'bank':
                    return { bgColor: 'bg-emerald-500', textColor: 'text-white', icon: '🏦' };
                case 'gas_station':
                    return { bgColor: 'bg-red-500', textColor: 'text-white', icon: '⛽' };
                case 'hospital':
                    return { bgColor: 'bg-red-500', textColor: 'text-white', icon: '🏥' };
                case 'hotel':
                    return { bgColor: 'bg-purple-500', textColor: 'text-white', icon: '🏨' };
                case 'intersection':
                    return { bgColor: 'bg-orange-500', textColor: 'text-white', icon: '🚦' };
                case 'landmark':
                    return { bgColor: 'bg-cyan-500', textColor: 'text-white', icon: '🏛️' };
                case 'library':
                    return { bgColor: 'bg-amber-700', textColor: 'text-white', icon: '📚' };
                case 'museum':
                    return { bgColor: 'bg-purple-600', textColor: 'text-white', icon: '🏛️' };
                case 'office':
                    return { bgColor: 'bg-gray-500', textColor: 'text-white', icon: '🏢' };
                case 'pagoda':
                    return { bgColor: 'bg-yellow-500', textColor: 'text-white', icon: '🛕' };
                case 'park':
                    return { bgColor: 'bg-green-500', textColor: 'text-white', icon: '🌳' };
                case 'pharmacy':
                    return { bgColor: 'bg-red-500', textColor: 'text-white', icon: '💊' };
                case 'restaurant':
                    return { bgColor: 'bg-orange-500', textColor: 'text-white', icon: '🍽️' };
                case 'school':
                    return { bgColor: 'bg-blue-500', textColor: 'text-white', icon: '🏫' };
                case 'store':
                    return { bgColor: 'bg-purple-500', textColor: 'text-white', icon: '🛍️' };
                case 'university':
                    return { bgColor: 'bg-blue-600', textColor: 'text-white', icon: '🎓' };
                case 'other':
                    return { bgColor: 'bg-gray-400', textColor: 'text-white', icon: '📍' };
                default:
                    return { bgColor: 'bg-indigo-500', textColor: 'text-white', icon: '📍' };
            }
        };

        const { bgColor, textColor, icon } = getMarkerStyles(location.type || 'other');

        // Create simple marker element
        const markerElement = document.createElement('div');
        markerElement.className = `
            w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer
            flex items-center justify-center text-sm
            ${bgColor} ${textColor}
        `;
        markerElement.innerHTML = icon;

        // Simple popup
        const popup = new mapboxgl.Popup({
            offset: 15,
            closeButton: true,
            closeOnClick: true
        }).setHTML(`
            <div class="p-3 max-w-xs">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-lg">${icon}</span>
                    <h3 class="text-sm font-semibold text-gray-900 m-0">${location.english_name}</h3>
                </div>
                <div class="space-y-1 text-xs text-gray-600">
                    <p><span class="font-medium">Burmese:</span> ${location.burmese_name}</p>
                    <p><span class="font-medium">Address:</span> ${location.address}</p>
                    ${location.description ? `<p class="mt-2 text-gray-700">${location.description}</p>` : ""}
                </div>
            </div>
        `);

        // Create marker
        const marker = new mapboxgl.Marker({
            element: markerElement,
            anchor: 'center'
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