"use client"

import RoadDataTable from "@/components/admin/road-datatable"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { useRoadStore } from "@/store/use-roads-store"
import { Plus, RefreshCw, AlertCircle, Rotate3D } from "lucide-react"
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

    // Clear error automatically after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000)
            return () => clearTimeout(timer)
        }
    }, [error, clearError])



    const handleReload = async () => {
        await reloadRoads()
    }


    if (loading && roads.length === 0) {
        return (
            <div className="w-full p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="h-6 w-6 animate-spin" />
                        <p className="text-lg">Loading roads...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Roads Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage road network data and configurations
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleReload}
                        disabled={loading}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? "Loading..." : "Reload"}
                    </Button>
                    <Button asChild className="gap-2">
                        <Link href="/admin/roads/create">
                            <Plus className="h-4 w-4" />
                            Create Road
                        </Link>
                    </Button>
                </div>
            </div>


            {/* Error Display */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                                <p className="text-xs text-red-600 mt-1">
                                    This error will automatically clear in a few seconds, or you can dismiss it manually.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearError}
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                                ✕
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Data Table */}
            {!error && roads.length > 0 && (
                <RoadDataTable
                    data={roads}
                    onDataChange={reloadRoads}
                />
            )}

            {/* Empty State */}
            {!loading && !error && roads.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center py-8">
                            <div className="rounded-full bg-muted p-6">
                                <Rotate3D className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">No roads found</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Get started by creating your first road. Roads help define the network structure for your application.
                                </p>
                            </div>
                            <Button asChild className="gap-2">
                                <Link href="/admin/roads/create">
                                    <Plus className="h-4 w-4" />
                                    Create Your First Road
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default Road