/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Route, Clock, Car, Brain, Zap, Target, Maximize2 } from 'lucide-react';
import Header from '@/components/home/Header';


interface RouteInfo {
    distance: string;
    duration: string;
    steps: string[];
}

const LocationFinder: React.FC = () => {

    const [yourLocation, setYourLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [routeFound, setRouteFound] = useState(false);
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [showAIButton, setShowAIButton] = useState(false);
    const [isAIOptimizing, setIsAIOptimizing] = useState(false);
    const [aiOptimizedRoute, setAiOptimizedRoute] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const routeLayerRef = useRef<any>(null);


    useEffect(() => {
        // Initialize Leaflet map
        const initMap = async () => {
            if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
                // Load Leaflet dynamically
                const L = (window as any).L;
                if (L) {
                    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 13);

                    // Add tile layer
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);

                    mapInstanceRef.current = map;
                }
            }
        };

        // Load Leaflet CSS and JS
        if (typeof window !== 'undefined' && !document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
            script.onload = initMap;
            document.head.appendChild(script);
        } else if ((window as any).L) {
            initMap();
        }
    }, []);

    const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        return null;
    };

    const handleSearch = async () => {
        if (!yourLocation || !destination || !mapInstanceRef.current) return;

        setIsSearching(true);

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const L = (window as any).L;

            // Geocode both locations
            const startCoords = await geocodeLocation(yourLocation);
            const endCoords = await geocodeLocation(destination);

            if (startCoords && endCoords) {
                // Clear existing route
                if (routeLayerRef.current) {
                    mapInstanceRef.current.removeLayer(routeLayerRef.current);
                }

                // Add markers
                const startMarker = L.marker(startCoords)
                    .addTo(mapInstanceRef.current)
                    .bindPopup('Start: ' + yourLocation);

                const endMarker = L.marker(endCoords)
                    .addTo(mapInstanceRef.current)
                    .bindPopup('Destination: ' + destination);

                // Create a simple route line
                const routeLine = L.polyline([startCoords, endCoords], {
                    color: '#3B82F6',
                    weight: 4,
                    opacity: 0.8
                }).addTo(mapInstanceRef.current);

                routeLayerRef.current = L.layerGroup([startMarker, endMarker, routeLine]);

                // Fit map to show both points
                const group = new L.featureGroup([startMarker, endMarker]);
                mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));

                // Calculate approximate distance
                const distance = mapInstanceRef.current.distance(startCoords, endCoords);
                const distanceKm = (distance / 1000).toFixed(1);
                const estimatedTime = Math.round(distance / 1000 * 2); // Rough estimate: 2 min per km

                setRouteFound(true);
                setShowAIButton(true);
                setAiOptimizedRoute(false);
                setRouteInfo({
                    distance: `${distanceKm} km`,
                    duration: `${estimatedTime} min`,
                    steps: [
                        `Head toward ${destination}`,
                        `Continue straight for ${distanceKm} km`,
                        `Arrive at ${destination}`
                    ]
                });
            }
        } catch (error) {
            console.error('Route search error:', error);
        }

        setIsSearching(false);
    };

    const handleAIOptimization = async () => {
        if (!routeFound || !mapInstanceRef.current) return;

        setIsAIOptimizing(true);

        // Simulate AI processing time
        setTimeout(() => {
            // Simulate AI finding a better route
            const currentDistance = parseFloat(routeInfo?.distance?.split(' ')[0] || '0');
            const optimizedDistance = (currentDistance * 0.85).toFixed(1); // 15% shorter
            const optimizedTime = Math.round(parseFloat(optimizedDistance) * 1.8); // Slightly faster

            setRouteInfo({
                distance: `${optimizedDistance} km`,
                duration: `${optimizedTime} min`,
                steps: [
                    `Head northeast on optimal route`,
                    `Take AI-suggested shortcut via Highway 15`,
                    `Continue on express lane for ${(parseFloat(optimizedDistance) * 0.7).toFixed(1)} km`,
                    `Take exit 12A (AI-optimized)`,
                    `Turn right onto Smart Route Boulevard`,
                    `Arrive at ${destination} via fastest path`
                ]
            });

            setAiOptimizedRoute(true);
            setIsAIOptimizing(false);
        }, 3000);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        setYourLocation(address);

                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.setView([latitude, longitude], 15);
                        }
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (error) {
                        setYourLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setYourLocation('Current Location');
                }
            );
        } else {
            setYourLocation('Current Location');
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300`}>
            <div className="">
                {/* Header */}
                <Header />
                {/* <AnimateBackground /> */}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Search Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    Find Your Route
                                </h2>

                                <div className="space-y-4 backdrop:blur-none">
                                    {/* Your Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Your Location
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={yourLocation}
                                                onChange={(e) => setYourLocation(e.target.value)}
                                                placeholder="Enter starting point"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                                            />
                                            <button
                                                onClick={getCurrentLocation}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
                                                title="Use current location"
                                            >
                                                <Navigation className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Destination */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Destination
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                                            <input
                                                type="text"
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)}
                                                placeholder="Enter destination"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Search Button */}
                                    <button
                                        onClick={handleSearch}
                                        disabled={!yourLocation || !destination || isSearching}
                                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-cyan-600 dark:hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {isSearching ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Searching...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-5 w-5" />
                                                <span>Find Route</span>
                                            </>
                                        )}
                                    </button>

                                    {/* AI Optimization Button */}
                                    {showAIButton && (
                                        <button
                                            onClick={handleAIOptimization}
                                            disabled={isAIOptimizing}
                                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 active:scale-95"
                                        >
                                            {isAIOptimizing ? (
                                                <>
                                                    <div className="flex items-center space-x-1">
                                                        <Brain className="h-5 w-5 animate-pulse" />
                                                        <Zap className="h-4 w-4 animate-bounce" />
                                                    </div>
                                                    <span>AI Optimizing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Brain className="h-5 w-5" />
                                                    <span>Ask AI for Shortest Path</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Route Information */}
                                {routeFound && routeInfo && (
                                    <div className={`mt-6 p-4 rounded-xl border backdrop-blur-sm transition-all duration-500 ${aiOptimizedRoute
                                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-800/50'
                                        : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50'
                                        }`}>
                                        <div className="flex items-center space-x-2 mb-3">
                                            {aiOptimizedRoute ? (
                                                <div className="flex items-center space-x-1">
                                                    <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                    <Zap className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                                                </div>
                                            ) : (
                                                <Route className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            )}
                                            <h3 className={`font-semibold ${aiOptimizedRoute
                                                ? 'text-purple-800 dark:text-purple-300'
                                                : 'text-green-800 dark:text-green-300'
                                                }`}>
                                                {aiOptimizedRoute ? 'AI-Optimized Route' : 'Route Found'}
                                            </h3>
                                            {aiOptimizedRoute && (
                                                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800/30 rounded-full">
                                                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                                                        15% Faster
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <Car className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {routeInfo.distance}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {routeInfo.duration}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                                Directions:
                                            </h4>
                                            <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                {routeInfo.steps.map((step, index) => (
                                                    <li key={index} className="flex">
                                                        <span className="font-medium mr-2">{index + 1}.</span>
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map Area */}
                        <div className="lg:col-span-2">

                            <div className="bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden ">
                                <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-b border-white/30 dark:border-gray-600/30 p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-200">Interactive Map</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Visualize your route in real-time</p>
                                        </div>
                                    </div>
                                    <button
                                        // onClick={toggleMapExpansion}
                                        className="p-2 bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm border border-white/40 dark:border-gray-600/40 rounded-xl hover:bg-white/30 dark:hover:bg-gray-600/40 transition-all duration-200 group/expand"
                                    // title={isMapExpanded ? "Minimize map" : "Expand map"}
                                    >
                                        <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/expand:text-blue-600 dark:group-hover/expand:text-blue-400 transition-colors" />

                                        {/* {isMapExpanded ? (
                                        <Minimize2 className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/expand:text-blue-600 dark:group-hover/expand:text-blue-400 transition-colors" />
                                    ) : (
                                        <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/expand:text-blue-600 dark:group-hover/expand:text-blue-400 transition-colors" />
                                    )} */}
                                    </button>
                                </div>

                                <div className="h-96 lg:h-[600px] relative">
                                    {/* Leaflet Map Container */}

                                    <div
                                        ref={mapRef}
                                        className="w-full h-full "
                                        style={{ zIndex: 1 }}
                                    />

                                    {/* AI Processing Overlay */}
                                    {isAIOptimizing && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-400/20 dark:to-pink-400/20 backdrop-blur-md rounded-2xl z-10">
                                            <div className="text-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50">
                                                <div className="flex items-center justify-center space-x-3 mb-4">
                                                    <div className="relative">
                                                        <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-pulse" />
                                                        <div className="absolute -top-1 -right-1">
                                                            <Zap className="h-6 w-6 text-pink-500 dark:text-pink-400 animate-bounce" />
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                                                    AI Analyzing Route
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-sm">
                                                    Finding the optimal path using advanced algorithms and real-time traffic data
                                                </p>
                                                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center space-x-1">
                                                        <Target className="h-4 w-4 animate-spin" />
                                                        <span>Optimizing</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Loading Overlay */}
                                    {!mapInstanceRef.current && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-purple-200/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl">
                                            <div className="text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                                                    <MapPin className="h-8 w-8 text-white" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Loading Map...
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                                    Please wait while we initialize the interactive map
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationFinder;