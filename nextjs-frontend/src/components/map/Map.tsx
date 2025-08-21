"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { getLocations } from "@/lib/admin/locations"

interface Node {
    coords: [number, number]
    name: string
    color?: string
    type: string
    icon: string
}

interface LocationNode {
    address: string
    burmese_name: string
    description: string | null
    english_name: string
    id: string
    lat: number
    lon: number
    type: string
}

interface StepLocation {
    address: string
    burmese_name: string
    english_name: string
    latitude: number
    longitude: number
    type: string
}

interface RoadName {
    burmese_name: string
    english_name: string
    length: string
    road_id: string
}

interface RouteData {
    distance: number
    end_location: StepLocation
    estimated_time: number
    is_success: boolean
    road_names: RoadName[]
    route: {
        geometry: {
            coordinates: number[][]
            type: string
        }

        type: string
    }
    route_id: string
    start_location: StepLocation
    step_locations: StepLocation[]
}

interface MapboxCustomDirectionsProps {
    accessToken: string
    center?: [number, number]
    zoom?: number
    style?: string
}

const MapboxCustomDirections: React.FC<MapboxCustomDirectionsProps> = ({
    accessToken,
    center = [95.6483, 16.7341],
    zoom = 13,
    style = "mapbox://styles/mapbox/standard",
}) => {
    const mapContainer = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
    const [isRouting, setIsRouting] = useState(false)
    const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null)
    const [apiNodes, setApiNodes] = useState<Node[]>([])
    const [isLoadingNodes, setIsLoadingNodes] = useState(false)
    const userLocationRef = useRef<[number, number] | null>(null)
    const routeAnimationRef = useRef<number | null>(null)
    const stepMarkersRef = useRef<mapboxgl.Marker[]>([])
    const [mapError, setMapError] = useState<string | null>(null)

    const sampleRouteData: RouteData = {
        distance: 1000.0,
        end_location: {
            address: "3rd Street & Kanar Street",
            burmese_name: "မြန်မာနိုင်ငံမိခင်နှင့်ကလေးစောင့်ရှောက်ရေးအသင်း",
            english_name: "Myanmar Maternal and Child Welfare Association",
            latitude: 16.7339353033448,
            longitude: 95.6560959511061,
            type: "defined_location",
        },
        estimated_time: 200.0,
        is_success: true,
        road_names: [
            {
                burmese_name: "မြို့ရှောင်လမ်း",
                english_name: "Myo Shaung Road",
                length: "300.0 meters",
                road_id: "076fc3eb-3ccb-4277-a834-ca8377b58617",
            },
            {
                burmese_name: "၃ လမ်း",
                english_name: "3rd Streed",
                length: "300.0 meters",
                road_id: "adb57efe-cbb7-41f1-a8d4-f70c0e659f05",
            },
            {
                burmese_name: "၃ လမ်း",
                english_name: "3rd Streed",
                length: "400.0 meters",
                road_id: "adb57efe-cbb7-41f1-a8d4-f70c0e659f05",
            },
        ],
        route: {
            geometry: {
                coordinates: [
                    [95.643255, 16.735858],
                    [95.6444175781722, 16.7373190850105],
                    [95.6492917512463, 16.7365567652605],
                    [95.6560959511061, 16.7339353033448],
                ],
                type: "LineString",
            },
            properties: {},
            type: "Feature",
        },
        route_id: "1924295f-d786-4be1-9a7c-f5ca17a11f36",
        start_location: {
            address: "Myo Shaung Road & Pagoda Road",
            burmese_name: "မအူပင်မှကြိုဆိုပါ၏",
            english_name: "Welcome to Maubin",
            latitude: 16.735858,
            longitude: 95.643255,
            type: "defined_location",
        },
        step_locations: [
            {
                address: "Myo Shaung Road & Pagoda Road",
                burmese_name: "မအူပင်မှကြိုဆိုပါ၏",
                english_name: "Welcome to Maubin",
                latitude: 16.735858,
                longitude: 95.643255,
                type: "defined_location",
            },
            {
                address: "Myo Shaung Road & 3rd Street",
                burmese_name: "ဓမ္မနောရမ ဝိပဿနာရိပ်သာ",
                english_name: "DHAMMA MANORAMA VIPASSANA CENTRE",
                latitude: 16.7373190850105,
                longitude: 95.6444175781722,
                type: "defined_location",
            },
            {
                address: "3rd Street & Khaing Shwe War Street",
                burmese_name: "ခိုင်ရွှေဝါဈေး",
                english_name: "Khaing Shwe War bazar",
                latitude: 16.7365567652605,
                longitude: 95.6492917512463,
                type: "defined_location",
            },
            {
                address: "3rd Street & Kanar Street",
                burmese_name: "မြန်မာနိုင်ငံမိခင်နှင့်ကလေးစောင့်ရှောက်ရေးအသင်း",
                english_name: "Myanmar Maternal and Child Welfare Association",
                latitude: 16.7339353033448,
                longitude: 95.6560959511061,
                type: "defined_location",
            },
        ],
    }

    const animateRoute = (routeCoordinates: number[][]) => {
        let step = 0
        const numSteps = 100

        const animate = () => {
            if (!mapRef.current) return

            const progress = step / numSteps
            const segmentIndex = Math.floor(progress * (routeCoordinates.length - 1))
            const segmentProgress = progress * (routeCoordinates.length - 1) - segmentIndex

            let animatedCoordinates: number[][]

            if (segmentIndex >= routeCoordinates.length - 1) {
                animatedCoordinates = routeCoordinates
            } else {
                animatedCoordinates = routeCoordinates.slice(0, segmentIndex + 1)

                if (segmentIndex < routeCoordinates.length - 1) {
                    const current = routeCoordinates[segmentIndex]
                    const next = routeCoordinates[segmentIndex + 1]
                    const interpolated = [
                        current[0] + (next[0] - current[0]) * segmentProgress,
                        current[1] + (next[1] - current[1]) * segmentProgress,
                    ]
                    animatedCoordinates.push(interpolated)
                }
            }

            const source = mapRef.current.getSource("route") as mapboxgl.GeoJSONSource
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
                })
            }

            step++

            if (step <= numSteps) {
                routeAnimationRef.current = requestAnimationFrame(animate)
            } else {
                setIsRouting(false)
            }
        }

        animate()
    }

    const addStepMarkers = (stepLocations: StepLocation[]) => {
        stepMarkersRef.current.forEach((marker) => marker.remove())
        stepMarkersRef.current = []

        stepLocations.forEach((step, index) => {
            const isStart = index === 0
            const isEnd = index === stepLocations.length - 1

            const markerEl = document.createElement("div")
            markerEl.style.cssText = `
                width: 30px;
                height: 30px;
                background: ${isStart ? "#00FF00" : isEnd ? "#FF0000" : "#FFA500"};
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
            `
            markerEl.innerHTML = isStart ? "🚩" : isEnd ? "🏁" : (index + 1).toString()

            const marker = new mapboxgl.Marker({ element: markerEl })
                .setLngLat([step.longitude, step.latitude])
                .setPopup(
                    new mapboxgl.Popup({
                        offset: 25,
                        className: "step-popup",
                    }).setHTML(`
                    <div style="text-align: center; padding: 8px; min-width: 200px;">
                        <div style="font-size: 16px; margin-bottom: 5px;">${isStart ? "🚩 START" : isEnd ? "🏁 END" : `📍 STEP ${index + 1}`}</div>
                        <div style="font-weight: bold; color: #333; margin-bottom: 3px; font-size: 14px;">${step.english_name}</div>
                        <div style="color: #666; font-size: 12px; font-family: 'Myanmar Text', serif; margin-bottom: 3px;">${step.burmese_name}</div>
                        <div style="color: #888; font-size: 11px;">${step.address}</div>
                    </div>
                `),
                )
                .addTo(mapRef.current!)

            stepMarkersRef.current.push(marker)
        })
    }

    const drawRouteWithCustomData = (routeData: RouteData) => {
        if (!routeData.is_success) {
            alert("Route data is not valid!")
            return
        }

        setIsRouting(true)
        setCurrentRoute(routeData)

        if (routeAnimationRef.current) {
            cancelAnimationFrame(routeAnimationRef.current)
        }

        const routeCoordinates = routeData.route.geometry.coordinates

        if (mapRef.current) {
            if (mapRef.current.getLayer("route-glow")) {
                mapRef.current.removeLayer("route-glow")
            }
            if (mapRef.current.getLayer("route")) {
                mapRef.current.removeLayer("route")
            }
            if (mapRef.current.getSource("route")) {
                mapRef.current.removeSource("route")
            }
        }

        mapRef.current?.addSource("route", {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: [],
                },
            },
        })

        mapRef.current?.addLayer({
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
        })

        mapRef.current?.addLayer({
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
        })

        addStepMarkers(routeData.step_locations)

        animateRoute(routeCoordinates)

        const coordinates = routeCoordinates
        const bounds = new mapboxgl.LngLatBounds()
        coordinates.forEach((coord) => bounds.extend(coord as [number, number]))
        mapRef.current?.fitBounds(bounds, { padding: 50 })
    }

    const clearRoute = () => {
        if (routeAnimationRef.current) {
            cancelAnimationFrame(routeAnimationRef.current)
        }

        stepMarkersRef.current.forEach((marker) => marker.remove())
        stepMarkersRef.current = []

        if (mapRef.current) {
            if (mapRef.current.getLayer("route-glow")) {
                mapRef.current.removeLayer("route-glow")
            }
            if (mapRef.current.getLayer("route")) {
                mapRef.current.removeLayer("route")
            }
            if (mapRef.current.getSource("route")) {
                mapRef.current.removeSource("route")
            }
        }
        setIsRouting(false)
        setCurrentRoute(null)
    }

    const showSampleRoute = () => {
        drawRouteWithCustomData(sampleRouteData)
    }

    const fetchNodesFromAPI = async () => {
        setIsLoadingNodes(true)
        try {
            const response = await getLocations()
            const locations: LocationNode[] = response.locations.data

            const convertedNodes: Node[] = locations.map((location) => ({
                coords: [location.lon, location.lat] as [number, number],
                name: `${location.english_name}\n${location.burmese_name}`,
                color: getColorByType(location.type),
                type: location.type,
                icon: getIconByType(location.type),
            }))

            setApiNodes(convertedNodes)
            console.log(`[v0] Loaded ${convertedNodes.length} nodes from API`)
        } catch (error) {
            console.error("[v0] Error fetching nodes from API:", error)
            setApiNodes([])
        } finally {
            setIsLoadingNodes(false)
        }
    }

    const getColorByType = (type: string): string => {
        const colorMap: { [key: string]: string } = {
            landmark: "#FF6B6B",
            restaurant: "#4ECDC4",
            hospital: "#45B7D1",
            school: "#96CEB4",
            market: "#FFEAA7",
            temple: "#DDA0DD",
            government: "#98D8C8",
            defined_location: "#FF7675",
        }
        return colorMap[type] || "#FF0000"
    }

    const getIconByType = (type: string): string => {
        const iconMap: { [key: string]: string } = {
            landmark: "🏛️",
            restaurant: "🍽️",
            hospital: "🏥",
            school: "🏫",
            market: "🏪",
            temple: "🛕",
            government: "🏛️",
            defined_location: "📍",
        }
        return iconMap[type] || "📍"
    }

    useEffect(() => {
        if (mapRef.current) return

        if (!accessToken) {
            setMapError("Mapbox access token is required")
            console.error("[v0] Mapbox access token is missing")
            return
        }

        if (!mapContainer.current) {
            setMapError("Map container not found")
            console.error("[v0] Map container ref is null")
            return
        }

        try {
            mapboxgl.accessToken = accessToken

            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current,
                style,
                center,
                zoom,
                maxBounds: [
                    [95.6244, 16.7215],
                    [95.6644, 16.7415],
                ],
            })

            mapRef.current.on("error", (e) => {
                console.error("[v0] Mapbox error:", e)
                setMapError(`Map error: ${e.error?.message || "Unknown error"}`)
            })

            mapRef.current.on("load", () => {
                console.log("[v0] Map loaded successfully")
                setMapError(null)
                fetchNodesFromAPI()

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const loc: [number, number] = [position.coords.longitude, position.coords.latitude]
                            setUserLocation(loc)
                            userLocationRef.current = loc

                            const userMarkerEl = document.createElement("div")
                            userMarkerEl.style.cssText = `
                                width: 20px;
                                height: 20px;
                                background: #00D4FF;
                                border: 3px solid #ffffff;
                                border-radius: 50%;
                                box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
                                animation: pulse 2s infinite;
                            `

                            const style = document.createElement("style")
                            style.textContent = `
                                @keyframes pulse {
                                    0% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.6); }
                                    50% { box-shadow: 0 0 30px rgba(0, 212, 255, 0.8); }
                                    100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.6); }
                                }
                            `
                            document.head.appendChild(style)

                            new mapboxgl.Marker({ element: userMarkerEl })
                                .setLngLat(loc)
                                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("📍 Your Location"))
                                .addTo(mapRef.current!)
                                .togglePopup()

                            mapRef.current!.flyTo({
                                center: loc,
                                zoom: 14,
                                duration: 2000,
                                essential: true,
                            })
                        },
                        (err) => console.error("Geolocation error:", err),
                    )
                }

                setTimeout(() => {
                    console.log("[v0] Auto-showing sample route")
                    showSampleRoute()
                }, 3000)
            })
        } catch (error) {
            console.error("[v0] Failed to initialize map:", error)
            setMapError(`Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
    }, [accessToken, center, zoom, style])

    useEffect(() => {
        if (!mapRef.current || apiNodes.length === 0) return

        console.log(`[v0] Adding ${apiNodes.length} markers to map`)

        apiNodes.forEach((node) => {
            const markerEl = document.createElement("div")
            markerEl.style.cssText = `
                width: 35px;
                height: 35px;
                background: ${node.color || "#FF0000"};
                border: 2px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            `
            markerEl.innerHTML = node.icon
        })
    }, [apiNodes])

    useEffect(() => {
        return () => {
            if (routeAnimationRef.current) {
                cancelAnimationFrame(routeAnimationRef.current)
            }
            stepMarkersRef.current.forEach((marker) => marker.remove())
            mapRef.current?.remove()
        }
    }, [])

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
            <div
                ref={mapContainer}
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                    minHeight: "400px",
                    minWidth: "300px",
                    backgroundColor: "#f0f0f0",
                }}
            />

            {mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-red-200 max-w-md mx-4">
                        <div className="text-red-600 text-center">
                            <div className="text-2xl mb-2">⚠️</div>
                            <div className="font-semibold mb-2">Map Error</div>
                            <div className="text-sm text-gray-600">{mapError}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-2">
                <button
                    onClick={fetchNodesFromAPI}
                    disabled={isLoadingNodes}
                    className={`
                        px-4 py-2.5 text-white border-none rounded-lg font-bold text-sm
                        shadow-lg transition-all duration-300 ease-in-out
                        ${isLoadingNodes
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 cursor-pointer hover:bg-blue-600"
                        }
                    `}
                >
                    {isLoadingNodes ? "🔄 Loading..." : "🔄 Refresh Nodes"}
                </button>

                <button
                    onClick={showSampleRoute}
                    disabled={isRouting}
                    className={`
                        px-4 py-2.5 text-white border-none rounded-lg font-bold text-sm
                        shadow-lg transition-all duration-300 ease-in-out
                        ${isRouting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 cursor-pointer hover:bg-green-600"
                        }
                    `}
                >
                    🗺️ Show Sample Route
                </button>

                <button
                    onClick={clearRoute}
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

                {userLocation && (
                    <div className="px-3 py-2 bg-white/95 rounded-lg text-xs text-gray-600 shadow-lg">
                        📍 Location: {userLocation[1].toFixed(4)}, {userLocation[0].toFixed(4)}
                    </div>
                )}

                {apiNodes.length > 0 && (
                    <div className="px-3 py-2 bg-green-100 rounded-lg text-xs text-green-700 shadow-lg">
                        📍 {apiNodes.length} locations loaded
                    </div>
                )}
            </div>

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
                </div>
            )}

            {(isRouting || isLoadingNodes) && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-black/80 text-white rounded-2xl z-50 text-sm font-bold flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLoadingNodes ? "📍 Loading locations..." : "🗺️ Drawing route with animation..."}
                </div>
            )}
        </>
    )
}

export default MapboxCustomDirections
