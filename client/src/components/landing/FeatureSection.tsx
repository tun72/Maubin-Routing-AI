import { themeClasses } from '@/config/site';
import { Brain, Route, Zap } from 'lucide-react';
// import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'

function FeaturesSection() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    // const t = useTranslations('HomePage');

    const t = () => { }

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        // Prevent hydration mismatch
        return null;
    }
    const isDark = theme === 'dark';
    const customTheme = isDark ? themeClasses.dark : themeClasses.light;

    // const features = [
    //     {
    //         icon: <Brain className="w-6 h-6 text-white" />,
    //         title: t("blog_Title"),
    //         description:
    //             t("blog_Paragraph"),
    //         gradientDark: "from-cyan-500 to-blue-600",
    //         gradientLight: "from-blue-500 to-indigo-600",
    //     },
    //     {
    //         icon: <Route className="w-6 h-6 text-white" />,
    //         title: t("blog_Title_2"),
    //         description:
    //             t("blog_Paragraph_2"),
    //         gradientDark: "from-purple-500 to-pink-600",
    //         gradientLight: "from-purple-500 to-pink-500",
    //     },
    //     {
    //         icon: <Zap className="w-6 h-6 text-white" />,
    //         title: t("blog_Title_3"),
    //         description:
    //             t("blog_Paragraph_3"),
    //         gradientDark: "",
    //         gradientLight: "from-emerald-500 to-teal-500",
    //     },
    // ];

    return (
        <section id="features" className="relative py-20 md:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold">{t("subtitle_1")}</h2>
                    <p className={`mt-4 text-lg ${customTheme.textSecondary}`}>
                        {/* {t("paragraph_1")} */}
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* {features.map((feature, index) => (
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
                    ))} */}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection



