"use client"
import React from 'react'
import RoadForm from '@/components/admin/road-from'
import { updateRoads } from '@/lib/admin/roads'
import { useRoadStore } from '@/store/use-roads-store'
import { useParams } from 'next/navigation'



function Update() {
    const { getRoadById } = useRoadStore()
    const { id } = useParams<{ id: string }>();
    const defaultRoad = {
        burmese_name: "",
        english_name: "",
        coordinates: [],
        length_m: "0",
        road_type: "local",
        is_oneway: false,
    }

    const road = getRoadById(id)


    if (road) {
        defaultRoad.burmese_name = road!.burmese_name as string
        defaultRoad.english_name = road.english_name as string
        defaultRoad.coordinates = JSON.parse(road!.geojson).coordinates
        defaultRoad.length_m = road.length_m.map((length) => length.toString()).join(",")
        defaultRoad.road_type = road.road_type as string
        defaultRoad.is_oneway = road.is_oneway as boolean
    }



    return (
        <RoadForm onSubmit={updateRoads} type={"UPDATE"} defaultRoads={defaultRoad} id={id} />
    )
}

export default Update