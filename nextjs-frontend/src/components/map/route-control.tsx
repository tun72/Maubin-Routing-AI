// components/map/route-controls.tsx
"use client"

import { useState, useEffect } from "react"
import { useMap } from "@/context/map-context"
import { useRouteDrawer } from "@/hooks/use-drawer"
import { ArrowDown } from "lucide-react"
import { Badge } from "../ui/badge"

interface RouteControlsProps {
    className?: string
    sampleRouteData: RouteData
}

export default function RouteControls({ className = "", sampleRouteData }: RouteControlsProps) {
    const { map } = useMap()
    const [isRouting, setIsRouting] = useState(false)
    const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null)
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

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
        setIsPanelCollapsed(false)
    }

    const handleReloadRoute = () => {
        if (!map) return
        setCurrentRoute(sampleRouteData)
        drawRoute(sampleRouteData)
        setIsPanelCollapsed(false)
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        return `${minutes} min${minutes !== 1 ? "s" : ""}`
    }

    const formatDistance = (meters: number) => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(1)} km`
        }
        return `${meters.toFixed(2)} m`
    }

    return (
        <>
            {/* Control Buttons - Mobile First Design */}
            <div className={`absolute top-2 right-2 md:top-2.5 md:right-2.5 z-20 flex flex-col gap-1.5 md:gap-2 ${className}`}>
                <button
                    onClick={handleReloadRoute}
                    disabled={isRouting}
                    className={`
                        px-2.5 py-2 md:px-4 md:py-2.5 text-white border-none rounded-lg font-bold text-xs md:text-sm
                        shadow-lg transition-all duration-300 ease-in-out min-w-0 flex items-center justify-center gap-1
                        ${isRouting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700"}
                    `}
                >
                    <span>🔄</span>
                    <span className="hidden sm:inline">Reload Route</span>
                    <span className="sm:hidden">Reload</span>
                </button>

                <button
                    onClick={handleClearRoute}
                    disabled={!currentRoute && !isRouting}
                    className={`
                        px-2.5 py-2 md:px-4 md:py-2.5 border-2 border-gray-300 rounded-lg font-bold text-xs md:text-sm
                        shadow-lg transition-all duration-300 ease-in-out min-w-0 flex items-center justify-center gap-1
                        ${isRouting
                            ? "bg-red-400 text-white cursor-not-allowed border-red-400"
                            : "bg-white text-gray-800 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                        }
                        ${!currentRoute && !isRouting ? "opacity-50" : "opacity-100"}
                    `}
                >
                    <span>{isRouting ? "🚶‍♂️" : "🗑️"}</span>
                    <span className="hidden sm:inline">{isRouting ? "Routing..." : "Clear Route"}</span>
                    <span className="sm:hidden">{isRouting ? "Routing" : "Clear"}</span>
                </button>
            </div>

            {/* Loading Indicator - Responsive */}
            {isRouting && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-2 md:px-6 md:py-3 bg-black/80 text-white rounded-xl md:rounded-2xl z-50 text-xs md:text-sm font-bold flex items-center gap-2 max-w-xs md:max-w-none">
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    <span className="truncate">
                        <span className="hidden md:inline">🗺️ Drawing route with animation...</span>
                        <span className="md:hidden">🗺️ Drawing route...</span>
                    </span>
                </div>
            )}

            {/* Route Information Panel - Fully Responsive */}
            {currentRoute && (
                <div className={`
                    bg-white/95 backdrop-blur-sm absolute z-10 shadow-2xl 
                    transition-all duration-300 ease-in-out
                    
                    /* Mobile: Bottom sheet style */
                    bottom-0 left-0 right-0 rounded-t-2xl max-h-[50vh]
                    
                    /* Tablet and up: Top panel */
                    md:bottom-auto md:top-3 md:left-3 md:max-w-sm md:rounded-2xl md:max-h-[60vh]
                    
                    /* Large screens: Slightly wider but constrained */
                    lg:max-w-xs xl:max-w-sm

                    overflow-scroll
                    
                    ${isPanelCollapsed ? 'max-h-16 md:max-h-20' : 'max-h-[50vh] md:max-h-[60vh]'}
                `}>
                    {/* Header - Always visible */}
                    <div className="p-3 md:p-4 border-b  backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 m-0 truncate mr-2">
                                Route Information
                            </h3>
                            <div className="flex items-center gap-2">
                                {/* Collapse button for mobile */}
                                <button
                                    onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    aria-label={isPanelCollapsed ? "Expand panel" : "Collapse panel"}
                                >
                                    <span className={`transition-transform duration-300 ${isPanelCollapsed ? 'rotate-180' : ''}`}>
                                        <ArrowDown />
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Quick stats - Always visible */}
                        <div className="flex gap-2 mt-2 text-xs md:text-sm">
                            <Badge variant={"secondary"} className="bg-blue-500 text-white dark:bg-blue-600">📏 {formatDistance(currentRoute.distance)}</Badge>
                            <Badge className="bg-green-500 text-white dark:bg-green-600">⏱️  {formatTime(currentRoute.distance)}</Badge>
                        </div>
                    </div>

                    {/* Expandable content */}
                    <div className={`overflow-y-auto overflow-x-hidden ${isPanelCollapsed ? 'hidden' : 'block'}`}>
                        {/* Start and End locations */}
                        <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2 md:gap-3">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full mt-1 flex-shrink-0 shadow-sm"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">FROM</span>
                                    </div>
                                    <div className="font-semibold text-gray-900 text-sm md:text-base leading-tight truncate">
                                        {currentRoute.start_location.english_name}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500 mt-0.5 truncate">{currentRoute.start_location.burmese_name}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 md:gap-3">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full mt-1 flex-shrink-0 shadow-sm"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">TO</span>
                                    </div>
                                    <div className="font-semibold text-gray-900 text-sm md:text-base leading-tight truncate">
                                        {currentRoute.end_location.english_name}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500 mt-0.5 truncate">{currentRoute.end_location.burmese_name}</div>
                                </div>
                            </div>
                        </div>

                        {/* Road Names */}
                        {currentRoute.road_names.length > 0 && (
                            <div className="border-t border-gray-100 p-3 md:p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm md:text-base">🛣️</span>
                                    <span className="font-semibold text-gray-800 text-sm md:text-base">Route Details</span>
                                </div>
                                <div className="space-y-2">
                                    {currentRoute.road_names.map((road, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 md:p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0 mr-2">
                                                <div className="font-medium text-gray-900 text-xs md:text-sm truncate">{road.english_name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5 truncate">{road.burmese_name}</div>
                                            </div>
                                            <div className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm flex-shrink-0">
                                                {road.length}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step locations */}
                        {currentRoute.step_locations && currentRoute.step_locations.length > 0 && (
                            <div className="border-t border-gray-100 p-3 md:p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm md:text-base">📍</span>
                                    <span className="font-semibold text-gray-800 text-sm md:text-base">Route Steps</span>
                                </div>
                                <div className="space-y-2 md:space-y-3 max-h-40 md:max-h-48 overflow-y-auto">
                                    {currentRoute.step_locations.map((step, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 text-xs md:text-sm leading-tight truncate">{step.english_name}</div>
                                                <div className="text-xs text-gray-500 mt-1 truncate">{step.burmese_name}</div>
                                                <div className="text-xs text-gray-400 mt-1 truncate">{step.address}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bottom padding for mobile */}
                        <div className="h-4 md:hidden"></div>
                    </div>
                </div>
            )}
        </>
    )
}