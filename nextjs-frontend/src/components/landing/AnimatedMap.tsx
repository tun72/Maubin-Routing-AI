
"use client"

import { themeClasses } from '@/config/site';
import MapProvider from '@/lib/mapbox/provider';
import { useTheme } from 'next-themes';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapCotrols from '../map/map-controls';
import MapStyles from '../map/map-styles';
import { getLocations } from '@/lib/user/action';
import MapPreMarker from '../map/map-premarker';
// import MapCotrols from '../map/map-controls';
// import MapStyles from '../map/map-styles';
// import MapPreMarker from '../map/map-premarker';

function AnimatedMap() {

    const mapContainer = useRef<HTMLDivElement>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isDarkMode = true;

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);



    const fetchData = useCallback(async () => {


        try {
            setLoading(true);
            setError(null);

            // Use Promise.all to run both API calls concurrently
            const [locationsResponse] = await Promise.all([
                getLocations(),

            ]);

            // Handle locations response
            if (!locationsResponse.locations.is_success) {
                throw new Error(`Locations API Error: ${locationsResponse}`);
            }

            const locationsData = locationsResponse.locations?.data ?? [];
            setLocations(locationsData);


        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, []); // Only depend on id

    useEffect(() => {
        fetchData();
    }, [fetchData]); // This will only run when fetchData changes (i.e., when id changes)


    if (!mounted) {
        // Prevent hydration mismatch
        return null;
    }

    const isDark = theme === 'dark';
    const customTheme = isDark ? themeClasses.dark : themeClasses.light;
    return (
        <div className={`relative w-full h-full rounded-2xl overflow-hidden border ${customTheme.cardBorder} ${isDarkMode ? 'bg-gray-800' : 'bg-slate-200'}`}>
            <div
                id="map-container"
                ref={mapContainer}
                className="absolute inset-0 h-full w-full"
            />

            <MapProvider mapContainer={mapContainer}>
                <MapCotrols />
                <MapStyles />
                {loading ? <p>Locading...</p> : <MapPreMarker locations={locations} />}
                {error && <p>{error}</p>}
            </MapProvider>
        </div>
    )
}

export default AnimatedMap