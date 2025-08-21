import { locations, paths, themeClasses } from '@/config/site';
import { MapPin } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'

const AnimatedMap = () => {
    const [selectedDestination, setSelectedDestination] = useState<number | null>(null);
    const isDarkMode = true;

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
    const customTheme = isDark ? themeClasses.dark : themeClasses.light;


    return <div className={`relative w-full h-96 rounded-2xl overflow-hidden border ${customTheme.cardBorder} ${isDarkMode ? 'bg-gray-800' : 'bg-slate-200'}`}>
        <svg width="100%" height="100%" className="absolute inset-0">
            {/* Abstract city blocks */}
            {[...Array(8)].map((_, i) => (
                <rect key={i}
                    x={`${Math.random() * 100}%`} y={`${Math.random() * 100}%`}
                    width={`${10 + Math.random() * 20}%`} height={`${5 + Math.random() * 10}%`}
                    fill={isDarkMode ? "rgba(100, 116, 139, 0.1)" : "rgba(203, 213, 225, 0.5)"}
                    rx="4"
                />
            ))}
            {/* Roads */}
            <path d="M 0 50 Q 25 45 50 50 T 100 50" fill="none" stroke={isDarkMode ? "#475569" : "#cbd5e1"} strokeWidth="4" />
            <path d="M 50 0 Q 45 25 50 50 T 50 100" fill="none" stroke={isDarkMode ? "#475569" : "#cbd5e1"} strokeWidth="4" />
            <path d="M 20 0 V 100" fill="none" stroke={isDarkMode ? "#475569" : "#cbd5e1"} strokeWidth="3" opacity="0.6" />
            <path d="M 80 0 V 100" fill="none" stroke={isDarkMode ? "#475569" : "#cbd5e1"} strokeWidth="3" opacity="0.6" />
            <path d="M 0 30 H 100" fill="none" stroke={isDarkMode ? "#475569" : "#cbd5e1"} strokeWidth="3" opacity="0.6" />
            <path d="M 0 70 H 100" fill="none" stroke={isDarkMode ? "#475569" : "#cbd5e1"} strokeWidth="3" opacity="0.6" />

            {/* Animated Path */}
            {selectedDestination && (
                <g>
                    <path d={paths[selectedDestination as keyof typeof paths]} fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.3" />
                    <path d={paths[selectedDestination as keyof typeof paths]} fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" strokeDasharray="100" className="animate-path-flow" />
                </g>
            )}
        </svg>

        {/* Location Pins */}
        {locations.map((loc) => (
            <div key={loc.id} className="absolute" style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
                {loc.type === 'user' ? (
                    <div className="relative transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 rounded-full bg-sky-400 border-2 border-white shadow-lg"></div>
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-sky-400 animate-ping"></div>
                    </div>
                ) : (
                    <button onClick={() => setSelectedDestination(loc.id)} className={`transform -translate-x-1/2 -translate-y-full transition-all duration-300 hover:scale-125 ${selectedDestination === loc.id ? 'scale-125' : ''}`}>
                        <MapPin className={`w-8 h-8 drop-shadow-lg ${selectedDestination === loc.id ? 'text-sky-400' : 'text-slate-500'} transition-colors`} fill="currentColor" strokeWidth="1" stroke={isDarkMode ? '#1e293b' : '#f8fafc'} />
                    </button>
                )}
            </div>
        ))}
        <style jsx>{`
        .animate-path-flow {
          stroke-dashoffset: 100;
          animation: draw 3s ease-in-out infinite;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
}
export default AnimatedMap