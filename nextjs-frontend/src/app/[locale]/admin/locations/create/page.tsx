"use client"
import React from 'react'
import LocationForm from '@/components/admin/location-form'

import { postLocations } from '@/lib/admin/locations'


function Create() {
    const defaultValues = {
        burmese_name: "",
        english_name: "",
        address: "",
        description: "",
        lon: 0,
        lat: 0,
        type: "",
    } as Locations



    return (

        <LocationForm onSubmit={postLocations} defaultLocations={defaultValues} type='CREATE' />

    )
}

export default Create