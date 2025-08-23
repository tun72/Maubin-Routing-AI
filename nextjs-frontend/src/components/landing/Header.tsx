
"use client"
import { themeClasses } from '@/config/site'
import { Menu, Navigation, X, } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ThemeToggle } from '../ui/theme-toogle';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageToogle from '../toogle-language';

function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <>
            <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b ${themeClasses.cardBorder}`}">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-r dark:from-cyan-400 dark:to-purple-500 from-blue-500 to-purple-600 rounded-xl flex items-center justify-center`}>
                            <Navigation className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-2xl  flex items-center font-bold bg-gradient-to-r ${customTheme.accent} bg-clip-text h-10 text-transparent`}>
                            {t("title")}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <a href="#features" className={`hover:${customTheme.accent} transition-colors`}>Features</a>
                        <a href="#gallery" className={`hover:${customTheme.accent} transition-colors`}>Gallery</a>
                        <a href="#faq" className={`hover:${customTheme.accent} transition-colors`}>FAQ</a>
                        <a href="#contact" className={`hover:${customTheme.accent} transition-colors`}>Contact</a>
                    </div>

                    <div className="hidden md:flex items-center space-x-3">
                        <ThemeToggle />
                        <LanguageToogle />
                        <Link href={"/home"}
                            className={`px-6 py-2 hover:no-underline bg-gradient-to-r dark:from-cyan-500 dark:to-purple-600 dark:hover:from-cyan-400 dark:hover:to-purple-500 from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg dark:hover:shadow-purple-500/25  hover:shadow-blue-500/25 text-white`}
                        >
                            Get Started
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2 md:hidden">
                        <ThemeToggle />
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {
                isMenuOpen && (
                    <div className={`md:hidden fixed inset-0 z-40 dark:bg-black/98 bg-white/98 bg-opacity-95`}>
                        <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl font-medium">
                            <Link href="#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
                            <Link href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
                            <Link href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                            <Link href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                            <Link href={"/home"}
                                className={`px-6 py-2 hover:no-underline bg-gradient-to-r dark:from-cyan-500 dark:to-purple-600 dark:hover:from-cyan-400 dark:hover:to-purple-500  from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg dark:hover:shadow-purple-500/25 hover:shadow-blue-500/25 text-white`}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )
            }</>
    )
}

export default Header