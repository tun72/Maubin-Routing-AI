"use client"
import { themeClasses } from '@/config/site';
import { Menu, Navigation, X } from 'lucide-react'
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'
import { ThemeToggle } from '../ui/theme-toogle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';


function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    return (
        <>
            <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b ${themeClasses.cardBorder}`}">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href='/' className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${isDark ? 'from-cyan-400 to-purple-500' : 'from-blue-500 to-purple-600'} rounded-xl flex items-center justify-center`}>
                            <Navigation className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-2xl font-bold bg-gradient-to-r ${customTheme.accent} bg-clip-text text-transparent`}>
                            Maubin AI
                        </span>
                    </Link>



                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />

                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

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
                    <div className={`md:hidden fixed inset-0 z-40 ${isDark ? "bg-black/98" : "bg-white/98"} bg-opacity-95`}>
                        <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl font-medium">
                            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
                            <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</a>
                            <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
                            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
                            <Link href={"/register"}
                                className={`px-6 py-2 hover:no-underline bg-gradient-to-r ${isDark ? 'from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500' : 'from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500'} rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${isDark ? 'hover:shadow-purple-500/25' : 'hover:shadow-blue-500/25'} text-white`}
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