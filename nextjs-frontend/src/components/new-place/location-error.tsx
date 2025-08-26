import React from 'react'
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '../ui/button'

interface LocationErrorProps {
    locationError: string
    onRetry?: () => void
}

const LocationError: React.FC<LocationErrorProps> = ({
    locationError,
    onRetry
}) => {
    // Determine error type for better UX
    const isNetworkError = locationError.toLowerCase().includes('network') ||
        locationError.toLowerCase().includes('fetch') ||
        locationError.toLowerCase().includes('connection')

    const isServerError = locationError.toLowerCase().includes('server') ||
        locationError.toLowerCase().includes('500') ||
        locationError.toLowerCase().includes('502') ||
        locationError.toLowerCase().includes('503')

    const getErrorIcon = () => {
        if (isNetworkError) return <WifiOff className="h-12 w-12 text-red-500" />
        if (isServerError) return <AlertTriangle className="h-12 w-12 text-orange-500" />
        return <AlertTriangle className="h-12 w-12 text-red-500" />
    }

    const getErrorTitle = () => {
        if (isNetworkError) return "Connection Problem"
        if (isServerError) return "Server Error"
        return "Loading Error"
    }

    const getErrorSubtitle = () => {
        if (isNetworkError) return "Please check your internet connection and try again"
        if (isServerError) return "The server is temporarily unavailable"
        return "Unable to load location data"
    }

    return (
        <div className=" flex items-center justify-center bg-gradient-to-br p-4">
            <div className="max-w-md w-full">
                <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 dark:border-white/20 p-8 text-center">
                    {/* Error Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {getErrorIcon()}
                            {isNetworkError && (
                                <div className="absolute -top-1 -right-1">
                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Content */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {getErrorTitle()}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                {getErrorSubtitle()}
                            </p>
                        </div>

                        {/* Error Details */}
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-red-600 dark:text-red-400 text-sm">
                                {locationError}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            {onRetry && (
                                <Button
                                    onClick={onRetry}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                                    size="lg"
                                >
                                    <RefreshCw className="h-5 w-5 mr-2" />
                                    Try Again
                                </Button>
                            )}

                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="w-full border-white/40 dark:border-white/20 bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
                            >
                                Refresh Page
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                If the problem persists, please check your internet connection
                                {isServerError && ' or try again later'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Network Status Indicator */}
                {isNetworkError && (
                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <Wifi className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                                Checking connection status...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LocationError