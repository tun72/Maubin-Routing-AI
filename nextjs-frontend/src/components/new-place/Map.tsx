import { MapPin } from 'lucide-react'
import React from 'react'

function Map() {
    return (
        <div className={`transition-all duration-500 lg:col-span-2`}>
            <div className="bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
                {/* <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-b border-white/30 dark:border-gray-600/30 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                            <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-200">Interactive Map</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {isNavigating ? 'Following route navigation' : 'Click anywhere to get location info'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleMapExpansion}
                        className="p-2 bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm border border-white/40 dark:border-gray-600/40 rounded-xl hover:bg-white/30 dark:hover:bg-gray-600/40 transition-all duration-200 group/expand"
                        title={isMapExpanded ? "Minimize map" : "Expand map"}
                    >
                        {isMapExpanded ? (
                            <Minimize2 className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/expand:text-blue-600 dark:group-hover/expand:text-blue-400 transition-colors" />
                        ) : (
                            <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/expand:text-blue-600 dark:group-hover/expand:text-blue-400 transition-colors" />
                        )}
                    </button>
                </div> */}

                <div className={`relative transition-all duration-500 h-[500px]`}>

                    {/* <div
                        ref={mapRef}
                        className="w-full h-full"
                        style={{ zIndex: 1 }}
                    /> */}


                    {/* {isNavigating && routeInfo && (
                        <div className="absolute top-4 left-4 right-4 z-10">
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/50 dark:border-gray-700/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                                            {getDirectionIcon(routeInfo.steps[currentStepIndex].direction)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {routeInfo.steps[currentStepIndex].instruction}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {routeInfo.steps[currentStepIndex].distance} • Step {currentStepIndex + 1} of {routeInfo.steps.length}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsNavigating(false)}
                                        className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}


                    {/* {isAIOptimizing && ( */}
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-400/20 dark:to-pink-400/20 backdrop-blur-md rounded-2xl z-10">
                        <div className="text-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="relative">
                                    <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-pulse" />
                                    <div className="absolute -top-1 -right-1">
                                        <Zap className="h-6 w-6 text-pink-500 dark:text-pink-400 animate-bounce" />
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                                AI Analyzing Route
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-sm">
                                Finding the optimal walking path using advanced algorithms and real-time data
                            </p>
                            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                    <Target className="h-4 w-4 animate-spin" />
                                    <span>Optimizing</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* )} */}


                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-purple-200/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                                <MapPin className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Loading Map...
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Please wait while we initialize the interactive map
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Map