"use client"

import { themeClasses } from '@/config/site';
import { Brain, Route, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'

function FeaturesSection() {
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

    const features = [
        {
            icon: <Brain className="w-6 h-6 text-white" />,
            title: "AI-Powered Pathfinding",
            description:
                "Advanced algorithms find the optimal route by analyzing millions of data points in real-time.",
            gradientDark: "from-cyan-500 to-blue-600",
            gradientLight: "from-blue-500 to-indigo-600",
        },
        {
            icon: <Route className="w-6 h-6 text-white" />,
            title: "Dynamic Route Adjustment",
            description:
                "Automatically re-routes you based on live traffic, accidents, and road closures to save you time.",
            gradientDark: "from-purple-500 to-pink-600",
            gradientLight: "from-purple-500 to-pink-500",
        },
        {
            icon: <Zap className="w-6 h-6 text-white" />,
            title: "Instant Calculation",
            description:
                "Our optimized cloud engine calculates even the most complex routes in a fraction of a second.",
            gradientDark: "",
            gradientLight: "from-emerald-500 to-teal-500",
        },
    ];

    return (
        <section id="features" className="relative py-20 md:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold">Why Maubin-AI is Different</h2>
                    <p className={`mt-4 text-lg ${customTheme.textSecondary}`}>
                        Our system does not just find routes—it understands the journey, predicts patterns, and optimizes for what matters most to you.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group relative p-8 bg-gradient-to-br ${customTheme.cardBg} backdrop-blur-xl border ${customTheme.border} ${isDark ? 'hover:border-white/40' : 'hover:border-gray-300'} rounded-3xl transition-all duration-500 hover:transform hover:scale-105`}
                        // onMouseEnter={handleMouseEnter}
                        // onMouseLeave={handleMouseLeave}
                        >
                            <div className={`w-16 h-16 bg-gradient-to-r ${isDark ? feature.gradientDark : feature.gradientLight} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className={`text-2xl font-bold ${customTheme.text} mb-4`}>{feature.title}</h3>
                            <p className={`${customTheme.textMuted} leading-relaxed`}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection



