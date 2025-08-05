import { Brain, Clock, Footprints, MapPin, Navigation, Route, Search, Zap } from 'lucide-react';
import React from 'react'

function SearchForm() {
    return (
        <div className={`transition-all duration-500`}>
            <div className="bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Find Your Route
                </h2>

                <div className="space-y-4">
                    {/* Your Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Your Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"


                                placeholder="Enter starting point"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                            />
                            <button

                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
                                title="Use current location"
                            >
                                <Navigation className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Destination
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                            <input
                                type="text"

                                placeholder="Enter destination"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Clicked Location Info */}
                    {/* <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                                    Clicked Location
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                                    Polytechnic University Maubin
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        // onClick={() => useClickedLocation('start')}
                                        className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
                                    >
                                        Use as Start
                                    </button>
                                    <button
                                        // onClick={() => useClickedLocation('destination')}
                                        className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
                                    >
                                        Use as Destination
                                    </button>
                                </div>
                            </div>
                            <button
                                // onClick={() => {
                                //     setClickedLocation(null);
                                //     if (clickMarkerRef.current) {
                                //         mapInstanceRef.current.removeLayer(clickMarkerRef.current);
                                //         clickMarkerRef.current = null;
                                //     }
                                // }}
                                className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div> */}

                    {/* Search Button */}
                    <button
                        // onClick={handleSearch}
                        // disabled={!yourLocation || !destination || isSearching}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-cyan-600 dark:hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
                    >
                        {/* {isSearching ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Searching...</span>
                            </>
                        ) : (
                            <>
                                <Search className="h-5 w-5" />
                                <span>Find Route</span>
                            </>
                        )} */}

                        <>
                            <Search className="h-5 w-5" />
                            <span>Find Route</span>
                        </>
                    </button>

                    {/* AI Optimization Button */}
                    {/* {showAIButton && (
                        
                    )} */}
                    <button
                        // onClick={handleAIOptimization}
                        // disabled={isAIOptimizing}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        {/* {isAIOptimizing ? (
                            <>
                                <div className="flex items-center space-x-1">
                                    <Brain className="h-5 w-5 animate-pulse" />
                                    <Zap className="h-4 w-4 animate-bounce" />
                                </div>
                                <span>AI Optimizing...</span>
                            </>
                        ) : (
                            <>
                                
                            </>
                        )} */}
                        <Brain className="h-5 w-5" />
                        <span>Ask AI for Shortest Path</span>
                    </button>
                </div>

                {/* Route Information */}
                {/* <div className={`mt-6 p-4 rounded-xl border backdrop-blur-sm transition-all duration-500 ${true
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-800/50'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50'
                    }`}>
                    <div className="flex items-center space-x-2 mb-3">
                        {true ? (
                            <div className="flex items-center space-x-1">
                                <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                <Zap className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                            </div>
                        ) : (
                            <Route className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                        <h3 className={`font-semibold ${true
                            ? 'text-purple-800 dark:text-purple-300'
                            : 'text-green-800 dark:text-green-300'
                            }`}>
                            {true ? 'AI-Optimized Route' : 'Walking Route Found'}
                        </h3>
                        {true && (
                            <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800/30 rounded-full">
                                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                                    15% Faster
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <Footprints className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                500km
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                100mins
                            </span>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default SearchForm