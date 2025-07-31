import { recentPlaces } from "@/constant/constant"
import { History } from "lucide-react"
import { PlaceCard } from "./PlaceCard"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import AddNewPlaceCard from "./AddNewPlace"

function LastVisited() {
    return (
        <section className="px-6 py-4">
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <History className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">Recently Visited</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CarouselPrevious className="relative left-auto top-auto translate-y-0" />
                        <CarouselNext className="relative right-auto top-auto translate-y-0" />
                    </div>
                </div>

                <CarouselContent className="-ml-1">

                    {recentPlaces.map((place) => (
                        <CarouselItem key={place.id} className="pl-1 lg:basis-1/4 md:basis-1/3">
                            <PlaceCard place={place} type="favorite" />
                        </CarouselItem>
                    ))}
                    <CarouselItem className="pl-1 lg:basis-1/4">
                        <AddNewPlaceCard />
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </section>
    )
}

export default LastVisited
