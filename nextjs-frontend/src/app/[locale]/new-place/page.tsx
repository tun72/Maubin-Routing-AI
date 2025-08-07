// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Header from '@/components/home/Header';
// import Map from '@/components/new-place/Map';
// import SearchForm from '@/components/new-place/SearchForm';





// const LocationFinder: React.FC = () => {
//     return (
//         <div className="min-h-screen ">
//             <Header />
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className={`grid gap-8 transition-all duration-500 grid-cols-3`}>
//                     {/* Search Form */}
//                     <SearchForm />
//                     <Map />

//                     {/* Map Area */}

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LocationFinder;
"use client"
import { useRef } from "react";

import MapProvider from "@/lib/mapbox/provider";
import MapStyles from "@/components/map/map-styles";
import MapCotrols from "@/components/map/map-controls";
import MapSearch from "@/components/map/map-search";

export default function Home() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="w-screen h-screen">
            <div
                id="map-container"
                ref={mapContainerRef}
                className="absolute inset-0 h-full w-full"
            />

            <MapProvider
                mapContainerRef={mapContainerRef}
                initialViewState={{
                    longitude: -122.4194,
                    latitude: 37.7749,
                    zoom: 10,
                }}
            >
                <MapSearch />
                <MapCotrols />
                <MapStyles />
            </MapProvider>
        </div>
    );
}