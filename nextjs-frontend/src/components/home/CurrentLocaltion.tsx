import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

function CurrentLocation() {
    return (
        <section className="px-4 sm:px-6 w-full">
            <Badge
                variant="secondary"
                className="group bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl dark:shadow-black/20 dark:hover:shadow-black/30 rounded-full px-4 py-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
                <MapPin className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm">Polytechnic University Maubin</span>
            </Badge>
        </section>
    )
}

export default CurrentLocation
