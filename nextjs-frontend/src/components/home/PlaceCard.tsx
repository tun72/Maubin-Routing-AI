"use client"
import type { Place } from "@/types/types"
import { Clock, History, MapPin, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MapAction from "../MapAction"
import { postRoutes } from "@/lib/user/action"
import useLocationStore from "@/store/location-store"
import { useRouter } from "next/navigation"


interface PlaceCardProps {
    place: Place
    type: "favorite" | "recent"
    lat?: number
    lon?: number
    isFav?: boolean
}

export const PlaceCard = ({ place, type, lat, lon, isFav = false }: PlaceCardProps) => {
    const { getCoordinates } = useLocationStore()
    const router = useRouter()
    const coordinates = getCoordinates()


    const handelLocation = async () => {
        try {

            if (!lat || !lon || !coordinates.lat || !coordinates.lon) {
                return
            }
            const response = await postRoutes({ start_lat: lat, start_lon: lon, end_lat: coordinates.lat, end_lon: coordinates.lon })
            const historyID = response.result.data.history_id
            router.push(`/map/${historyID}`)

        } catch {

        }


    }
    return (
        <Card onClick={handelLocation} className="flex-shrink-0 w-full sm:w-80 md:w-72 lg:w-80 xl:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg dark:shadow-gray-900/20 dark:hover:shadow-gray-900/30 transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-700">
            <CardHeader className="relative h-40 sm:h-40 md:h-30 lg:h-30 bg-white dark:bg-gray-800 p-0 overflow-hidden border-b border-gray-50 dark:border-gray-700">
                <div className="absolute top-2 left-2 sm:left-3 flex items-center space-x-1 sm:space-x-2 z-30">
                    <span className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm dark:shadow-gray-900/20">
                        {place.category}
                    </span>
                </div>
                <MapAction />
                {type === "favorite" && place.rating && (
                    <div className="absolute top-2 right-2 sm:right-3 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center space-x-1 z-30 shadow-sm dark:shadow-gray-900/20">
                        <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{place.rating}</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="px-2 sm:px-3 py-4">
                <CardTitle className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                    {place.name}
                </CardTitle>

                <CardDescription className="text-gray-500 dark:text-gray-400 text-xs mb-1.5 sm:mb-2 line-clamp-1">{place.address}</CardDescription>

                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs font-medium">{place.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">{place.estimatedTime}</span>
                    </div>
                </div>

                {type === "favorite" && place.visits && (
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1.5 sm:mb-2">
                        <span>{place.visits} visits</span>
                    </div>
                )}

                {type === "recent" && place.lastVisited && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500 mb-1.5 sm:mb-2">
                        <History className="w-3 h-3" />
                        <span>Last visited {place.lastVisited}</span>
                    </div>
                )}

                {isFav ? <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:shadow-md dark:hover:shadow-gray-900/30 transform hover:-translate-y-0.5 transition-all duration-200 border-0">
                    Navigate Location
                </Button> : <Button onClick={() => {
                    router.push(`/map/${place.id}`)
                }} className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:shadow-md dark:hover:shadow-gray-900/30 transform hover:-translate-y-0.5 transition-all duration-200 border-0">
                    Navigate
                </Button>}

            </CardContent>


            {/* Footer with Navigation Button */}
            {/* <CardFooter className="p-2 sm:p-3 pt-0">

            </CardFooter> */}
        </Card>
    )
}


