"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { History } from "lucide-react"
import { PlaceCard } from "./PlaceCard"
import AddNewPlaceCard from "./AddNewPlace"
import { getHistories } from "@/lib/user/action"
import { PlaceCardLoading } from "../PlaceCardLoading"

type Place = {
    id: string
    name: string
    address: string
    category: string
    distance: string
    estimatedTime: string
    image: string
    rating: number
    visits: number
}

interface LastVisitedProps {
    initialPlaces?: Place[]
    maxItems?: number
}

const LOADING_SKELETON_COUNT = 4

function LastVisited({ initialPlaces = [], maxItems }: LastVisitedProps) {
    const [places, setPlaces] = useState<Place[]>(initialPlaces)
    const [loading, setLoading] = useState(!initialPlaces.length)
    const [error, setError] = useState<string | null>(null)

    const limitedPlaces = useMemo(() =>
        maxItems ? places.slice(0, maxItems) : places,
        [places, maxItems]
    )

    const fetchPlaces = useCallback(async () => {
        // Skip if we already have initial data
        if (initialPlaces.length > 0) return

        try {
            setLoading(true)
            setError(null)

            const res = await getHistories()

            if (!res.success) {
                throw new Error(res.error || "Failed to fetch history")
            }

            setPlaces(res.result || [])
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load history"
            console.error("Error fetching histories:", err)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [initialPlaces.length])

    useEffect(() => {
        fetchPlaces()
    }, [fetchPlaces])

    const renderContent = useMemo(() => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: LOADING_SKELETON_COUNT }, (_, index) => (
                        <PlaceCardLoading key={`loading-${index}`} />
                    ))}
                </div>
            )
        }

        if (error) {
            return (
                <div className="flex items-center justify-center py-12 px-4">
                    <div className="text-center">
                        <p className="text-red-500 mb-2">{error}</p>
                        <button
                            onClick={fetchPlaces}
                            className="text-sm text-blue-500 hover:text-blue-600 underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )
        }

        if (limitedPlaces.length === 0) {
            return (
                <div className="flex items-center justify-center py-12 px-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        No recently visited places yet
                    </p>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AddNewPlaceCard />
                {limitedPlaces.map((place) => (
                    <PlaceCard
                        key={place.id}
                        place={place}
                        type="favorite"
                    />
                ))}
            </div>
        )
    }, [loading, error, limitedPlaces, fetchPlaces])

    return (
        <section className="px-6 py-4">
            <header className="flex items-center space-x-2 mb-6">
                <History className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">
                    Recently Visited
                    {!loading && limitedPlaces.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                            ({limitedPlaces.length})
                        </span>
                    )}
                </h2>
            </header>

            {renderContent}
        </section>
    )
}

export default LastVisited