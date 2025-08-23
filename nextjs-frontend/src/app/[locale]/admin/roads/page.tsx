"use client"
import RoadDataTable from "@/components/admin/road-datatable"
import { Button } from "@/components/ui/button"
import { useRoadStore } from "@/store/use-roads-store"
import Link from "next/link"
import { useEffect } from "react"


function Road() {
    const {
        roads,
        loading,
        error,
        fetchRoads,
        reloadRoads,
        clearError
    } = useRoadStore()

    // Fetch roads on mount (with caching)
    useEffect(() => {
        fetchRoads()
    }, [fetchRoads])

    // Clear error when component unmounts or user takes action
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000) // Auto-clear error after 5s
            return () => clearTimeout(timer)
        }
    }, [error, clearError])

    const handleReload = async () => {
        await reloadRoads()
    }

    return (
        <div className="w-full p-4">
            <div className="flex items-center py-4 space-x-4">
                <Button asChild>
                    <Link href="/admin/roads/create">Create Road</Link>
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
                <p className="text-sm text-muted-foreground">Loading roads...</p>
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

            {!loading && !error && roads.length > 0 && (
                <RoadDataTable
                    data={roads}
                    onDataChange={reloadRoads}
                />
            )}

            {!loading && !error && roads.length === 0 && (
                <p className="text-sm text-muted-foreground">No roads found</p>
            )}
        </div>
    )
}

export default Road