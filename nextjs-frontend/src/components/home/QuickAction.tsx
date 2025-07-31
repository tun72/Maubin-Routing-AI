
import React from 'react'
import { MapPin, Footprints, Clock, CoinsIcon } from 'lucide-react'
import StatsCard from './ActionCard'

function QuickAction() {
    return (
        <section className="px-6 py-6">

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={<CoinsIcon className="w-6 h-6" />}
                    title="10 Coins"
                    subtitle="Credits Left"
                />
                <StatsCard
                    icon={<Footprints className="w-6 h-6" />}
                    title="12 km"
                    subtitle="Distance travelled"
                />
                <StatsCard
                    icon={<MapPin className="w-6 h-6" />}
                    title="10 Places"
                    subtitle="Locations visited"
                />
                <StatsCard
                    icon={<Clock className="w-6 h-6" />}
                    title="2h 15m"
                    subtitle="Active time"
                />

            </div>
        </section>
    )
}



export default QuickAction