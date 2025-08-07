"use client"

import { themeClasses } from '@/config/site';
import { Github, Linkedin, Navigation, Twitter, } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function Footer() {

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations('HomePage');

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        // Prevent hydration mismatch
        return null;
    }
    const isDark = theme === 'dark';
    const customTheme = isDark ? themeClasses.dark : themeClasses.light;
    return (
        <footer className={`relative border-t ${customTheme.border} ${customTheme.footerBg} backdrop-blur-md py-10`}>
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-8 md:grid-cols-4 mb-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 bg-gradient-to-r ${customTheme.accent} rounded-lg flex items-center justify-center`}>
                                <Navigation className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-xl font-bold bg-gradient-to-r ${customTheme.accent} bg-clip-text text-transparent`}>
                                {t("title")}
                            </span>
                        </div>
                        <p className={`${customTheme.textMuted} max-w-md mb-4`}>
                            {t("about_us_paragraph")}
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>
                                <Github className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={`font-semibold ${customTheme.text} mb-4`}>Product</h4>
                        <ul className="space-y-2">
                            <li><Link href="#Features" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>Features</Link></li>
                            <li><Link href="#pricing" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>Pricing</Link></li>
                            <li><Link href="/tutorials" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>Tutorials</Link></li>
                            <li><Link href="/register" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>Get Start</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-semibold ${customTheme.text} mb-4`}>Support</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>Help Center</Link></li>
                            <li><Link href="#" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>Contact Us</Link></li>
                            <li><Link href="#" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>Privacy Policy</Link></li>
                            <li><Link href="#" className={`${customTheme.textSecondary} hover:${customTheme.text} transition-colors`}>Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={`pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} text-center ${customTheme.textSecondary}`}>
                    <p>&copy; 2025 {t("team")}</p>
                </div>
            </div>
        </footer>

    )
}

export default Footer