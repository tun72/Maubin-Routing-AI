"use client"
import React from 'react'
import LocationForm from '@/components/admin/location-form'

import { postLocations } from '@/lib/admin/locations'


function Create() {



    return (

        <LocationForm onSubmit={postLocations} />

    )
}

export default Create