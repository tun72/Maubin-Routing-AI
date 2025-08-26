"use client"

import React, { useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRoadStore } from "@/store/use-roads-store"
import { useLocationStore } from "@/store/use-location-store"
import {
    MapPin,
    Route,
    Activity
} from "lucide-react"
import Link from "next/link"

function Dashboard() {
    const { roads, fetchRoads, loading: roadsLoading } = useRoadStore()
    const { locations, fetchLocations, loading: locationsLoading } = useLocationStore()

    useEffect(() => {
        fetchRoads()
        fetchLocations()
    }, [fetchRoads, fetchLocations])

    // Calculate statistics
    const stats = useMemo(() => {
        // Location stats
        const locationStats = {
            total: locations.length,
            byType: locations.reduce((acc, loc) => {
                const type = loc.type || 'unknown'
                acc[type] = (acc[type] || 0) + 1
                return acc
            }, {} as Record<string, number>)
        }

        // Road stats
        const roadStats = {
            total: roads.length,
            totalLength: roads.reduce((sum, road) => {
                if (road.total_length) return sum + road.total_length
                if (road.length_m && Array.isArray(road.length_m)) {
                    return sum + road.length_m.reduce((s, l) => s + l, 0)
                }
                return sum
            }, 0),
            byType: roads.reduce((acc, road) => {
                const type = road.road_type || 'unknown'
                acc[type] = (acc[type] || 0) + 1
                return acc
            }, {} as Record<string, number>),
            oneway: roads.filter(road => road.is_oneway).length,
            twoway: roads.filter(road => !road.is_oneway).length
        }

        return { locations: locationStats, roads: roadStats }
    }, [locations, roads])



    const isLoading = roadsLoading || locationsLoading

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your locations and roads data
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/locations">
                            <MapPin className="w-4 h-4 mr-2" />
                            Locations
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/roads">
                            <Route className="w-4 h-4 mr-2" />
                            Roads
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 animate-pulse" />
                        <span>Loading dashboard data...</span>
                    </div>
                </div>
            )}

            {/* Main Stats */}
            {!isLoading && (
                <>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
                        <Card className='py-4'>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.locations.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total Locations
                                </p>
                            </CardContent>
                        </Card>

                        <Card className='py-4'>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.roads.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total Roads
                                </p>
                            </CardContent>
                        </Card>
                    </div>



                    {/* Quick Actions */}


                    {/* Recent Data Summary */}
                    {(locations.length > 0 || roads.length > 0) && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Recent Locations */}
                            {locations.length > 0 && (
                                <Card className='py-4'>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Recent Locations</CardTitle>
                                        <CardDescription>
                                            Latest {Math.min(5, locations.length)} locations
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {locations
                                                .slice(-5)
                                                .reverse()
                                                .map((location, index) => (
                                                    <div key={location.id || index} className="flex items-center justify-between py-2 border-b last:border-0">
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {location.english_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {location.burmese_name}
                                                            </p>
                                                        </div>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {location.type || 'N/A'}
                                                        </Badge>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Recent Roads */}
                            {roads.length > 0 && (
                                <Card className='py-4'>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Recent Roads</CardTitle>
                                        <CardDescription>
                                            Latest {Math.min(5, roads.length)} roads
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {roads
                                                .slice(-5)
                                                .reverse()
                                                .map((road, index) => (
                                                    <div key={road.id || index} className="flex items-center justify-between py-2 border-b last:border-0">
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {road.english_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {road.burmese_name}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {road.road_type}
                                                            </Badge>
                                                            {road.is_oneway && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    One-way
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Dashboard