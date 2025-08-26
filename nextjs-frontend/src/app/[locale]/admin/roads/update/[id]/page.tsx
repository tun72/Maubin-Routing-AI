"use client"
import React from 'react'
import RoadForm from '@/components/admin/road-from'
import { postRoads } from '@/lib/admin/roads'
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
    console.log(road);


    return (
        <RoadForm onSubmit={postRoads} type={"CREATE"} defaultRoads={defaultRoad} />
    )
}

export default Update