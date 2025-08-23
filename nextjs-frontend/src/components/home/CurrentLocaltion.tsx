"use client"
import { useState, useEffect } from "react"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import useLocationStore from "@/store/location-store"

function CurrentLocation() {
    const [location, setLocation] = useState("Getting location...")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { setCoordinates } = useLocationStore()

    useEffect(() => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser")
            setIsLoading(false)
            return
        }

        // Get current position
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords
                    // console.log(latitude, longitude);
                    setLocation(`Lat ${latitude.toFixed(6)}, Long ${longitude.toFixed(6)}`)
                    setCoordinates(latitude, longitude)
                } catch (err) {
                    console.error('Error fetching address:', err)
                    setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`)
                } finally {
                    setIsLoading(false)
                }
            },
            (error) => {
                console.error('Geolocation error:', error)
                let errorMessage = "Unable to get location"

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied"
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location unavailable"
                        break
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out"
                        break
                }

                setError(errorMessage)
                setLocation("Location unavailable")
                setIsLoading(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes cache
            }
        )
    }, [setCoordinates])

    const handleRetryLocation = () => {
        setIsLoading(true)
        setError(null)
        setLocation("Getting location...")

        // Trigger the geolocation again
        window.location.reload()
    }

    return (
        <section className="px-4 sm:px-6 w-full">
            <Badge
                variant="secondary"
                className={`group bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl dark:shadow-black/20 dark:hover:shadow-black/30 rounded-full px-4 py-2 transition-all duration-300 text-gray-900 dark:text-gray-100 font-medium ${error ? 'hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer' :
                    isLoading ? '' : 'hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                    }`}
                onClick={error ? handleRetryLocation : undefined}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 animate-spin" />
                ) : error ? (
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                ) : (
                    <MapPin className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                )}
                <span className="text-sm">
                    {isLoading ? "Getting location..." : location}
                    {error && " (click to retry)"}
                </span>
            </Badge>
        </section>
    )
}

export default CurrentLocation