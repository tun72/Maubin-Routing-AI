// components/map/route-controls.tsx
"use client"

import { useState, useEffect } from "react"
import { useMap } from "@/context/map-context"
import { useRouteDrawer } from "@/hooks/use-drawer"



interface RouteControlsProps {
    className?: string
    sampleRouteData: RouteData
}

export default function RouteControls({ className = "", sampleRouteData }: RouteControlsProps) {
    const { map } = useMap()
    const [isRouting, setIsRouting] = useState(false)
    const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null)

    const { drawRoute, clearRoute } = useRouteDrawer({
        map,
        onRouteStart: () => setIsRouting(true),
        onRouteComplete: () => setIsRouting(false),
    })

    useEffect(() => {
        if (map && !currentRoute) {
            setCurrentRoute(sampleRouteData)
            drawRoute(sampleRouteData)
        }
    }, [map, currentRoute, drawRoute, sampleRouteData])

    const handleClearRoute = () => {
        clearRoute()
        setIsRouting(false)
        setCurrentRoute(null)
    }

    const handleReloadRoute = () => {
        if (!map) return
        setCurrentRoute(sampleRouteData)
        drawRoute(sampleRouteData)
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        return `${minutes} min${minutes !== 1 ? "s" : ""}`
    }

    const formatDistance = (meters: number) => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(1)} km`
        }
        return `${meters} m`
    }

    return (
        <>
            {/* Control Buttons */}
            <div className={`absolute top-2.5 right-2.5 z-10 flex flex-col gap-2 ${className}`}>
                <button
                    onClick={handleReloadRoute}
                    disabled={isRouting}
                    className={`
                        px-4 py-2.5 text-white border-none rounded-lg font-bold text-sm
                        shadow-lg transition-all duration-300 ease-in-out
                        ${isRouting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 cursor-pointer hover:bg-blue-600"}
                    `}
                >
                    🔄 Reload Route
                </button>

                <button
                    onClick={handleClearRoute}
                    disabled={!currentRoute && !isRouting}
                    className={`
                        px-4 py-2.5 border-2 border-gray-300 rounded-lg font-bold text-sm
                        shadow-lg transition-all duration-300 ease-in-out
                        ${isRouting
                            ? "bg-red-400 text-white cursor-not-allowed"
                            : "bg-white text-gray-800 cursor-pointer hover:bg-gray-50"
                        }
                        ${!currentRoute && !isRouting ? "opacity-50" : "opacity-100"}
                    `}
                >
                    {isRouting ? "🚶‍♂️ Routing..." : "🗑️ Clear Route"}
                </button>
            </div>

            {/* Loading Indicator */}
            {isRouting && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-black/80 text-white rounded-2xl z-50 text-sm font-bold flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    🗺️ Drawing route with animation...
                </div>
            )}

            {/* Route Information Panel */}
            {currentRoute && (
                <div className="bg-white/95 backdrop-blur-sm absolute top-3 left-3 right-3 max-w-lg p-4 rounded-2xl shadow-2xl border border-white/20 z-10 overflow-auto max-h-100">
                    <div className="flex justify-between items-start mb-5 pb-3 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 m-0">Route Information</h3>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg">
                                <span className="text-blue-600">📏</span>
                                <span className="font-medium text-blue-700">{formatDistance(currentRoute.distance)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg">
                                <span className="text-green-600">⏱️</span>
                                <span className="font-medium text-green-700">{formatTime(currentRoute.estimated_time)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0 shadow-sm"></div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">FROM</span>
                                </div>
                                <div className="font-semibold text-gray-900 text-base leading-tight">
                                    {currentRoute.start_location.english_name}
                                </div>
                                <div className="text-sm text-gray-500 mt-0.5">{currentRoute.start_location.burmese_name}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0 shadow-sm"></div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">TO</span>
                                </div>
                                <div className="font-semibold text-gray-900 text-base leading-tight">
                                    {currentRoute.end_location.english_name}
                                </div>
                                <div className="text-sm text-gray-500 mt-0.5">{currentRoute.end_location.burmese_name}</div>
                            </div>
                        </div>
                    </div>

                    {currentRoute.road_names.length > 0 && (
                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-base">🛣️</span>
                                <span className="font-semibold text-gray-800">Route Details</span>
                            </div>
                            <div className="space-y-2">
                                {currentRoute.road_names.map((road, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm">{road.english_name}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{road.burmese_name}</div>
                                        </div>
                                        <div className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm">
                                            {road.length}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentRoute.step_locations && currentRoute.step_locations.length > 0 && (
                        <div className="border-t border-gray-100 pt-4 mt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-base">📍</span>
                                <span className="font-semibold text-gray-800">Route Steps</span>
                            </div>
                            <div className="space-y-3">
                                {currentRoute.step_locations.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm leading-tight">{step.english_name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{step.burmese_name}</div>
                                            <div className="text-xs text-gray-400 mt-1">{step.address}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
