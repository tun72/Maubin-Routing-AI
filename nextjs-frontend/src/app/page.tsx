import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection';
import FAQSection from '@/components/landing/FAQSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';
import AnimateBackground from '@/components/landing/AnimatedBg';
import GallarySecion from '@/components/landing/GallarySecion';


const NavigationLanding = () => {


  return (
    <section className={`min-h-screen font-sans transition-colors duration-300`}>
      {/* <div className="absolute inset-0 z-0">
        <div className={`absolute bottom-0 left-0 w-full h-2/3 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 to-transparent' : 'bg-gradient-to-t from-slate-50 to-transparent'}`}></div>
      </div> */}

      <AnimateBackground />
      <Header />
      <div className='section z-10'>
        <HeroSection />
        <FeatureSection />
        <GallarySecion />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </section>

  );
};

export default NavigationLanding;