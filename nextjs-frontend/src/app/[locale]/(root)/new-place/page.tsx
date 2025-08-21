import Header from "@/components/home/Header";
import SearchLocation from "@/components/new-place/SearchLocation";


export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <SearchLocation />
            </div>
        </div>

        // <Map accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string} />
    )
}
