"use client";

import RoadDataTable from "@/components/admin/road-datatable";
import { Button } from "@/components/ui/button";
import { getRoads } from "@/lib/admin/roads";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Road() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [roads, setRoads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoads = async () => {
            try {
                const data = await getRoads();
                setRoads(data?.roads?.data || []);
            } catch (err) {
                console.error("Failed to fetch roads:", err);
                setError("Failed to load roads.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoads();
    }, []);

    return (
        <div className="w-full p-4">
            <div className="flex items-center py-4 space-x-4">
                <Button asChild>
                    <Link href="/admin/roads/create">Create Roads</Link>
                </Button>
            </div>

            {loading && <p className="text-sm text-muted-foreground">Loading roads...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!loading && !error && roads.length > 0 && <RoadDataTable data={roads} />}
            {!loading && !error && roads.length === 0 && (
                <p className="text-sm text-muted-foreground">No roads found</p>
            )}
        </div>
    );
}

export default Road;
