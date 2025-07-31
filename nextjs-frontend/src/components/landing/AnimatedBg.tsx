"use client"
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'

function AnimateBackground() {

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        // Prevent hydration mismatch
        return null;
    }
    const isDark = theme === 'dark';
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {isDark ? (
                <>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

                </>
            ) : (
                <>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

                </>
            )}
        </div>
    )
}

export default AnimateBackground