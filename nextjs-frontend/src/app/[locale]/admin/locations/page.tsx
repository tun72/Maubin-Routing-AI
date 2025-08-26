"use client"

import { memo, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { RefreshCw, Plus, AlertCircle } from "lucide-react"

import LocationDataTable from "@/components/admin/location-datatable"
import { Button } from "@/components/ui/button"
import { useLocationStore } from "@/store/use-location-store"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Memoized error display component
const ErrorDisplay = memo(({
    error,
    onClear
}: {
    error: string
    onClear: () => void
}) => (
    <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="ml-2 h-6 w-6 p-0 text-destructive-foreground hover:text-destructive-foreground/80"
            >
                ✕
            </Button>
        </AlertDescription>
    </Alert>
))

ErrorDisplay.displayName = "ErrorDisplay"

// Memoized loading display component
const LoadingDisplay = memo(() => (
    <div className="flex items-center space-x-2 py-8">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading locations...</p>
    </div>
))

LoadingDisplay.displayName = "LoadingDisplay"

// Memoized empty state component
const EmptyState = memo(() => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No locations found</h3>
        <p className="text-sm text-muted-foreground mb-4">
            Get started by creating your first location.
        </p>
        <Button asChild>
            <Link href="/admin/locations/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Location
            </Link>
        </Button>
    </div>
))

EmptyState.displayName = "EmptyState"

// Main Location component with performance optimizations
function Location() {
    const {
        locations,
        loading,
        error,
        fetchLocations,
        reloadLocations,
        clearError
    } = useLocationStore()

    // Memoize callbacks to prevent unnecessary re-renders
    const handleReload = useCallback(async () => {
        try {
            await reloadLocations()
        } catch (err) {
            console.error('Failed to reload locations:', err)
        }
    }, [reloadLocations])

    const handleClearError = useCallback(() => {
        clearError()
    }, [clearError])

    // Memoize location statistics
    const locationStats = useMemo(() => {
        if (!locations?.length) return null

        return {
            total: locations.length,
            withBurmeseName: locations.filter(loc => loc.burmese_name?.trim()).length,
            withEnglishName: locations.filter(loc => loc.english_name?.trim()).length,
            withCoordinates: locations.filter(loc => loc.lat && loc.lon).length,
        }
    }, [locations])

    // Fetch locations on mount with error handling
    useEffect(() => {
        const loadLocations = async () => {
            try {
                await fetchLocations()
            } catch (err) {
                console.error('Failed to fetch locations:', err)
            }
        }

        loadLocations()
    }, [fetchLocations])

    // Auto-clear error after timeout
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 8000) // Increased to 8s for better UX
            return () => clearTimeout(timer)
        }
    }, [error, clearError])

    // Memoize the data table props to prevent unnecessary re-renders
    const tableProps = useMemo(() => ({
        data: locations || [],
        onDataChange: reloadLocations
    }), [locations, reloadLocations])

    return (
        <div className="w-full space-y-6 p-4">
            {/* Header Section */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
                    {locationStats && (
                        <p className="text-sm text-muted-foreground">
                            Managing {locationStats.total} location{locationStats.total !== 1 ? 's' : ''}
                            {locationStats.withCoordinates < locationStats.total && (
                                <span className="ml-2 text-amber-600">
                                    ({locationStats.total - locationStats.withCoordinates} missing coordinates)
                                </span>
                            )}
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="outline"
                        onClick={handleReload}
                        disabled={loading}
                        className="flex items-center space-x-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>{loading ? "Loading..." : "Refresh"}</span>
                    </Button>

                    <Button asChild>
                        <Link href="/admin/locations/create" className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Create Location</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            {/* {locationStats && !loading && (
                // <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                //     <div className="rounded-lg border bg-card p-3 text-center">
                //         <div className="text-2xl font-bold">{locationStats.total}</div>
                //         <p className="text-xs text-muted-foreground">Total Locations</p>
                //     </div>
                //     <div className="rounded-lg border bg-card p-3 text-center">
                //         <div className="text-2xl font-bold">{locationStats.withBurmeseName}</div>
                //         <p className="text-xs text-muted-foreground">With Burmese Names</p>
                //     </div>
                //     <div className="rounded-lg border bg-card p-3 text-center">
                //         <div className="text-2xl font-bold">{locationStats.withEnglishName}</div>
                //         <p className="text-xs text-muted-foreground">With English Names</p>
                //     </div>
                //     <div className="rounded-lg border bg-card p-3 text-center">
                //         <div className="text-2xl font-bold">{locationStats.withCoordinates}</div>
                //         <p className="text-xs text-muted-foreground">With Coordinates</p>
                //     </div>
                // </div>
            )} */}

            {/* Error Display */}
            {error && (
                <ErrorDisplay error={error} onClear={handleClearError} />
            )}

            {/* Content Area */}
            {loading ? (
                <LoadingDisplay />
            ) : !error && locations.length === 0 ? (
                <EmptyState />
            ) : !error && locations.length > 0 ? (
                <LocationDataTable {...tableProps} />
            ) : null}

            {/* Additional Actions */}
            {/* {!loading && !error && locations.length > 0 && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/admin/locations/bulk-import')}
                        className="flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Bulk Import</span>
                    </Button>
                </div>
            )} */}
        </div>
    )
}

export default memo(Location)