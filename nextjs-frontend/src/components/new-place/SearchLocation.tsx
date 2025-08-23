"use client"

import { Brain, MapPin, Zap, Target } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { LocationCombobox, type Location } from "./location-combox"
import { getLocations } from "@/lib/admin/locations"
import { postRoutes } from "@/lib/user/action"
import LoadingLocation from "./location-loading"
import LocationError from "./location-error"
import { Button } from "../ui/button"
import Link from "next/link"

const searchFormSchema = z.object({
    startLocationId: z.string().min(1, "Please select a starting location"),
    destLocationId: z.string().min(1, "Please select a destination"),
})

type SearchFormData = z.infer<typeof searchFormSchema>

function SearchLocation() {
    const [locations, setLocations] = useState<Location[]>([])
    const [isLoadingLocations, setIsLoadingLocations] = useState(true)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [isProcessingRoute, setIsProcessingRoute] = useState(false)
    const [isRouteReady, setIsRouteReady] = useState(false)
    const [historyId, setHistoryId] = useState("")


    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchFormData>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
            startLocationId: "",
            destLocationId: "",
        },
    })

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoadingLocations(true)
                setLocationError(null)
                const response = await getLocations()
                console.log(response)

                const data = await response.locations.data
                setLocations(data)
            } catch (error) {
                console.error("Error fetching locations:", error)
                setLocationError(error instanceof Error ? error.message : "Failed to load locations")
            } finally {
                setIsLoadingLocations(false)
            }
        }

        fetchLocations()
    }, [])

    const onSubmit = async (data: SearchFormData) => {
        const startLocation = locations.find((loc) => loc.id === data.startLocationId)
        const destLocation = locations.find((loc) => loc.id === data.destLocationId)

        if (startLocation && destLocation) {
            const formattedData = {
                start_lat: startLocation.lat,
                start_lon: startLocation.lon,
                end_lon: destLocation.lon,
                end_lat: destLocation.lat,
            }

            try {
                setIsProcessingRoute(true)
                setIsRouteReady(false)
                const response = await postRoutes(formattedData)
                console.log(response.result)
                console.log("Form submitted:", formattedData)
                setHistoryId(response.result.data.history_id)
                setIsRouteReady(true)
            } catch (error) {
                console.error("Error processing route:", error)
            } finally {
                setIsProcessingRoute(false)
            }
        }
    }

    if (isLoadingLocations) {
        return <LoadingLocation />
    }

    if (locationError) {
        return <LocationError locationError={locationError} />
    }

    return (
        <div className="grid gap-4 sm:gap-6 lg:gap-8 transition-all duration-500 grid-cols-1 lg:grid-cols-3">
            <div className="col-span-full lg:col-span-1">
                <div className="transition-all duration-500">
                    <div className="bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Find Your Route</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <MapPin className="inline h-4 w-4 mr-1" />
                                    Starting Location
                                </label>
                                <Controller
                                    name="startLocationId"
                                    control={control}
                                    render={({ field }) => (
                                        <LocationCombobox locations={locations} value={field.value} onValueChange={field.onChange} />
                                    )}
                                />
                                {errors.startLocationId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.startLocationId.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <MapPin className="inline h-4 w-4 mr-1 text-red-500" />
                                    Destination
                                </label>
                                <Controller
                                    name="destLocationId"
                                    control={control}
                                    render={({ field }) => (
                                        <LocationCombobox locations={locations} value={field.value} onValueChange={field.onChange} />
                                    )}
                                />
                                {errors.destLocationId && <p className="text-red-500 text-xs mt-1">{errors.destLocationId.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 active:scale-95"
                            >
                                <Brain className="h-5 w-5" />
                                <span>{isSubmitting ? "Processing..." : "Ask AI for Shortest Path"}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="transition-all duration-500 lg:col-span-2">
                <div className="bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
                    <div className="relative transition-all duration-500 h-[500px]">
                        {isProcessingRoute ? (
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
                                            <div
                                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                                style={{ animationDelay: "150ms" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                                style={{ animationDelay: "300ms" }}
                                            ></div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                                        AI Analyzing Route
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-sm">
                                        Finding the optimal walking path using advanced algorithms and real-time data
                                    </p>
                                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center space-x-1">
                                            <Target className="h-4 w-4 animate-spin" />
                                            <span>Optimizing</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
                                                    style={{ width: "70%" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : isRouteReady ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-400/20 dark:to-emerald-400/20 backdrop-blur-md rounded-2xl z-10">
                                <div className="text-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50">
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                                            <Target className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
                                        Your route is ready
                                    </h3>
                                    {historyId && <Button asChild
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white py-3 px-8 rounded-xl font-medium transition-all duration-200 shadow-lg transform hover:scale-105 active:scale-95"
                                    >
                                        <Link href={`/map/${historyId}`}>go now</Link>
                                    </Button>}
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-purple-200/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                                        <MapPin className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Ready for Route Planning
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                        Select your starting location and destination to begin
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchLocation
