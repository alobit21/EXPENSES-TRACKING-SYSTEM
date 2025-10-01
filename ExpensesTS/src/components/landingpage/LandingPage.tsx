import React from 'react';
import Navbar from '../layout/Navbar';
import ServicesComponent from './ServicesComponent';
import HeroSection from './HeroSection';
import WhyChooseUs from './WhyCooseUs';
import Testimonials from './Testimonials';
import Footer from './Footer';
import AboutUs from './AboutUs';
import StatsShowcase from './StatsShowcase';
import { Link } from 'react-router-dom';

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

      {/* Concluding CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Ready to take control of your finances?
          </h3>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join now and start tracking your expenses with clarity. No credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-white bg-green-600 hover:bg-green-700 transition-colors">
              Get started free
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-green-700 dark:text-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-800 transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </section>

    <Footer/>
    </div>
  );
};

export default LandingPage;