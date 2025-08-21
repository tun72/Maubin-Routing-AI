import React from 'react'

function LocationError({ locationError }: { locationError: string }) {
    return (
        <div className="transition-all duration-500">
            <div className="bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
                <div className="text-center py-8">
                    <p className="text-red-500 mb-4">Error loading locations: {locationError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LocationError