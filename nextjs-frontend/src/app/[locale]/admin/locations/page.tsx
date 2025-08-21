"use client";
import LocationDataTable from "@/components/admin/location-datatable";
import { Button } from "@/components/ui/button";
import { getLocations } from "@/lib/admin/locations";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Location() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [locations, setLocations] = useState<any[]>([]); // adjust type later

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getLocations();
                console.log("Locations:", data);
                setLocations(data?.locations?.data || []); // ✅ safely handle
            } catch (error) {
                console.error("Failed to fetch locations:", error);
            }
        };

        fetchLocations();
    }, []);

    return (
        <div className="w-full p-4">
            <div className="flex items-center py-4 space-x-4">
                <Button asChild>
                    <Link href="/admin/locations/create">Create Locations</Link>
                </Button>
            </div>

            {/* Render datatable only if data is loaded */}
            {locations.length > 0 ? (
                <LocationDataTable data={locations} />
            ) : (
                <p className="text-sm text-muted-foreground">No locations found</p>
            )}
        </div>
    );
}

export default Location;
