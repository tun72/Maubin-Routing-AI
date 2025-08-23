"use client"

import { useEffect, useState, useRef } from "react"
import { History } from "lucide-react"
import { PlaceCard } from "./PlaceCard"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel"
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

function LastVisited() {
    const [places, setPlaces] = useState<Place[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const hasFetched = useRef(false)

    useEffect(() => {
        // Prevent multiple fetches
        if (hasFetched.current) return
        hasFetched.current = true
        const abortController = new AbortController()
        const fetchPlaces = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await getHistories()
                console.log(res);

                if (!res.success) {
                    throw new Error(res.error || "Failed to fetch history")
                }
                setPlaces(res.result || [])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                // Only set error if it's not an abort error
                if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
                    console.error("Error fetching histories:", err)
                    setError(err.message || "Failed to load history")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchPlaces()
        return () => {
            // Cleanup: abort ongoing request if component unmounts
            abortController.abort()
        }
    }, [])

    return (
        <section className="px-6 py-4">
            <Carousel opts={{ align: "start" }} className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <History className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">
                            Recently Visited
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CarouselPrevious className="relative left-auto top-auto translate-y-0" />
                        <CarouselNext className="relative right-auto top-auto translate-y-0" />
                    </div>
                </div>

                <CarouselContent className="-ml-1">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <CarouselItem key={index} className="pl-1 lg:basis-1/4 md:basis-1/3">
                                <PlaceCardLoading />
                            </CarouselItem>
                        ))
                    ) : error ? (
                        <div className="w-full py-8 text-center">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                        <>
                            <CarouselItem className="pl-1 lg:basis-1/4">
                                <AddNewPlaceCard />
                            </CarouselItem>
                            {places.map((place) => (
                                <CarouselItem
                                    key={place.id}
                                    className="pl-1 lg:basis-1/4 md:basis-1/3"
                                >
                                    <PlaceCard place={place} type="favorite" />
                                </CarouselItem>
                            ))}

                        </>
                    )}
                </CarouselContent>
            </Carousel>
        </section>
    )
}

export default LastVisited