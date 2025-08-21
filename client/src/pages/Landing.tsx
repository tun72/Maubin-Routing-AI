import AnimateBackground from "@/components/landing/AnimateBackground";
import ContactSection from "@/components/landing/ContactSection";
import FAQSection from "@/components/landing/FAQSection";
import FeaturesSection from "@/components/landing/FeatureSection";
import Footer from "@/components/landing/Footer";
import GallarySecion from "@/components/landing/GallarySection";
import HeroSection from "@/components/landing/HeroSection";

const LandingPage = () => {


    return (
        <section className={`min-h-screen font-sans transition-colors duration-300`}>
            {/* <div className="absolute inset-0 z-0">
        <div className={`absolute bottom-0 left-0 w-full h-2/3 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 to-transparent' : 'bg-gradient-to-t from-slate-50 to-transparent'}`}></div>
      </div> */}
            <AnimateBackground />

            <div className='section z-10'>
                <HeroSection />
                <FeaturesSection />
                <GallarySecion />
                <FAQSection />
                <ContactSection />
                <Footer />
            </div>

        </section>

    );
};

export default LandingPage;