import React from 'react'

export default function LoadingLocation() {
    return (
        <div className="transition-all duration-500">
            <div className="w-full">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">Loading locations...</span>
                </div>
            </div>
        </div>
    )
}
