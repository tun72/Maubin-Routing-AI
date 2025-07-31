import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const AddNewPlaceCard = () => {
    return (
        <Card className="flex-shrink-0 w-70 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer group min-h-[240px] flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 rounded-full flex items-center justify-center mb-2 transition-all duration-300">
                    <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm mb-1 transition-colors duration-300">
                    Go New Place
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                    Discover and add new destinations to your favorites
                </p>
            </CardContent>
        </Card>
    )
}

export default AddNewPlaceCard
