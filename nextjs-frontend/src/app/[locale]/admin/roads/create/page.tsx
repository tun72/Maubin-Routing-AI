"use client"
import React from 'react'
import RoadForm from '@/components/admin/road-from'
import { postRoads } from '@/lib/admin/roads'


function Create() {
    return (
        <RoadForm onSubmit={postRoads} />
    )
}

export default Create