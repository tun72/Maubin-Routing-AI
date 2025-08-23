import React from 'react';

export const PlaceCardLoading = () => {
    return (
        <div className="flex-shrink-0 w-full sm:w-80 md:w-72 lg:w-80 xl:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
            {/* Header/Map Section */}
            <div className="relative h-40 sm:h-40 md:h-30 lg:h-30 bg-gray-200 dark:bg-gray-700 p-0 overflow-hidden border-b border-gray-50 dark:border-gray-700">
                {/* Category Badge */}
                <div className="absolute top-2 left-2 sm:left-3 z-30">
                    <div className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-full w-20 h-6"></div>
                </div>

                {/* Rating Badge (sometimes visible) */}
                <div className="absolute top-2 right-2 sm:right-3 z-30">
                    <div className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-full w-12 h-6"></div>
                </div>

                {/* Map placeholder */}
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Content Section */}
            <div className="px-2 sm:px-3 py-4">
                {/* Title */}
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>

                {/* Address */}
                <div className="space-y-1 mb-3">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>

                {/* Distance and Time Row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                </div>

                {/* Visits/Last Visited Info */}
                <div className="flex items-center space-x-1 mb-3">
                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>

                {/* Navigate Button */}
                <div className="w-full h-9 bg-gray-200 dark:bg-gray-700 rounded-lg mt-2"></div>
            </div>
        </div>
    );
};

