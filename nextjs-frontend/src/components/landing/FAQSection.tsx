"use client"

import { themeClasses } from '@/config/site';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'

function FAQSection() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
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

    const toggleFAQ = (index: number): void => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqs = [
        {
            question: t("question_1"),
            answer: t("answer_1")
        },
        {
            question: t("question_2"),
            answer: t("answer_2")
        },
        {
            question: t("question_3"),
            answer: t("answer_3")
        },
        {
            question: t("question_4"),
            answer: t("answer_4")
        },
    ];


    return (
        <section className="relative py-20 md:py-20">
            <div className="mx-auto max-w-4xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold">{t("subtitle_4")}</h2>
                    <p className={`mt-4 text-lg ${customTheme.textSecondary}`}>
                        {t("paragraph_3")}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${customTheme.cardBg} backdrop-blur-xl border ${customTheme.border} rounded-2xl overflow-hidden transition-all duration-300`}
                        >
                            <button
                                className={`w-full px-8 py-6  text-left flex items-center justify-between ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'} hover:shadow-none transition-colors duration-200`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className={`text-lg font-semibold ${customTheme.text}`}>{faq.question}</span>
                                {openFAQ === index ? (
                                    <ChevronUp className={`w-5 h-5 ${customTheme.textMuted}`} />
                                ) : (
                                    <ChevronDown className={`w-5 h-5 ${customTheme.textMuted}`} />
                                )}
                            </button>
                            {openFAQ === index && (
                                <div className="px-8 pb-6">
                                    <p className={`${customTheme.textMuted} leading-relaxed`}>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQSection