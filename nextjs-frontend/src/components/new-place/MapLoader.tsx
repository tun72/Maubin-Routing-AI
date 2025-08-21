import { Brain, MapPin, Target, Zap } from 'lucide-react'
import React from 'react'

function MapLoader() {
    return (
        <div className={`transition-all duration-500 lg:col-span-2`}>
            <div className="bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className={`relative transition-all duration-500 h-[500px]`}>

                    {/* lodaer when ask ai button click */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-400/20 dark:to-pink-400/20 backdrop-blur-md rounded-2xl z-10">
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
                    </div>
                    {/* initial */}
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

export default MapLoader