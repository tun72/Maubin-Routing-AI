import { MapPin } from 'lucide-react'
import React from 'react'

function MapAction() {
    return (
        <>{/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 transition-all duration-300" />

            {/* Map Design */}
            <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" viewBox="0 0 320 160">
                {/* Roads */}
                <path
                    d="M0 80 Q80 60 160 80 T320 80"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-400 dark:text-gray-500"
                />
                <path
                    d="M160 0 Q140 40 160 80 Q180 120 160 160"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-300 dark:text-gray-600"
                />

                {/* Buildings */}
                <rect x="60" y="50" width="20" height="25" rx="2" className="fill-gray-300 dark:fill-gray-600" />
                <rect x="85" y="45" width="15" height="30" rx="2" className="fill-gray-400 dark:fill-gray-500" />
                <rect x="220" y="55" width="25" height="20" rx="2" className="fill-gray-300 dark:fill-gray-600" />
                <rect x="250" y="50" width="18" height="25" rx="2" className="fill-gray-400 dark:fill-gray-500" />

                {/* Trees/Parks */}
                <circle cx="40" cy="100" r="8" className="fill-green-300 dark:fill-green-700 opacity-60" />
                <circle cx="280" cy="110" r="6" className="fill-green-300 dark:fill-green-700 opacity-60" />
                <circle cx="120" cy="120" r="5" className="fill-green-300 dark:fill-green-700 opacity-60" />
            </svg>

            {/* Location Pin */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                        <MapPin className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-blue-500"></div>
                </div>
            </div>


            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-9 h-9 border-2 border-blue-300 dark:border-blue-400 rounded-full animate-ping opacity-30"></div>
            </div>
        </>

    )
}

export default MapAction