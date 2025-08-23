"use client"
import LocationDataTable from "@/components/admin/location-datatable"
import { Button } from "@/components/ui/button"
import { useLocationStore } from "@/store/use-location-store"
import Link from "next/link"
import { useEffect } from "react"


function Location() {
    const {
        locations,
        loading,
        error,
        fetchLocations,
        reloadLocations,
        clearError
    } = useLocationStore()

    // Fetch locations on mount (with caching)
    useEffect(() => {
        fetchLocations()
    }, [fetchLocations])

    // Clear error when component unmounts or user takes action
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000) // Auto-clear error after 5s
            return () => clearTimeout(timer)
        }
    }, [error, clearError])

    const handleReload = async () => {
        await reloadLocations()
    }

    return (
        <div className="w-full p-4">
            <div className="flex items-center py-4 space-x-4">
                <Button asChild>
                    <Link href="/admin/locations/create">Create Locations</Link>
                </Button>
                <Button
                    variant="outline"
                    onClick={handleReload}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Reload Data"}
                </Button>
            </div>

            {loading && (
                <p className="text-sm text-muted-foreground">Loading locations...</p>
            )}

            {error && (
                <div className="flex items-center space-x-2 mb-4">
                    <p className="text-sm text-red-500">{error}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearError}
                        className="text-red-500 hover:text-red-700"
                    >
                        ✕
                    </Button>
                </div>
            )}

            {!loading && !error && locations.length > 0 && (
                <LocationDataTable
                    data={locations}
                    onDataChange={reloadLocations}
                />
            )}

            {!loading && !error && locations.length === 0 && (
                <p className="text-sm text-muted-foreground">No locations found</p>
            )}
        </div>
    )
}

export default Location