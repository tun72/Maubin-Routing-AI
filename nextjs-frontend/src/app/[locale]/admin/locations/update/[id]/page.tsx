"use client";

import LocationForm from '@/components/admin/location-form';
import { updateLocations } from '@/lib/admin/locations';
import { useLocationStore } from '@/store/use-location-store';
import { useParams } from 'next/navigation';


export default function Page() {
    const { getLocationById } = useLocationStore()
    const { id } = useParams<{ id: string }>();

    console.log(id);

    const location = getLocationById(id)

    console.log(location);


    const defaultValues = {
        burmese_name: "",
        english_name: "",
        address: "",
        description: "",
        lon: 0,
        lat: 0,
        type: "",
    } as Locations

    if (location) {
        defaultValues.burmese_name = location.burmese_name
        defaultValues.english_name = location.english_name
        defaultValues.address = location.address
        defaultValues.description = location.description ? location.description : ""
        defaultValues.lat = location.lat
        defaultValues.lon = location.lon
        defaultValues.type = location.type
    }


    return (
        <LocationForm
            onSubmit={updateLocations}
            defaultLocations={defaultValues}
            type='UPDATE'
            id={id}
        />
    )
}
