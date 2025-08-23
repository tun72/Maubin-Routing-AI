import { PlaceCard } from './PlaceCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { favoritePlaces } from '@/constant/constant';
import { Heart } from 'lucide-react';

export default function FavouritePlaces() {

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
                        <Heart className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">Popular places</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CarouselPrevious className="relative left-auto top-auto translate-y-0" />
                        <CarouselNext className="relative right-auto top-auto translate-y-0" />
                    </div>
                </div>


                <CarouselContent className="-ml-1">
                    {favoritePlaces.map((place) => (
                        <CarouselItem key={place.id} className="pl-1 lg:basis-1/4">
                            <PlaceCard place={place} type="favorite" isFav={true} lat={place.lat} lon={place.lon} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    )
}
