
"use client"
import { themeClasses } from '@/config/site';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import img1 from "@/assets/imgs/img1.jpg"
import img2 from "@/assets/imgs/img2.jpg"
import img3 from "@/assets/imgs/img3.jpg"
import img4 from "@/assets/imgs/img4.jpg"


import img5 from "@/assets/imgs/img5.jpg"
import { useTranslations } from 'next-intl';


function GallarySecion() {

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
        <section id="gallery" className="relative py-20 md:py-20 cursor-pointer">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold">{t("subtitle_3")}</h2>
                    <p className={`mt-4 text-lg ${customTheme.textSecondary}`}>
                        {t("paragraph_2")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Gallery Item 1 */}
                    <div
                        className={`group relative aspect-video overflow-hidden rounded-3xl border ${customTheme.border} transition-all duration-500 hover:scale-105`}
                    >
                        <Image
                            src={img1}
                            alt='image1'
                            fill={true}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />


                        <div className="absolute inset-0 opacity-85 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 text-center">

                        </div>
                    </div>

                    {/* Gallery Item 2 */}
                    <div
                        className={`group relative aspect-video overflow-hidden rounded-3xl border ${customTheme.border} transition-all duration-500 hover:scale-105`}
                    >

                        <Image
                            src={img2}
                            alt='image1'
                            fill={true}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 opacity-85 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 text-center">

                        </div>
                    </div>
                    {/* Gallery Item 3 */}
                    <div
                        className={`group relative aspect-video overflow-hidden rounded-3xl border ${customTheme.border} transition-all duration-500 hover:scale-105`}
                    >

                        <Image
                            src={img3}
                            alt='image1'
                            fill={true}
                            className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8">
                        </div>
                    </div>

                    <div
                        className={`group relative aspect-video md:col-span-2  overflow-hidden rounded-3xl border ${customTheme.border} transition-all duration-500 hover:scale-100`}
                    >

                        <Image
                            src={img4}
                            alt='image1'
                            fill={true}
                            className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-rose-500/10 to-pink-500/10 p-8">
                        </div>
                    </div>

                    <div
                        className={`group relative overflow-hidden rounded-3xl border ${customTheme.border} transition-all duration-500 hover:scale-100`}
                    >

                        <Image
                            src={img5}
                            alt='image1'
                            fill={true}
                            className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8">
                        </div>
                    </div>
                </div>
            </div>
        </section>)
}

export default GallarySecion