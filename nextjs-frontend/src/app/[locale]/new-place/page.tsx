/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from '@/components/home/Header';
import Map from '@/components/new-place/Map';
import SearchForm from '@/components/new-place/SearchForm';





const LocationFinder: React.FC = () => {
    return (
        <div className="min-h-screen ">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={`grid gap-8 transition-all duration-500 grid-cols-3`}>
                    {/* Search Form */}
                    <SearchForm />
                    <Map />

                    {/* Map Area */}

                </div>
            </div>
        </div>
    );
};

export default LocationFinder;