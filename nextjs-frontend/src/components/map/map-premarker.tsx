import React from 'react'
import MarkerItem from './map-markerItem'

function MapPreMarker({ locations }: { locations: Location[] }) {
    return (
        <>
            {locations.map((loc) => (
                <MarkerItem key={loc.id} location={loc} />
            ))}
        </>
    )
}

export default MapPreMarker