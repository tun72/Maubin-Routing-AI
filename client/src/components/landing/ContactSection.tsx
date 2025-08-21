"use client"
import { themeClasses } from '@/config/site'
import { Mail, MessageSquare, Phone, Send, User } from 'lucide-react'
// import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'

function ContactSection() {
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



    return (
        <section id="contact" className="px-6 py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold">{t("about_title")}</h2>
                    <p className={`mt-4 text-lg ${customTheme.textSecondary}`}>{t("about_paragraph")}</p>
                </div>
                <div className={`grid md:grid-cols-2 gap-8 ${customTheme.cardBg} border ${customTheme.cardBorder} rounded-2xl p-8`}>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">{t("contact")}</h3>
                        <p className={customTheme.textSecondary}>{t("contact_paragraph")}</p>
                        <div className="space-y-4">
                            <a href="mailto:contact@naviai.com" className="flex items-center space-x-3 group">
                                <Mail className={`w-5 h-5 ${customTheme.textSecondary} group-hover:${customTheme.accent} transition-colors`} />
                                <span className={`group-hover:${customTheme.accent} transition-colors`}>contact@naviai.com</span>
                            </a>
                            <div className="flex items-center space-x-3 group">
                                <Phone className={`w-5 h-5 ${customTheme.textSecondary}`} />
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>
                    <form className="space-y-4">
                        <div className="relative">
                            <User className={`absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 ${customTheme.textSecondary}`} />
                            <input type="text" name="name" placeholder={t("contact_form_name")} className={`w-full p-3 pl-10 rounded-lg ${customTheme.inputBg} border ${customTheme.inputBorder} focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors`} required />
                        </div>
                        <div className="relative">
                            <Mail className={`absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 ${customTheme.textSecondary}`} />
                            <input type="email" name="email" placeholder={t("contact_form_email")} className={`w-full p-3 pl-10 rounded-lg ${customTheme.inputBg} border ${customTheme.inputBorder} focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors`} required />
                        </div>
                        <div className="relative">
                            <MessageSquare className={`absolute top-5 left-3 w-5 h-5 ${customTheme.textSecondary}`} />
                            <textarea name="message" placeholder="Your Message" rows={4} className={`w-full p-3 pl-10 rounded-lg ${customTheme.inputBg} border ${customTheme.inputBorder} focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors`} required></textarea>
                        </div>
                        <button
                            type="submit"

                            className={`w-full px-4 py-2 cursor-pointer bg-gradient-to-r ${isDark ? 'from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500' : 'from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500'} rounded-xl font-semibold text-md text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
                        >
                            <Send className="w-5 h-5" />
                            {t("contact_form_message_button")}
                        </button>

                        <p className={`text-xs ${customTheme.textSecondary} text-center`}>
                            By submitting this form, you agree to our Privacy Policy and Terms of Service.
                        </p>

                    </form>
                </div>
            </div>
        </section>
    )
}

export default ContactSection