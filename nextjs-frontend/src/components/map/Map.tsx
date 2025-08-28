"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import MapProvider from "@/lib/mapbox/provider";
import MapStyles from "@/components/map/map-styles";
import MapCotrols from "@/components/map/map-controls";
import MapPreMarker from "./map-premarker";
import RouteControls from "./route-control";
import { getHistory, getLocations } from "@/lib/user/action";

export default function Map({ id }: { id: string }) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sampleRouteData, setSampleRouteData] = useState<RouteData | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) return; // Don't fetch if no id provided

        try {
            setLoading(true);
            setError(null);

            // Use Promise.all to run both API calls concurrently
            const [locationsResponse, historyResponse] = await Promise.all([
                getLocations(),
                getHistory(id)
            ]);

            // Handle locations response
            if (!locationsResponse.locations.is_success) {
                throw new Error(`Locations API Error: ${locationsResponse}`);
            }

            const locationsData = locationsResponse.locations?.data ?? [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const locationsFilter = locationsData.filter((loc: any) => loc.type !== "intersection")
            setLocations(locationsFilter);
            setSampleRouteData(historyResponse.result);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, [id]); // Only depend on id

    useEffect(() => {
        fetchData();
    }, [fetchData]); // This will only run when fetchData changes (i.e., when id changes)

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="text-lg">Loading map...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="text-lg text-red-500">Error loading map: {error}</div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen">
            <div
                id="map-container"
                ref={mapContainer}
                className="absolute inset-0 h-full w-full"
            />

            <MapProvider mapContainer={mapContainer}>
                {/* <MapSearch /> */}
                <MapCotrols />
                <MapStyles />
                <MapPreMarker locations={locations} />
                {sampleRouteData && <RouteControls sampleRouteData={sampleRouteData} />}
            </MapProvider>
        </div>
    );
}