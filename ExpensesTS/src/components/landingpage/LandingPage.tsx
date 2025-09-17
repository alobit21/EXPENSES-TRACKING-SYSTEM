import React from 'react';
import Navbar from '../layout/Navbar';
import ServicesComponent from './ServicesComponent';
import HeroSection from './HeroSection';
import WhyChooseUs from './WhyCooseUs';
import Testimonials from './Testimonials';
import Footer from './Footer';
import AboutUs from './AboutUs';
import StatsShowcase from './StatsShowcase';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans">
        <Navbar />
      {/* Hero Section with Background Image */}
      <HeroSection />
      <StatsShowcase/>

      {/* Features Section with Pulsing Animation */}
      <ServicesComponent />

        <WhyChooseUs/>

      {/* Testimonials Section */}
      <Testimonials />
      <AboutUs/>

    <Footer/>
    </div>
  );
};

export default LandingPage;